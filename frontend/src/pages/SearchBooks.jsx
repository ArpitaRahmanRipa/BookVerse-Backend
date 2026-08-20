import { useState } from "react";

import BookCard from "../components/BookCard";
import {
  searchBooks as searchBooksApi,
} from "../services/bookApi";

const searchTypes = [
  {
    value: "title",
    label: "Title",
  },
  {
    value: "author",
    label: "Author",
  },
  {
    value: "isbn",
    label: "ISBN",
  },
  {
    value: "genre",
    label: "Genre",
  },
  {
    value: "year",
    label: "Publication Year",
  },
  {
    value: "query",
    label: "Keyword",
  },
];

export default function SearchBooks() {
  const [type, setType] =
    useState("title");

  const [value, setValue] =
    useState("");

  const [books, setBooks] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [source, setSource] =
    useState("");

  const handleSearch = async () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setMessage(
        "Please enter a search value."
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setSource("");

      const data =
        await searchBooksApi(
          type,
          trimmedValue
        );

      const results =
        data.books || [];

      setBooks(results);
      setSource(data.source || "");

      if (results.length === 0) {
        setMessage(
          "No books found."
        );
      }
    } catch (error) {
      setBooks([]);

      setMessage(
        error.message ||
          "Unable to search for books."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      <section className="rounded-3xl bg-[#352522] px-6 py-10 text-white shadow-lg md:px-10">

        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e4b995]">
          Discover
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Find Your Next Book
        </h1>

        <p className="mt-3 max-w-2xl text-stone-200">
          Search books by title, author,
          ISBN, genre, publication year,
          or keyword.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-[220px_1fr_auto]">

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value
              )
            }
            className="rounded-xl border border-white/20 bg-white px-4 py-3 text-[#352522] outline-none"
          >
            {searchTypes.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          <input
            type="text"
            value={value}
            onChange={(event) =>
              setValue(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                handleSearch();
              }
            }}
            placeholder="Search books..."
            className="rounded-xl border border-white/20 bg-white px-4 py-3 text-[#352522] outline-none"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="rounded-xl bg-[#a85f35] px-7 py-3 font-semibold text-white hover:bg-[#8f4c2b] disabled:opacity-50"
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>

        </div>

      </section>

      {source && (
        <p className="mt-5 text-sm text-stone-500">
          Results provided by{" "}
          <span className="font-semibold">
            {source}
          </span>
        </p>
      )}

      {message && (
        <div className="mt-6 rounded-xl border border-stone-200 bg-white px-5 py-4 text-stone-700">
          {message}
        </div>
      )}

      {books.length > 0 && (
        <section className="mt-8">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-2xl font-bold text-[#352522]">
              Search Results
            </h2>

            <span className="text-sm text-stone-500">
              {books.length} books
            </span>

          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {books.map(
              (book, index) => (
                <BookCard
                  key={
                    book.googleBookId ||
                    book.openLibraryId ||
                    index
                  }
                  book={book}
                />
              )
            )}

          </div>

        </section>
      )}

    </main>
  );
}