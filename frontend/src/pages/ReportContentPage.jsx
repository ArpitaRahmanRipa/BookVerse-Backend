import {
  useState,
} from "react";

import {
  createReport,
} from "../services/reportApi";

import {
  useAuth,
} from "../context/AuthContext";


const targetTypes = [
  {
    value: "review",
    label: "Review",
  },

  {
    value: "comment",
    label: "Comment",
  },

  {
    value: "reading_list",
    label: "Reading List",
  },

  {
    value: "profile",
    label: "Profile",
  },
];


const reasons = [
  "Spam",
  "Harassment",
  "Hate Speech",
  "Inappropriate Content",
  "False Information",
  "Spoiler",
  "Other",
];


const defaultForm = {
  targetType: "review",
  targetId: "",
  targetOwnerId: "",
  targetOwnerName: "",
  targetTitle: "",
  reason: "Spam",
  details: "",
};


export default function ReportContentPage() {
  const {
    user,
  } = useAuth();


  const userId =
    user?.userId;


  const [
    form,
    setForm,
  ] = useState(
    defaultForm
  );


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


  // ==============================
  // Input Change
  // ==============================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;


    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };


  // ==============================
  // Submit Report
  // ==============================

  const handleSubmit =
    async (event) => {
      event.preventDefault();


      if (!userId) {
        setMessage({
          type: "error",

          text:
            "You must be logged in to submit a report.",
        });

        return;
      }


      if (
        !form.targetId.trim() ||
        !form.reason
      ) {
        setMessage({
          type: "error",

          text:
            "Content ID and report reason are required.",
        });

        return;
      }


      try {
        setWorking(true);


        setMessage({
          type: "",
          text: "",
        });


        await createReport({
          // Logged-in BookVerse user
          reporterId:
            userId,

          reporterName:
            user?.name || "",


          targetType:
            form.targetType,

          targetId:
            form.targetId.trim(),

          targetOwnerId:
            form.targetOwnerId.trim(),

          targetOwnerName:
            form.targetOwnerName.trim(),

          targetTitle:
            form.targetTitle.trim(),

          reason:
            form.reason,

          details:
            form.details.trim(),
        });


        setMessage({
          type: "success",

          text:
            "Report submitted successfully. A moderator will review it.",
        });


        setForm(
          defaultForm
        );

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to submit report.",
        });

      } finally {

        setWorking(false);

      }
    };


  return (
    <main className="min-h-screen bg-[#f7f2e9] px-5 py-10">

      <div className="mx-auto max-w-3xl">


        <section className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">


          {/* ============================== */}
          {/* Header */}
          {/* ============================== */}

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            BookVerse Community Safety
          </p>


          <h1 className="mt-2 text-4xl font-bold text-[#352522]">
            Report Content
          </h1>


          <p className="mt-3 leading-7 text-stone-600">
            Report inappropriate reviews,
            comments, reading lists, or
            profiles for moderator review.
          </p>


          {user?.name && (
            <div className="mt-5 rounded-2xl bg-[#faf6ef] px-5 py-4">

              <p className="text-sm text-stone-500">
                Reporting as
              </p>

              <p className="mt-1 font-bold text-[#352522]">
                {user.name}
              </p>

              <p className="text-sm text-stone-500">
                @{user.username}
              </p>

            </div>
          )}



          {/* ============================== */}
          {/* Message */}
          {/* ============================== */}

          {message.text && (
            <div
              className={`mt-6 rounded-xl border px-5 py-4 font-medium ${
                message.type ===
                "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}



          {/* ============================== */}
          {/* Form */}
          {/* ============================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-7 space-y-5"
          >


            {/* Content Type */}

            <label className="block">

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Content Type
              </span>


              <select
                name="targetType"
                value={
                  form.targetType
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              >

                {targetTypes.map(
                  (type) => (

                    <option
                      key={
                        type.value
                      }
                      value={
                        type.value
                      }
                    >
                      {
                        type.label
                      }
                    </option>

                  )
                )}

              </select>

            </label>



            {/* Content ID */}

            <label className="block">

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Content ID
              </span>


              <input
                type="text"
                name="targetId"
                value={
                  form.targetId
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Example: review-001"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

              <p className="mt-2 text-xs text-stone-500">
                Enter the ID of the review,
                comment, list, or profile
                you are reporting.
              </p>

            </label>



            {/* Content Title */}

            <label className="block">

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Content Title
              </span>


              <input
                type="text"
                name="targetTitle"
                value={
                  form.targetTitle
                }
                onChange={
                  handleChange
                }
                placeholder="Example: Review of The Hobbit"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />

            </label>



            {/* ============================== */}
            {/* Content Owner */}
            {/* ============================== */}

            <div className="grid gap-5 sm:grid-cols-2">


              <label>

                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Content Owner ID
                </span>


                <input
                  type="text"
                  name="targetOwnerId"
                  value={
                    form.targetOwnerId
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Optional"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                />

              </label>



              <label>

                <span className="mb-2 block text-sm font-semibold text-stone-700">
                  Content Owner Name
                </span>


                <input
                  type="text"
                  name="targetOwnerName"
                  value={
                    form.targetOwnerName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Optional"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                />

              </label>

            </div>



            {/* Report Reason */}

            <label className="block">

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Report Reason
              </span>


              <select
                name="reason"
                value={
                  form.reason
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              >

                {reasons.map(
                  (reason) => (

                    <option
                      key={
                        reason
                      }
                      value={
                        reason
                      }
                    >
                      {reason}
                    </option>

                  )
                )}

              </select>

            </label>



            {/* Additional Details */}

            <label className="block">

              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Additional Details
              </span>


              <textarea
                rows="5"
                name="details"
                value={
                  form.details
                }
                onChange={
                  handleChange
                }
                maxLength="1000"
                placeholder="Explain why you are reporting this content..."
                className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
              />


              <p className="mt-1 text-right text-xs text-stone-400">
                {
                  form.details.length
                }
                /1000
              </p>

            </label>



            {/* ============================== */}
            {/* Reminder */}
            {/* ============================== */}

            <div className="rounded-2xl bg-[#faf6ef] p-4 text-sm leading-6 text-stone-600">

              Reports are sent to the
              BookVerse moderation system.
              Community Moderators and
              Admins can review the case
              and dismiss, warn, hide, or
              forward it.

            </div>



            {/* Submit */}

            <button
              type="submit"
              disabled={
                working
              }
              className="w-full rounded-xl bg-[#6f3f26] px-5 py-3 font-bold text-white transition hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {
                working
                  ? "Submitting..."
                  : "Submit Report"
              }
            </button>

          </form>

        </section>

      </div>

    </main>
  );
}