import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getPlatformAnalytics,
  updateCategory,
} from "../services/adminApi";

const defaultCategoryForm = {
  name: "",
  type: "genre",
  description: "",
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [form, setForm] = useState(defaultCategoryForm);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [analyticsResult, categoriesResult] =
        await Promise.all([
          getPlatformAnalytics(),
          getCategories(),
        ]);

      setAnalytics(analyticsResult.data);
      setCategories(categoriesResult.data || []);
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
    loadData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }));
  };

  const handleCreateCategory = async () => {
    try {
      setWorking(true);
      setMessage({ type: "", text: "" });

      const result = await createCategory({
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim(),
      });

      setCategories((oldCategories) =>
        [...oldCategories, result.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );

      setForm(defaultCategoryForm);
      setMessage({
        type: "success",
        text: "Category created successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setWorking(false);
    }
  };

  const handleToggleCategory = async (category) => {
    try {
      setWorking(true);

      const result = await updateCategory(category._id, {
        isActive: !category.isActive,
      });

      setCategories((oldCategories) =>
        oldCategories.map((item) =>
          item._id === category._id
            ? result.data
            : item
        )
      );
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setWorking(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setWorking(true);
      await deleteCategory(categoryId);

      setCategories((oldCategories) =>
        oldCategories.filter(
          (item) => item._id !== categoryId
        )
      );

      setMessage({
        type: "success",
        text: "Category deleted successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-lg text-stone-600">
            Loading admin analytics...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
          BookVerse Admin
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#352522]">
          Analytics and Category Management
        </h1>

        <p className="mt-2 max-w-3xl text-stone-600">
          View platform-level reading activity and manage
          book genres, tags, and community categories.
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

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={analytics?.totalUsers || 0}
        />
        <StatCard
          label="Books Saved"
          value={analytics?.totalBooksSaved || 0}
        />
        <StatCard
          label="Total Reviews"
          value={analytics?.totalReviews || 0}
        />
        <StatCard
          label="Active Readers"
          value={analytics?.activeReaders || 0}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#352522]">
              Most Reviewed Books
            </h2>

            {analytics?.mostReviewedBooks?.length ? (
              <ul className="mt-4 space-y-3">
                {analytics.mostReviewedBooks.map(
                  (book) => (
                    <li
                      key={book.bookTitle}
                      className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
                    >
                      <span className="font-semibold text-[#352522]">
                        {book.bookTitle}
                      </span>
                      <span className="text-sm font-bold text-[#8a5d42]">
                        {book.reviewCount} reviews
                      </span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="mt-4 text-stone-500">
                No reviewed books yet.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#352522]">
              Popular Genres
            </h2>

            {analytics?.popularGenres?.length ? (
              <ul className="mt-4 space-y-3">
                {analytics.popularGenres.map((genre) => (
                  <li
                    key={genre.name}
                    className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
                  >
                    <span className="font-semibold text-[#352522]">
                      {genre.name}
                    </span>
                    <span className="text-sm font-bold text-[#8a5d42]">
                      {genre.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-stone-500">
                No genre activity yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#352522]">
            Manage Categories
          </h2>

          <div className="mt-6 grid gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Category name"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#8a5d42]"
            >
              <option value="genre">Genre</option>
              <option value="tag">Tag</option>
              <option value="community">Community</option>
            </select>

            <textarea
              rows="3"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Optional description"
              className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
            />

            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={working || !form.name.trim()}
              className="rounded-xl bg-[#6f3f26] px-5 py-3 font-semibold text-white hover:bg-[#57301d] disabled:opacity-50"
            >
              {working ? "Saving..." : "Add Category"}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {categories.length === 0 ? (
              <p className="text-stone-500">
                No categories created yet.
              </p>
            ) : (
              categories.map((category) => (
                <article
                  key={category._id}
                  className="rounded-2xl border border-stone-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#352522]">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm capitalize text-stone-600">
                        {category.type}
                      </p>
                      {category.description && (
                        <p className="mt-2 text-sm text-stone-500">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        category.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {category.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleCategory(category)
                      }
                      disabled={working}
                      className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                    >
                      {category.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteCategory(category._id)
                      }
                      disabled={working}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-[#352522]">
        {value}
      </p>
    </div>
  );
}
