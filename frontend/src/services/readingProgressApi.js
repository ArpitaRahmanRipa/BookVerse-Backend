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

// Get all reading-progress records for one user
export const getUserProgress = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-progress/user/${userId}`
  );

  return handleResponse(response);
};

// Get one reading-progress record
export const getSingleProgress = async (
  progressId
) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-progress/${progressId}`
  );

  return handleResponse(response);
};

// Create a new reading-progress record
export const createReadingProgress = async (
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-progress`,
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

// Update progress/status/dates/rating
export const updateReadingProgress = async (
  progressId,
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-progress/${progressId}`,
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

// Add diary entry
export const addDiaryEntry = async (
  progressId,
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-progress/${progressId}/diary`,
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

// Delete diary entry
export const deleteDiaryEntry = async (
  progressId,
  entryId
) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-progress/${progressId}/diary/${entryId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};

// Delete entire reading-progress record
export const deleteReadingProgress = async (
  progressId
) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-progress/${progressId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};
// Check whether the user has inactive reading
// progress records that need reminders
export const checkReadingReminders = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/reading-progress/user/${userId}/check-reminders`,
    {
      method: "POST",
    }
  );

  return handleResponse(response);
};