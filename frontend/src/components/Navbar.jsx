import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  useNavigate,
} from "react-router";

import {
  getUnreadCount,
} from "../services/notificationApi";

import {
  useAuth,
} from "../context/AuthContext";


const getLinkClass = ({
  isActive,
}) => {
  const base =
    "rounded-xl px-3 py-2 text-sm font-semibold transition";

  return isActive
    ? `${base} bg-white/15 text-white`
    : `${base} text-stone-200 hover:bg-white/10 hover:text-white`;
};


export default function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isModerator,
    isAdmin,
    logout,
  } = useAuth();


  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);


  // ==============================
  // Notification Counter
  // ==============================

  useEffect(() => {
    if (
      !isAuthenticated ||
      !user?.userId
    ) {
      setUnreadCount(0);
      return;
    }


    const loadUnreadCount =
      async () => {
        try {
          const response =
            await getUnreadCount(
              user.userId
            );

          setUnreadCount(
            response.unreadCount || 0
          );
        } catch (error) {
          console.error(
            "Failed to load unread notification count:",
            error.message
          );
        }
      };


    loadUnreadCount();


    const intervalId =
      setInterval(
        loadUnreadCount,
        5000
      );


    return () => {
      clearInterval(intervalId);
    };

  }, [
    isAuthenticated,
    user?.userId,
  ]);


  // ==============================
  // Logout
  // ==============================

  const handleLogout = () => {
    logout();

    navigate(
      "/",
      { replace: true }
    );
  };


  return (
    <header className="bg-[#352522] text-white shadow-lg">

      <div className="mx-auto max-w-7xl px-5 py-4">


        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


          {/* ============================== */}
          {/* Logo */}
          {/* ============================== */}

          <NavLink
            to="/"
            className="flex shrink-0 items-center gap-3 text-xl font-bold"
          >
            <span className="text-2xl">
              📖
            </span>

            <span>
              BookVerse
            </span>
          </NavLink>



          {/* ============================== */}
          {/* Navigation */}
          {/* ============================== */}

          <nav className="flex flex-wrap items-center gap-1">


            {/* Public */}

            <NavLink
              to="/"
              className={getLinkClass}
            >
              Home
            </NavLink>


            <NavLink
              to="/books"
              className={getLinkClass}
            >
              Books
            </NavLink>


            <NavLink
              to="/reading-lists"
              className={getLinkClass}
            >
              Reading Lists
            </NavLink>



            {/* ============================== */}
            {/* Logged-In Reader Features */}
            {/* ============================== */}

            {isAuthenticated && (
              <>

                <NavLink
                  to="/reading-progress"
                  className={getLinkClass}
                >
                  Progress
                </NavLink>


                <NavLink
                  to="/reading-diary"
                  className={getLinkClass}
                >
                  Diary
                </NavLink>


                <NavLink
                  to="/connections"
                  className={getLinkClass}
                >
                  Connections
                </NavLink>


                <NavLink
                  to="/reading-goals"
                  className={getLinkClass}
                >
                  Goals
                </NavLink>


                <NavLink
                  to="/reading-wrapped"
                  className={getLinkClass}
                >
                  Wrapped
                </NavLink>


                <NavLink
                  to="/recommendations"
                  className={getLinkClass}
                >
                  Recommendations
                </NavLink>


                <NavLink
                  to="/report"
                  className={getLinkClass}
                >
                  Report
                </NavLink>


                <NavLink
                  to="/notifications"
                  className={getLinkClass}
                >

                  <span className="flex items-center gap-2">

                    🔔

                    {unreadCount > 0 && (
                      <span className="min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-xs font-bold text-white">
                        {
                          unreadCount > 99
                            ? "99+"
                            : unreadCount
                        }
                      </span>
                    )}

                  </span>

                </NavLink>


                <NavLink
                  to="/profile"
                  className={getLinkClass}
                >
                  Profile
                </NavLink>

              </>
            )}



            {/* ============================== */}
            {/* Moderator */}
            {/* ============================== */}

            {isModerator && (
              <NavLink
                to="/moderation"
                className={getLinkClass}
              >
                Moderation
              </NavLink>
            )}



            {/* ============================== */}
            {/* Admin */}
            {/* ============================== */}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={getLinkClass}
              >
                Admin
              </NavLink>
            )}

          </nav>



          {/* ============================== */}
          {/* Account Section */}
          {/* ============================== */}

          <div className="flex shrink-0 items-center gap-2">


            {!isAuthenticated ? (
              <>

                <NavLink
                  to="/login"
                  className="rounded-xl border border-white/30 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Sign In
                </NavLink>


                <NavLink
                  to="/register"
                  className="rounded-xl bg-[#d6ad8c] px-4 py-2 text-sm font-bold text-[#352522] transition hover:bg-[#e5c3a8]"
                >
                  Join
                </NavLink>

              </>
            ) : (
              <>

                <div className="hidden text-right xl:block">

                  <p className="text-sm font-bold">
                    {user?.name}
                  </p>

                  <p className="text-xs text-stone-300">
                    {user?.role}
                  </p>

                </div>


                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-white/30 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Logout
                </button>

              </>
            )}

          </div>


        </div>

      </div>

    </header>
  );
}