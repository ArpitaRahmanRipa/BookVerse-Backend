import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";
import ReadingDiaryPage from "./pages/ReadingDiaryPage";
import ReadingProgressPage from "./pages/ReadingProgressPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f2e9]">

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<ReadingProgressPage />}
        />

        <Route
          path="/reading-diary"
          element={<ReadingDiaryPage />}
        />

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