'use client';

export function H2HSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section 1: Overall Record */}
      <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
        </div>
        {/* Three circles */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
          ))}
        </div>
        {/* Two bars */}
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
        </div>
      </div>

      {/* Section 2: Form Guide */}
      <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((col) => (
            <div key={col}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
              </div>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <div className="h-7 w-8 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
                    <div className="h-7 w-7 bg-gray-200 dark:bg-gray-600 rounded-md animate-h2h-shimmer" />
                    <div className="h-7 w-7 bg-gray-200 dark:bg-gray-600 rounded-md animate-h2h-shimmer" />
                    <div className="h-7 w-8 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Season So Far */}
      <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-2.5 ${
                i % 2 === 0 ? 'bg-white dark:bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700/30'
              }`}
            >
              <div className="h-4 w-10 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
              <div className="h-4 w-10 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Previous Meetings */}
      <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl p-5 sm:p-6">
        <div className="h-4 w-36 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-5 animate-h2h-shimmer" />
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto mb-1 animate-h2h-shimmer" />
              <div className="flex items-center justify-center gap-3 py-2 px-3 rounded-xl bg-white dark:bg-gray-700">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-md animate-h2h-shimmer" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-md animate-h2h-shimmer" />
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full animate-h2h-shimmer" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-h2h-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function H2HMiniSkeleton() {
  return (
    <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl p-5 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
      </div>
      <div className="flex items-center justify-center gap-6">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full" />
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full" />
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full" />
      </div>
    </div>
  );
}
