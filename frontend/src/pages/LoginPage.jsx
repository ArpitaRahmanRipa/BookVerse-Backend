import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router";

import { useAuth } from "../context/AuthContext";


export default function LoginPage() {
  const navigate = useNavigate();

  const {
    login,
  } = useAuth();


  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });


  const [working, setWorking] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }));
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setWorking(true);
      setError("");


      const result = await login({
        identifier:
          form.identifier.trim(),

        password:
          form.password,
      });


      const role =
        result.user.role;


      // ==============================
      // Role-Based Dashboard Redirect
      // ==============================

      if (role === "Admin") {
        navigate(
          "/admin",
          { replace: true }
        );

        return;
      }


      if (
        role ===
        "Community Moderator"
      ) {
        navigate(
          "/moderation",
          { replace: true }
        );

        return;
      }


      // Reader

      navigate(
        "/",
        { replace: true }
      );

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Login failed."
      );

    } finally {

      setWorking(false);

    }
  };


  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f7f2e9] px-6 py-12">

      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl lg:grid-cols-2">


        {/* ============================== */}
        {/* Left Side */}
        {/* ============================== */}

        <section className="hidden bg-[#352522] p-10 text-white lg:flex lg:flex-col lg:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6ad8c]">
              BookVerse
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight">
              Welcome back to your reading world.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-stone-300">
              Track your reading, save your
              thoughts, discover books, connect
              with readers, and continue your
              BookVerse journey.
            </p>

          </div>


          <div className="mt-10 rounded-2xl bg-white/10 p-5">

            <p className="text-4xl">
              📚
            </p>

            <p className="mt-3 font-semibold">
              Every chapter counts.
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-300">
              Sign in to continue from where
              you left off.
            </p>

          </div>

        </section>


        {/* ============================== */}
        {/* Login Form */}
        {/* ============================== */}

        <section className="p-7 sm:p-10">

          <div className="mx-auto max-w-md">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
              Sign In
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#352522]">
              Welcome back
            </h2>

            <p className="mt-2 text-stone-600">
              Use your email address or
              username to log in.
            </p>


            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              <label className="block">

                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Email or Username
                </span>

                <input
                  type="text"
                  name="identifier"
                  value={
                    form.identifier
                  }
                  onChange={
                    handleChange
                  }
                  required
                  autoComplete="username"
                  placeholder="you@example.com or username"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                />

              </label>


              <label className="block">

                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Password
                </span>

                <input
                  type="password"
                  name="password"
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                />

              </label>


              <button
                type="submit"
                disabled={working}
                className="w-full rounded-xl bg-[#6f3f26] px-5 py-3 font-bold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {
                  working
                    ? "Signing in..."
                    : "Sign In"
                }
              </button>

            </form>


            <p className="mt-7 text-center text-sm text-stone-600">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-bold text-[#6f3f26] hover:underline"
              >
                Create one
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}