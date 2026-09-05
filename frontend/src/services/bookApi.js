import { API_BASE_URL } from "../config/api.js";
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

export const searchBooks = async (
  type,
  value
) => {
  const params = new URLSearchParams({
    [type]: value,
  });

  const response = await fetch(
    `${API_BASE_URL}/books/search?${params.toString()}`
  );

  return handleResponse(response);
};

export const getBookDetails = async (
  bookId
) => {
  const response = await fetch(
    `${API_BASE_URL}/books/${bookId}`
  );

  return handleResponse(response);
};

export const addBookToShelf = async (
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/shelves`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
};