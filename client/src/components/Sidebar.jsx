import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/statistics", label: "Reading Statistics", ready: true },
  { to: "/wrapped", label: "Yearly Wrapped", ready: false },
  { to: "/reports", label: "Reports", ready: false },
  { to: "/admin", label: "Admin Analytics", ready: false },
];

function Sidebar() {
  return (
    <aside className="w-full border-b border-amber-200 bg-white/90 backdrop-blur md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          BookVerse
        </p>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">
          Member 4 Hub
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Insights, moderation, and analytics
        </p>
      </div>

      <nav className="px-4 pb-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-amber-100 text-amber-900"
                      : "text-stone-700 hover:bg-stone-100",
                  ].join(" ")
                }
              >
                <span>{item.label}</span>
                {!item.ready && (
                  <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] uppercase tracking-wide text-stone-600">
                    Soon
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
