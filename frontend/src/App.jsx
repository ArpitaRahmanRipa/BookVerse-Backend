import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ==============================
// Common Workflow Pages
// ==============================

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";


// ==============================
// Member 2 Pages
// ==============================

import SearchBooks from "./pages/SearchBooks";
import BookDetails from "./pages/BookDetails";

import ReadingLists from "./pages/ReadingLists";
import CreateReadingList from "./pages/CreateReadingList";
import MyReadingLists from "./pages/MyReadingLists";
import ReadingListDetails from "./pages/ReadingListDetails";
import EditReadingList from "./pages/EditReadingList";

import ReadingWrapped from "./pages/ReadingWrapped";


// ==============================
// Member 3 Pages
// ==============================

import ReadingDiaryPage from "./pages/ReadingDiaryPage";
import ReadingProgressPage from "./pages/ReadingProgressPage";
import ReaderConnectionsPage from "./pages/ReaderConnectionsPage";
import NotificationsPage from "./pages/NotificationsPage";

import ReportContentPage from "./pages/ReportContentPage";
import ModerationDashboard from "./pages/ModerationDashboard";


// ==============================
// Member 4 Pages
// ==============================

import ProfileMediaPage from "./pages/ProfileMediaPage";
import RecommendationPage from "./pages/RecommendationPage";
import ReadingGoalsPage from "./pages/ReadingGoalsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";


export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f2e9]">

      <Navbar />

      <Routes>

        {/* ============================== */}
        {/* Common Workflow */}
        {/* ============================== */}

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* ============================== */}
        {/* Member 2 */}
        {/* ============================== */}

        <Route
          path="/books"
          element={<SearchBooks />}
        />

        <Route
          path="/books/:id"
          element={<BookDetails />}
        />


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


        <Route
          path="/reading-wrapped"
          element={
            <ProtectedRoute>
              <ReadingWrapped />
            </ProtectedRoute>
          }
        />


        {/* ============================== */}
        {/* Member 3 */}
        {/* ============================== */}


        <Route
          path="/reading-progress"
          element={
            <ProtectedRoute>
              <ReadingProgressPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reading-diary"
          element={
            <ProtectedRoute>
              <ReadingDiaryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/connections"
          element={
            <ProtectedRoute>
              <ReaderConnectionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportContentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderation"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Community Moderator",
                "Admin",
              ]}
            >
              <ModerationDashboard />
            </ProtectedRoute>
          }
        />


        {/* ============================== */}
        {/* Member 4 */}
        {/* ============================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/media"
          element={
            <ProtectedRoute>
              <ProfileMediaPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RecommendationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reading-goals"
          element={
            <ProtectedRoute>
              <ReadingGoalsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["Admin"]}
            >
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />


        {/* ============================== */}
        {/* Unknown Route */}
        {/* ============================== */}

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