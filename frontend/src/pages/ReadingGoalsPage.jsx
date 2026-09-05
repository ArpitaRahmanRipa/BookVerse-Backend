import {
  useEffect,
  useState,
} from "react";

import {
  createReadingGoal,
  deleteReadingGoal,
  getUserReadingGoals,
} from "../services/readingGoalApi";

import {
  useAuth,
} from "../context/AuthContext";


const defaultForm = {
  title: "",
  goalType: "yearly",
  targetType: "books",
  targetValue: "20",
  year:
    new Date()
      .getFullYear()
      .toString(),
  month:
    (
      new Date().getMonth() + 1
    ).toString(),
};


const statusStyles = {
  active:
    "bg-blue-100 text-blue-800",

  completed:
    "bg-green-100 text-green-800",

  missed:
    "bg-red-100 text-red-800",
};


export default function ReadingGoalsPage() {
  const {
    user,
  } = useAuth();

  const userId =
    user?.userId;


  const [
    goals,
    setGoals,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    working,
    setWorking,
  ] = useState(false);


  const [
    form,
    setForm,
  ] = useState(defaultForm);


  const [
    message,
    setMessage,
  ] = useState({
    type: "",
    text: "",
  });


  // ==============================
  // Prefill Profile Reading Goal
  // ==============================

  useEffect(() => {
    if (
      user?.readingGoal &&
      Number(user.readingGoal) > 0
    ) {
      setForm((oldForm) => ({
        ...oldForm,

        targetValue:
          String(
            user.readingGoal
          ),
      }));
    }
  }, [user?.readingGoal]);


  // ==============================
  // Load Goals
  // ==============================

  useEffect(() => {
    const loadGoals =
      async () => {
        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);

          const result =
            await getUserReadingGoals(
              userId
            );

          setGoals(
            result.data || []
          );

        } catch (error) {

          setMessage({
            type: "error",

            text:
              error instanceof Error
                ? error.message
                : "Failed to load reading goals.",
          });

        } finally {

          setLoading(false);

        }
      };


    loadGoals();

  }, [userId]);


  // ==============================
  // Form Change
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
  // Create Goal
  // ==============================

  const handleCreateGoal =
    async () => {
      if (!userId) {
        setMessage({
          type: "error",

          text:
            "You must be logged in to create a reading goal.",
        });

        return;
      }


      const targetValue =
        Number(
          form.targetValue
        );


      const year =
        Number(
          form.year
        );


      if (
        !targetValue ||
        targetValue < 1
      ) {
        setMessage({
          type: "error",

          text:
            "Target value must be at least 1.",
        });

        return;
      }


      if (!year) {
        setMessage({
          type: "error",

          text:
            "Please enter a valid year.",
        });

        return;
      }


      try {
        setWorking(true);

        setMessage({
          type: "",
          text: "",
        });


        const result =
          await createReadingGoal({
            userId,

            title:
              form.title.trim(),

            goalType:
              form.goalType,

            targetType:
              form.targetType,

            targetValue,

            year,

            month:
              form.goalType ===
              "monthly"
                ? Number(
                    form.month
                  )
                : undefined,
          });


        setGoals(
          (oldGoals) => [
            result.data,
            ...oldGoals,
          ]
        );


        setForm({
          ...defaultForm,

          targetValue:
            user?.readingGoal
              ? String(
                  user.readingGoal
                )
              : defaultForm.targetValue,
        });


        setMessage({
          type: "success",

          text:
            "Reading goal created successfully.",
        });

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to create reading goal.",
        });

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Delete Goal
  // ==============================

  const handleDeleteGoal =
    async (goalId) => {
      try {
        setWorking(true);


        await deleteReadingGoal(
          goalId
        );


        setGoals(
          (oldGoals) =>
            oldGoals.filter(
              (goal) =>
                goal._id !== goalId
            )
        );


        setMessage({
          type: "success",

          text:
            "Reading goal deleted successfully.",
        });

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to delete reading goal.",
        });

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Split Goals by Status
  // ==============================

  const activeGoals =
    goals.filter(
      (goal) =>
        goal.status === "active"
    );


  const completedGoals =
    goals.filter(
      (goal) =>
        goal.status ===
        "completed"
    );


  const missedGoals =
    goals.filter(
      (goal) =>
        goal.status === "missed"
    );


  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <p className="text-lg text-stone-600">
            Loading reading goals...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="mx-auto max-w-6xl px-6 py-10">


      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

      <section className="mb-8">

        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
          BookVerse
        </p>


        <h1 className="mt-2 text-4xl font-bold text-[#352522]">
          Reading Goals and Challenges
        </h1>


        <p className="mt-2 max-w-3xl text-stone-600">
          Set yearly or monthly reading
          goals, track your progress from
          completed books and page updates,
          and review completed or missed
          challenges.
        </p>


        {user?.name && (
          <p className="mt-3 text-sm font-semibold text-[#6f3f26]">
            Goals for{" "}
            {user.name}
          </p>
        )}

      </section>


      {/* ============================== */}
      {/* Message */}
      {/* ============================== */}

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


      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">


        {/* ============================== */}
        {/* Create Goal */}
        {/* ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


          <h2 className="text-2xl font-bold text-[#352522]">
            Create a Goal
          </h2>


          <p className="mt-2 text-sm text-stone-500">
            Your progress is calculated
            automatically from your
            BookVerse reading records.
          </p>


          <div className="mt-6 grid gap-4">


            {/* Title */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Goal Title
              </span>


              <input
                type="text"
                name="title"
                value={
                  form.title
                }
                onChange={
                  handleInputChange
                }
                placeholder="Example: 2026 Reading Challenge"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

            </label>



            {/* Goal Type */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Goal Type
              </span>


              <select
                name="goalType"
                value={
                  form.goalType
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              >

                <option value="yearly">
                  Yearly
                </option>

                <option value="monthly">
                  Monthly
                </option>

              </select>

            </label>



            {/* Target Type */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Target Type
              </span>


              <select
                name="targetType"
                value={
                  form.targetType
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              >

                <option value="books">
                  Books
                </option>

                <option value="pages">
                  Pages
                </option>

              </select>

            </label>



            {/* Target Value */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Target Value
              </span>


              <input
                type="number"
                min="1"
                name="targetValue"
                value={
                  form.targetValue
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

            </label>



            {/* Year */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Year
              </span>


              <input
                type="number"
                name="year"
                value={
                  form.year
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

            </label>



            {/* Month */}

            {form.goalType ===
              "monthly" && (

              <label>

                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Month
                </span>


                <select
                  name="month"
                  value={
                    form.month
                  }
                  onChange={
                    handleInputChange
                  }
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                >

                  {Array.from(
                    {
                      length: 12,
                    },
                    (
                      _,
                      index
                    ) => (

                      <option
                        key={
                          index + 1
                        }
                        value={
                          index + 1
                        }
                      >
                        {
                          new Date(
                            2026,
                            index,
                            1
                          ).toLocaleString(
                            "en-US",
                            {
                              month:
                                "long",
                            }
                          )
                        }
                      </option>

                    )
                  )}

                </select>

              </label>

            )}



            <button
              type="button"
              onClick={
                handleCreateGoal
              }
              disabled={working}
              className="rounded-xl bg-[#6f3f26] px-5 py-3 font-semibold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {
                working
                  ? "Saving..."
                  : "Create Goal"
              }
            </button>

          </div>

        </section>



        {/* ============================== */}
        {/* Goal Groups */}
        {/* ============================== */}

        <section className="space-y-6">


          <GoalGroup
            title="Active Challenges"
            goals={
              activeGoals
            }
            emptyText="No active goals yet."
            onDelete={
              handleDeleteGoal
            }
            working={
              working
            }
          />


          <GoalGroup
            title="Completed Goals"
            goals={
              completedGoals
            }
            emptyText="No completed goals yet."
            onDelete={
              handleDeleteGoal
            }
            working={
              working
            }
          />


          <GoalGroup
            title="Missed Goals"
            goals={
              missedGoals
            }
            emptyText="No missed goals yet."
            onDelete={
              handleDeleteGoal
            }
            working={
              working
            }
          />

        </section>

      </div>

    </main>
  );
}


// ==============================
// Goal Group Component
// ==============================

function GoalGroup({
  title,
  goals,
  emptyText,
  onDelete,
  working,
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


      <h2 className="text-2xl font-bold text-[#352522]">
        {title}
      </h2>


      {goals.length === 0 ? (

        <div className="mt-4 rounded-2xl bg-[#faf6ef] p-5 text-center">

          <p className="text-stone-500">
            {emptyText}
          </p>

        </div>

      ) : (

        <div className="mt-4 space-y-4">


          {goals.map(
            (goal) => (

              <article
                key={
                  goal._id
                }
                className="rounded-2xl border border-stone-200 p-4"
              >


                <div className="flex flex-wrap items-start justify-between gap-3">


                  <div>

                    <h3 className="text-lg font-bold text-[#352522]">
                      {
                        goal.title
                      }
                    </h3>


                    <p className="mt-1 text-sm text-stone-600">

                      {
                        goal.goalType ===
                        "yearly"
                          ? `Year ${goal.year}`
                          : new Date(
                              goal.year,
                              goal.month -
                                1,
                              1
                            ).toLocaleString(
                              "en-US",
                              {
                                month:
                                  "long",

                                year:
                                  "numeric",
                              }
                            )
                      }

                      {" · "}

                      {
                        goal.targetType
                      }{" "}
                      goal

                    </p>

                  </div>



                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      statusStyles[
                        goal.status
                      ] ||
                      "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {goal.status}
                  </span>

                </div>



                {/* Progress */}

                <div className="mt-4">


                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-stone-700">


                    <span>

                      {
                        goal.progress
                          ?.current || 0
                      }

                      {" / "}

                      {
                        goal.progress
                          ?.target ||
                        goal.targetValue
                      }

                      {" "}

                      {
                        goal.targetType
                      }

                    </span>


                    <span>

                      {
                        goal.progress
                          ?.percentage || 0
                      }
                      %

                    </span>

                  </div>



                  <div className="h-3 overflow-hidden rounded-full bg-stone-200">

                    <div
                      className="h-full rounded-full bg-[#8a5d42] transition-all"
                      style={{
                        width:
                          `${
                            goal
                              .progress
                              ?.percentage ||
                            0
                          }%`,
                      }}
                    />

                  </div>


                  <p className="mt-2 text-xs text-stone-500">

                    {
                      goal.progress
                        ?.remaining ?? 0
                    }{" "}
                    remaining

                  </p>

                </div>



                {/* Delete */}

                <button
                  type="button"
                  onClick={() =>
                    onDelete(
                      goal._id
                    )
                  }
                  disabled={
                    working
                  }
                  className="mt-4 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>

              </article>

            )
          )}

        </div>

      )}

    </section>
  );
}