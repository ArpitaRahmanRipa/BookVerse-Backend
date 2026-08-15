import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import Reports from "./pages/Reports.jsx";
import StatisticsDashboard from "./pages/StatisticsDashboard.jsx";
import YearlyWrapped from "./pages/YearlyWrapped.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/statistics" replace />} />
        <Route path="/statistics" element={<StatisticsDashboard />} />
        <Route path="/wrapped" element={<YearlyWrapped />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
}

export default App;
