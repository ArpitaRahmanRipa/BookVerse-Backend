function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-stone-600">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
