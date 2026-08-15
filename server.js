const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const readingProgressRoutes = require(
  "./routes/readingProgressRoutes"
);

const followRoutes = require("./routes/followRoutes");

// Member 2 Book Search and Book Details routes
const bookRoutes = require("./routes/bookRoutes");
const shelfRoutes = require("./routes/shelfRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "BookVerse Backend API is running",
    port: process.env.PORT,
  });
});

// Member 3 routes
app.use(
  "/api/reading-progress",
  readingProgressRoutes
);

app.use("/api", followRoutes);

// Member 2 routes
app.use("/api/books", bookRoutes);
app.use("/api/shelves", shelfRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server is running on http://127.0.0.1:${PORT}`
      );
    });
  } catch (error) {
    console.error("Server could not start");
    process.exit(1);
  }
};

startServer();