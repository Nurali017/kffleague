export default function MatchesLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-12 w-48 rounded-lg mb-8" />

      {/* Filters skeleton */}
      <div className="flex gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-slate-700 h-10 w-32 rounded-lg"
          />
        ))}
      </div>

      {/* Match cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-slate-700 h-48 rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}
