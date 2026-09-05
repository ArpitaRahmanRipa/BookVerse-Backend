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

const authHeaders = (token, withJson = false) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (withJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const generateRecommendations = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/recommendations/generate`, {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const getMyRecommendations = async (token) => {
  const response = await fetch(`${API_BASE_URL}/recommendations/me`, {
    headers: authHeaders(token),
  });

  return handleResponse(response);
};

export const getUserRecommendations = async (token, userId) => {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/user/${userId}`,
    {
      headers: authHeaders(token),
    }
  );

  return handleResponse(response);
};

export const getSingleRecommendation = async (token, recommendationId) => {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/${recommendationId}`,
    {
      headers: authHeaders(token),
    }
  );

  return handleResponse(response);
};
