import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import {
  useAuth,
} from "../context/AuthContext";

import {
  updateMyProfile,
} from "../services/userApi";

import {
  getUserMedia,
} from "../services/mediaApi";


export default function ProfilePage() {
  const {
    user,
    token,
    refreshUser,
  } = useAuth();


  const [form, setForm] = useState({
    name: "",
    bio: "",
    favoriteGenres: "",
    readingGoal: "0",
    privacy: "Public",
  });


  const [profilePicture, setProfilePicture] =
    useState("");

  const [working, setWorking] =
    useState(false);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });


  // ==============================
  // Load User Into Form
  // ==============================

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name:
        user.name || "",

      bio:
        user.bio || "",

      favoriteGenres:
        user.favoriteGenres?.join(", ") ||
        "",

      readingGoal:
        String(
          user.readingGoal ?? 0
        ),

      privacy:
        user.privacy || "Public",
    });

  }, [user]);


  // ==============================
  // Load Member 4 Profile Picture
  // ==============================

  useEffect(() => {
    if (!user?.userId) {
      return;
    }

    const loadMedia = async () => {
      try {
        const result =
          await getUserMedia(
            user.userId
          );

        setProfilePicture(
          result.data
            ?.profilePictureUrl || ""
        );
      } catch (error) {
        console.error(
          "Failed to load profile media:",
          error.message
        );
      }
    };

    loadMedia();

  }, [user?.userId]);


  // ==============================
  // Form Change
  // ==============================

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


  // ==============================
  // Save Profile
  // ==============================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setWorking(true);

      setMessage({
        type: "",
        text: "",
      });


      const favoriteGenres =
        form.favoriteGenres
          .split(",")
          .map((genre) =>
            genre.trim()
          )
          .filter(Boolean);


      await updateMyProfile(
        token,
        {
          name:
            form.name.trim(),

          bio:
            form.bio.trim(),

          favoriteGenres,

          readingGoal:
            Number(
              form.readingGoal
            ) || 0,

          privacy:
            form.privacy,
        }
      );


      await refreshUser();


      setMessage({
        type: "success",
        text:
          "Profile updated successfully.",
      });

    } catch (error) {

      setMessage({
        type: "error",

        text:
          error instanceof Error
            ? error.message
            : "Failed to update profile.",
      });

    } finally {

      setWorking(false);

    }
  };


  if (!user) {
    return null;
  }


  return (
    <main className="mx-auto max-w-7xl px-6 py-10">


      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

      <section className="mb-8">

        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
          My BookVerse
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#352522]">
          Profile
        </h1>

        <p className="mt-2 max-w-2xl text-stone-600">
          Manage your reader identity,
          preferences, privacy, and profile
          media.
        </p>

      </section>


      {message.text && (
        <div
          className={`mb-6 rounded-xl border px-5 py-4 font-medium ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}


      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">


        {/* ============================== */}
        {/* Profile Summary */}
        {/* ============================== */}

        <section className="space-y-6">


          <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-sm">


            <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-[#eadfce] bg-[#faf6ef]">

              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-5xl">
                  👤
                </span>
              )}

            </div>


            <h2 className="mt-5 text-2xl font-bold text-[#352522]">
              {user.name}
            </h2>


            <p className="mt-1 text-stone-500">
              @{user.username}
            </p>


            <span className="mt-4 inline-block rounded-full bg-[#f2e5d9] px-4 py-1.5 text-sm font-bold text-[#6f3f26]">
              {user.role}
            </span>


            <div className="mt-6">

              <Link
                to="/profile/media"
                className="inline-block rounded-xl bg-[#6f3f26] px-5 py-3 font-bold text-white transition hover:bg-[#57301d]"
              >
                Manage Profile Media
              </Link>

            </div>

          </div>


          {/* Account Information */}

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-[#352522]">
              Account Information
            </h2>


            <InfoRow
              label="Email"
              value={user.email}
            />

            <InfoRow
              label="Username"
              value={`@${user.username}`}
            />

            <InfoRow
              label="Role"
              value={user.role}
            />

            <InfoRow
              label="Account Status"
              value={
                user.isActive
                  ? "Active"
                  : "Inactive"
              }
            />

          </div>


          {/* Quick Links */}

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-[#352522]">
              My Reading
            </h2>


            <div className="mt-4 grid gap-2">

              <ProfileLink
                to="/reading-progress"
                text="📖 Reading Progress"
              />

              <ProfileLink
                to="/reading-diary"
                text="📝 Reading Diary"
              />

              <ProfileLink
                to="/reading-goals"
                text="🎯 Reading Goals"
              />

              <ProfileLink
                to="/reading-wrapped"
                text="🏆 Reading Wrapped"
              />

              <ProfileLink
                to="/connections"
                text="👥 Reader Connections"
              />

            </div>

          </div>

        </section>



        {/* ============================== */}
        {/* Edit Profile */}
        {/* ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">


          <h2 className="text-2xl font-bold text-[#352522]">
            Edit Profile
          </h2>

          <p className="mt-2 text-stone-600">
            Update how your BookVerse profile
            appears to other readers.
          </p>


          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >


            {/* Name */}

            <label className="block">

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Display Name
              </span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

            </label>


            {/* Bio */}

            <label className="block">

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Bio
              </span>

              <textarea
                rows="5"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell other readers about yourself..."
                className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

            </label>


            {/* Genres */}

            <label className="block">

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Favorite Genres
              </span>

              <input
                type="text"
                name="favoriteGenres"
                value={
                  form.favoriteGenres
                }
                onChange={handleChange}
                placeholder="Mystery, Fantasy, Memoir"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

              <span className="mt-2 block text-xs text-stone-500">
                Separate genres with commas.
              </span>

            </label>


            <div className="grid gap-5 sm:grid-cols-2">


              {/* Goal */}

              <label className="block">

                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Yearly Reading Goal
                </span>

                <input
                  type="number"
                  min="0"
                  name="readingGoal"
                  value={
                    form.readingGoal
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                />

              </label>


              {/* Privacy */}

              <label className="block">

                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Profile Privacy
                </span>

                <select
                  name="privacy"
                  value={form.privacy}
                  onChange={handleChange}
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


            {/* Privacy Explanation */}

            <div className="rounded-2xl bg-[#faf6ef] p-4 text-sm leading-6 text-stone-600">

              <strong className="text-[#352522]">
                Public:
              </strong>{" "}
              other readers can view your
              profile information.

              <br />

              <strong className="text-[#352522]">
                Private:
              </strong>{" "}
              only basic identity information
              is shown publicly.

            </div>


            <button
              type="submit"
              disabled={working}
              className="w-full rounded-xl bg-[#6f3f26] px-5 py-3 font-bold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {
                working
                  ? "Saving..."
                  : "Save Profile Changes"
              }
            </button>

          </form>

        </section>

      </div>

    </main>
  );
}


function InfoRow({
  label,
  value,
}) {
  return (
    <div className="mt-4 flex items-start justify-between gap-4 border-b border-stone-100 pb-3 last:border-0">

      <span className="text-sm text-stone-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-[#352522]">
        {value}
      </span>

    </div>
  );
}


function ProfileLink({
  to,
  text,
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-[#352522] transition hover:bg-[#faf6ef]"
    >
      {text}
    </Link>
  );
}