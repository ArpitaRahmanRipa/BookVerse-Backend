function UserIdInput({ userId, onChange, onSubmit, loading }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <label
        htmlFor="userId"
        className="block text-sm font-medium text-stone-700"
      >
        Reader ID
      </label>
      <p className="mt-1 text-xs text-stone-500">
        Enter the same user ID used in reading progress records.
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g. reader-001"
          className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none ring-amber-300 focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading || !userId.trim()}
          className="rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {loading ? "Loading..." : "Load Statistics"}
        </button>
      </div>
    </form>
  );
}

export default UserIdInput;
