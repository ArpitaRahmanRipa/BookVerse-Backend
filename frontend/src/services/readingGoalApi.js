import { API_BASE_URL, apiRequest } from "../config/api.js";

export const getMyReadingGoals = async (token) => {
  return apiRequest(`${API_BASE_URL}/reading-goals/me`, { token });
};

export const getUserReadingGoals = async (token, userId) => {
  return apiRequest(`${API_BASE_URL}/reading-goals/user/${userId}`, {
    token,
  });
};

export const createReadingGoal = async (token, payload) => {
  return apiRequest(`${API_BASE_URL}/reading-goals`, {
    token,
    method: "POST",
    body: payload,
    json: true,
  });
};

export const updateReadingGoal = async (token, goalId, payload) => {
  return apiRequest(`${API_BASE_URL}/reading-goals/${goalId}`, {
    token,
    method: "PUT",
    body: payload,
    json: true,
  });
};

export const deleteReadingGoal = async (token, goalId) => {
  return apiRequest(`${API_BASE_URL}/reading-goals/${goalId}`, {
    token,
    method: "DELETE",
  });
};
