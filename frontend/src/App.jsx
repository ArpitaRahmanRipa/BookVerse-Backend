import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";


// ==================================
// Member 2 - Module 1 Feature 2
// Book Search & Details
// ==================================

import SearchBooks from "./pages/SearchBooks";
import BookDetails from "./pages/BookDetails";



// ==================================
// Member 2 - Module 2 Feature 2
// Custom Reading Lists
// ==================================

import ReadingLists from "./pages/ReadingLists";
import CreateReadingList from "./pages/CreateReadingList";
import MyReadingLists from "./pages/MyReadingLists";
import ReadingListDetails from "./pages/ReadingListDetails";
import EditReadingList from "./pages/EditReadingList";



// ==================================
// Member 3 - Reading Progress & Social Features
// ==================================

import ReadingDiaryPage from "./pages/ReadingDiaryPage";
import ReadingProgressPage from "./pages/ReadingProgressPage";
import ReaderConnectionsPage from "./pages/ReaderConnectionsPage";
import NotificationsPage from "./pages/NotificationsPage";



// ==================================
// Member 2 - Module 4 Feature 2
// Yearly Reading Wrapped
// ==================================

import ReadingWrapped from "./pages/ReadingWrapped";





export default function App() {


  return (

    <div className="min-h-screen bg-[#f7f2e9]">


      <Navbar />



      <Routes>



        {/* ================================= */}
        {/* Member 2 - Book Search & Details */}
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


        <Route
          path="/reading-lists"
          element={<ReadingLists />}
        />


        <Route
          path="/reading-lists/create"
          element={<CreateReadingList />}
        />


        <Route
          path="/reading-lists/mine"
          element={<MyReadingLists />}
        />


        <Route
          path="/reading-lists/:id"
          element={<ReadingListDetails />}
        />


        <Route
          path="/reading-lists/edit/:id"
          element={<EditReadingList />}
        />







        {/* ================================= */}
        {/* Member 3 Features */}
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







        {/* ================================= */}
        {/* Member 2 - Module 4 Feature 2 */}
        {/* Yearly Reading Wrapped */}
        {/* ================================= */}


        <Route
          path="/reading-wrapped"
          element={<ReadingWrapped />}
        />







        {/* ================================= */}
        {/* Home */}
        {/* ================================= */}


        <Route

          path="/"

          element={

            <Navigate
              to="/reading-wrapped"
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
              to="/reading-wrapped"
              replace
            />

          }

        />


      </Routes>



    </div>

  );

}