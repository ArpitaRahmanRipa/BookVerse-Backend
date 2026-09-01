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


// Notifications

const notificationRoutes = require(
  "./routes/notificationRoutes"
);


// Report Feature

const reportRoutes = require(
  "./routes/reportRoutes"
);



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
// Custom Reading Lists
// ==============================

const readingListRoutes = require(
  "./routes/readingListRoutes"
);



// ==============================
// Member 2 - Module 4 Feature 2
// Yearly Reading Wrapped
// ==============================

const readingWrappedRoutes = require(
  "./routes/readingWrappedRoutes"
);



// ==============================
// Create Express App
// ==============================

const app = express();



// ==============================
// Port
// ==============================

const PORT =
  process.env.PORT || 9208;



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

    message:
      "BookVerse Backend API is running",

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
// Follow Feature
// ------------------------------

app.use(
  "/api",
  followRoutes
);



// ------------------------------
// Notifications
// ------------------------------

app.use(
  "/api/notifications",
  notificationRoutes
);



// ------------------------------
// Report Feature
// ------------------------------

app.use(
  "/api/reports",
  reportRoutes
);




// ------------------------------
// Member 2 - Book Search
// ------------------------------

app.use(
  "/api/books",
  bookRoutes
);




// ------------------------------
// Shelves
// ------------------------------

app.use(
  "/api/shelves",
  shelfRoutes
);




// ------------------------------
// Member 2 - Reading Lists
// ------------------------------

app.use(
  "/api/readinglists",
  readingListRoutes
);




// ------------------------------
// Member 2 - Reading Wrapped
// ------------------------------

app.use(
  "/api/reading-wrapped",
  readingWrappedRoutes
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


    await connectDB();



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


      console.log(
        `Reading Wrapped API: http://127.0.0.1:${PORT}/api/reading-wrapped`
      );


      console.log(
        `Report API: http://127.0.0.1:${PORT}/api/reports`
      );


    });


  } catch(error) {


    console.error(
      "Server could not start:",
      error.message
    );


    process.exit(1);


  }

};



// Start BookVerse Backend

startServer();