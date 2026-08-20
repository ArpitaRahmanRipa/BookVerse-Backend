import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";

// Member 3 - Reading Progress & Diary
import ReadingDiaryPage from "./pages/ReadingDiaryPage";
import ReadingProgressPage from "./pages/ReadingProgressPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f2e9]">
      <Navbar />

      <Routes>
        {/* Temporary home.
            Later this can become Member 1's Dashboard. */}
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