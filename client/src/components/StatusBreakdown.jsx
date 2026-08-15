function StatusBreakdown({ items }) {
  if (!items.length) {
    return null;
  }

  const total = items.reduce((sum, item) => sum + item.count, 0);

  const colors = {
    Finished: "bg-emerald-500",
    "Currently Reading": "bg-amber-500",
    "Want to Read": "bg-sky-500",
    "Did Not Finish": "bg-rose-400",
  };

  return (
    <section className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">
        Reading Status Breakdown
      </h2>
      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={item.status}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-stone-700">{item.status}</span>
                <span className="text-stone-500">
                  {item.count} ({percent}%)
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full ${colors[item.status] || "bg-stone-400"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatusBreakdown;
