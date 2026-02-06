'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function MatchCenterSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex-1 space-y-0">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="w-7 h-7 rounded-full" />
            </div>
            <Skeleton className="h-5 w-14 mx-4" />
            <div className="flex items-center space-x-2 flex-1">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeagueTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="px-5 py-3 bg-[#1E4D8C]">
        <Skeleton className="h-5 w-32 bg-white/20" />
      </div>
      <div className="px-5 py-2 bg-gray-100">
        <Skeleton className="h-3 w-full" />
      </div>
      <div className="flex-1 p-2 space-y-1">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2">
            <Skeleton className="w-5 h-4" />
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="w-6 h-4" />
            <Skeleton className="w-8 h-4" />
            <Skeleton className="w-6 h-4" />
          </div>
        ))}
      </div>
      <div className="px-5 py-2.5 border-t border-gray-100">
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-900">
      {/* Top right counter skeleton */}
      <div className="absolute top-6 right-8">
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-14">
        <div className="flex items-center space-x-3 mb-5">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-12 w-3/4 mb-3" />
        <Skeleton className="h-12 w-1/2 mb-8" />
        <div className="flex items-center space-x-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>

      {/* Bottom right progress indicators skeleton */}
      <div className="absolute bottom-6 right-8 flex items-center space-x-2">
        <Skeleton className="h-1 w-12 rounded-full" />
        <Skeleton className="h-1 w-6 rounded-full" />
        <Skeleton className="h-1 w-6 rounded-full" />
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}
