const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const readingProgressRoutes = require(
  "./routes/readingProgressRoutes"
);
const followRoutes = require("./routes/followRoutes");
const notificationRoutes = require(
  "./routes/notificationRoutes"
);
const reportRoutes = require("./routes/reportRoutes");
const bookRoutes = require("./routes/bookRoutes");
const shelfRoutes = require("./routes/shelfRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const recommendationRoutes = require(
  "./routes/recommendationRoutes"
);
const readingGoalRoutes = require(
  "./routes/readingGoalRoutes"
);
const adminRoutes = require("./routes/adminRoutes");
const readingListRoutes = require(
  "./routes/readingListRoutes"
);
const readingWrappedRoutes = require(
  "./routes/readingWrappedRoutes"
);
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BookVerse Backend API is running",
    port: PORT,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/reading-progress", readingProgressRoutes);
app.use("/api", followRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/shelves", shelfRoutes);
app.use("/api/readinglists", readingListRoutes);
app.use("/api/reading-wrapped", readingWrappedRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/reading-goals", readingGoalRoutes);
app.use("/api/admin", adminRoutes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server is running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server could not start:",
      error.message
    );
    process.exit(1);
  }
};

startServer();
