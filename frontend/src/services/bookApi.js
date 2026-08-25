const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:9208/api";


// ==========================================
// HANDLE API RESPONSE
// ==========================================

const handleResponse = async (response) => {

  let data;

  try {

    data = await response.json();

  } catch {

    data = {};

  }


  if (!response.ok) {

    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );

  }


  return data;

};



// ==========================================
// SEARCH BOOKS
// GET /api/books/search
// ==========================================

export const searchBooks = async (
  type,
  value
) => {

  const params =
    new URLSearchParams({
      [type]: value,
    });


  const response =
    await fetch(
      `${API_BASE_URL}/books/search?${params.toString()}`
    );


  return handleResponse(
    response
  );

};



// ==========================================
// GET BOOK DETAILS
// GET /api/books/:bookId
// ==========================================

export const getBookDetails = async (
  bookId
) => {

  const response =
    await fetch(
      `${API_BASE_URL}/books/${bookId}`
    );


  return handleResponse(
    response
  );

};



// ==========================================
// ADD BOOK TO SHELF
// POST /api/shelves
// ==========================================

export const addBookToShelf = async (
  payload
) => {

  const response =
    await fetch(
      `${API_BASE_URL}/shelves`,
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),

      }
    );


  return handleResponse(
    response
  );

};