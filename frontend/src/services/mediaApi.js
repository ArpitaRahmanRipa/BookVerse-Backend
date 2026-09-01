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

export const getUserMedia = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/media/user/${userId}`
  );

  return handleResponse(response);
};

export const uploadProfilePicture = async (
  userId,
  file
) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await fetch(
    `${API_BASE_URL}/media/profile/${userId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  return handleResponse(response);
};

export const removeProfilePicture = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/media/profile/${userId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};

export const uploadListCover = async (
  userId,
  file,
  listId,
  listTitle
) => {
  const formData = new FormData();
  formData.append("listCover", file);
  formData.append("listId", listId);
  formData.append("listTitle", listTitle);

  const response = await fetch(
    `${API_BASE_URL}/media/list-cover/${userId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  return handleResponse(response);
};

export const removeListCover = async (
  userId,
  listId
) => {
  const response = await fetch(
    `${API_BASE_URL}/media/list-cover/${userId}/${listId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};
