import { useNavigate } from "react-router-dom";

function BookCard({ book }) {
  const navigate = useNavigate();

  const id = book.googleBookId || book.openLibraryId;

  return (
    <div className="book-card">
      <img
        src={
          book.coverImage ||
          "https://via.placeholder.com/150x220"
        }
        alt={book.title}
      />

      <h3>{book.title}</h3>

      <p>
        {book.authors?.length
          ? book.authors.join(", ")
          : "Unknown Author"}
      </p>

      <p>⭐ {book.averageRating || "N/A"}</p>

      <button onClick={() => navigate(`/books/${id}`)}>
        View Details
      </button>
    </div>
  );
}

export default BookCard;