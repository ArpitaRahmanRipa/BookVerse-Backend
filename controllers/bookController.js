const axios = require("axios");
const ReadingProgress = require("../models/ReadingProgress");

const formatGoogleBook = (item) => {
    const info = item.volumeInfo || {};

    return {
        googleBookId: item.id || null,
        openLibraryId: null,
        title: info.title || "Unknown title",
        authors: info.authors || [],
        description:
            info.description ||
            "No description available.",
        isbn:
            info.industryIdentifiers?.[0]?.identifier ||
            null,
        publicationDate:
            info.publishedDate || null,
        pageCount:
            info.pageCount || 0,
        language:
            info.language || null,
        categories:
            info.categories || [],
        coverImage:
            info.imageLinks?.thumbnail ||
            info.imageLinks?.smallThumbnail ||
            "",
        averageRating:
            info.averageRating || 0,
        ratingsCount:
            info.ratingsCount || 0,
        previewLink:
            info.previewLink || ""
    };
};

const formatOpenLibraryBook = (book) => ({
    googleBookId: null,

    openLibraryId:
        book.key?.replace("/works/", "") || null,

    title:
        book.title || "Unknown title",

    authors:
        book.author_name || [],

    description:
        "Open book details for description.",

    isbn:
        book.isbn?.[0] || null,

    publicationDate:
        book.first_publish_year || null,

    pageCount:
        book.number_of_pages_median || 0,

    language:
        book.language || [],

    categories:
        book.subject?.slice(0, 10) || [],

    coverImage:
        book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "",

    averageRating:
        book.ratings_average || 0,

    ratingsCount:
        book.ratings_count || 0,

    previewLink:
        book.key
            ? `https://openlibrary.org${book.key}`
            : ""
});


// ========================================
// Reader Activity
// ========================================

const getReaderActivity = async (bookTitle) => {

    const currentlyReading =
        await ReadingProgress.countDocuments({
            bookTitle,
            status: "Currently Reading"
        });

    const completed =
        await ReadingProgress.countDocuments({
            bookTitle,
            status: "Completed"
        });

    const totalReaders =
        await ReadingProgress.countDocuments({
            bookTitle
        });

    return {
        currentlyReading,
        completed,
        totalReaders
    };
};


// ========================================
// SEARCH BOOKS
// ========================================

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

        if (title)
            terms.push(`intitle:${title}`);

        if (author)
            terms.push(`inauthor:${author}`);

        if (isbn)
            terms.push(`isbn:${isbn}`);

        if (genre)
            terms.push(`subject:${genre}`);

        if (year)
            terms.push(year);

        if (query)
            terms.push(query);


        // =================================
        // Google Books
        // =================================

        try {

            const response =
                await axios.get(
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
                results:
                    books.length,
                books
            });

        } catch (googleError) {

            // Use Open Library when Google
            // rate limit is reached

            if (
                googleError.response?.status !== 429
            ) {
                throw googleError;
            }


            // =============================
            // Open Library fallback
            // =============================

            const params = {
                limit: 20
            };

            if (title)
                params.title = title;

            if (author)
                params.author = author;

            if (isbn)
                params.isbn = isbn;

            if (genre)
                params.subject = genre;

            if (query)
                params.q = query;

            if (year)
                params.q =
                    `first_publish_year:${year}`;


            const response =
                await axios.get(
                    "https://openlibrary.org/search.json",
                    { params }
                );


            let documents =
                response.data.docs || [];


            if (year) {

                documents =
                    documents.filter(
                        (book) =>
                            String(
                                book.first_publish_year
                            ) === String(year)
                    );
            }


            const books =
                documents
                    .slice(0, 20)
                    .map(formatOpenLibraryBook);


            return res.json({
                success: true,
                source:
                    "Open Library fallback",

                totalItems:
                    response.data.numFound ||
                    response.data.num_found ||
                    books.length,

                results:
                    books.length,

                books
            });
        }

    } catch (error) {

        return res.status(500).json({
            success: false,
            message:
                "Unable to search for books.",
            error:
                error.message
        });
    }
};


// ========================================
// GET BOOK DETAILS
// ========================================

