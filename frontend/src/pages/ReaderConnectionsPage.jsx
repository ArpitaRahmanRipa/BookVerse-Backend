import {
  useEffect,
  useState,
} from "react";

import {
  followReader,
  unfollowReader,
  getFollowing,
  getFollowers,
  getConnectionCounts,
  getFollowStatus,
  getFollowingActivity,
} from "../services/followApi";

import {
  useAuth,
} from "../context/AuthContext";


// ==============================
// Temporary Reader Directory
// ==============================
//
// These are discoverable demo readers.
// Later we can replace this with a
// real public user directory endpoint.
//

const READERS = [
  {
    userId: "22301473",
    name: "Mohammad Tanzim Rafi",
    username: "@rafi",
    initials: "MR",
  },

  {
    userId: "22299208",
    name: "Nafis Sadik",
    username: "@nafis",
    initials: "NS",
  },

  {
    userId: "23101548",
    name: "Ahmed Galib Hasan",
    username: "@galib",
    initials: "AG",
  },
];


// ==============================
// Reader Helpers
// ==============================

const makeInitials = (name = "") => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "R";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
};


const getReaderInfo = (
  userId,
  fallback = {}
) => {
  const knownReader =
    READERS.find(
      (reader) =>
        reader.userId === userId
    );

  if (knownReader) {
    return knownReader;
  }


  const name =
    fallback.name ||
    `Reader ${userId}`;


  return {
    userId,

    name,

    username:
      fallback.username || "",

    initials:
      makeInitials(name),
  };
};


const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(parsedDate);
};


