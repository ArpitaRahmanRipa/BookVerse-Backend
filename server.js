const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// ==============================
// Route imports
// ==============================

// Member 3 - Reading Progress & Diary
const readingProgressRoutes = require(
  "./routes/readingProgressRoutes"
);

// Existing Follow feature
const followRoutes = require(
  "./routes/followRoutes"
);

// Future integrations:
//
// Member 1:
// const dashboardRoutes = require("./routes/dashboardRoutes");
//
// Member 2 - Book Search & Book Details
const bookRoutes = require(
  "./routes/bookRoutes"
);

const shelfRoutes = require(
  "./routes/shelfRoutes"
);

// Member 4 - Profile Picture & Media Upload
const mediaRoutes = require("./routes/mediaRoutes");

// Member 4 - AI Book Recommendation Assistant
const recommendationRoutes = require(
  "./routes/recommendationRoutes"
);


const app = express();

const PORT = process.env.PORT || 3000;


// ==============================
// Middleware
// ==============================

app.use(cors());
app.use(express.json());


// ==============================
// Test route
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BookVerse Backend API is running",
    port: PORT,
  });
});


// ==============================
// Feature routes
// ==============================

// Member 3 - Reading Progress & Diary
app.use(
  "/api/reading-progress",
  readingProgressRoutes
);

// Existing Follow feature
app.use("/api", followRoutes);


// Future integrations:
//
// Member 1:
// app.use("/api/dashboard", dashboardRoutes);
//
// Member 2 - Book Search & Book Details
app.use(
  "/api/books",
  bookRoutes
);

// Temporary shelf integration.
// Member 1 may later reuse/replace this.
app.use(
  "/api/shelves",
  shelfRoutes
);
// Member 4 - Profile Picture & Media Upload
app.use("/api/media", mediaRoutes);

// Member 4 - AI Book Recommendation Assistant
app.use(
  "/api/recommendations",
  recommendationRoutes
);


// ==============================
// Start server
// ==============================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server is running on http://127.0.0.1:${PORT}`
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