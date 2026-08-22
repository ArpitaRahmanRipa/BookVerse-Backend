import { NavLink } from "react-router";

const getLinkClass = ({ isActive }) => {
  const base =
    "rounded-xl px-4 py-2 text-sm font-semibold transition";

  return isActive
    ? `${base} bg-white/15 text-white`
    : `${base} text-stone-200 hover:bg-white/10 hover:text-white`;
};

export default function Navbar() {
  return (
    <header className="bg-[#352522] text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">

        {/* BookVerse Home */}
        <NavLink
          to="/"
          className="flex items-center gap-3 text-xl font-bold"
        >
          <span className="text-2xl">📖</span>
          <span>BookVerse</span>
        </NavLink>

        <nav className="flex flex-wrap items-center gap-2">

          {/* Future navigation:
              Member 1 - Dashboard / Shelves
              Member 2 - Books
              Member 4 - Profile

              We will add these only when
              their actual pages are integrated.
          */}
          {/* Member 2 - Book Search */}
          <NavLink
            to="/books"
            className={getLinkClass}
          >
            Books
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
          <NavLink
            to="/connections"
            className={getLinkClass}
          >
            Connections
          </NavLink>
        </nav>
      </div>
    </header>
  );
}