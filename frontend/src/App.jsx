import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";

import ReadingDiaryPage from "./pages/ReadingDiaryPage";
import ReadingProgressPage from "./pages/ReadingProgressPage";

// Member 2 - Book Search and Book Details
import SearchBooks from "./pages/SearchBooks";
import BookDetails from "./pages/BookDetails";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f2e9]">

      <Navbar />

      <Routes>

        {/* Shared Reading Progress */}
        <Route
          path="/"
          element={<ReadingProgressPage />}
        />

        <Route
          path="/reading-diary"
          element={<ReadingDiaryPage />}
        />

        {/* Member 2 - Book Search */}
        <Route
          path="/books"
          element={<SearchBooks />}
        />

        {/* Member 2 - Book Details */}
        <Route
          path="/books/:id"
          element={<BookDetails />}
        />

        {/* Unknown URLs */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </div>
  );
}