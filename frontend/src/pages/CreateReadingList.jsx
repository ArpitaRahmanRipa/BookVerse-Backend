import { useState } from "react";

import {
  createReadingList,
} from "../services/readingListApi";


export default function CreateReadingList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [visibility, setVisibility] =
    useState("public");
  const [tags, setTags] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage(
        "Please enter a reading list title."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const result = await createReadingList({
        ownerId: "reader001",
        title: title.trim(),
        description: description.trim(),
        visibility,
        tags: tagArray,
      });

      if (result.success) {
        setMessage(
          "Reading list created successfully!"
        );

        setTitle("");
        setDescription("");
        setVisibility("public");
        setTags("");
      } else {
        setMessage(
          result.message ||
            "Failed to create reading list."
        );
      }

    } catch (error) {
      console.error(
        "Create reading list error:",
        error
      );

      setMessage(
        "Something went wrong while creating the list."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mx-auto max-w-3xl p-6">

      <div className="rounded-2xl bg-white p-8 shadow">

        <h1 className="text-3xl font-bold text-[#352522]">
          Create Reading List
        </h1>

        <p className="mt-2 text-stone-600">
          Create your own public or private
          collection of books.
        </p>


        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* Title */}
          <div>
            <label className="mb-2 block font-semibold text-[#352522]">
              List Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Example: Best Mystery Books"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#b56536]"
            />
          </div>


          {/* Description */}
          <div>
            <label className="mb-2 block font-semibold text-[#352522]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe your reading list..."
              rows="4"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#b56536]"
            />
          </div>


          {/* Visibility */}
          <div>
            <label className="mb-2 block font-semibold text-[#352522]">
              Visibility
            </label>

            <select
              value={visibility}
              onChange={(event) =>
                setVisibility(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#b56536]"
            >
              <option value="public">
                Public
              </option>

              <option value="private">
                Private
              </option>
            </select>
          </div>


          {/* Tags */}
          <div>
            <label className="mb-2 block font-semibold text-[#352522]">
              Tags
            </label>

            <input
              type="text"
              value={tags}
              onChange={(event) =>
                setTags(event.target.value)
              }
              placeholder="Mystery, Thriller, Favorites"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#b56536]"
            />

            <p className="mt-2 text-sm text-stone-500">
              Separate tags using commas.
            </p>
          </div>


          {/* Message */}
          {message && (
            <div className="rounded-xl bg-stone-100 p-3 text-sm text-[#352522]">
              {message}
            </div>
          )}


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#b56536] px-6 py-3 font-semibold text-white transition hover:bg-[#9f542f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating..."
              : "Create Reading List"}
          </button>

        </form>

      </div>

    </div>
  );
}