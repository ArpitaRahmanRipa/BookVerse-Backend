import {
  Navigate,
  useLocation,
} from "react-router";

import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const location = useLocation();

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();


  // ==============================
  // Wait While Session Restores
  // ==============================

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20">

        <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">

          <p className="text-lg font-semibold text-[#352522]">
            Loading BookVerse...
          </p>

        </div>

      </main>
    );
  }


  // ==============================
  // Not Logged In
  // ==============================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  // ==============================
  // Role Not Allowed
  // ==============================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "Admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    if (
      user.role ===
      "Community Moderator"
    ) {
      return (
        <Navigate
          to="/moderation"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  // ==============================
  // Access Granted
  // ==============================

  return children;
}