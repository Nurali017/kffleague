export default function MatchDetailLoading() {
  return (
    <div className="bg-[#FAFBFC] dark:bg-dark-bg min-h-screen">
      {/* Match header skeleton */}
      <div className="bg-gradient-to-br from-[#1E4D8C] to-[#0D2847] py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Home team */}
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-white/20 w-24 h-24 rounded-full" />
              <div className="animate-pulse bg-white/20 h-6 w-32 rounded" />
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="animate-pulse bg-white/20 h-16 w-24 rounded-lg mx-auto mb-2" />
              <div className="animate-pulse bg-white/20 h-4 w-20 rounded mx-auto" />
            </div>

            {/* Away team */}
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-white/20 h-6 w-32 rounded" />
              <div className="animate-pulse bg-white/20 w-24 h-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-dark-surface">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex gap-8 py-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 dark:bg-slate-700 h-8 w-24 rounded"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-96 rounded-2xl" />
          </div>
          <div>
            <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-64 rounded-2xl mb-6" />
            <div className="animate-pulse bg-gray-200 dark:bg-slate-700 h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
