import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import {
  addDiaryEntry,
  checkReadingReminders,
  createReadingProgress,
  getUserProgress,
  updateReadingProgress,
} from "../services/readingProgressApi";

import {
  useAuth,
} from "../context/AuthContext";


const statusOptions = [
  "Want to Read",
  "Currently Reading",
  "Paused",
  "Dropped",
  "Finished",
];


function formatDate(value) {
  if (!value) {
    return "Not completed yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}


function toInputDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date
    .toISOString()
    .slice(0, 10);
}


export default function ReadingProgressPage() {
  const {
    user,
  } = useAuth();

  const userId =
    user?.userId;


  const [
    records,
    setRecords,
  ] = useState([]);


  const [
    selectedId,
    setSelectedId,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    working,
    setWorking,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState({
    type: "",
    text: "",
  });


  const [
    form,
    setForm,
  ] = useState({
    currentPage: 0,
    status: "Currently Reading",
    startDate: "",
    finishDate: "",
    rating: "",
  });


  const [
    diaryForm,
    setDiaryForm,
  ] = useState({
    note: "",
    visibility: "Private",
  });


  // ==============================
  // Selected Reading Record
  // ==============================

  const selectedRecord =
    useMemo(() => {
      return records.find(
        (record) =>
          record._id === selectedId
      );
    }, [
      records,
      selectedId,
    ]);


  // ==============================
  // Progress Percentage
  // ==============================

  const progressPercentage =
    useMemo(() => {
      if (
        !selectedRecord?.totalPages
      ) {
        return 0;
      }


      const percentage =
        (
          Number(
            form.currentPage || 0
          ) /
          selectedRecord.totalPages
        ) *
        100;


      return Math.max(
        0,
        Math.min(
          100,
          Math.round(
            percentage
          )
        )
      );

    }, [
      form.currentPage,
      selectedRecord,
    ]);


  // ==============================
  // Reading Timeline
  // ==============================

  const timeline =
    useMemo(() => {
      if (!selectedRecord) {
        return [];
      }


      const items = [];


      if (
        selectedRecord.startDate
      ) {
        items.push({
          id: "start",

          date:
            selectedRecord.startDate,

          title:
            "Started reading",

          description:
            `Started reading ${selectedRecord.bookTitle}.`,
        });
      }


      if (
        selectedRecord
          .diaryEntries
      ) {
        selectedRecord
          .diaryEntries
          .forEach((entry) => {
            items.push({
              id:
                entry._id,

              date:
                entry.entryDate,

              title:
                `Reached page ${entry.pageNumber}`,

              description:
                entry.note,
            });
          });
      }


      if (
        selectedRecord.finishDate
      ) {
        items.push({
          id: "finish",

          date:
            selectedRecord.finishDate,

          title:
            "Finished reading",

          description:
            `Completed ${selectedRecord.bookTitle}.`,
        });
      }


      return items.sort(
        (a, b) =>
          new Date(
            a.date
          ).getTime() -
          new Date(
            b.date
          ).getTime()
      );

    }, [
      selectedRecord,
    ]);


  // ==============================
  // Load Logged-In User Progress
  // ==============================

  useEffect(() => {
    const loadProgress =
      async () => {
        if (!userId) {
          setLoading(false);
          return;
        }


        try {
          setLoading(true);


          const result =
            await getUserProgress(
              userId
            );


          const progressRecords =
            result.data || [];


          setRecords(
            progressRecords
          );


          if (
            progressRecords.length > 0
          ) {
            const currentBook =
              progressRecords.find(
                (record) =>
                  record.status ===
                  "Currently Reading"
              ) ||
              progressRecords[0];


            setSelectedId(
              (currentId) => {
                const currentStillExists =
                  progressRecords.some(
                    (record) =>
                      record._id ===
                      currentId
                  );


                return currentStillExists
                  ? currentId
                  : currentBook._id;
              }
            );

          } else {

            setSelectedId("");

          }

        } catch (error) {

          setMessage({
            type: "error",

            text:
              error instanceof Error
                ? error.message
                : "Failed to load reading progress.",
          });

        } finally {

          setLoading(false);

        }
      };


    loadProgress();

  }, [userId]);


  // ==============================
  // Check Reading Reminders
  // ==============================

  useEffect(() => {
    const runReadingReminderCheck =
      async () => {
        if (!userId) {
          return;
        }


        try {
          const result =
            await checkReadingReminders(
              userId
            );


          console.log(
            "Reading reminder check:",
            result
          );

        } catch (error) {

          // Reminder failure should not
          // stop the page from working.

          console.error(
            "Failed to check reading reminders:",
            error.message
          );

        }
      };


    runReadingReminderCheck();

  }, [userId]);


  // ==============================
  // Fill Form From Selected Book
  // ==============================

  useEffect(() => {
    if (!selectedRecord) {
      return;
    }


    setForm({
      currentPage:
        selectedRecord
          .currentPage ?? 0,

      status:
        selectedRecord.status ||
        "Currently Reading",

      startDate:
        toInputDate(
          selectedRecord
            .startDate
        ),

      finishDate:
        toInputDate(
          selectedRecord
            .finishDate
        ),

      rating:
        selectedRecord.rating ??
        "",
    });

  }, [
    selectedRecord,
  ]);


  // ==============================
  // Replace Record In State
  // ==============================

  const replaceRecord = (
    updatedRecord
  ) => {
    setRecords(
      (currentRecords) =>
        currentRecords.map(
          (record) =>
            record._id ===
            updatedRecord._id
              ? updatedRecord
              : record
        )
    );
  };


  // ==============================
  // Message Helpers
  // ==============================

  const showSuccess = (
    text
  ) => {
    setMessage({
      type: "success",
      text,
    });
  };


  const showError = (
    error
  ) => {
    setMessage({
      type: "error",

      text:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  };


  // ==============================
  // Create Sample Record
  // ==============================

  const handleCreateSample =
    async () => {
      if (!userId) {
        setMessage({
          type: "error",

          text:
            "You must be logged in to create a reading record.",
        });

        return;
      }


      try {
        setWorking(true);


        const result =
          await createReadingProgress({
            userId,

            bookId:
              "midnight-library-001",

            bookTitle:
              "The Midnight Library",

            author:
              "Matt Haig",

            totalPages:
              304,

            currentPage:
              182,

            status:
              "Currently Reading",

            startDate:
              "2026-07-01",
          });


        setRecords(
          (oldRecords) => [
            ...oldRecords,
            result.data,
          ]
        );


        setSelectedId(
          result.data._id
        );


        showSuccess(
          "Reading record created successfully."
        );

      } catch (error) {

        showError(error);

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Progress Form Change
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
  // Save Progress
  // ==============================

  const handleSaveProgress =
    async () => {
      if (!selectedRecord) {
        return;
      }


      const pageNumber =
        Number(
          form.currentPage
        );


      if (
        pageNumber < 0 ||
        pageNumber >
          selectedRecord.totalPages
      ) {
        setMessage({
          type: "error",

          text:
            `Current page must be between 0 and ${selectedRecord.totalPages}.`,
        });

        return;
      }


      const ratingValue =
        form.rating === ""
          ? null
          : Number(
              form.rating
            );


      if (
        ratingValue !== null &&
        (
          ratingValue < 0 ||
          ratingValue > 5
        )
      ) {
        setMessage({
          type: "error",

          text:
            "Rating must be between 0 and 5.",
        });

        return;
      }


      try {
        setWorking(true);


        const result =
          await updateReadingProgress(
            selectedRecord._id,
            {
              currentPage:
                pageNumber,

              status:
                form.status,

              startDate:
                form.startDate ||
                null,

              finishDate:
                form.finishDate ||
                null,

              rating:
                ratingValue,
            }
          );


        replaceRecord(
          result.data
        );


        showSuccess(
          "Reading progress updated successfully."
        );

      } catch (error) {

        showError(error);

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Save Diary Entry
  // ==============================

  const handleSaveDiary =
    async () => {
      if (!selectedRecord) {
        return;
      }


      const note =
        diaryForm.note.trim();


      if (!note) {
        setMessage({
          type: "error",

          text:
            "Write a diary note first.",
        });

        return;
      }


      try {
        setWorking(true);


        const result =
          await addDiaryEntry(
            selectedRecord._id,
            {
              note,

              pageNumber:
                Number(
                  form.currentPage
                ),

              visibility:
                diaryForm.visibility,
            }
          );


        replaceRecord(
          result.data
        );


        setDiaryForm({
          note: "",
          visibility:
            "Private",
        });


        showSuccess(
          "Diary entry saved successfully."
        );

      } catch (error) {

        showError(error);

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Mark Book Finished
  // ==============================

  const handleMarkFinished =
    async () => {
      if (!selectedRecord) {
        return;
      }


      try {
        setWorking(true);


        const result =
          await updateReadingProgress(
            selectedRecord._id,
            {
              status:
                "Finished",

              currentPage:
                selectedRecord.totalPages,

              finishDate:
                new Date()
                  .toISOString()
                  .slice(
                    0,
                    10
                  ),

              rating:
                form.rating === ""
                  ? null
                  : Number(
                      form.rating
                    ),
            }
          );


        replaceRecord(
          result.data
        );


        showSuccess(
          "Book marked as finished."
        );

      } catch (error) {

        showError(error);

      } finally {

        setWorking(false);

      }
    };


  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <p className="text-lg text-stone-600">
            Loading reading progress...
          </p>

        </div>

      </main>
    );
  }


  // ==============================
  // Empty State
  // ==============================

  if (
    records.length === 0
  ) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">

        <section className="rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">


          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            BookVerse
          </p>


          <h1 className="mt-2 text-3xl font-bold text-[#352522]">
            Reading Progress & Diary
          </h1>


          {user?.name && (
            <p className="mt-3 font-semibold text-[#6f3f26]">
              Reading journey for{" "}
              {user.name}
            </p>
          )}


          <p className="mx-auto mt-4 max-w-xl text-stone-600">
            You currently have no
            reading progress records.
            Start tracking a book to
            build your reading history.
          </p>


          <button
            type="button"
            onClick={
              handleCreateSample
            }
            disabled={
              working
            }
            className="mt-7 rounded-xl bg-[#6f3f26] px-6 py-3 font-semibold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {
              working
                ? "Creating..."
                : "Create Sample Record"
            }
          </button>


          {message.text && (
            <div
              className={`mx-auto mt-5 max-w-xl rounded-xl border px-4 py-3 ${
                message.type ===
                "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

        </section>

      </main>
    );
  }


  // ==============================
  // Main Page
  // ==============================

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">


      {/* Header */}

      <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">


        <div>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            BookVerse
          </p>


          <h1 className="mt-2 text-4xl font-bold text-[#352522]">
            Reading Progress & Diary
          </h1>


          <p className="mt-2 text-stone-600">
            Track your reading progress
            and write your thoughts along
            the way.
          </p>


          {user?.name && (
            <p className="mt-2 text-sm font-semibold text-[#6f3f26]">
              Reading journey for{" "}
              {user.name}
            </p>
          )}

        </div>



        <div className="w-full md:w-72">

          <label className="mb-2 block text-sm font-semibold text-stone-700">
            Select Book
          </label>


          <select
            value={
              selectedId
            }
            onChange={(event) =>
              setSelectedId(
                event.target.value
              )
            }
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
          >

            {records.map(
              (record) => (

                <option
                  key={
                    record._id
                  }
                  value={
                    record._id
                  }
                >
                  {
                    record.bookTitle
                  }
                </option>

              )
            )}

          </select>

        </div>

      </section>



      {/* Status Message */}

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



      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr_0.9fr]">


        {/* ============================== */}
        {/* LEFT CARD */}
        {/* ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


          <div className="flex gap-5">


            <div className="flex h-48 w-32 shrink-0 items-center justify-center rounded-xl bg-[#172333] p-4 text-center font-semibold text-white shadow-md">

              {
                selectedRecord
                  .bookTitle
              }

            </div>


            <div>

              <h2 className="text-2xl font-bold text-[#352522]">
                {
                  selectedRecord
                    .bookTitle
                }
              </h2>


              <p className="mt-2 text-stone-600">
                by{" "}
                {
                  selectedRecord.author ||
                  "Unknown Author"
                }
              </p>


              <span className="mt-5 inline-block rounded-full bg-[#f4eadf] px-3 py-2 text-sm font-semibold text-[#6f3f26]">
                {form.status}
              </span>

            </div>

          </div>


          <hr className="my-6 border-stone-200" />


          <h3 className="font-bold text-[#352522]">
            Reading Progress
          </h3>


          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#eadfce]">

            <div
              className="h-full rounded-full bg-[#7c4326] transition-all"
              style={{
                width:
                  `${progressPercentage}%`,
              }}
            />

          </div>


          <div className="mt-3 flex justify-between">

            <span className="font-semibold text-stone-700">
              {form.currentPage}
              {" / "}
              {
                selectedRecord
                  .totalPages
              }{" "}
              pages
            </span>


            <span className="font-bold text-[#6f3f26]">
              {progressPercentage}%
            </span>

          </div>


          <div className="mt-7 grid grid-cols-2 gap-4">


            <div className="rounded-2xl bg-[#faf6ef] p-4">

              <p className="text-sm text-stone-500">
                Start Date
              </p>

              <p className="mt-1 font-semibold">
                {
                  formatDate(
                    selectedRecord
                      .startDate
                  )
                }
              </p>

            </div>


            <div className="rounded-2xl bg-[#faf6ef] p-4">

              <p className="text-sm text-stone-500">
                Finish Date
              </p>

              <p className="mt-1 font-semibold">
                {
                  formatDate(
                    selectedRecord
                      .finishDate
                  )
                }
              </p>

            </div>

          </div>


          <Link
            to="/reading-diary"
            className="mt-7 inline-block font-semibold text-[#6f3f26] hover:underline"
          >
            View complete reading diary →
          </Link>

        </section>



        {/* ============================== */}
        {/* MIDDLE CARD */}
        {/* ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


          <h2 className="text-xl font-bold text-[#352522]">
            Update Page Progress
          </h2>


          <div className="mt-6 grid gap-5 sm:grid-cols-2">


            <label>

              <span className="mb-2 block text-sm font-semibold">
                Current Page
              </span>

              <input
                type="number"
                name="currentPage"
                min="0"
                max={
                  selectedRecord
                    .totalPages
                }
                value={
                  form.currentPage
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

            </label>



            <label>

              <span className="mb-2 block text-sm font-semibold">
                Status
              </span>

              <select
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              >

                {statusOptions.map(
                  (status) => (

                    <option
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      {status}
                    </option>

                  )
                )}

              </select>

            </label>



            <label>

              <span className="mb-2 block text-sm font-semibold">
                Start Date
              </span>

              <input
                type="date"
                name="startDate"
                value={
                  form.startDate
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />

            </label>



            <label>

              <span className="mb-2 block text-sm font-semibold">
                Finish Date
              </span>

              <input
                type="date"
                name="finishDate"
                value={
                  form.finishDate
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />

            </label>



            <label className="sm:col-span-2">

              <span className="mb-2 block text-sm font-semibold">
                Rating
              </span>

              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.5"
                placeholder="Example: 4.5"
                value={
                  form.rating
                }
                onChange={
                  handleInputChange
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />

            </label>

          </div>


          <button
            type="button"
            onClick={
              handleSaveProgress
            }
            disabled={
              working
            }
            className="mt-6 w-full rounded-xl bg-[#6f3f26] px-5 py-3 font-semibold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {
              working
                ? "Saving..."
                : "Save Progress"
            }
          </button>



          <hr className="my-7 border-stone-200" />



          <h2 className="text-xl font-bold text-[#352522]">
            Diary Note
          </h2>


          <textarea
            rows="5"
            value={
              diaryForm.note
            }
            onChange={(event) =>
              setDiaryForm(
                (oldForm) => ({
                  ...oldForm,

                  note:
                    event.target.value,
                })
              )
            }
            placeholder="Write about today's reading..."
            className="mt-4 w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
          />


          <label className="mt-4 block">

            <span className="mb-2 block text-sm font-semibold">
              Visibility
            </span>


            <select
              value={
                diaryForm.visibility
              }
              onChange={(event) =>
                setDiaryForm(
                  (oldForm) => ({
                    ...oldForm,

                    visibility:
                      event.target.value,
                  })
                )
              }
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
            >

              <option value="Private">
                Private
              </option>

              <option value="Public">
                Public
              </option>

            </select>

          </label>


          <div className="mt-5 grid gap-3 sm:grid-cols-2">


            <button
              type="button"
              onClick={
                handleSaveDiary
              }
              disabled={
                working
              }
              className="rounded-xl bg-[#6f3f26] px-4 py-3 font-semibold text-white transition hover:bg-[#57301d] disabled:opacity-50"
            >
              Save Diary Entry
            </button>


            <button
              type="button"
              onClick={
                handleMarkFinished
              }
              disabled={
                working
              }
              className="rounded-xl border-2 border-[#6f3f26] px-4 py-3 font-semibold text-[#6f3f26] transition hover:bg-[#f5ebe1] disabled:opacity-50"
            >
              Mark as Finished
            </button>

          </div>

        </section>



        {/* ============================== */}
        {/* RIGHT CARD */}
        {/* ============================== */}

        <aside className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


          <h2 className="text-xl font-bold text-[#352522]">
            Reading Timeline
          </h2>


          {timeline.length === 0 ? (

            <p className="mt-5 text-stone-500">
              No reading history yet.
            </p>

          ) : (

            <div className="mt-6 space-y-6">


              {timeline.map(
                (item) => (

                  <article
                    key={
                      item.id
                    }
                    className="relative border-l-2 border-[#b58b70] pl-5"
                  >

                    <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#6f3f26]" />


                    <time className="text-sm font-bold text-[#6f3f26]">
                      {
                        formatDate(
                          item.date
                        )
                      }
                    </time>


                    <h3 className="mt-1 font-bold">
                      {item.title}
                    </h3>


                    <p className="mt-1 text-sm leading-6 text-stone-600">
                      {
                        item.description
                      }
                    </p>

                  </article>

                )
              )}

            </div>

          )}


          <div className="mt-8 rounded-2xl bg-[#faf1e7] p-5">

            <p className="font-bold text-[#352522]">
              Keep it up!
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Consistent progress creates
              a complete history of your
              reading journey.
            </p>

          </div>

        </aside>

      </div>

    </main>
  );
}