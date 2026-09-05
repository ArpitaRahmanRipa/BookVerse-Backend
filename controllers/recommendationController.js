const OpenAI = require("openai");
const ReadingProgress = require("../models/ReadingProgress");
const Recommendation = require("../models/Recommendation");

const buildReadingContext = (readingHistory) => {
  if (!readingHistory.length) {
    return "No reading history available yet.";
  }

  return readingHistory
    .map((book) => {
      const ratingText =
        book.rating !== null && book.rating !== undefined
          ? `, rating: ${book.rating}/5`
          : "";

      return `- ${book.bookTitle} by ${book.author || "Unknown Author"} (${book.status}${ratingText})`;
    })
    .join("\n");
};

const parseRecommendations = (content) => {
  try {
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (Array.isArray(parsed.recommendations)) {
      return parsed.recommendations;
    }
  } catch {
    return [];
  }

  return [];
};

const getFallbackRecommendations = ({
  favoriteGenres,
  mood,
  difficulty,
}) => {
  const genreHint =
    favoriteGenres.length > 0
      ? favoriteGenres.join(", ")
      : "general fiction";

  return [
    {
      title: "The Night Circus",
      author: "Erin Morgenstern",
      genre: genreHint,
      reason: `A rich, atmospheric pick for a ${mood || "reflective"} mood with ${difficulty || "moderate"} difficulty.`,
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Science Fiction",
      reason:
        "Fast-paced and engaging if you enjoy immersive storytelling with clear momentum.",
    },
    {
      title: "Educated",
      author: "Tara Westover",
      genre: "Memoir",
      reason:
        "Strong character-driven narrative that works well when you want meaningful personal stories.",
    },
  ];
};

const generateRecommendations = async (req, res) => {
  try {
    const {
      userId,
      prompt = "",
      mood = "",
      difficulty = "",
      favoriteGenres = [],
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const readingHistory = await ReadingProgress.find({
      userId,
    })
      .sort({ updatedAt: -1 })
      .limit(12);

    const readingContext =
      buildReadingContext(readingHistory);

    const userPrompt =
      prompt ||
      "Suggest books I would enjoy based on my reading history and preferences.";

    let recommendations = [];
    let source = "fallback";

    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion =
        await openai.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content:
                "You are a book recommendation assistant for BookVerse. Return JSON with key recommendations as an array of 3-5 objects. Each object must include title, author, genre, and reason.",
            },
            {
              role: "user",
              content: `Reading history:\n${readingContext}\n\nFavorite genres: ${favoriteGenres.join(", ") || "Not specified"}\nMood: ${mood || "Not specified"}\nDifficulty: ${difficulty || "Not specified"}\nRequest: ${userPrompt}`,
            },
          ],
        });

      recommendations = parseRecommendations(
        completion.choices[0]?.message?.content || ""
      );

      if (recommendations.length > 0) {
        source = "openai";
      }
    }

    if (recommendations.length === 0) {
      recommendations = getFallbackRecommendations({
        favoriteGenres,
        mood,
        difficulty,
      });
    }

    const savedRecommendation =
      await Recommendation.create({
        userId,
        prompt: userPrompt,
        mood,
        difficulty,
        favoriteGenres,
        recommendations,
        source,
      });

    res.status(201).json({
      message:
        "Book recommendations generated successfully",
      data: savedRecommendation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
};

const getUserRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message:
        "Recommendation history fetched successfully",
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recommendation history",
      error: error.message,
    });
  }
};

const getSingleRecommendation = async (req, res) => {
  try {
    const recommendation =
      await Recommendation.findById(
        req.params.recommendationId
      );

    if (!recommendation) {
      return res.status(404).json({
        message: "Recommendation not found",
      });
    }

    res.status(200).json({
      message: "Recommendation fetched successfully",
      data: recommendation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recommendation",
      error: error.message,
    });
  }
};

const getMyRecommendations = async (req, res) => {
  req.params.userId = req.user.userId;
  return getUserRecommendations(req, res);
};

module.exports = {
  generateRecommendations,
  getUserRecommendations,
  getMyRecommendations,
  getSingleRecommendation,
};
