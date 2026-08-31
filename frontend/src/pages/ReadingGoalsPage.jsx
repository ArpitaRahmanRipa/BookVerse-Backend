import { useEffect, useState } from "react";

import {
  createReadingGoal,
  deleteReadingGoal,
  getUserReadingGoals,
} from "../services/readingGoalApi";

const USER_ID = "23101548";

const defaultForm = {
  title: "",
  goalType: "yearly",
  targetType: "books",
  targetValue: "20",
  year: new Date().getFullYear().toString(),
  month: (new Date().getMonth() + 1).toString(),
};

const statusStyles = {
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  missed: "bg-red-100 text-red-800",
};

export default function ReadingGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadGoals = async () => {
    try {
      setLoading(true);

      const result = await getUserReadingGoals(USER_ID);
      setGoals(result.data || []);
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
    loadGoals();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }));
  };

  const handleCreateGoal = async () => {
    try {
      setWorking(true);
      setMessage({ type: "", text: "" });

      const result = await createReadingGoal({
        userId: USER_ID,
        title: form.title.trim(),
        goalType: form.goalType,
        targetType: form.targetType,
        targetValue: Number(form.targetValue),
        year: Number(form.year),
        month:
          form.goalType === "monthly"
            ? Number(form.month)
            : undefined,
      });

      setGoals((oldGoals) => [
        result.data,
        ...oldGoals,
      ]);

      setForm(defaultForm);
      setMessage({
        type: "success",
        text: "Reading goal created successfully.",
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

  const handleDeleteGoal = async (goalId) => {
    try {
      setWorking(true);
      await deleteReadingGoal(goalId);

      setGoals((oldGoals) =>
        oldGoals.filter((goal) => goal._id !== goalId)
      );

      setMessage({
        type: "success",
        text: "Reading goal deleted successfully.",
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

  const activeGoals = goals.filter(
    (goal) => goal.status === "active"
  );
  const completedGoals = goals.filter(
    (goal) => goal.status === "completed"
  );
  const missedGoals = goals.filter(
    (goal) => goal.status === "missed"
  );

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
      <section className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
          BookVerse
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#352522]">
          Reading Goals and Challenges
        </h1>

        <p className="mt-2 max-w-3xl text-stone-600">
          Set yearly or monthly reading goals, track your
          progress from completed books and page updates,
          and review completed or missed challenges.
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

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#352522]">
            Create a Goal
          </h2>

          <div className="mt-6 grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Goal title
              </span>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Example: 2026 Reading Challenge"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Goal type
              </span>

              <select
                name="goalType"
                value={form.goalType}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#8a5d42]"
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Target type
              </span>

              <select
                name="targetType"
                value={form.targetType}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#8a5d42]"
              >
                <option value="books">Books</option>
                <option value="pages">Pages</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Target value
              </span>

              <input
                type="number"
                min="1"
                name="targetValue"
                value={form.targetValue}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Year
              </span>

              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#8a5d42]"
              />
            </label>

            {form.goalType === "monthly" && (
              <label>
                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Month
                </span>

                <select
                  name="month"
                  value={form.month}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#8a5d42]"
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option
                      key={index + 1}
                      value={index + 1}
                    >
                      {new Date(2026, index, 1).toLocaleString(
                        "en-US",
                        { month: "long" }
                      )}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <button
              type="button"
              onClick={handleCreateGoal}
              disabled={working}
              className="rounded-xl bg-[#6f3f26] px-5 py-3 font-semibold text-white hover:bg-[#57301d] disabled:opacity-50"
            >
              {working ? "Saving..." : "Create Goal"}
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <GoalGroup
            title="Active Challenges"
            goals={activeGoals}
            emptyText="No active goals yet."
            onDelete={handleDeleteGoal}
            working={working}
          />

          <GoalGroup
            title="Completed Goals"
            goals={completedGoals}
            emptyText="No completed goals yet."
            onDelete={handleDeleteGoal}
            working={working}
          />

          <GoalGroup
            title="Missed Goals"
            goals={missedGoals}
            emptyText="No missed goals yet."
            onDelete={handleDeleteGoal}
            working={working}
          />
        </section>
      </div>
    </main>
  );
}

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
        <p className="mt-4 text-stone-500">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {goals.map((goal) => (
            <article
              key={goal._id}
              className="rounded-2xl border border-stone-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#352522]">
                    {goal.title}
                  </h3>

                  <p className="mt-1 text-sm text-stone-600">
                    {goal.goalType === "yearly"
                      ? `Year ${goal.year}`
                      : `${new Date(
                          goal.year,
                          goal.month - 1,
                          1
                        ).toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}`}{" "}
                    · {goal.targetType} goal
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    statusStyles[goal.status]
                  }`}
                >
                  {goal.status}
                </span>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-stone-700">
                  <span>
                    {goal.progress?.current || 0} /{" "}
                    {goal.progress?.target || goal.targetValue}{" "}
                    {goal.targetType}
                  </span>

                  <span>
                    {goal.progress?.percentage || 0}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-[#8a5d42] transition-all"
                    style={{
                      width: `${goal.progress?.percentage || 0}%`,
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDelete(goal._id)}
                disabled={working}
                className="mt-4 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
