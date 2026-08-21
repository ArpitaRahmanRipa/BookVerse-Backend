import { useEffect, useState } from "react";

import {
  getUserMedia,
  removeListCover,
  removeProfilePicture,
  uploadListCover,
  uploadProfilePicture,
} from "../services/mediaApi";

const USER_ID = "23101548";

const defaultListForm = {
  listId: "",
  listTitle: "",
  file: null,
};

export default function ProfileMediaPage() {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [listForm, setListForm] = useState(defaultListForm);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadMedia = async () => {
    try {
      setLoading(true);

      const result = await getUserMedia(USER_ID);
      setMedia(result.data);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const showSuccess = (text) => {
    setMessage({
      type: "success",
      text,
    });
  };

  const showError = (error) => {
    setMessage({
      type: "error",
      text:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  };

  const handleProfileUpload = async () => {
    if (!profileFile) {
      setMessage({
        type: "error",
        text: "Choose a profile picture first.",
      });
      return;
    }

    try {
      setWorking(true);

      const result = await uploadProfilePicture(
        USER_ID,
        profileFile
      );

      setMedia(result.data);
      setProfileFile(null);
      showSuccess("Profile picture uploaded successfully.");
    } catch (error) {
      showError(error);
    } finally {
      setWorking(false);
    }
  };

  const handleProfileRemove = async () => {
    try {
      setWorking(true);

      const result = await removeProfilePicture(USER_ID);
      setMedia(result.data);
      showSuccess("Profile picture removed.");
    } catch (error) {
      showError(error);
    } finally {
      setWorking(false);
    }
  };

  const handleListCoverUpload = async () => {
    if (!listForm.file || !listForm.listId.trim()) {
      setMessage({
        type: "error",
        text: "List ID and cover image are required.",
      });
      return;
    }

    try {
      setWorking(true);

      const result = await uploadListCover(
        USER_ID,
        listForm.file,
        listForm.listId.trim(),
        listForm.listTitle.trim()
      );

      setMedia(result.data);
      setListForm(defaultListForm);
      showSuccess("List cover uploaded successfully.");
    } catch (error) {
      showError(error);
    } finally {
      setWorking(false);
    }
  };

  const handleListCoverRemove = async (listId) => {
    try {
      setWorking(true);

      const result = await removeListCover(
        USER_ID,
        listId
      );

      setMedia(result.data);
      showSuccess("List cover removed.");
    } catch (error) {
      showError(error);
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-lg text-stone-600">
            Loading profile media...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
          BookVerse
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#352522]">
          Profile Picture & Media Upload
        </h1>

        <p className="mt-2 max-w-2xl text-stone-600">
          Upload your profile picture and custom reading list
          cover images. Media is stored with Cloudinary and
          linked to your BookVerse profile.
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

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#352522]">
            Profile Picture
          </h2>

          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-[#eadfce] bg-[#faf6ef]">
              {media?.profilePictureUrl ? (
                <img
                  src={media.profilePictureUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-5xl">👤</span>
              )}
            </div>

            <div className="w-full flex-1">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Choose image
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setProfileFile(
                      event.target.files?.[0] || null
                    )
                  }
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
                />
              </label>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleProfileUpload}
                  disabled={working}
                  className="rounded-xl bg-[#6f3f26] px-4 py-3 font-semibold text-white hover:bg-[#57301d] disabled:opacity-50"
                >
                  Upload Picture
                </button>

                <button
                  type="button"
                  onClick={handleProfileRemove}
                  disabled={
                    working || !media?.profilePictureUrl
                  }
                  className="rounded-xl border-2 border-[#6f3f26] px-4 py-3 font-semibold text-[#6f3f26] hover:bg-[#f5ebe1] disabled:opacity-50"
                >
                  Remove Picture
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#352522]">
            Reading List Cover
          </h2>

          <div className="mt-6 grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                List ID
              </span>

              <input
                type="text"
                value={listForm.listId}
                onChange={(event) =>
                  setListForm((oldForm) => ({
                    ...oldForm,
                    listId: event.target.value,
                  }))
                }
                placeholder="Example: mystery-favorites-2026"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                List Title
              </span>

              <input
                type="text"
                value={listForm.listTitle}
                onChange={(event) =>
                  setListForm((oldForm) => ({
                    ...oldForm,
                    listTitle: event.target.value,
                  }))
                }
                placeholder="Example: Best Mystery Books"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Cover image
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setListForm((oldForm) => ({
                    ...oldForm,
                    file:
                      event.target.files?.[0] || null,
                  }))
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
              />
            </label>

            <button
              type="button"
              onClick={handleListCoverUpload}
              disabled={working}
              className="rounded-xl bg-[#6f3f26] px-4 py-3 font-semibold text-white hover:bg-[#57301d] disabled:opacity-50"
            >
              Upload List Cover
            </button>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#352522]">
          Uploaded List Covers
        </h2>

        {!media?.listCoverImages?.length ? (
          <p className="mt-4 text-stone-500">
            No list covers uploaded yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.listCoverImages.map((cover) => (
              <article
                key={cover._id || cover.listId}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf6ef]"
              >
                <img
                  src={cover.imageUrl}
                  alt={
                    cover.listTitle ||
                    cover.listId
                  }
                  className="h-40 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-[#352522]">
                    {cover.listTitle ||
                      cover.listId}
                  </h3>

                  <p className="mt-1 text-sm text-stone-500">
                    ID: {cover.listId}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleListCoverRemove(
                        cover.listId
                      )
                    }
                    disabled={working}
                    className="mt-4 rounded-xl border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Remove Cover
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
