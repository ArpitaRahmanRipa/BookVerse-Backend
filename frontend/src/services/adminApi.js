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

export const getPlatformAnalytics = async () => {
  const response = await fetch(
    `${API_BASE_URL}/admin/analytics`
  );

  return handleResponse(response);
};

export const getCategories = async (params = {}) => {
  const searchParams = new URLSearchParams(params);

  const response = await fetch(
    `${API_BASE_URL}/admin/categories?${searchParams.toString()}`
  );

  return handleResponse(response);
};

export const createCategory = async (payload) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/categories`,
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

export const updateCategory = async (
  categoryId,
  payload
) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/categories/${categoryId}`,
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

export const deleteCategory = async (categoryId) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/categories/${categoryId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};

// ==============================
// Admin - Get Registered Users
// ==============================

export const getAdminUsers = async (
  token
) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/users`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
};


// ==============================
// Admin - Change User Role
// ==============================

export const updateAdminUserRole = async (
  token,
  mongoUserId,
  role
) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/users/${mongoUserId}/role`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        role,
      }),
    }
  );

  return handleResponse(response);
};


// ==============================
// Admin - Activate / Deactivate User
// ==============================

export const updateAdminUserStatus = async (
  token,
  mongoUserId,
  isActive
) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/users/${mongoUserId}/status`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        isActive,
      }),
    }
  );

  return handleResponse(response);
};
