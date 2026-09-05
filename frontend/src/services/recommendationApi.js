import { API_BASE_URL, apiRequest } from "../config/api.js";

export const generateRecommendations = async (token, payload) => {
  return apiRequest(`${API_BASE_URL}/recommendations/generate`, {
    token,
    method: "POST",
    body: payload,
    json: true,
  });
};

export const getMyRecommendations = async (token) => {
  return apiRequest(`${API_BASE_URL}/recommendations/me`, { token });
};

export const getUserRecommendations = async (token, userId) => {
  return apiRequest(`${API_BASE_URL}/recommendations/user/${userId}`, {
    token,
  });
};

export const getSingleRecommendation = async (token, recommendationId) => {
  return apiRequest(`${API_BASE_URL}/recommendations/${recommendationId}`, {
    token,
  });
};
