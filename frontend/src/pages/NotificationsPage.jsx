import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationApi";

import {
  useAuth,
} from "../context/AuthContext";


export default function NotificationsPage() {
  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  const userId =
    user?.userId;


  const [
    notifications,
    setNotifications,
  ] = useState([]);


  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);


  const [
    activeTab,
    setActiveTab,
  ] = useState("all");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    working,
    setWorking,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState({
    type: "",
    text: "",
  });


  // ==============================
  // Load Current User Notifications
  // ==============================

  const loadNotifications =
    async () => {
      if (!userId) {
        setLoading(false);
        return;
      }


      try {
        setLoading(true);


        const [
          notificationsResponse,
          unreadResponse,
        ] = await Promise.all([
          getNotifications(
            userId
          ),

          getUnreadCount(
            userId
          ),
        ]);


        setNotifications(
          notificationsResponse.data ||
            []
        );


        setUnreadCount(
          unreadResponse.unreadCount ||
            0
        );

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to load notifications.",
        });

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {
    loadNotifications();
  }, [userId]);


  // ==============================
  // Mark One As Read
  // ==============================

  const handleMarkAsRead =
    async (
      notificationId
    ) => {
      try {
        setWorking(true);

        setMessage({
          type: "",
          text: "",
        });


        await markNotificationAsRead(
          notificationId
        );


        await loadNotifications();

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to mark notification as read.",
        });

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Mark All As Read
  // ==============================

  const handleMarkAllAsRead =
    async () => {
      if (!userId) {
        return;
      }


      try {
        setWorking(true);

        setMessage({
          type: "",
          text: "",
        });


        await markAllNotificationsAsRead(
          userId
        );


        await loadNotifications();


        setMessage({
          type: "success",

          text:
            "All notifications marked as read.",
        });

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to mark all notifications as read.",
        });

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Delete Notification
  // ==============================

  const handleDelete =
    async (
      notificationId
    ) => {
      try {
        setWorking(true);

        setMessage({
          type: "",
          text: "",
        });


        await deleteNotification(
          notificationId
        );


        await loadNotifications();


        setMessage({
          type: "success",

          text:
            "Notification deleted successfully.",
        });

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to delete notification.",
        });

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // View Notification Activity
  // ==============================

  const handleViewActivity =
    async (
      notification
    ) => {
      try {
        if (
          !notification.isRead
        ) {
          await markNotificationAsRead(
            notification._id
          );
        }
      } catch (error) {
        console.error(
          "Failed to mark notification as read:",
          error.message
        );
      }


      if (
        notification.link
      ) {
        navigate(
          notification.link
        );
      }
    };


  // ==============================
  // Notification Labels
  // ==============================

  const getTypeLabel = (
    type
  ) => {
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


  const getTypeIcon = (
    type
  ) => {
    switch (type) {
      case "follow":
        return "👥";

      case "review_like":
        return "❤️";

      case "review_comment":
        return "💬";

      case "list_like":
        return "📚";

      case "reading_reminder":
        return "⏰";

      case "moderation_update":
        return "🛡️";

      default:
        return "🔔";
    }
  };


  // ==============================
  // Date
  // ==============================

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }


    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(date);
  };


  // ==============================
  // Filter
  // ==============================

  const displayedNotifications =
    activeTab === "unread"
      ? notifications.filter(
          (notification) =>
            !notification.isRead
        )
      : notifications;


  return (
    <main className="min-h-screen bg-[#f7f2e9]">

      <div className="mx-auto max-w-5xl px-6 py-10">


        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">


          <div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
              BookVerse Activity
            </p>


            <h1 className="mt-2 text-4xl font-bold text-[#352522]">
              Notifications
            </h1>


            <p className="mt-2 text-stone-600">
              Stay updated with your
              BookVerse activity.
            </p>


            {user?.name && (
              <p className="mt-2 text-sm font-semibold text-[#6f3f26]">
                Notifications for{" "}
                {user.name}
              </p>
            )}

          </div>


          {unreadCount > 0 && (
            <button
              type="button"
              onClick={
                handleMarkAllAsRead
              }
              disabled={
                working
              }
              className="rounded-xl bg-[#6f3f26] px-5 py-3 font-semibold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark All as Read
            </button>
          )}

        </section>



        {/* ============================== */}
        {/* Message */}
        {/* ============================== */}

        {message.text && (
          <div
            className={`mt-6 rounded-xl border px-5 py-4 font-medium ${
              message.type ===
              "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}



        {/* ============================== */}
        {/* Unread Summary */}
        {/* ============================== */}

        <section className="mt-8 rounded-3xl bg-[#352522] p-6 text-white shadow-sm">


          <div className="flex items-center justify-between gap-4">


            <div>

              <p className="text-sm text-stone-300">
                Unread Notifications
              </p>


              <p className="mt-2 text-4xl font-bold">
                {unreadCount}
              </p>

            </div>


            <div className="text-5xl">
              🔔
            </div>

          </div>

        </section>



        {/* ============================== */}
        {/* Tabs */}
        {/* ============================== */}

        <section className="mt-6 flex flex-wrap gap-3">


          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "all"
              )
            }
            className={
              activeTab === "all"
                ? "rounded-xl bg-[#824425] px-5 py-2.5 font-semibold text-white"
                : "rounded-xl border border-stone-300 bg-white px-5 py-2.5 font-semibold text-stone-700 transition hover:bg-stone-50"
            }
          >
            All (
            {
              notifications.length
            }
            )
          </button>


          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "unread"
              )
            }
            className={
              activeTab ===
              "unread"
                ? "rounded-xl bg-[#824425] px-5 py-2.5 font-semibold text-white"
                : "rounded-xl border border-stone-300 bg-white px-5 py-2.5 font-semibold text-stone-700 transition hover:bg-stone-50"
            }
          >
            Unread (
            {unreadCount})
          </button>

        </section>



        {/* ============================== */}
        {/* Content */}
        {/* ============================== */}

        {loading ? (

          <section className="mt-6 rounded-3xl bg-white p-10 text-center shadow-sm">

            <p className="text-stone-600">
              Loading notifications...
            </p>

          </section>

        ) : displayedNotifications.length ===
          0 ? (

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">


            <div className="text-5xl">
              🔔
            </div>


            <h2 className="mt-5 text-2xl font-bold text-[#352522]">
              No notifications found
            </h2>


            <p className="mt-2 text-stone-500">

              {activeTab === "unread"
                ? "You have no unread notifications."
                : "New BookVerse activity will appear here."}

            </p>

          </section>

        ) : (

          <section className="mt-6 space-y-4">


            {displayedNotifications.map(
              (
                notification
              ) => (

                <article
                  key={
                    notification._id
                  }
                  className={`rounded-3xl border p-6 shadow-sm ${
                    notification.isRead
                      ? "border-stone-200 bg-white"
                      : "border-[#d9b89f] bg-[#fffaf5]"
                  }`}
                >


                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">


                    <div className="flex flex-1 gap-4">


                      {/* Icon */}

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f1e5d8] text-xl">

                        {
                          getTypeIcon(
                            notification.type
                          )
                        }

                      </div>



                      <div className="flex-1">


                        {/* Labels */}

                        <div className="flex flex-wrap items-center gap-2">


                          <span className="rounded-full bg-[#f4eadf] px-3 py-1 text-xs font-bold text-[#6f3f26]">

                            {
                              getTypeLabel(
                                notification.type
                              )
                            }

                          </span>


                          {!notification.isRead && (
                            <span className="rounded-full bg-[#824425] px-2.5 py-1 text-xs font-bold text-white">
                              New
                            </span>
                          )}

                        </div>



                        {/* Message */}

                        <p className="mt-3 font-medium leading-7 text-[#352522]">
                          {
                            notification.message
                          }
                        </p>



                        {/* Date */}

                        <p className="mt-2 text-sm text-stone-500">

                          {
                            formatDate(
                              notification.createdAt
                            )
                          }

                        </p>



                        {/* Email Status */}

                        {notification.emailSent && (
                          <p className="mt-2 text-xs font-semibold text-green-700">
                            ✉️ Email alert sent
                          </p>
                        )}



                        {/* Link */}

                        {notification.link && (
                          <button
                            type="button"
                            onClick={() =>
                              handleViewActivity(
                                notification
                              )
                            }
                            className="mt-4 text-sm font-bold text-[#824425] hover:underline"
                          >
                            View Activity →
                          </button>
                        )}

                      </div>

                    </div>



                    {/* ============================== */}
                    {/* Actions */}
                    {/* ============================== */}

                    <div className="flex flex-wrap gap-2">


                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsRead(
                              notification._id
                            )
                          }
                          disabled={
                            working
                          }
                          className="rounded-xl border border-[#824425] px-3 py-2 text-sm font-semibold text-[#824425] transition hover:bg-[#f5ebe1] disabled:opacity-50"
                        >
                          Mark as Read
                        </button>
                      )}


                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            notification._id
                          )
                        }
                        disabled={
                          working
                        }
                        className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              )
            )}

          </section>

        )}

      </div>

    </main>
  );
}