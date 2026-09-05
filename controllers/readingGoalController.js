const ReadingGoal = require("../models/ReadingGoal");
const ReadingProgress = require("../models/ReadingProgress");

const isDateInGoalPeriod = (dateValue, goal) => {
  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  if (date.getFullYear() !== goal.year) {
    return false;
  }

  if (goal.goalType === "yearly") {
    return true;
  }

  return date.getMonth() + 1 === goal.month;
};

const isGoalPeriodEnded = (goal) => {
  const now = new Date();

  if (goal.goalType === "yearly") {
    return now.getFullYear() > goal.year;
  }

  const periodEnd = new Date(goal.year, goal.month, 0, 23, 59, 59);
  return now > periodEnd;
};

const calculateGoalProgress = (goal, readingRecords) => {
  if (goal.targetType === "books") {
    const finishedBooks = readingRecords.filter(
      (record) =>
        record.status === "Finished" &&
        isDateInGoalPeriod(record.finishDate, goal)
    );

    const current = finishedBooks.length;
    const percentage = Math.min(
      100,
      Math.round((current / goal.targetValue) * 100)
    );

    return {
      current,
      target: goal.targetValue,
      percentage,
      remaining: Math.max(goal.targetValue - current, 0),
    };
  }

  let pagesRead = 0;

  readingRecords.forEach((record) => {
    if (
      record.status === "Finished" &&
      isDateInGoalPeriod(record.finishDate, goal)
    ) {
      pagesRead += record.totalPages || 0;
      return;
    }

    if (
      ["Currently Reading", "Paused"].includes(record.status) &&
      (isDateInGoalPeriod(record.startDate, goal) ||
        isDateInGoalPeriod(record.updatedAt, goal))
    ) {
      pagesRead += record.currentPage || 0;
    }
  });

  const percentage = Math.min(
    100,
    Math.round((pagesRead / goal.targetValue) * 100)
  );

  return {
    current: pagesRead,
    target: goal.targetValue,
    percentage,
    remaining: Math.max(goal.targetValue - pagesRead, 0),
  };
};

const resolveGoalStatus = (goal, progress) => {
  if (progress.current >= goal.targetValue) {
    return "completed";
  }

  if (isGoalPeriodEnded(goal)) {
    return "missed";
  }

  return "active";
};

const attachProgressToGoal = async (goal) => {
  const readingRecords = await ReadingProgress.find({
    userId: goal.userId,
  });

  const progress = calculateGoalProgress(
    goal,
    readingRecords
  );

  const status = resolveGoalStatus(goal, progress);

  if (goal.status !== status) {
    goal.status = status;
    await goal.save();
  }

  return {
    ...goal.toObject(),
    progress,
  };
};

const createReadingGoal = async (req, res) => {
  try {
    const {
      userId,
      title,
      goalType,
      targetType,
      targetValue,
      year,
      month,
    } = req.body;

    if (
      !userId ||
      !goalType ||
      !targetType ||
      !targetValue ||
      !year
    ) {
      return res.status(400).json({
        message:
          "userId, goalType, targetType, targetValue, and year are required",
      });
    }

    if (goalType === "monthly" && !month) {
      return res.status(400).json({
        message: "month is required for monthly goals",
      });
    }

    const goal = await ReadingGoal.create({
      userId,
      title:
        title ||
        `${goalType === "yearly" ? "Yearly" : "Monthly"} ${targetType} goal`,
      goalType,
      targetType,
      targetValue,
      year,
      month: goalType === "monthly" ? month : undefined,
    });

    const goalWithProgress =
      await attachProgressToGoal(goal);

    res.status(201).json({
      message: "Reading goal created successfully",
      data: goalWithProgress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create reading goal",
      error: error.message,
    });
  }
};

const getUserReadingGoals = async (req, res) => {
  try {
    const goals = await ReadingProgress.find({
      userId: req.params.userId,
    });

    const goalRecords = await ReadingGoal.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    const goalsWithProgress = await Promise.all(
      goalRecords.map((goal) =>
        attachProgressToGoal(goal)
      )
    );

    res.status(200).json({
      message: "Reading goals fetched successfully",
      data: goalsWithProgress,
      readingRecordCount: goals.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reading goals",
      error: error.message,
    });
  }
};

const getSingleReadingGoal = async (req, res) => {
  try {
    const goal = await ReadingGoal.findById(
      req.params.goalId
    );

    if (!goal) {
      return res.status(404).json({
        message: "Reading goal not found",
      });
    }

    const goalWithProgress =
      await attachProgressToGoal(goal);

    res.status(200).json({
      message: "Reading goal fetched successfully",
      data: goalWithProgress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reading goal",
      error: error.message,
    });
  }
};

const updateReadingGoal = async (req, res) => {
  try {
    const goal = await ReadingGoal.findById(
      req.params.goalId
    );

    if (!goal) {
      return res.status(404).json({
        message: "Reading goal not found",
      });
    }

    const allowedFields = [
      "title",
      "targetValue",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        goal[field] = req.body[field];
      }
    });

    const updatedGoal = await goal.save();
    const goalWithProgress =
      await attachProgressToGoal(updatedGoal);

    res.status(200).json({
      message: "Reading goal updated successfully",
      data: goalWithProgress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update reading goal",
      error: error.message,
    });
  }
};

const deleteReadingGoal = async (req, res) => {
  try {
    const goal = await ReadingGoal.findByIdAndDelete(
      req.params.goalId
    );

    if (!goal) {
      return res.status(404).json({
        message: "Reading goal not found",
      });
    }

    res.status(200).json({
      message: "Reading goal deleted successfully",
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete reading goal",
      error: error.message,
    });
  }
};

const getMyReadingGoals = async (req, res) => {
  req.params.userId = req.user.userId;
  return getUserReadingGoals(req, res);
};

module.exports = {
  createReadingGoal,
  getUserReadingGoals,
  getMyReadingGoals,
  getSingleReadingGoal,
  updateReadingGoal,
  deleteReadingGoal,
};
