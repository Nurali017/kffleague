export default function TeamDetailLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Team header skeleton */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-8">
          {/* Team logo */}
          <div className="animate-pulse bg-gray-200 dark:bg-slate-700 w-32 h-32 rounded-2xl" />

          {/* Team info */}
          <div className="flex-1">
            <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-8 w-64 rounded mb-4" />
            <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-5 w-48 rounded mb-2" />
            <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-5 w-36 rounded" />
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-10 w-16 rounded mb-2" />
                <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-4 w-12 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-slate-700 h-10 w-28 rounded-lg"
          />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-[500px] rounded-2xl" />
        </div>
        <div>
          <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-64 rounded-2xl mb-6" />
          <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
