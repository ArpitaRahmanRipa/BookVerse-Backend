const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:1436/api";


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


// ==============================
// Update Logged-In User Profile
// ==============================

export const updateMyProfile = async (
  token,
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/users/me`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response);
};


// ==============================
// Get Public Profile
// ==============================

export const getPublicProfile = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}`
  );

  return handleResponse(response);
};