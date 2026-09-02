import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllReports,
  moderateReport,
} from "../services/reportApi";

import {
  useAuth,
} from "../context/AuthContext";


const statusOptions = [
  "All",
  "Pending",
  "Warned",
  "Dismissed",
  "Hidden",
  "Forwarded",
];


const actionOptions = [
  "Warned",
  "Dismissed",
  "Hidden",
  "Forwarded",
];


const allowedRoles = [
  "Community Moderator",
  "Admin",
];


const formatDate = (value) => {
  if (!value) {
    return "Not reviewed yet";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};


const getStatusClass = (
  status
) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-800";

    case "Warned":
      return "bg-red-100 text-red-700";

    case "Dismissed":
      return "bg-green-100 text-green-700";

    case "Hidden":
      return "bg-purple-100 text-purple-700";

    case "Forwarded":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-stone-100 text-stone-700";
  }
};


export default function ModerationDashboard() {
  const {
    user,
  } = useAuth();


  const moderatorId =
    user?.userId;


  const moderatorName =
    user?.name || "";


  const canModerate =
    allowedRoles.includes(
      user?.role
    );


  const [
    reports,
    setReports,
  ] = useState([]);


  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    workingId,
    setWorkingId,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  const [
    moderatorNotes,
    setModeratorNotes,
  ] = useState({});


  // ==============================
  // Load Reports
  // ==============================

  const loadReports =
    async () => {
      if (
        !moderatorId ||
        !canModerate
      ) {
        setLoading(false);
        return;
      }


      try {
        setLoading(true);
        setError("");


        const result =
          await getAllReports();


        setReports(
          result.data || []
        );

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load reports."
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {
    loadReports();
  }, [
    moderatorId,
    user?.role,
  ]);


  // ==============================
  // Filter Reports
  // ==============================

  const filteredReports =
    useMemo(() => {
      if (
        statusFilter ===
        "All"
      ) {
        return reports;
      }


      return reports.filter(
        (report) =>
          report.status ===
          statusFilter
      );

    }, [
      reports,
      statusFilter,
    ]);


  // ==============================
  // Counts
  // ==============================

  const pendingCount =
    useMemo(() => {
      return reports.filter(
        (report) =>
          report.status ===
          "Pending"
      ).length;
    }, [reports]);


  const resolvedCount =
    useMemo(() => {
      return reports.filter(
        (report) =>
          report.status !==
          "Pending"
      ).length;
    }, [reports]);


  // ==============================
  // Moderator Note
  // ==============================

  const handleNoteChange = (
    reportId,
    value
  ) => {
    setModeratorNotes(
      (current) => ({
        ...current,
        [reportId]: value,
      })
    );
  };


  // ==============================
  // Moderation Action
  // ==============================

  const handleModeration =
    async (
      reportId,
      action
    ) => {
      if (
        !moderatorId ||
        !canModerate
      ) {
        setError(
          "You do not have permission to perform moderation actions."
        );

        return;
      }


      try {
        setWorkingId(
          reportId
        );

        setError("");

        setSuccessMessage("");


        const result =
          await moderateReport(
            reportId,
            {
              action,

              moderatorId,

              moderatorName,

              moderatorNote:
                moderatorNotes[
                  reportId
                ] || "",
            }
          );


        setReports(
          (currentReports) =>
            currentReports.map(
              (report) =>
                report._id ===
                reportId
                  ? result.data
                  : report
            )
        );


        setSuccessMessage(
          `Report successfully marked as ${action}.`
        );


        setModeratorNotes(
          (current) => ({
            ...current,
            [reportId]: "",
          })
        );

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : "Failed to update report."
        );

      } finally {

        setWorkingId("");

      }
    };


  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f2e9] px-5 py-12">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <p className="text-stone-600">
              Loading moderation dashboard...
            </p>

          </div>

        </div>

      </main>
    );
  }


  // ==============================
  // Access Denied
  // ==============================

  if (!canModerate) {
    return (
      <main className="min-h-screen bg-[#f7f2e9] px-5 py-16">

        <div className="mx-auto max-w-2xl">

          <section className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              🔒
            </div>


            <h1 className="mt-5 text-3xl font-bold text-[#352522]">
              Access Denied
            </h1>


            <p className="mt-3 leading-7 text-stone-600">
              Only Community Moderators
              and Admins can access the
              BookVerse moderation
              dashboard.
            </p>


            {user?.role && (
              <p className="mt-4 text-sm font-semibold text-red-700">
                Your current role:{" "}
                {user.role}
              </p>
            )}

          </section>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f7f2e9] px-5 py-10">

      <div className="mx-auto max-w-7xl">


        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <section className="mb-8">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            BookVerse Moderation
          </p>


          <h1 className="mt-2 text-4xl font-bold text-[#352522]">
            Report & Moderation Dashboard
          </h1>


          <p className="mt-3 max-w-3xl text-stone-600">
            Review reports submitted by
            readers and take appropriate
            moderation actions.
          </p>


          <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#352522] text-white">
              🛡️
            </div>


            <div>

              <p className="text-xs text-stone-500">
                Signed in as
              </p>


              <p className="font-bold text-[#352522]">
                {moderatorName}
              </p>


              <p className="text-xs font-semibold text-[#824425]">
                {user.role}
              </p>

            </div>

          </div>

        </section>



        {/* ============================== */}
        {/* Summary */}
        {/* ============================== */}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">


          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-semibold text-stone-500">
              Total Reports
            </p>

            <p className="mt-2 text-3xl font-bold text-[#352522]">
              {reports.length}
            </p>

          </div>


          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">

            <p className="text-sm font-semibold text-amber-700">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-800">
              {pendingCount}
            </p>

          </div>


          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">

            <p className="text-sm font-semibold text-green-700">
              Reviewed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {resolvedCount}
            </p>

          </div>

        </section>



        {/* ============================== */}
        {/* Filter */}
        {/* ============================== */}

        <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

          <label className="block text-sm font-semibold text-stone-700">
            Filter by Status
          </label>


          <select
            value={
              statusFilter
            }
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="mt-2 w-full max-w-xs rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
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

        </section>



        {/* ============================== */}
        {/* Messages */}
        {/* ============================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-700">
            {error}
          </div>
        )}


        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 font-medium text-green-700">
            {successMessage}
          </div>
        )}



        {/* ============================== */}
        {/* Empty */}
        {/* ============================== */}

        {filteredReports.length ===
        0 ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              🛡️
            </div>


            <h2 className="mt-4 text-xl font-bold text-[#352522]">
              No reports found
            </h2>


            <p className="mt-2 text-stone-500">
              There are no reports
              matching this status.
            </p>

          </div>

        ) : (

          <div className="space-y-5">


            {filteredReports.map(
              (report) => (

                <article
                  key={
                    report._id
                  }
                  className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
                >


                  {/* ============================== */}
                  {/* Top */}
                  {/* ============================== */}

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">


                    <div>

                      <div className="flex flex-wrap items-center gap-2">


                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {
                            report.status
                          }
                        </span>


                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                          {
                            report.targetType
                          }
                        </span>

                      </div>


                      <h2 className="mt-4 text-xl font-bold text-[#352522]">
                        {
                          report.targetTitle ||
                          "Reported Content"
                        }
                      </h2>


                      <p className="mt-2 text-sm text-stone-500">
                        Report ID:{" "}
                        {report._id}
                      </p>

                    </div>


                    <div className="text-sm text-stone-500">
                      Submitted{" "}
                      {
                        formatDate(
                          report.createdAt
                        )
                      }
                    </div>

                  </div>



                  {/* ============================== */}
                  {/* Report Info */}
                  {/* ============================== */}

                  <div className="mt-6 grid gap-4 md:grid-cols-2">


                    <div className="rounded-2xl bg-[#faf6ef] p-4">

                      <p className="text-sm font-semibold text-stone-500">
                        Reporter
                      </p>


                      <p className="mt-1 font-bold text-[#352522]">
                        {
                          report.reporterName ||
                          report.reporterId
                        }
                      </p>


                      <p className="mt-1 break-all text-sm text-stone-500">
                        ID:{" "}
                        {
                          report.reporterId
                        }
                      </p>

                    </div>



                    <div className="rounded-2xl bg-[#faf6ef] p-4">

                      <p className="text-sm font-semibold text-stone-500">
                        Content Owner
                      </p>


                      <p className="mt-1 font-bold text-[#352522]">
                        {
                          report.targetOwnerName ||
                          report.targetOwnerId ||
                          "Unknown"
                        }
                      </p>


                      {report.targetOwnerId && (
                        <p className="mt-1 break-all text-sm text-stone-500">
                          ID:{" "}
                          {
                            report.targetOwnerId
                          }
                        </p>
                      )}

                    </div>



                    <div className="rounded-2xl bg-red-50 p-4">

                      <p className="text-sm font-semibold text-red-600">
                        Report Reason
                      </p>


                      <p className="mt-1 font-bold text-red-800">
                        {
                          report.reason
                        }
                      </p>

                    </div>



                    <div className="rounded-2xl bg-stone-50 p-4">

                      <p className="text-sm font-semibold text-stone-500">
                        Target ID
                      </p>


                      <p className="mt-1 break-all font-medium text-stone-800">
                        {
                          report.targetId
                        }
                      </p>

                    </div>

                  </div>



                  {/* ============================== */}
                  {/* Details */}
                  {/* ============================== */}

                  <div className="mt-5">

                    <p className="text-sm font-semibold text-stone-600">
                      Report Details
                    </p>


                    <p className="mt-2 rounded-2xl border border-stone-200 bg-stone-50 p-4 leading-7 text-stone-700">
                      {
                        report.details ||
                        "No additional details were provided."
                      }
                    </p>

                  </div>



                  {/* ============================== */}
                  {/* Already Reviewed */}
                  {/* ============================== */}

                  {report.status !==
                    "Pending" && (

                    <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-5">


                      <p className="font-bold text-[#352522]">
                        Moderation Decision
                      </p>


                      <p className="mt-2 text-sm text-stone-600">
                        Reviewed by{" "}
                        <strong>
                          {
                            report.moderatorName ||
                            report.moderatorId
                          }
                        </strong>
                      </p>


                      <p className="mt-1 text-sm text-stone-600">
                        Reviewed:{" "}
                        {
                          formatDate(
                            report.reviewedAt
                          )
                        }
                      </p>


                      {report.moderatorNote && (
                        <p className="mt-3 rounded-xl bg-white p-3 text-sm text-stone-700">
                          {
                            report.moderatorNote
                          }
                        </p>
                      )}

                    </div>

                  )}



                  {/* ============================== */}
                  {/* Pending Controls */}
                  {/* ============================== */}

                  {report.status ===
                    "Pending" && (

                    <div className="mt-6 border-t border-stone-200 pt-6">


                      <label className="block">

                        <span className="text-sm font-semibold text-stone-700">
                          Moderator Note
                        </span>


                        <textarea
                          rows="3"
                          value={
                            moderatorNotes[
                              report._id
                            ] || ""
                          }
                          onChange={(event) =>
                            handleNoteChange(
                              report._id,
                              event.target.value
                            )
                          }
                          placeholder="Add an optional explanation for this decision..."
                          className="mt-2 w-full resize-none rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8a5d42] focus:ring-2 focus:ring-[#8a5d42]/20"
                        />

                      </label>



                      <div className="mt-4 flex flex-wrap gap-3">


                        {actionOptions.map(
                          (action) => (

                            <button
                              key={
                                action
                              }
                              type="button"
                              disabled={
                                workingId ===
                                report._id
                              }
                              onClick={() =>
                                handleModeration(
                                  report._id,
                                  action
                                )
                              }
                              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                action ===
                                "Warned"
                                  ? "bg-red-600 text-white hover:bg-red-700"
                                  : action ===
                                      "Dismissed"
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : action ===
                                        "Hidden"
                                      ? "bg-purple-600 text-white hover:bg-purple-700"
                                      : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {
                                workingId ===
                                report._id
                                  ? "Processing..."
                                  : action
                              }
                            </button>

                          )
                        )}

                      </div>

                    </div>

                  )}

                </article>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}