function PlaceholderPage({ title, description, badge }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-600">
          {badge}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-stone-900">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default PlaceholderPage;
