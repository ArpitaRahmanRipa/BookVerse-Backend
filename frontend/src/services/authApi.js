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

const requestJson = async (url, options = {}) => {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(
      `Could not reach the BookVerse API at ${API_BASE_URL}. Make sure the backend is running on port 1548.`
    );
  }

  return handleResponse(response);
};


// ==============================
// Register
// ==============================

export const registerUser = async (payload) => {
  return requestJson(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};


// ==============================
// Login
// ==============================

export const loginUser = async (payload) => {
  return requestJson(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};


// ==============================
// Current Logged-In User
// ==============================

export const getCurrentUser = async (token) => {
  return requestJson(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};