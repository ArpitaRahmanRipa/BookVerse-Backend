import { API_BASE_URL, apiRequest } from "../config/api.js";

export const getMyMedia = async (token) => {
  return apiRequest(`${API_BASE_URL}/media/me`, { token });
};

export const getUserMedia = async (token, userId) => {
  return apiRequest(`${API_BASE_URL}/media/user/${userId}`, { token });
};

export const uploadProfilePicture = async (token, userId, file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  return apiRequest(`${API_BASE_URL}/media/profile/${userId}`, {
    token,
    method: "POST",
    body: formData,
  });
};

export const removeProfilePicture = async (token, userId) => {
  return apiRequest(`${API_BASE_URL}/media/profile/${userId}`, {
    token,
    method: "DELETE",
  });
};

export const uploadListCover = async (
  token,
  userId,
  file,
  listId,
  listTitle
) => {
  const formData = new FormData();
  formData.append("listCover", file);
  formData.append("listId", listId);
  formData.append("listTitle", listTitle);

  return apiRequest(`${API_BASE_URL}/media/list-cover/${userId}`, {
    token,
    method: "POST",
    body: formData,
  });
};

export const removeListCover = async (token, userId, listId) => {
  return apiRequest(`${API_BASE_URL}/media/list-cover/${userId}/${listId}`, {
    token,
    method: "DELETE",
  });
};
