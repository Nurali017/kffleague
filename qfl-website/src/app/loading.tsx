export default function RootLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10 space-y-8">
      {/* Hero + Matches Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 h-[500px]">
          <div className="animate-pulse bg-gray-200 dark:bg-slate-700 rounded-2xl h-full" />
        </div>
        <div className="lg:col-span-3 h-[500px]">
          <div className="animate-pulse bg-gray-200 dark:bg-slate-700 rounded-2xl h-full" />
        </div>
      </div>

      {/* News + Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          <div className="animate-pulse bg-gray-200 dark:bg-slate-700 rounded-2xl h-[400px]" />
        </div>
        <div className="lg:col-span-3">
          <div className="animate-pulse bg-gray-200 dark:bg-slate-700 rounded-2xl h-[400px]" />
        </div>
      </div>
    </div>
  );
}
