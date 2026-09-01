const ReadingProgress = require("../models/ReadingProgress");
const BookShelf = require("../models/BookShelf");
const Follow = require("../models/Follow");
const ProfileMedia = require("../models/ProfileMedia");
const Recommendation = require("../models/Recommendation");
const ReadingGoal = require("../models/ReadingGoal");
const Category = require("../models/Category");

const collectUniqueUserIds = async () => {
  const userIdSets = await Promise.all([
    ReadingProgress.distinct("userId"),
    BookShelf.distinct("userId"),
    Follow.distinct("userId"),
    Follow.distinct("targetUserId"),
    ProfileMedia.distinct("userId"),
    Recommendation.distinct("userId"),
    ReadingGoal.distinct("userId"),
  ]);

  return [
    ...new Set(userIdSets.flat().filter(Boolean)),
  ];
};

const getPlatformAnalytics = async (req, res) => {
  try {
    const [
      uniqueUserIds,
      totalBooksSaved,
      totalReadingRecords,
      totalRecommendations,
      totalGoals,
      totalFollows,
      ratedBooks,
      categories,
    ] = await Promise.all([
      collectUniqueUserIds(),
      BookShelf.countDocuments(),
      ReadingProgress.countDocuments(),
      Recommendation.countDocuments(),
      ReadingGoal.countDocuments(),
      Follow.countDocuments(),
      ReadingProgress.find({
        rating: { $ne: null },
      }).select("bookTitle rating userId updatedAt"),
      Category.find({ isActive: true }).sort({
        name: 1,
      }),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeReaderIds =
      await ReadingProgress.distinct("userId", {
        updatedAt: { $gte: thirtyDaysAgo },
      });

    const bookReviewCounts = {};

    ratedBooks.forEach((record) => {
      const key = record.bookTitle || "Unknown Book";

      if (!bookReviewCounts[key]) {
        bookReviewCounts[key] = 0;
      }

      bookReviewCounts[key] += 1;
    });

    const mostReviewedBooks = Object.entries(
      bookReviewCounts
    )
      .map(([bookTitle, reviewCount]) => ({
        bookTitle,
        reviewCount,
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5);

    const genreCounts = {};

    categories.forEach((category) => {
      genreCounts[category.name] = 0;
    });

    const followGenres = await Follow.find({
      favoriteGenres: { $exists: true, $ne: [] },
    }).select("favoriteGenres");

    followGenres.forEach((follow) => {
      follow.favoriteGenres.forEach((genre) => {
        genreCounts[genre] =
          (genreCounts[genre] || 0) + 1;
      });
    });

    const popularGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.status(200).json({
      message: "Platform analytics fetched successfully",
      data: {
        totalUsers: uniqueUserIds.length,
        totalBooksSaved:
          totalBooksSaved + totalReadingRecords,
        totalReviews: ratedBooks.length,
        activeReaders: activeReaderIds.length,
        totalRecommendations,
        totalReadingGoals: totalGoals,
        totalFollowConnections: totalFollows,
        mostReviewedBooks,
        popularGenres,
        reportedContentCounts: {
          reviews: 0,
          comments: 0,
          lists: 0,
          profiles: 0,
          total: 0,
        },
        activeCategories: categories.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch platform analytics",
      error: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.activeOnly === "true") {
      filter.isActive = true;
    }

    const categories = await Category.find(filter).sort({
      name: 1,
    });

    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type, description, isActive } =
      req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await Category.create({
      name,
      type: type || "genre",
      description: description || "",
      isActive:
        isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category name already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(
      req.params.categoryId
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const allowedFields = [
      "name",
      "type",
      "description",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        category[field] = req.body[field];
      }
    });

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category name already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(
      req.params.categoryId
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getPlatformAnalytics,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
