import {
  useEffect,
  useState,
} from "react";

import {
  generateRecommendations,
  getMyRecommendations,
} from "../services/recommendationApi";

import {
  useAuth,
} from "../context/AuthContext";


const moodOptions = [
  "",
  "Relaxed",
  "Adventurous",
  "Reflective",
  "Motivated",
  "Curious",
];


const difficultyOptions = [
  "",
  "Light",
  "Moderate",
  "Challenging",
];


export default function RecommendationPage() {
  const {
    user,
    token,
  } = useAuth();

  const userId =
    user?.userId;


  const [
    history,
    setHistory,
  ] = useState([]);


  const [
    latestResult,
    setLatestResult,
  ] = useState(null);


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
  ] = useState({
    prompt: "",
    mood: "",
    difficulty: "",
    favoriteGenres: "",
  });


  const [
    message,
    setMessage,
  ] = useState({
    type: "",
    text: "",
  });


  // ==============================
  // Prefill Favorite Genres
  // From Logged-In Profile
  // ==============================

  useEffect(() => {
    if (
      !user?.favoriteGenres?.length
    ) {
      return;
    }


    setForm((oldForm) => {
      if (
        oldForm.favoriteGenres
      ) {
        return oldForm;
      }


      return {
        ...oldForm,

        favoriteGenres:
          user.favoriteGenres.join(
            ", "
          ),
      };
    });

  }, [user?.favoriteGenres]);


  // ==============================
  // Load Recommendation History
  // ==============================

  useEffect(() => {
    const loadHistory =
      async () => {
        if (!userId || !token) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);

          const result = await getMyRecommendations(token);


          const records =
            result.data || [];


          setHistory(records);


          if (
            records.length > 0
          ) {
            setLatestResult(
              records[0]
            );
          }

        } catch (error) {

          setMessage({
            type: "error",

            text:
              error instanceof Error
                ? error.message
                : "Failed to load recommendation history.",
          });

        } finally {

          setLoading(false);

        }
      };


    loadHistory();

  }, [userId, token]);


  // ==============================
  // Form Input
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
  // Generate Recommendations
  // ==============================

  const handleGenerate =
    async () => {
      if (!userId || !token) {
        setMessage({
          type: "error",

          text:
            "You must be logged in to generate recommendations.",
        });

        return;
      }


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


        const result =
          await generateRecommendations(
            token,
            {
              userId,

              prompt:
                form.prompt.trim(),

              mood:
                form.mood,

              difficulty:
                form.difficulty,

              favoriteGenres,
            }
          );


        setLatestResult(
          result.data
        );


        setHistory(
          (oldHistory) => [
            result.data,
            ...oldHistory,
          ]
        );


        setMessage({
          type: "success",

          text:
            result.data.source ===
            "openai"
              ? "AI recommendations generated with OpenAI."
              : "Personalized recommendations generated successfully.",
        });

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to generate recommendations.",
        });

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <p className="text-lg text-stone-600">
            Loading recommendation
            assistant...
          </p>

        </div>

      </main>
    );
  }


  // ==============================
  // Page
  // ==============================

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
          AI Book Recommendation
          Assistant
        </h1>


        <p className="mt-2 max-w-3xl text-stone-600">
          Get personalized book
          suggestions based on your
          reading history, favorite genres,
          mood, and preferred difficulty.
        </p>


        {user?.name && (
          <p className="mt-3 text-sm font-semibold text-[#6f3f26]">
            Recommendations for{" "}
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


      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">


        {/* ============================== */}
        {/* Recommendation Form */}
        {/* ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-[#352522]">
            Ask for Recommendations
          </h2>


          <div className="mt-6 grid gap-4">


            {/* Prompt */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                What kind of books do
                you want?
              </span>


              <textarea
                rows="4"
                name="prompt"
                value={
                  form.prompt
                }
                onChange={
                  handleInputChange
                }
                placeholder="Example: I want something similar to The Midnight Library but with more mystery."
                className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

            </label>



            {/* Mood */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Mood
              </span>


              <select
                name="mood"
                value={
                  form.mood
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              >

                {moodOptions.map(
                  (mood) => (
                    <option
                      key={
                        mood ||
                        "any"
                      }
                      value={mood}
                    >
                      {
                        mood ||
                        "Any mood"
                      }
                    </option>
                  )
                )}

              </select>

            </label>



            {/* Difficulty */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Difficulty
              </span>


              <select
                name="difficulty"
                value={
                  form.difficulty
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              >

                {difficultyOptions.map(
                  (level) => (
                    <option
                      key={
                        level ||
                        "any"
                      }
                      value={level}
                    >
                      {
                        level ||
                        "Any difficulty"
                      }
                    </option>
                  )
                )}

              </select>

            </label>



            {/* Favorite Genres */}

            <label>

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Favorite Genres
              </span>


              <input
                type="text"
                name="favoriteGenres"
                value={
                  form.favoriteGenres
                }
                onChange={
                  handleInputChange
                }
                placeholder="Example: Mystery, Fantasy, Memoir"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />


              <span className="mt-2 block text-xs text-stone-500">
                Your profile genres are
                filled automatically. You
                can change them for this
                request.
              </span>

            </label>



            <button
              type="button"
              onClick={
                handleGenerate
              }
              disabled={working}
              className="rounded-xl bg-[#6f3f26] px-5 py-3 font-semibold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {
                working
                  ? "Generating..."
                  : "Generate Recommendations"
              }
            </button>

          </div>

        </section>



        {/* ============================== */}
        {/* Latest Suggestions */}
        {/* ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


          <div className="flex items-center justify-between gap-3">

            <h2 className="text-2xl font-bold text-[#352522]">
              Latest Suggestions
            </h2>


            {latestResult?.source && (
              <span className="rounded-full bg-[#f4eadf] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#6f3f26]">
                {
                  latestResult.source
                }
              </span>
            )}

          </div>


          {!latestResult
            ?.recommendations
            ?.length ? (

            <div className="mt-5 rounded-2xl bg-[#faf6ef] p-6 text-center">

              <p className="text-stone-500">
                No recommendations yet.
                Submit a request to get
                started.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {
                latestResult
                  .recommendations
                  .map(
                    (
                      book,
                      index
                    ) => (

                      <article
                        key={`${book.title}-${index}`}
                        className="rounded-2xl border border-stone-200 bg-[#faf6ef] p-5"
                      >

                        <h3 className="text-lg font-bold text-[#352522]">
                          {
                            book.title
                          }
                        </h3>


                        <p className="mt-1 text-sm font-semibold text-[#6f3f26]">
                          by{" "}
                          {
                            book.author ||
                            "Unknown Author"
                          }
                        </p>


                        {book.genre && (
                          <p className="mt-2 text-sm text-stone-500">
                            Genre:{" "}
                            {
                              book.genre
                            }
                          </p>
                        )}


                        <p className="mt-3 text-sm leading-6 text-stone-600">
                          {
                            book.reason
                          }
                        </p>

                      </article>

                    )
                  )
              }

            </div>

          )}

        </section>

      </div>



      {/* ============================== */}
      {/* Recommendation History */}
      {/* ============================== */}

      <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold text-[#352522]">
          Recommendation History
        </h2>


        {history.length === 0 ? (

          <div className="mt-4 rounded-2xl bg-[#faf6ef] p-6 text-center">

            <p className="text-stone-500">
              Your past recommendation
              requests will appear here.
            </p>

          </div>

        ) : (

          <div className="mt-6 space-y-4">

            {history.map(
              (entry) => (

                <article
                  key={entry._id}
                  className="rounded-2xl border border-stone-200 p-5"
                >

                  <div className="flex flex-wrap items-center justify-between gap-2">

                    <p className="font-semibold text-[#352522]">
                      {
                        entry.prompt ||
                        "Personalized recommendation request"
                      }
                    </p>


                    <span className="text-sm text-stone-500">
                      {
                        new Date(
                          entry.createdAt
                        ).toLocaleString()
                      }
                    </span>

                  </div>


                  <p className="mt-2 text-sm text-stone-600">

                    {
                      entry
                        .recommendations
                        ?.length || 0
                    }{" "}
                    books suggested


                    {entry.mood
                      ? ` • Mood: ${entry.mood}`
                      : ""}


                    {entry.difficulty
                      ? ` • Difficulty: ${entry.difficulty}`
                      : ""}

                  </p>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}