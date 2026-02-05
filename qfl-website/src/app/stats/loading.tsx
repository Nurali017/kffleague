export default function StatsLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-48 rounded-2xl mb-8" />

      {/* Tabs skeleton */}
      <div className="flex gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-10 w-32 rounded-lg"
          />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl p-6">
        {/* Table header */}
        <div className="flex gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-6 flex-1 rounded"
            />
          ))}
        </div>

        {/* Table rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex gap-4 py-4 border-b border-gray-100 dark:border-dark-border">
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-8 flex-1 rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
