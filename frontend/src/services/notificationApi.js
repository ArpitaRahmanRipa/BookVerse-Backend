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

// Get all notifications for one user
export const getNotifications = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/user/${userId}`
  );

  return handleResponse(response);
};

// Get only unread notifications
export const getUnreadNotifications = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/user/${userId}?unread=true`
  );

  return handleResponse(response);
};

// Get unread notification count
export const getUnreadCount = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/user/${userId}/unread-count`
  );

  return handleResponse(response);
};

// Mark one notification as read
export const markNotificationAsRead = async (
  notificationId
) => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
    }
  );

  return handleResponse(response);
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  userId
) => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/user/${userId}/read-all`,
    {
      method: "PATCH",
    }
  );

  return handleResponse(response);
};

// Delete one notification
export const deleteNotification = async (
  notificationId
) => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
};