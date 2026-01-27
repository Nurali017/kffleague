'use client';

export function H2HSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col items-center gap-6">
          {/* Title */}
          <div className="h-4 w-32 bg-gray-200 rounded" />

          {/* Teams and Chart */}
          <div className="flex items-center justify-between w-full max-w-md">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2 w-20">
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>

            {/* Donut Chart */}
            <div className="w-32 h-32 bg-gray-200 rounded-full" />

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2 w-20">
              <div className="w-14 h-14 bg-gray-200 rounded-full" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Form Section Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>

          {/* Team 1 Form */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          {/* Team 2 Form */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Season Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto mb-6" />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-8 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-8 bg-gray-200 rounded" />
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Previous Meetings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 bg-gray-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-2 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                  <div className="h-8 w-14 bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function H2HMiniSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
      {/* Header */}
      <div className="bg-gray-300 py-4 px-6">
        <div className="h-3 w-24 bg-gray-400 rounded mx-auto" />
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Teams + Stats */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-2 w-16">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="h-2 w-12 bg-gray-200 rounded" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-6 bg-gray-200 rounded" />
            <div className="h-6 w-4 bg-gray-200 rounded" />
            <div className="h-8 w-6 bg-gray-200 rounded" />
          </div>

          <div className="flex flex-col items-center gap-2 w-16">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="h-2 w-12 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>

          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="w-5 h-5 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
