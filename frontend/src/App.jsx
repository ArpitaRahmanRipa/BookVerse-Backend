import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";


// ==================================
// Member 2 - Book Search & Details
// ==================================

import SearchBooks from "./pages/SearchBooks";
import BookDetails from "./pages/BookDetails";



// ==================================
// Member 2 - Reading Lists
// ==================================

import ReadingLists from "./pages/ReadingLists";
import CreateReadingList from "./pages/CreateReadingList";
import MyReadingLists from "./pages/MyReadingLists";
import ReadingListDetails from "./pages/ReadingListDetails";
import EditReadingList from "./pages/EditReadingList";



// ==================================
// Member 3 - Reading Progress & Diary
// ==================================

import ReadingDiaryPage from "./pages/ReadingDiaryPage";
import ReadingProgressPage from "./pages/ReadingProgressPage";
import ReaderConnectionsPage from "./pages/ReaderConnectionsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ReportContentPage from "./pages/ReportContentPage";
import ModerationDashboard from "./pages/ModerationDashboard";






export default function App() {


  return (


    <div className="min-h-screen bg-[#f7f2e9]">


      <Navbar />



      <Routes>



        {/* ================================= */}
        {/* Member 2 - Book Search */}
        {/* ================================= */}


        <Route

          path="/books"

          element={<SearchBooks />}

        />



        <Route

          path="/books/:id"

          element={<BookDetails />}

        />







        {/* ================================= */}
        {/* Member 2 - Reading Lists */}
        {/* ================================= */}



        {/* Public Reading Lists */}

        <Route

          path="/reading-lists"

          element={<ReadingLists />}

        />





        {/* Create Reading List */}

        <Route

          path="/reading-lists/create"

          element={<CreateReadingList />}

        />







        {/* My Reading Lists */}

        <Route

          path="/reading-lists/mine"

          element={<MyReadingLists />}

        />







        {/* Reading List Details */}

        <Route

          path="/reading-lists/:id"

          element={<ReadingListDetails />}

        />







        {/* STEP 60 */}
        {/* Edit Reading List */}

        <Route

          path="/reading-lists/edit/:id"

          element={<EditReadingList />}

        />









        {/* ================================= */}
        {/* Member 3 - Reading Progress */}
        {/* ================================= */}



        <Route

          path="/reading-progress"

          element={<ReadingProgressPage />}

        />





        <Route

          path="/reading-diary"

          element={<ReadingDiaryPage />}

        />
      <Route
        path="/connections"
        element={<ReaderConnectionsPage />}
      />

      <Route
        path="/notifications"
        element={<NotificationsPage />}
      />

      <Route
        path="/report"
        element={<ReportContentPage />}
      />

      <Route
        path="/moderation"
        element={<ModerationDashboard />}
      />








        {/* ================================= */}
        {/* Home */}
        {/* ================================= */}



        <Route

          path="/"

          element={

            <Navigate

              to="/reading-progress"

              replace

            />

          }

        />









        {/* ================================= */}
        {/* Unknown URL */}
        {/* ================================= */}



        <Route

          path="*"

          element={

            <Navigate

              to="/reading-progress"

              replace

            />

          }

        />




      </Routes>




    </div>


  );


}