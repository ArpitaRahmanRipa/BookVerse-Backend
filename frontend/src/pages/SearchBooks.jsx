import { useState } from "react";
import BookCard from "../components/BookCard";

function SearchBooks() {
  const [type, setType] = useState("title");
  const [value, setValue] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const searchBooks = async () => {
    if (!value.trim()) {
      setMessage("Please enter a search value.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `http://localhost:9208/api/books/search?${type}=${encodeURIComponent(value)}`
      );

      const data = await response.json();

      if (!data.success) {
        setBooks([]);
        setMessage(data.message || "Search failed.");
        return;
      }

      setBooks(data.books || []);

      if (!data.books?.length) {
        setMessage("No books found.");
      }
    } catch (error) {
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <section className="hero">
        <h1>BookVerse</h1>
        <h2>Book Search and Book Details</h2>

        <p>
          Search by title, author, ISBN, genre or publication year.
        </p>

        <div className="search-box">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
            <option value="genre">Genre</option>
            <option value="year">Publication Year</option>
            <option value="query">Keyword</option>
          </select>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchBooks();
              }
            }}
            placeholder="Search books..."
          />

          <button onClick={searchBooks}>
            Search
          </button>
        </div>
      </section>

      {loading && <p>Searching...</p>}
      {message && <p>{message}</p>}

      <section className="book-grid">
        {books.map((book, index) => (
          <BookCard
            key={
              book.googleBookId ||
              book.openLibraryId ||
              index
            }
            book={book}
          />
        ))}
      </section>
    </main>
  );
}

export default SearchBooks;