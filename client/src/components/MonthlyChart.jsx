function MonthlyChart({ items }) {
  if (!items.length) {
    return (
      <section className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">
          Books Finished by Month
        </h2>
        <p className="mt-4 text-sm text-stone-500">
          Finish more books to see monthly trends here.
        </p>
      </section>
    );
  }

  const maxCount = Math.max(...items.map((item) => item.count));

  return (
    <section className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">
        Books Finished by Month
      </h2>
      <div className="mt-6 flex h-56 items-end gap-3 overflow-x-auto pb-2">
        {items.map((item) => {
          const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <div
              key={item.month}
              className="flex min-w-[56px] flex-1 flex-col items-center justify-end"
            >
              <span className="mb-2 text-xs font-semibold text-stone-700">
                {item.count}
              </span>
              <div
                className="w-full rounded-t-lg bg-amber-500 transition-all"
                style={{ height: `${Math.max(height, 8)}%` }}
                title={`${item.month}: ${item.count} books`}
              />
              <span className="mt-2 text-[11px] text-stone-500">
                {item.month.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MonthlyChart;
