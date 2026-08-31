import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";
// Member 2 - Book Search & Details
import SearchBooks from "./pages/SearchBooks";
import BookDetails from "./pages/BookDetails";

// Member 3 - Reading Progress & Diary
import ReadingDiaryPage from "./pages/ReadingDiaryPage";
import ReadingProgressPage from "./pages/ReadingProgressPage";

// Member 4 - Profile Media & AI Recommendations
import ProfileMediaPage from "./pages/ProfileMediaPage";
import RecommendationPage from "./pages/RecommendationPage";

// Member 4 - Reading Goals & Admin Analytics
import ReadingGoalsPage from "./pages/ReadingGoalsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f2e9]">
      <Navbar />

      <Routes>
        {/* Temporary home.
            Later this can become Member 1's Dashboard. */}
        {/* Member 2 - Book Search & Details */}
        <Route
          path="/books"
          element={<SearchBooks />}
        />

        <Route
          path="/books/:id"
          element={<BookDetails />}
        />
        <Route
          path="/"
          element={
            <Navigate
              to="/reading-progress"
              replace
            />
          }
        />

        {/* Member 3 - Reading Progress & Diary */}
        <Route
          path="/reading-progress"
          element={<ReadingProgressPage />}
        />

        <Route
          path="/reading-diary"
          element={<ReadingDiaryPage />}
        />

        {/* Member 4 - Profile Media & AI Recommendations */}
        <Route
          path="/profile"
          element={<ProfileMediaPage />}
        />

        <Route
          path="/recommendations"
          element={<RecommendationPage />}
        />

        {/* Member 4 - Reading Goals & Admin Analytics */}
        <Route
          path="/reading-goals"
          element={<ReadingGoalsPage />}
        />

        <Route
          path="/admin"
          element={<AdminAnalyticsPage />}
        />

        {/* Future integrations:

            Member 1:
            /dashboard
            /shelves

            Member 2:
            /books
            /books/:id

            Member 4:
            /profile
        */}

        {/* Unknown URL */}
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