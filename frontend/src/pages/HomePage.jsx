import { Link } from "react-router";

const features = [
  {
    icon: "🔎",
    title: "Discover Books",
    description:
      "Search for books, explore details, and find your next great read.",
    link: "/books",
    linkText: "Explore Books",
  },
  {
    icon: "📖",
    title: "Track Your Reading",
    description:
      "Update page progress, reading status, dates, ratings, and your reading journey.",
    link: "/reading-progress",
    linkText: "Track Progress",
  },
  {
    icon: "📝",
    title: "Reading Diary",
    description:
      "Save private or public thoughts while reading and build a personal reading history.",
    link: "/reading-diary",
    linkText: "Open Diary",
  },
  {
    icon: "📚",
    title: "Reading Lists",
    description:
      "Create and explore collections of books for different moods, themes, and goals.",
    link: "/reading-lists",
    linkText: "View Lists",
  },
  {
    icon: "👥",
    title: "Reader Connections",
    description:
      "Follow other readers and stay connected with their reading activity.",
    link: "/connections",
    linkText: "Find Readers",
  },
  {
    icon: "🔔",
    title: "Stay Updated",
    description:
      "Receive in-app notifications and important email alerts about BookVerse activity.",
    link: "/notifications",
    linkText: "Notifications",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f2e9]">

      {/* ============================== */}
      {/* Hero */}
      {/* ============================== */}

      <section className="border-b border-stone-200 bg-gradient-to-b from-[#efe2d3] to-[#f7f2e9]">

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8a5d42]">
              Your reading life, in one place
            </p>

            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight text-[#352522] md:text-6xl">
              Read.
              <br />
              Remember.
              <br />
              Discover.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              BookVerse is a social reading
              journal for discovering books,
              tracking your progress, recording
              your thoughts, and connecting with
              other readers.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                to="/books"
                className="rounded-xl bg-[#6f3f26] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#57301d]"
              >
                Explore Books
              </Link>

              <Link
                to="/reading-progress"
                className="rounded-xl border-2 border-[#6f3f26] px-6 py-3 font-bold text-[#6f3f26] transition hover:bg-[#f2e5d9]"
              >
                Start Tracking
              </Link>

            </div>

          </div>

          {/* Hero visual */}

          <div className="relative mx-auto w-full max-w-lg">

            <div className="rounded-[2rem] bg-[#352522] p-8 text-white shadow-2xl">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-stone-300">
                    Currently Reading
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    Your Reading Journey
                  </h2>
                </div>

                <span className="text-5xl">
                  📚
                </span>

              </div>

              <div className="mt-10 rounded-2xl bg-white/10 p-5">

                <div className="flex justify-between text-sm">

                  <span>
                    Reading Progress
                  </span>

                  <span className="font-bold">
                    60%
                  </span>

                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">

                  <div className="h-full w-3/5 rounded-full bg-[#d6ad8c]" />

                </div>

                <p className="mt-4 text-sm leading-6 text-stone-300">
                  Keep updating your progress and
                  BookVerse will build a complete
                  history of your reading journey.
                </p>

              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">

                <div className="rounded-xl bg-white/10 p-4 text-center">
                  <p className="text-2xl">
                    📖
                  </p>
                  <p className="mt-2 text-xs text-stone-300">
                    Progress
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4 text-center">
                  <p className="text-2xl">
                    ✍️
                  </p>
                  <p className="mt-2 text-xs text-stone-300">
                    Diary
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4 text-center">
                  <p className="text-2xl">
                    👥
                  </p>
                  <p className="mt-2 text-xs text-stone-300">
                    Community
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================== */}
      {/* Feature Section */}
      {/* ============================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="text-center">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            Everything a reader needs
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#352522]">
            Build your reading world
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-600">
            Keep your books, progress, thoughts,
            collections, connections, and reading
            activity together in BookVerse.
          </p>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (

            <article
              key={feature.title}
              className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2e5d9] text-3xl">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#352522]">
                {feature.title}
              </h3>

              <p className="mt-3 min-h-20 leading-7 text-stone-600">
                {feature.description}
              </p>

              <Link
                to={feature.link}
                className="mt-5 inline-block font-bold text-[#6f3f26] transition group-hover:translate-x-1"
              >
                {feature.linkText} →
              </Link>

            </article>

          ))}

        </div>

      </section>

      {/* ============================== */}
      {/* Community Safety */}
      {/* ============================== */}

      <section className="bg-[#352522]">

        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d6ad8c]">
              A safer reading community
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Community safety matters.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-stone-300">
              Readers can report inappropriate
              content while moderators can review
              reports and take appropriate action.
            </p>

          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">

            <Link
              to="/report"
              className="rounded-xl bg-white px-5 py-3 font-bold text-[#352522] transition hover:bg-stone-100"
            >
              Report Content
            </Link>

            <Link
              to="/moderation"
              className="rounded-xl border border-white/40 px-5 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Moderation Dashboard
            </Link>

          </div>

        </div>

      </section>

      {/* ============================== */}
      {/* Final CTA */}
      {/* ============================== */}

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">

        <span className="text-5xl">
          📚
        </span>

        <h2 className="mt-5 text-4xl font-bold text-[#352522]">
          Every book becomes part of your story.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-600">
          Discover something new, track every
          chapter, and keep a record of the books
          that shaped your year.
        </p>

        <Link
          to="/books"
          className="mt-8 inline-block rounded-xl bg-[#6f3f26] px-7 py-3 font-bold text-white transition hover:bg-[#57301d]"
        >
          Start Exploring
        </Link>

      </section>

      {/* ============================== */}
      {/* Footer */}
      {/* ============================== */}

      <footer className="border-t border-stone-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 BookVerse
          </p>

          <p>
            A social reading journal & discovery
            platform.
          </p>

        </div>

      </footer>

    </main>
  );
}