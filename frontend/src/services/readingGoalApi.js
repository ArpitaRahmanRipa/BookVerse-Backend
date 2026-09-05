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

export const getUserReadingGoals = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-goals/user/${userId}`
  );

  return handleResponse(response);
};

export const createReadingGoal = async (payload) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-goals`,
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

export const updateReadingGoal = async (
  goalId,
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-goals/${goalId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
};

export const deleteReadingGoal = async (goalId) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-goals/${goalId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};
