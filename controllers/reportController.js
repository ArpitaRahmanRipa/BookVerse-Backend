const Report = require("../models/Report");

const {
  createNotificationRecord,
} = require("./notificationController");

// ==============================
// Submit a new report
// ==============================

const createReport = async (req, res) => {
  try {
    const {
      reporterId,
      reporterName,
      targetType,
      targetId,
      targetOwnerId,
      targetOwnerName,
      targetTitle,
      reason,
      details,
    } = req.body;

    if (
      !reporterId ||
      !targetType ||
      !targetId ||
      !reason
    ) {
      return res.status(400).json({
        message:
          "reporterId, targetType, targetId, and reason are required",
      });
    }

    const report = await Report.create({
      reporterId,
      reporterName: reporterName || "",
      targetType,
      targetId,
      targetOwnerId: targetOwnerId || "",
      targetOwnerName: targetOwnerName || "",
      targetTitle: targetTitle || "",
      reason,
      details: details || "",
    });

    return res.status(201).json({
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to submit report",
      error: error.message,
    });
  }
};

// ==============================
// Get all reports
// Moderator/Admin dashboard
// ==============================

const getAllReports = async (req, res) => {
  try {
    const {
      status,
      targetType,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (targetType) {
      filter.targetType = targetType;
    }

    const reports = await Report.find(
      filter
    ).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Reports fetched successfully",
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

// ==============================
// Get reports submitted by reader
// ==============================

const getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reports = await Report.find({
      reporterId: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message:
        "User reports fetched successfully",
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to fetch user reports",
      error: error.message,
    });
  }
};

// ==============================
// Get one report
// ==============================

const getSingleReport = async (req, res) => {
  try {
    const report = await Report.findById(
      req.params.reportId
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    return res.status(200).json({
      message: "Report fetched successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};

// ==============================
// Create moderation message
// ==============================

const getModerationMessage = (
  action,
  report
) => {
  const contentName =
    report.targetTitle ||
    report.targetType.replace("_", " ");

  switch (action) {
    case "Dismissed":
      return `A report involving your ${contentName} was reviewed and dismissed. No moderation action was taken.`;

    case "Hidden":
      return `Your ${contentName} was hidden after a moderation review.`;

    case "Warned":
      return `You received a moderation warning related to your ${contentName}. Please review the BookVerse community guidelines.`;

    case "Forwarded":
      return `A moderation case involving your ${contentName} was forwarded to an Admin for further review.`;

    default:
      return "A moderation update is available for your content.";
  }
};

// ==============================
// Take moderation action
// ==============================

const moderateReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const {
      action,
      moderatorId,
      moderatorName,
      moderatorNote,
      targetOwnerEmail,
    } = req.body;

    const validActions = [
      "Dismissed",
      "Hidden",
      "Warned",
      "Forwarded",
    ];

    if (!action) {
      return res.status(400).json({
        message:
          "Moderation action is required",
      });
    }

    if (!validActions.includes(action)) {
      return res.status(400).json({
        message:
          "Action must be Dismissed, Hidden, Warned, or Forwarded",
      });
    }

    if (!moderatorId) {
      return res.status(400).json({
        message: "moderatorId is required",
      });
    }

    const report = await Report.findById(
      reportId
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.status = action;
    report.moderatorId = moderatorId;
    report.moderatorName =
      moderatorName || "";
    report.moderatorNote =
      moderatorNote || "";
    report.reviewedAt = new Date();

    const updatedReport =
      await report.save();

    // ==============================
    // Automatic Module 3 notification
    // ==============================

    if (report.targetOwnerId) {
      try {
        const moderationMessage =
          getModerationMessage(
            action,
            report
          );

        await createNotificationRecord({
          recipientId:
            report.targetOwnerId,

          type: "moderation_update",

          message: moderationMessage,

          relatedId:
            report._id.toString(),

          relatedType:
            "moderation",

          link: "/notifications",

          recipientEmail:
            targetOwnerEmail || "",
        });
      } catch (notificationError) {
        // Moderation action must still succeed
        // if notification/email fails.
        console.error(
          "Failed to create moderation notification:",
          notificationError.message
        );
      }
    }

    return res.status(200).json({
      message:
        "Moderation action completed successfully",
      data: updatedReport,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to complete moderation action",
      error: error.message,
    });
  }
};

// ==============================
// Delete report
// Admin cleanup / testing
// ==============================

const deleteReport = async (req, res) => {
  try {
    const report =
      await Report.findByIdAndDelete(
        req.params.reportId
      );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    return res.status(200).json({
      message: "Report deleted successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete report",
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportsByUser,
  getSingleReport,
  moderateReport,
  deleteReport,
};