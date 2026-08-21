const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:1548/api";

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

export const generateRecommendations = async (
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/generate`,
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

export const getUserRecommendations = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/user/${userId}`
  );

  return handleResponse(response);
};

export const getSingleRecommendation = async (
  recommendationId
) => {
  const response = await fetch(
    `${API_BASE_URL}/recommendations/${recommendationId}`
  );

  return handleResponse(response);
};
