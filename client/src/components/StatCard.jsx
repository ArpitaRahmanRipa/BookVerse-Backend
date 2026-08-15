function StatCard({ label, value, hint }) {
  return (
    <article className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-stone-900">{value}</p>
      {hint && <p className="mt-2 text-xs text-stone-500">{hint}</p>}
    </article>
  );
}

export default StatCard;
