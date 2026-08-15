import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

function Layout() {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
