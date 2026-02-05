export default function PlayerDetailLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Player header skeleton */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 mb-8">
        <div className="flex gap-8">
          {/* Player photo */}
          <div className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft w-48 h-48 rounded-2xl" />

          {/* Player info */}
          <div className="flex-1">
            <div className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-8 w-64 rounded mb-4" />
            <div className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-5 w-48 rounded mb-6" />

            {/* Stats row */}
            <div className="flex gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-dark-surface rounded-xl p-4 w-24"
                >
                  <div className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-8 w-12 rounded mb-2 mx-auto" />
                  <div className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-4 w-16 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-10 w-28 rounded-lg"
          />
        ))}
      </div>

      {/* Stats table skeleton */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl p-6">
        {/* Table header */}
        <div className="flex gap-4 mb-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-dark-surface-soft h-6 flex-1 rounded"
            />
          ))}
        </div>

        {/* Table rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 py-4 border-b border-gray-100 dark:border-dark-border">
            {[...Array(8)].map((_, j) => (
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
