import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Navbar from "./components/Navbar";

import SearchBooks from "./pages/SearchBooks";
import BookDetails from "./pages/BookDetails";

import ReadingLists from "./pages/ReadingLists";
import CreateReadingList from "./pages/CreateReadingList";
import MyReadingLists from "./pages/MyReadingLists";
import ReadingListDetails from "./pages/ReadingListDetails";
import EditReadingList from "./pages/EditReadingList";


import ReadingDiaryPage from "./pages/ReadingDiaryPage";
import ReadingProgressPage from "./pages/ReadingProgressPage";
import ReaderConnectionsPage from "./pages/ReaderConnectionsPage";
import NotificationsPage from "./pages/NotificationsPage";

import ReadingWrapped from "./pages/ReadingWrapped";

import ReportContentPage from "./pages/ReportContentPage";
import ModerationDashboard from "./pages/ModerationDashboard";


export default function App() {

return (

<div className="min-h-screen bg-[#f7f2e9]">

<Navbar />


<Routes>


<Route path="/books" element={<SearchBooks />} />

<Route path="/books/:id" element={<BookDetails />} />



<Route path="/reading-lists" element={<ReadingLists />} />

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
path="/reading-wrapped"
element={<ReadingWrapped />}
/>


<Route
path="/report"
element={<ReportContentPage />}
/>


<Route
path="/moderation"
element={<ModerationDashboard />}
/>



<Route
path="/"
element={
<Navigate
to="/reading-wrapped"
replace
/>
}
/>


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