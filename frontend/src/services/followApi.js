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

// Follow another reader
export const followReader = async (payload) => {
  const response = await fetch(
    `${API_BASE_URL}/follow`,
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

// Unfollow another reader
export const unfollowReader = async (
  userId,
  targetUserId
) => {
  const response = await fetch(
    `${API_BASE_URL}/follow/${userId}/${targetUserId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};

// Get the readers this user follows
export const getFollowing = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/following/${userId}`
  );

  return handleResponse(response);
};

// Get this user's followers
export const getFollowers = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/followers/${userId}`
  );

  return handleResponse(response);
};

// Followers + following counts
export const getConnectionCounts = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/connections/${userId}/counts`
  );

  return handleResponse(response);
};

// Check if user follows another reader
export const getFollowStatus = async (
  userId,
  targetUserId
) => {
  const response = await fetch(
    `${API_BASE_URL}/follow-status/${userId}/${targetUserId}`
  );

  return handleResponse(response);
};

// Get reading activity from followed readers
export const getFollowingActivity = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/following/${userId}/activity`
  );

  return handleResponse(response);
};