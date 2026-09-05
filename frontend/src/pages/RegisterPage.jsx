import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router";

import { useAuth } from "../context/AuthContext";


export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
  } = useAuth();


  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    bio: "",
    favoriteGenres: "",
    readingGoal: "20",
    privacy: "Public",
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


      if (
        form.password !==
        form.confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }


      if (form.password.length < 6) {
        setError(
          "Password must be at least 6 characters long."
        );

        return;
      }


      const favoriteGenres =
        form.favoriteGenres
          .split(",")
          .map((genre) =>
            genre.trim()
          )
          .filter(Boolean);


      await register({
        name:
          form.name.trim(),

        email:
          form.email.trim(),

        username:
          form.username.trim(),

        password:
          form.password,

        bio:
          form.bio.trim(),

        favoriteGenres,

        readingGoal:
          Number(form.readingGoal) || 0,

        privacy:
          form.privacy,
      });


      // Every normal registration
      // becomes Reader.

      navigate(
        "/",
        { replace: true }
      );

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Registration failed."
      );

    } finally {

      setWorking(false);

    }
  };


  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f7f2e9] px-6 py-12">

      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">


        {/* ============================== */}
        {/* Left Side */}
        {/* ============================== */}

        <section className="hidden bg-[#352522] p-10 text-white lg:flex lg:flex-col lg:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6ad8c]">
              Join BookVerse
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight">
              Build your own reading story.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-stone-300">
              Create your reader profile,
              track books, write diary entries,
              build lists, follow readers, and
              discover your next favorite book.
            </p>

          </div>


          <div className="mt-10 space-y-4">

            <FeatureLine
              icon="📖"
              text="Track your reading progress"
            />

            <FeatureLine
              icon="📝"
              text="Keep a personal reading diary"
            />

            <FeatureLine
              icon="📚"
              text="Build reading lists and goals"
            />

            <FeatureLine
              icon="👥"
              text="Connect with other readers"
            />

          </div>

        </section>


        {/* ============================== */}
        {/* Registration Form */}
        {/* ============================== */}

        <section className="p-7 sm:p-10">

          <div className="mx-auto max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
              Create Account
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#352522]">
              Join BookVerse
            </h2>

            <p className="mt-2 text-stone-600">
              Start building your personal
              reading world.
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

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />

                <Field
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />

              </div>


              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />


              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                />

                <Field
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={
                    form.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                />

              </div>


              <label className="block">

                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Bio
                </span>

                <textarea
                  rows="3"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell other readers a little about yourself..."
                  className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                />

              </label>


              <Field
                label="Favorite Genres"
                name="favoriteGenres"
                value={
                  form.favoriteGenres
                }
                onChange={handleChange}
                placeholder="Mystery, Fantasy, Memoir"
              />


              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Yearly Reading Goal"
                  name="readingGoal"
                  type="number"
                  min="0"
                  value={
                    form.readingGoal
                  }
                  onChange={handleChange}
                />


                <label className="block">

                  <span className="mb-2 block text-sm font-semibold text-stone-700">
                    Profile Privacy
                  </span>

                  <select
                    name="privacy"
                    value={
                      form.privacy
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                  >
                    <option value="Public">
                      Public
                    </option>

                    <option value="Private">
                      Private
                    </option>
                  </select>

                </label>

              </div>


              <div className="rounded-xl bg-[#faf6ef] px-4 py-3 text-sm leading-6 text-stone-600">

                New accounts are created as{" "}

                <strong className="text-[#352522]">
                  Reader
                </strong>.

                Moderator and Admin roles are
                assigned separately by an
                administrator.

              </div>


              <button
                type="submit"
                disabled={working}
                className="w-full rounded-xl bg-[#6f3f26] px-5 py-3 font-bold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {
                  working
                    ? "Creating Account..."
                    : "Create Account"
                }
              </button>

            </form>


            <p className="mt-7 text-center text-sm text-stone-600">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-bold text-[#6f3f26] hover:underline"
              >
                Sign in
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}


function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-semibold text-stone-700">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
      />

    </label>
  );
}


function FeatureLine({
  icon,
  text,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">

      <span className="text-xl">
        {icon}
      </span>

      <span className="text-sm font-medium text-stone-200">
        {text}
      </span>

    </div>
  );
}