const getBookDetails = async (req, res) => {

    try {

        const { id } = req.params;


        // =================================
        // OPEN LIBRARY
        // =================================

        if (id.startsWith("OL")) {

            // -----------------------------
            // 1. Get Work
            // -----------------------------

            const workResponse =
                await axios.get(
                    `https://openlibrary.org/works/${id}.json`
                );

            const work =
                workResponse.data;


            const description =
                typeof work.description === "string"
                    ? work.description
                    : work.description?.value ||
                      "No description available.";


            const coverId =
                work.covers?.[0];


            // Default values

            let authors = [];

            let isbn = null;

            let pageCount = 0;

            let language = null;

            let averageRating = 0;

            let ratingsCount = 0;

            let publicationDate =
                work.first_publish_date || null;


            // =================================
            // 2. Get author directly from Work
            // =================================

            if (Array.isArray(work.authors)) {

                const authorNames =
                    await Promise.all(

                        work.authors.map(
                            async (entry) => {

                                try {

                                    let authorKey =
                                        entry.author?.key ||
                                        entry.key;

                                    if (!authorKey)
                                        return null;


                                    const authorResponse =
                                        await axios.get(
                                            `https://openlibrary.org${authorKey}.json`
                                        );


                                    return (
                                        authorResponse
                                            .data
                                            .name ||
                                        null
                                    );

                                } catch (error) {

                                    return null;
                                }
                            }
                        )
                    );


                authors =
                    authorNames.filter(Boolean);
            }


            // =================================
            // 3. Search using TITLE
            // =================================

            try {

                const metadataResponse =
                    await axios.get(
                        "https://openlibrary.org/search.json",
                        {
                            params: {

                                title:
                                    work.title,

                                fields: [
                                    "key",
                                    "title",
                                    "author_name",
                                    "isbn",
                                    "language",
                                    "first_publish_year",
                                    "number_of_pages_median",
                                    "ratings_average",
                                    "ratings_count",
                                    "editions",
                                    "editions.key",
                                    "editions.language"
                                ].join(","),

                                limit: 20
                            }
                        }
                    );


                const documents =
                    metadataResponse.data.docs || [];


                // Find this exact Work ID

                const metadataBook =
                    documents.find((item) => {

                        const itemId =
                            item.key
                                ?.replace(
                                    "/works/",
                                    ""
                                );

                        return itemId === id;

                    }) || documents[0];


                if (metadataBook) {

                    // -------------------------
                    // Author
                    // -------------------------

                    if (
                        authors.length === 0 &&
                        Array.isArray(
                            metadataBook.author_name
                        )
                    ) {

                        authors =
                            metadataBook.author_name;
                    }


                    // -------------------------
                    // ISBN
                    // -------------------------

                    if (
                        Array.isArray(
                            metadataBook.isbn
                        ) &&
                        metadataBook.isbn.length > 0
                    ) {

                        // Prefer ISBN-13

                        isbn =
                            metadataBook.isbn.find(
                                value =>
                                    String(value).length === 13
                            ) ||
                            metadataBook.isbn[0];
                    }


                    // -------------------------
                    // Page Count
                    // -------------------------

                    if (
                        metadataBook
                            .number_of_pages_median
                    ) {

                        pageCount =
                            metadataBook
                                .number_of_pages_median;
                    }


                    // -------------------------
                    // Language
                    // -------------------------

                    if (
                        Array.isArray(
                            metadataBook.language
                        ) &&
                        metadataBook.language.length > 0
                    ) {

                        language =
                            metadataBook.language;
                    }


                    // -------------------------
                    // Publication Date fallback
                    // -------------------------

                    if (
                        !publicationDate &&
                        metadataBook
                            .first_publish_year
                    ) {

                        publicationDate =
                            metadataBook
                                .first_publish_year;
                    }


                    // -------------------------
                    // Rating
                    // -------------------------

                    if (
                        metadataBook.ratings_average
                    ) {

                        averageRating =
                            Number(
                                metadataBook
                                    .ratings_average
                            );
                    }


                    if (
                        metadataBook.ratings_count
                    ) {

                        ratingsCount =
                            Number(
                                metadataBook
                                    .ratings_count
                            );
                    }


                    // -------------------------
                    // Edition language fallback
                    // -------------------------

                    const edition =
                        metadataBook
                            .editions
                            ?.docs?.[0];


                    if (
                        !language &&
                        edition &&
                        Array.isArray(
                            edition.language
                        )
                    ) {

                        language =
                            edition.language;
                    }
                }

            } catch (metadataError) {

                console.log(
                    "Open Library metadata lookup failed:",
                    metadataError.message
                );
            }


            // =================================
            // Final normalized book object
            // =================================

            const book = {

                googleBookId: null,

                openLibraryId: id,

                title:
                    work.title ||
                    "Unknown title",

                authors,

                description,

                isbn,

                publicationDate,

                pageCount,

                language,

                categories:
                    work.subjects || [],

                coverImage:
                    coverId
                        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                        : "",

                averageRating,

                ratingsCount,

                previewLink:
                    `https://openlibrary.org/works/${id}`
            };


            const readerActivity =
                await getReaderActivity(
                    book.title
                );


            return res.json({

                success: true,

                source:
                    "Open Library",

                book,

                readerActivity,

                shelfOptions: [
                    "Want to Read",
                    "Currently Reading",
                    "Read"
                ]
            });
        }


        // =================================
        // GOOGLE BOOKS
        // =================================

        const response =
            await axios.get(
                `${process.env.GOOGLE_BOOKS_API}/volumes/${id}`
            );


        const book =
            formatGoogleBook(
                response.data
            );


        const readerActivity =
            await getReaderActivity(
                book.title
            );


        return res.json({

            success: true,

            source:
                "Google Books",

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

            error:
                error.message
        });
    }
};


module.exports = {
    searchBooks,
    getBookDetails
};