export default function ReaderConnectionsPage() {
  const {
    user,
  } = useAuth();


  const userId =
    user?.userId;


  const [
    activeTab,
    setActiveTab,
  ] = useState("discover");


  const [
    counts,
    setCounts,
  ] = useState({
    followers: 0,
    following: 0,
  });


  const [
    following,
    setFollowing,
  ] = useState([]);


  const [
    followers,
    setFollowers,
  ] = useState([]);


  const [
    activity,
    setActivity,
  ] = useState([]);


  const [
    followStatus,
    setFollowStatus,
  ] = useState({});


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    actionLoading,
    setActionLoading,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    message,
    setMessage,
  ] = useState("");


  // ==============================
  // Readers Available To Discover
  // ==============================

  const discoverReaders =
    READERS.filter(
      (reader) =>
        reader.userId !== userId
    );


  // ==============================
  // Load Connections
  // ==============================

  const loadConnections =
    async () => {
      if (!userId) {
        return;
      }


      const statusPromise =
        Promise.all(
          discoverReaders.map(
            (reader) =>
              getFollowStatus(
                userId,
                reader.userId
              )
          )
        );


      const [
        countsResult,
        followingResult,
        followersResult,
        activityResult,
        statusResults,
      ] = await Promise.all([
        getConnectionCounts(
          userId
        ),

        getFollowing(
          userId
        ),

        getFollowers(
          userId
        ),

        getFollowingActivity(
          userId
        ),

        statusPromise,
      ]);


      setCounts({
        followers:
          countsResult.followers ||
          0,

        following:
          countsResult.following ||
          0,
      });


      setFollowing(
        followingResult.data || []
      );


      setFollowers(
        followersResult.data || []
      );


      setActivity(
        activityResult.data || []
      );


      const newStatus = {};


      discoverReaders.forEach(
        (
          reader,
          index
        ) => {
          newStatus[
            reader.userId
          ] =
            Boolean(
              statusResults[
                index
              ]?.isFollowing
            );
        }
      );


      setFollowStatus(
        newStatus
      );
    };


  // ==============================
  // Initial Load
  // ==============================

  useEffect(() => {
    let cancelled = false;


    const initializePage =
      async () => {
        if (!userId) {
          setLoading(false);
          return;
        }


        try {
          setLoading(true);
          setError("");


          await loadConnections();

        } catch (error) {

          if (!cancelled) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to load reader connections."
            );
          }

        } finally {

          if (!cancelled) {
            setLoading(false);
          }

        }
      };


    initializePage();


    return () => {
      cancelled = true;
    };

  }, [userId]);


  // ==============================
  // Follow Reader
  // ==============================

  const handleFollow =
    async (reader) => {
      if (!userId) {
        return;
      }


      try {
        setActionLoading(
          reader.userId
        );

        setError("");
        setMessage("");


        await followReader({
          userId,

          // Used by Module 3
          // follow notification
          userName:
            user?.name || "",

          targetUserId:
            reader.userId,

          targetName:
            reader.name,

          targetUsername:
            reader.username,
        });


        setMessage(
          `You are now following ${reader.name}.`
        );


        await loadConnections();

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : "Failed to follow reader."
        );

      } finally {

        setActionLoading("");

      }
    };


  // ==============================
  // Unfollow Reader
  // ==============================

  const handleUnfollow =
    async (reader) => {
      if (!userId) {
        return;
      }


      try {
        setActionLoading(
          reader.userId
        );

        setError("");
        setMessage("");


        await unfollowReader(
          userId,
          reader.userId
        );


        setMessage(
          `You unfollowed ${reader.name}.`
        );


        await loadConnections();

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : "Failed to unfollow reader."
        );

      } finally {

        setActionLoading("");

      }
    };


  // ==============================
  // Reader Card
  // ==============================

  const renderReaderCard = (
    reader
  ) => {
    const isFollowing =
      Boolean(
        followStatus[
          reader.userId
        ]
      );


    return (
      <article
        key={reader.userId}
        className="flex flex-col justify-between gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center"
      >

        <div className="flex items-center gap-4">


          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#352522] text-lg font-bold text-white">
            {reader.initials}
          </div>


          <div>

            <h3 className="text-lg font-bold text-[#352522]">
              {reader.name}
            </h3>


            {reader.username && (
              <p className="text-sm text-stone-500">
                {reader.username}
              </p>
            )}


            <p className="mt-1 text-xs text-stone-400">
              Reader ID:{" "}
              {reader.userId}
            </p>

          </div>

        </div>



        <button
          type="button"
          onClick={() =>
            isFollowing
              ? handleUnfollow(
                  reader
                )
              : handleFollow(
                  reader
                )
          }
          disabled={
            actionLoading ===
            reader.userId
          }
          className={
            isFollowing
              ? "rounded-xl border border-[#824425] px-5 py-2.5 font-semibold text-[#824425] transition hover:bg-[#824425] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              : "rounded-xl bg-[#824425] px-5 py-2.5 font-semibold text-white transition hover:bg-[#6d371e] disabled:cursor-not-allowed disabled:opacity-50"
          }
        >
          {
            actionLoading ===
            reader.userId
              ? "Please wait..."
              : isFollowing
                ? "Unfollow"
                : "Follow"
          }
        </button>

      </article>
    );
  };


  // ==============================
  // Following Record Card
  // ==============================

  const renderFollowingRecord = (
    item
  ) => {
    const reader =
      getReaderInfo(
        item.targetUserId,
        {
          name:
            item.targetName,

          username:
            item.targetUsername,
        }
      );


    return renderReaderCard(
      reader
    );
  };


  // ==============================
  // Activity Card
  // ==============================

  const renderActivity = (
    item,
    index
  ) => {
    const reader =
      getReaderInfo(
        item.userId
      );


    let title =
      "Updated reading progress";

    let description =
      `${reader.name} is reading ${item.bookTitle || "a book"} — page ${item.currentPage || 0} of ${item.totalPages || "?"}.`;


    if (
      item.type ===
      "completed_book"
    ) {
      title =
        "Completed a book";

      description =
        `${reader.name} finished ${item.bookTitle}.`;

    } else if (
      item.type ===
      "reading_milestone"
    ) {
      title =
        `Reached page ${item.pageNumber || ""}`;

      description =
        item.note ||
        `${reader.name} shared a reading update.`;
    }


    return (
      <article
        key={`${item.type}-${item.createdAt}-${index}`}
        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >

        <div className="flex items-start gap-4">


          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e5d8] font-bold text-[#824425]">
            {reader.initials}
          </div>


          <div className="flex-1">


            <p className="font-semibold text-[#352522]">
              {reader.name}
            </p>


            <p className="mt-1 text-lg font-bold text-[#352522]">
              {title}
            </p>


            <p className="mt-2 leading-7 text-stone-600">
              {description}
            </p>


            {item.bookTitle && (
              <div className="mt-4 inline-block rounded-lg bg-[#f8f1e8] px-3 py-2 text-sm font-semibold text-[#824425]">
                📖{" "}
                {item.bookTitle}
              </div>
            )}


            <p className="mt-4 text-xs text-stone-400">
              {
                formatDate(
                  item.createdAt
                )
              }
            </p>

          </div>

        </div>

      </article>
    );
  };


  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-12">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <p className="text-stone-600">
            Loading reader
            connections...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#f7f2e9]">

      <div className="mx-auto max-w-7xl px-5 py-12">


        {/* ============================== */}
        {/* Header */}
        {/* ============================== */}

        <section className="mb-10">


          <p className="mb-2 text-sm font-bold tracking-[0.2em] text-[#9a5733]">
            READER NETWORK
          </p>


          <h1 className="text-4xl font-bold text-[#352522]">
            Reader Connections
          </h1>


          <p className="mt-3 max-w-2xl text-stone-600">
            Follow other readers and
            keep up with their reading
            journeys.
          </p>


          {user?.name && (
            <p className="mt-3 text-sm font-semibold text-[#824425]">
              Connections for{" "}
              {user.name}
            </p>
          )}

        </section>



        {/* ============================== */}
        {/* Counts */}
        {/* ============================== */}

        <section className="mb-10 grid gap-5 sm:grid-cols-2">


          <div className="rounded-2xl bg-[#352522] p-6 text-white shadow-sm">

            <p className="text-sm text-stone-300">
              Followers
            </p>

            <p className="mt-2 text-4xl font-bold">
              {
                counts.followers
              }
            </p>

          </div>


          <div className="rounded-2xl bg-[#824425] p-6 text-white shadow-sm">

            <p className="text-sm text-orange-100">
              Following
            </p>

            <p className="mt-2 text-4xl font-bold">
              {
                counts.following
              }
            </p>

          </div>

        </section>



        {/* ============================== */}
        {/* Messages */}
        {/* ============================== */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {message}
          </div>
        )}


        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}



        {/* ============================== */}
        {/* Tabs */}
        {/* ============================== */}

        <div className="mb-8 flex flex-wrap gap-3">


          {[
            [
              "discover",
              "Discover Readers",
            ],

            [
              "following",
              "Following",
            ],

            [
              "followers",
              "Followers",
            ],

            [
              "activity",
              "Activity",
            ],
          ].map(
            ([
              value,
              label,
            ]) => (

              <button
                key={value}
                type="button"
                onClick={() =>
                  setActiveTab(
                    value
                  )
                }
                className={
                  activeTab === value
                    ? "rounded-xl bg-[#824425] px-5 py-2.5 font-semibold text-white"
                    : "rounded-xl border border-stone-300 bg-white px-5 py-2.5 font-semibold text-stone-600 transition hover:bg-stone-50"
                }
              >
                {label}
              </button>

            )
          )}

        </div>



        {/* ============================== */}
        {/* Discover */}
        {/* ============================== */}

        {activeTab ===
          "discover" && (

          <section>


            <h2 className="mb-5 text-2xl font-bold text-[#352522]">
              Discover Readers
            </h2>


            {discoverReaders.length ===
            0 ? (

              <EmptyState
                text="No other readers are available to discover."
              />

            ) : (

              <div className="space-y-4">

                {
                  discoverReaders.map(
                    renderReaderCard
                  )
                }

              </div>

            )}

          </section>

        )}



        {/* ============================== */}
        {/* Following */}
        {/* ============================== */}

        {activeTab ===
          "following" && (

          <section>


            <h2 className="mb-5 text-2xl font-bold text-[#352522]">
              People You Follow
            </h2>


            {following.length ===
            0 ? (

              <EmptyState
                text="You are not following anyone yet."
              />

            ) : (

              <div className="space-y-4">

                {
                  following.map(
                    renderFollowingRecord
                  )
                }

              </div>

            )}

          </section>

        )}



        {/* ============================== */}
        {/* Followers */}
        {/* ============================== */}

        {activeTab ===
          "followers" && (

          <section>


            <h2 className="mb-5 text-2xl font-bold text-[#352522]">
              Your Followers
            </h2>


            {followers.length ===
            0 ? (

              <EmptyState
                text="You do not have any followers yet."
              />

            ) : (

              <div className="space-y-4">

                {followers.map(
                  (item) => {
                    const reader =
                      getReaderInfo(
                        item.userId
                      );


                    return (
                      <article
                        key={
                          item._id
                        }
                        className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                      >

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#352522] font-bold text-white">
                          {
                            reader.initials
                          }
                        </div>


                        <div>

                          <h3 className="font-bold text-[#352522]">
                            {
                              reader.name
                            }
                          </h3>


                          {reader.username && (
                            <p className="text-sm text-stone-500">
                              {
                                reader.username
                              }
                            </p>
                          )}


                          <p className="mt-1 text-xs text-stone-400">
                            Reader ID:{" "}
                            {
                              reader.userId
                            }
                          </p>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            )}

          </section>

        )}



        {/* ============================== */}
        {/* Activity */}
        {/* ============================== */}

        {activeTab ===
          "activity" && (

          <section>


            <h2 className="mb-2 text-2xl font-bold text-[#352522]">
              Following Activity
            </h2>


            <p className="mb-6 text-stone-500">
              Recent reading updates from
              readers you follow.
            </p>


            {activity.length ===
            0 ? (

              <EmptyState
                text="No activity to show yet."
              />

            ) : (

              <div className="space-y-4">

                {
                  activity.map(
                    renderActivity
                  )
                }

              </div>

            )}

          </section>

        )}

      </div>

    </main>
  );
}


// ==============================
// Empty State
// ==============================

function EmptyState({
  text,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-500 shadow-sm">
      {text}
    </div>
  );
}