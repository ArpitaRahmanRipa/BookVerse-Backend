function LoadingSpinner({ label = "Loading statistics..." }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-amber-100 bg-white">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
        <p className="mt-4 text-sm text-stone-600">{label}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
