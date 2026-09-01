import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getUnreadCount } from "../services/notificationApi";


const getLinkClass = ({ isActive }) => {
  const base =
    "rounded-xl px-4 py-2 text-sm font-semibold transition";

  return isActive
    ? `${base} bg-white/15 text-white`
    : `${base} text-stone-200 hover:bg-white/10 hover:text-white`;
};


const USER_ID = "21201436";


export default function Navbar() {

  const [unreadCount, setUnreadCount] =
    useState(0);


  useEffect(() => {

    const loadUnreadCount = async () => {

      try {

        const response =
          await getUnreadCount(USER_ID);


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


    const intervalId = setInterval(
      loadUnreadCount,
      5000
    );


    return () => {
      clearInterval(intervalId);
    };


  }, []);



  return (

    <header className="bg-[#352522] text-white shadow-lg">

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">


        {/* BookVerse Home */}

        <NavLink
          to="/"
          className="flex items-center gap-3 text-xl font-bold"
        >

          <span className="text-2xl">
            📖
          </span>

          <span>
            BookVerse
          </span>

        </NavLink>




        <nav className="flex flex-wrap items-center gap-2">



          {/* Member 2 - Book Search */}

          <NavLink
            to="/books"
            className={getLinkClass}
          >
            Books
          </NavLink>




          {/* Member 2 - Reading Lists */}

          <NavLink
            to="/reading-lists"
            className={getLinkClass}
          >
            Reading Lists
          </NavLink>




          {/* Member 3 - Reading Progress */}

          <NavLink
            to="/reading-progress"
            className={getLinkClass}
          >
            Reading Progress
          </NavLink>




          {/* Member 3 - Reading Diary */}

          <NavLink
            to="/reading-diary"
            className={getLinkClass}
          >
            Reading Diary
          </NavLink>




          {/* Reader Connections */}

          <NavLink
            to="/connections"
            className={getLinkClass}
          >
            Connections
          </NavLink>





          {/* Notifications */}

          <NavLink
            to="/notifications"
            className={getLinkClass}
          >

            <span className="flex items-center gap-2">

              Notifications


              {unreadCount > 0 && (

                <span className="min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-xs font-bold text-white">

                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}

                </span>

              )}


            </span>

          </NavLink>





          {/* Member 2 - Module 4 Feature 2 */}

          <NavLink
            to="/reading-wrapped"
            className={getLinkClass}
          >
            Reading Wrapped
          </NavLink>





          {/* Reporting Feature */}

          <NavLink
            to="/report"
            className={getLinkClass}
          >
            Report
          </NavLink>




          {/* Moderation Dashboard */}

          <NavLink
            to="/moderation"
            className={getLinkClass}
          >
            Moderation
          </NavLink>



        </nav>


      </div>

    </header>

  );

}