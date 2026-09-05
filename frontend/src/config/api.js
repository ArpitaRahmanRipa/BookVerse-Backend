export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:1548/api";

export const buildAuthHeaders = (
  token,
  { json = false } = {}
) => {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const parseApiResponse = async (response) => {
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

export const apiRequest = async (
  url,
  { token, method = "GET", body, json = false } = {}
) => {
  const options = {
    method,
    headers: buildAuthHeaders(token, { json }),
  };

  if (body !== undefined) {
    options.body = json ? JSON.stringify(body) : body;
  }

  const response = await fetch(url, options);
  return parseApiResponse(response);
};
