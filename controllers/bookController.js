const axios = require("axios");
const ReadingProgress = require("../models/ReadingProgress");

const formatGoogleBook = (item) => {
    const info = item.volumeInfo || {};

    return {
        googleBookId: item.id || null,
        openLibraryId: null,
        title: info.title || "Unknown title",
        authors: info.authors || [],
        description: info.description || "No description available.",
        isbn: info.industryIdentifiers?.[0]?.identifier || null,
        publicationDate: info.publishedDate || null,
        pageCount: info.pageCount || 0,
        language: info.language || null,
        categories: info.categories || [],
        coverImage:
            info.imageLinks?.thumbnail ||
            info.imageLinks?.smallThumbnail ||
            "",
        averageRating: info.averageRating || 0,
        ratingsCount: info.ratingsCount || 0,
        previewLink: info.previewLink || ""
    };
};

const formatOpenLibraryBook = (book) => ({
    googleBookId: null,
    openLibraryId: book.key?.replace("/works/", "") || null,
    title: book.title || "Unknown title",
    authors: book.author_name || [],
    description: "Open book details for description.",
    isbn: book.isbn?.[0] || null,
    publicationDate: book.first_publish_year || null,
    pageCount: book.number_of_pages_median || 0,
    language: book.language || [],
    categories: book.subject?.slice(0, 10) || [],
    coverImage: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : "",
    averageRating: book.ratings_average || 0,
    ratingsCount: book.ratings_count || 0,
    previewLink: book.key
        ? `https://openlibrary.org${book.key}`
        : ""
});

// Reader activity for one book
const getReaderActivity = async (bookTitle) => {
    const currentlyReading =
        await ReadingProgress.countDocuments({
            bookTitle: bookTitle,
            status: "Currently Reading"
        });

    const completed =
        await ReadingProgress.countDocuments({
            bookTitle: bookTitle,
            status: "Completed"
        });

    const totalReaders =
        await ReadingProgress.countDocuments({
            bookTitle: bookTitle
        });

    return {
        currentlyReading,
        completed,
        totalReaders
    };
};

// Search books
const searchBooks = async (req, res) => {
    try {
        const {
            title,
            author,
            isbn,
            genre,
            year,
            query
        } = req.query;

        if (
            !title &&
            !author &&
            !isbn &&
            !genre &&
            !year &&
            !query
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide a search value."
            });
        }

        const terms = [];

        if (title) terms.push(`intitle:${title}`);
        if (author) terms.push(`inauthor:${author}`);
        if (isbn) terms.push(`isbn:${isbn}`);
        if (genre) terms.push(`subject:${genre}`);
        if (year) terms.push(year);
        if (query) terms.push(query);

        try {
            const response = await axios.get(
                `${process.env.GOOGLE_BOOKS_API}/volumes`,
                {
                    params: {
                        q: terms.join(" "),
                        maxResults: 20
                    }
                }
            );

            const books =
                (response.data.items || [])
                    .map(formatGoogleBook);

            return res.json({
                success: true,
                source: "Google Books",
                totalItems:
                    response.data.totalItems || 0,
                results: books.length,
                books
            });

        } catch (googleError) {

            if (googleError.response?.status !== 429) {
                throw googleError;
            }

            const params = {
                limit: 20
            };

            if (title) params.title = title;
            if (author) params.author = author;
            if (isbn) params.isbn = isbn;
            if (genre) params.subject = genre;
            if (query) params.q = query;

            if (year) {
                params.q =
                    `first_publish_year:${year}`;
            }

            const response = await axios.get(
                "https://openlibrary.org/search.json",
                { params }
            );

            let documents =
                response.data.docs || [];

            if (year) {
                documents = documents.filter(
                    (book) =>
                        String(
                            book.first_publish_year
                        ) === String(year)
                );
            }

            const books = documents
                .slice(0, 20)
                .map(formatOpenLibraryBook);

            return res.json({
                success: true,
                source: "Open Library fallback",
                totalItems:
                    response.data.numFound ||
                    response.data.num_found ||
                    books.length,
                results: books.length,
                books
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                "Unable to search for books.",
            error: error.message
        });
    }
};

// Get one book details
const getBookDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Open Library book
        if (id.startsWith("OL")) {

            const response = await axios.get(
                `https://openlibrary.org/works/${id}.json`
            );

            const apiBook = response.data;

            const description =
                typeof apiBook.description === "string"
                    ? apiBook.description
                    : apiBook.description?.value ||
                      "No description available.";

            const coverId =
                apiBook.covers?.[0];

            const book = {
                googleBookId: null,
                openLibraryId: id,
                title:
                    apiBook.title ||
                    "Unknown title",
                authors: [],
                description,
                isbn: null,
                publicationDate:
                    apiBook.first_publish_date ||
                    null,
                pageCount: 0,
                language: null,
                categories:
                    apiBook.subjects || [],
                coverImage: coverId
                    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                    : "",
                averageRating: 0,
                ratingsCount: 0,
                previewLink:
                    `https://openlibrary.org/works/${id}`
            };

            const readerActivity =
                await getReaderActivity(
                    book.title
                );

            return res.json({
                success: true,
                source: "Open Library",
                book,
                readerActivity,
                shelfOptions: [
                    "Want to Read",
                    "Currently Reading",
                    "Read"
                ]
            });
        }

        // Google Books book
        const response = await axios.get(
            `${process.env.GOOGLE_BOOKS_API}/volumes/${id}`
        );

        const book =
            formatGoogleBook(response.data);

        const readerActivity =
            await getReaderActivity(
                book.title
            );

        return res.json({
            success: true,
            source: "Google Books",
            book,
            readerActivity,
            shelfOptions: [
                "Want to Read",
                "Currently Reading",
                "Read"
            ]
        });

    } catch (error) {
        return res.status(
            error.response?.status === 404
                ? 404
                : 500
        ).json({
            success: false,
            message:
                error.response?.status === 404
                    ? "Book not found."
                    : "Unable to retrieve book details.",
            error: error.message
        });
    }
};

module.exports = {
    searchBooks,
    getBookDetails
};