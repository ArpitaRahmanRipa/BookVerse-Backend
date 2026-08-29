const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");


// ==============================
// Route Imports
// ==============================

// Member 3 - Reading Progress & Diary
const readingProgressRoutes = require(
  "./routes/readingProgressRoutes"
);

// Existing Follow Feature
const followRoutes = require(
  "./routes/followRoutes"
);
const notificationRoutes = require("./routes/notificationRoutes");

// ==============================
// Member 2 - Module 1 Feature 2
// Book Search & Book Details
// ==============================

const bookRoutes = require(
  "./routes/bookRoutes"
);

const shelfRoutes = require(
  "./routes/shelfRoutes"
);


// ==============================
// Member 2 - Module 2 Feature 2
// Custom Reading Lists & Collections
// ==============================

const readingListRoutes = require(
  "./routes/readingListRoutes"
);


// ==============================
// Create Express App
// ==============================

const app = express();


// ==============================
// Port
// ==============================

// Use PORT from .env if provided.
// Otherwise BookVerse backend will run on 9208.
const PORT = process.env.PORT || 9208;


// ==============================
// Middleware
// ==============================

app.use(cors());

app.use(express.json());


// ==============================
// Test Route
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BookVerse Backend API is running",
    port: PORT,
  });
});


// ==============================
// Feature Routes
// ==============================


// ------------------------------
// Member 3 - Reading Progress
// ------------------------------

app.use(
  "/api/reading-progress",
  readingProgressRoutes
);


// ------------------------------
// Existing Follow Feature
// ------------------------------

app.use(
  "/api",
  followRoutes
);

app.use("/api/notifications", notificationRoutes);
// ------------------------------
// Member 2 - Module 1 Feature 2
// Book Search & Book Details
// ------------------------------

app.use(
  "/api/books",
  bookRoutes
);


// Temporary shelf integration.
// Existing Module 1 functionality.
// Do not remove.
app.use(
  "/api/shelves",
  shelfRoutes
);


// ------------------------------
// Member 2 - Module 2 Feature 2
// Custom Reading Lists
// ------------------------------

app.use(
  "/api/readinglists",
  readingListRoutes
);


// ==============================
// Future Integrations
// ==============================

// Member 1:
// const dashboardRoutes = require(
//   "./routes/dashboardRoutes"
// );

// app.use(
//   "/api/dashboard",
//   dashboardRoutes
// );


// Member 4:
// const mediaRoutes = require(
//   "./routes/mediaRoutes"
// );

// app.use(
//   "/api/media",
//   mediaRoutes
// );


// ==============================
// Start Server
// ==============================

const startServer = async () => {
  try {
    // Connect MongoDB first
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `Server is running on http://127.0.0.1:${PORT}`
      );

      console.log(
        `Book Search API: http://127.0.0.1:${PORT}/api/books`
      );

      console.log(
        `Reading Lists API: http://127.0.0.1:${PORT}/api/readinglists`
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


// Start BookVerse backend
startServer();