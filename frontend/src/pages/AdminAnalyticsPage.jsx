import {
  useEffect,
  useState,
} from "react";

import {
  createCategory,
  deleteCategory,
  getAdminUsers,
  getCategories,
  getPlatformAnalytics,
  updateAdminUserRole,
  updateAdminUserStatus,
  updateCategory,
} from "../services/adminApi";

import {
  useAuth,
} from "../context/AuthContext";


const defaultCategoryForm = {
  name: "",
  type: "genre",
  description: "",
};


const USER_ROLES = [
  "Reader",
  "Community Moderator",
  "Admin",
];


export default function AdminAnalyticsPage() {
  const {
    user,
    token,
  } = useAuth();


  const [analytics, setAnalytics] =
    useState(null);

  const [categories, setCategories] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [working, setWorking] =
    useState(false);

  const [workingUserId, setWorkingUserId] =
    useState("");

  const [form, setForm] =
    useState(defaultCategoryForm);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });


  // ==============================
  // Load Admin Data
  // ==============================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        analyticsResult,
        categoriesResult,
        usersResult,
      ] = await Promise.all([
        getPlatformAnalytics(),
        getCategories(),
        getAdminUsers(token),
      ]);

      setAnalytics(
        analyticsResult.data
      );

      setCategories(
        categoriesResult.data || []
      );

      setUsers(
        usersResult.data || []
      );

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
    if (token) {
      loadData();
    }
  }, [token]);


  // ==============================
  // Category Form
  // ==============================

  const handleInputChange = (
    event
  ) => {
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
  // Create Category
  // ==============================

  const handleCreateCategory =
    async () => {
      try {
        setWorking(true);

        setMessage({
          type: "",
          text: "",
        });

        const result =
          await createCategory({
            name:
              form.name.trim(),

            type:
              form.type,

            description:
              form.description.trim(),
          });

        setCategories(
          (oldCategories) =>
            [
              ...oldCategories,
              result.data,
            ].sort((a, b) =>
              a.name.localeCompare(
                b.name
              )
            )
        );

        setForm(
          defaultCategoryForm
        );

        setMessage({
          type: "success",
          text:
            "Category created successfully.",
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


  // ==============================
  // Toggle Category
  // ==============================

  const handleToggleCategory =
    async (category) => {
      try {
        setWorking(true);

        const result =
          await updateCategory(
            category._id,
            {
              isActive:
                !category.isActive,
            }
          );

        setCategories(
          (oldCategories) =>
            oldCategories.map(
              (item) =>
                item._id ===
                category._id
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


  // ==============================
  // Delete Category
  // ==============================

  const handleDeleteCategory =
    async (categoryId) => {
      try {
        setWorking(true);

        await deleteCategory(
          categoryId
        );

        setCategories(
          (oldCategories) =>
            oldCategories.filter(
              (item) =>
                item._id !==
                categoryId
            )
        );

        setMessage({
          type: "success",
          text:
            "Category deleted successfully.",
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


  // ==============================
  // Change User Role
  // ==============================

  const handleRoleChange =
    async (
      account,
      newRole
    ) => {
      if (
        newRole === account.role
      ) {
        return;
      }

      try {
        setWorkingUserId(
          account._id
        );

        setMessage({
          type: "",
          text: "",
        });

        const result =
          await updateAdminUserRole(
            token,
            account._id,
            newRole
          );

        setUsers(
          (oldUsers) =>
            oldUsers.map(
              (item) =>
                item._id ===
                account._id
                  ? result.user
                  : item
            )
        );

        setMessage({
          type: "success",
          text:
            `${account.name}'s role was changed to ${newRole}.`,
        });

      } catch (error) {

        setMessage({
          type: "error",
          text: error.message,
        });

      } finally {

        setWorkingUserId("");
      }
    };


  // ==============================
  // Activate / Deactivate User
  // ==============================

  const handleUserStatus =
    async (account) => {
      try {
        setWorkingUserId(
          account._id
        );

        setMessage({
          type: "",
          text: "",
        });

        const newStatus =
          account.isActive === false;

        const result =
          await updateAdminUserStatus(
            token,
            account._id,
            newStatus
          );

        setUsers(
          (oldUsers) =>
            oldUsers.map(
              (item) =>
                item._id ===
                account._id
                  ? result.user
                  : item
            )
        );

        setMessage({
          type: "success",

          text:
            newStatus
              ? `${account.name}'s account was activated.`
              : `${account.name}'s account was deactivated.`,
        });

      } catch (error) {

        setMessage({
          type: "error",
          text: error.message,
        });

      } finally {

        setWorkingUserId("");
      }
    };


  // ==============================
  // Check Current Admin
  // ==============================

  const isCurrentUser = (
    account
  ) => {
    return (
      account._id === user?._id ||
      account.userId ===
        user?.userId
    );
  };


  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-lg text-stone-600">
            Loading admin dashboard...
          </p>
        </div>
      </main>
    );
  }


  return (
    <main className="mx-auto max-w-6xl px-6 py-10">

      {/* ==============================
          Header
      ============================== */}

      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
          BookVerse Admin
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#352522]">
          Admin Dashboard
        </h1>

        <p className="mt-2 max-w-3xl text-stone-600">
          View platform activity,
          manage categories, and control
          BookVerse user roles and
          account access.
        </p>

        <div className="mt-4 inline-flex rounded-full bg-[#f2e9df] px-4 py-2 text-sm font-semibold text-[#6f3f26]">
          Signed in as {user?.name} ·{" "}
          {user?.role}
        </div>
      </section>


      {/* ==============================
          Messages
      ============================== */}

      {message.text && (
        <div
          className={`mb-6 rounded-xl border px-5 py-4 font-medium ${
            message.type ===
            "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}


      {/* ==============================
          Analytics Cards
      ============================== */}

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Users"
          value={
            analytics?.totalUsers ||
            users.length ||
            0
          }
        />

        <StatCard
          label="Books Saved"
          value={
            analytics?.totalBooksSaved ||
            0
          }
        />

        <StatCard
          label="Total Reviews"
          value={
            analytics?.totalReviews ||
            0
          }
        />

        <StatCard
          label="Active Readers"
          value={
            analytics?.activeReaders ||
            0
          }
        />

      </section>


      {/* ==============================
          User Management
      ============================== */}

      <section className="mb-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>
            <h2 className="text-2xl font-bold text-[#352522]">
              User Management
            </h2>

            <p className="mt-1 text-stone-600">
              Manage registered users,
              roles, and account status.
            </p>
          </div>

          <div className="rounded-full bg-[#f7f1eb] px-4 py-2 text-sm font-bold text-[#8a5d42]">
            {users.length} Registered
          </div>

        </div>


        {users.length === 0 ? (

          <p className="mt-6 text-stone-500">
            No registered users found.
          </p>

        ) : (

          <div className="mt-6 space-y-4">

            {users.map(
              (account) => {

                const ownAccount =
                  isCurrentUser(
                    account
                  );

                const active =
                  account.isActive !==
                  false;

                return (
                  <article
                    key={account._id}
                    className="rounded-2xl border border-stone-200 p-5"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* User Information */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-lg font-bold text-[#352522]">
                            {account.name}
                          </h3>

                          {ownAccount && (
                            <span className="rounded-full bg-[#f2e9df] px-2.5 py-1 text-xs font-bold text-[#6f3f26]">
                              You
                            </span>
                          )}

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {active
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-stone-600">
                          @{account.username}
                        </p>

                        <p className="mt-1 break-all text-sm text-stone-500">
                          {account.email}
                        </p>

                        <p className="mt-2 text-xs text-stone-400">
                          BookVerse ID:{" "}
                          {account.userId}
                        </p>

                      </div>


                      {/* Controls */}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">
                            Role
                          </label>

                          <select
                            value={
                              account.role
                            }
                            onChange={(
                              event
                            ) =>
                              handleRoleChange(
                                account,
                                event.target
                                  .value
                              )
                            }
                            disabled={
                              workingUserId ===
                                account._id ||
                              ownAccount
                            }
                            className="min-w-[210px] rounded-xl border border-stone-300 bg-white px-4 py-2.5 font-semibold text-stone-700 outline-none focus:border-[#8a5d42] disabled:bg-stone-100 disabled:opacity-60"
                          >

                            {USER_ROLES.map(
                              (role) => (
                                <option
                                  key={
                                    role
                                  }
                                  value={
                                    role
                                  }
                                >
                                  {role}
                                </option>
                              )
                            )}

                          </select>

                        </div>


                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">
                            Account
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              handleUserStatus(
                                account
                              )
                            }
                            disabled={
                              workingUserId ===
                                account._id ||
                              ownAccount
                            }
                            className={`min-w-[130px] rounded-xl border px-4 py-2.5 font-semibold disabled:opacity-50 ${
                              active
                                ? "border-red-200 text-red-700 hover:bg-red-50"
                                : "border-green-200 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {workingUserId ===
                            account._id
                              ? "Saving..."
                              : active
                                ? "Deactivate"
                                : "Activate"}
                          </button>

                        </div>

                      </div>

                    </div>


                    {ownAccount && (
                      <p className="mt-4 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
                        Your own Admin role
                        and account status
                        cannot be changed
                        here.
                      </p>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>


      {/* ==============================
          Analytics + Categories
      ============================== */}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

        <section className="space-y-6">

          {/* Most Reviewed Books */}

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-[#352522]">
              Most Reviewed Books
            </h2>

            {analytics
              ?.mostReviewedBooks
              ?.length ? (

              <ul className="mt-4 space-y-3">

                {analytics.mostReviewedBooks.map(
                  (book) => (
                    <li
                      key={
                        book.bookTitle
                      }
                      className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
                    >
                      <span className="font-semibold text-[#352522]">
                        {
                          book.bookTitle
                        }
                      </span>

                      <span className="text-sm font-bold text-[#8a5d42]">
                        {
                          book.reviewCount
                        }{" "}
                        reviews
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


          {/* Popular Genres */}

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-[#352522]">
              Popular Genres
            </h2>

            {analytics
              ?.popularGenres
              ?.length ? (

              <ul className="mt-4 space-y-3">

                {analytics.popularGenres.map(
                  (genre) => (
                    <li
                      key={
                        genre.name
                      }
                      className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3"
                    >
                      <span className="font-semibold text-[#352522]">
                        {genre.name}
                      </span>

                      <span className="text-sm font-bold text-[#8a5d42]">
                        {genre.count}
                      </span>
                    </li>
                  )
                )}

              </ul>

            ) : (

              <p className="mt-4 text-stone-500">
                No genre activity yet.
              </p>

            )}

          </div>

        </section>


        {/* ==============================
            Category Management
        ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-[#352522]">
            Manage Categories
          </h2>

          <div className="mt-6 grid gap-4">

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={
                handleInputChange
              }
              placeholder="Category name"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
            />

            <select
              name="type"
              value={form.type}
              onChange={
                handleInputChange
              }
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#8a5d42]"
            >
              <option value="genre">
                Genre
              </option>

              <option value="tag">
                Tag
              </option>

              <option value="community">
                Community
              </option>
            </select>

            <textarea
              rows="3"
              name="description"
              value={
                form.description
              }
              onChange={
                handleInputChange
              }
              placeholder="Optional description"
              className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
            />

            <button
              type="button"
              onClick={
                handleCreateCategory
              }
              disabled={
                working ||
                !form.name.trim()
              }
              className="rounded-xl bg-[#6f3f26] px-5 py-3 font-semibold text-white hover:bg-[#57301d] disabled:opacity-50"
            >
              {working
                ? "Saving..."
                : "Add Category"}
            </button>

          </div>


          <div className="mt-6 space-y-3">

            {categories.length ===
            0 ? (

              <p className="text-stone-500">
                No categories created
                yet.
              </p>

            ) : (

              categories.map(
                (category) => (
                  <article
                    key={
                      category._id
                    }
                    className="rounded-2xl border border-stone-200 p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h3 className="font-bold text-[#352522]">
                          {
                            category.name
                          }
                        </h3>

                        <p className="mt-1 text-sm capitalize text-stone-600">
                          {
                            category.type
                          }
                        </p>

                        {category.description && (
                          <p className="mt-2 text-sm text-stone-500">
                            {
                              category.description
                            }
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
                          handleToggleCategory(
                            category
                          )
                        }
                        disabled={
                          working
                        }
                        className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                      >
                        {category.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCategory(
                            category._id
                          )
                        }
                        disabled={
                          working
                        }
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>

                    </div>

                  </article>
                )
              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}


function StatCard({
  label,
  value,
}) {
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