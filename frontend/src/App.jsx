import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import SearchBooks from "./pages/SearchBooks";
import BookDetails from "./pages/BookDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchBooks />} />
        <Route path="/books/:id" element={<BookDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;