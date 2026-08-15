import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shelfMessage, setShelfMessage] = useState("");

  const userId = "member2-demo-user";

  useEffect(() => {
    const loadBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:9208/api/books/${id}`
        );

        const result = await response.json();

        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const addToShelf = async (shelf) => {
    try {
      const book = data.book;

      const response = await fetch(
        "http://localhost:9208/api/shelves",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            bookId:
              book.googleBookId ||
              book.openLibraryId ||
              id,
            bookTitle: book.title,
            authors: book.authors || [],
            coverImage: book.coverImage || "",
            shelf,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setShelfMessage(result.message);
      } else {
        setShelfMessage(
          result.message || "Unable to add book to shelf."
        );
      }
    } catch (error) {
      setShelfMessage("Unable to connect to shelf API.");
    }
  };

  if (loading) {
    return (
      <div className="container">
        Loading book details...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        Book not found.
      </div>
    );
  }

  const book = data.book;

  return (
    <main className="book-details">
      <div>
        <img
          className="detail-cover"
          src={
            book.coverImage ||
            "https://via.placeholder.com/220x320"
          }
          alt={book.title}
        />
      </div>

      <div>
        <h1>{book.title}</h1>

        <h3>
          {book.authors?.length
            ? book.authors.join(", ")
            : "Unknown Author"}
        </h3>

        <div className="rating-row">
          <span>
            ⭐ {book.averageRating || "N/A"}
          </span>

          <span>
            {book.ratingsCount || 0} reviews
          </span>
        </div>

        <p>
          {book.description ||
            "No description available."}
        </p>

        <div className="metadata">
          <p>
            <strong>ISBN:</strong>{" "}
            {book.isbn || "Unknown"}
          </p>

          <p>
            <strong>Page Count:</strong>{" "}
            {book.pageCount || "Unknown"}
          </p>

          <p>
            <strong>Publication Date:</strong>{" "}
            {book.publicationDate || "Unknown"}
          </p>

          <p>
            <strong>Language:</strong>{" "}
            {Array.isArray(book.language)
              ? book.language.join(", ")
              : book.language || "Unknown"}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {book.categories?.length
              ? book.categories.join(", ")
              : "Unknown"}
          </p>
        </div>

        <section className="reader-box">
          <h3>Reader Activity</h3>

          <p>
            Currently Reading:{" "}
            {data.readerActivity?.currentlyReading || 0}
          </p>

          <p>
            Completed:{" "}
            {data.readerActivity?.completed || 0}
          </p>

          <p>
            Total Readers:{" "}
            {data.readerActivity?.totalReaders || 0}
          </p>
        </section>

        <section className="shelf-box">
          <h3>Add to Shelf</h3>

          {(data.shelfOptions || []).map((shelf) => (
            <button
              key={shelf}
              onClick={() => addToShelf(shelf)}
            >
              {shelf}
            </button>
          ))}

          {shelfMessage && (
            <p>
              <strong>{shelfMessage}</strong>
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default BookDetails;