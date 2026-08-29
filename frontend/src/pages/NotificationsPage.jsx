import { useEffect, useState } from "react";

import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationApi";

const USER_ID = "21201436";

const NotificationsPage = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [activeTab, setActiveTab] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==============================
  // Load notifications
  // ==============================

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        notificationsResponse,
        unreadResponse,
      ] = await Promise.all([
        getNotifications(USER_ID),
        getUnreadCount(USER_ID),
      ]);

      setNotifications(
        notificationsResponse.data || []
      );

      setUnreadCount(
        unreadResponse.unreadCount || 0
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ==============================
  // Mark one notification as read
  // ==============================

  const handleMarkAsRead = async (
    notificationId
  ) => {
    try {
      setError("");

      await markNotificationAsRead(
        notificationId
      );

      await loadNotifications();
    } catch (err) {
      setError(
        err.message ||
          "Failed to mark notification as read"
      );
    }
  };

  // ==============================
  // Mark all as read
  // ==============================

  const handleMarkAllAsRead = async () => {
    try {
      setError("");

      await markAllNotificationsAsRead(
        USER_ID
      );

      await loadNotifications();
    } catch (err) {
      setError(
        err.message ||
          "Failed to mark all notifications as read"
      );
    }
  };

  // ==============================
  // Delete notification
  // ==============================

  const handleDelete = async (
    notificationId
  ) => {
    try {
      setError("");

      await deleteNotification(
        notificationId
      );

      await loadNotifications();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete notification"
      );
    }
  };

  // ==============================
  // Notification type label
  // ==============================

  const getTypeLabel = (type) => {
    switch (type) {
      case "follow":
        return "New Follower";

      case "review_like":
        return "Review Like";

      case "review_comment":
        return "Review Comment";

      case "list_like":
        return "List Like";

      case "reading_reminder":
        return "Reading Reminder";

      case "moderation_update":
        return "Moderation Update";

      default:
        return "Notification";
    }
  };

  // ==============================
  // Date formatting
  // ==============================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  // ==============================
  // All / Unread filtering
  // ==============================

  const displayedNotifications =
    activeTab === "unread"
      ? notifications.filter(
          (notification) =>
            !notification.isRead
        )
      : notifications;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Notifications
            </h1>

            <p className="mt-1 text-gray-600">
              Stay updated with your BookVerse
              activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Unread summary */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">
            Unread notifications
          </p>

          <p className="mt-1 text-3xl font-bold text-indigo-600">
            {unreadCount}
          </p>
        </div>

        {/* Tabs */}

        <div className="mb-6 flex gap-2">
          <button
            onClick={() =>
              setActiveTab("all")
            }
            className={`rounded-lg px-4 py-2 font-medium ${
              activeTab === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() =>
              setActiveTab("unread")
            }
            className={`rounded-lg px-4 py-2 font-medium ${
              activeTab === "unread"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Loading notifications...
            </p>
          </div>
        ) : displayedNotifications.length ===
          0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-gray-800">
              No notifications found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              New activity will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedNotifications.map(
              (notification) => (
                <div
                  key={notification._id}
                  className={`rounded-xl border p-5 shadow-sm ${
                    notification.isRead
                      ? "border-gray-200 bg-white"
                      : "border-indigo-200 bg-indigo-50"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          {getTypeLabel(
                            notification.type
                          )}
                        </span>

                        {!notification.isRead && (
                          <span className="rounded-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-base font-medium text-gray-900">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {formatDate(
                          notification.createdAt
                        )}
                      </p>

                      {notification.link && (
                        <button
                          onClick={() => {
                            window.location.href =
                              notification.link;
                          }}
                          className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
                        >
                          View Activity
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            handleMarkAsRead(
                              notification._id
                            )
                          }
                          className="rounded-lg border border-indigo-600 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                        >
                          Mark as Read
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleDelete(
                            notification._id
                          )
                        }
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;