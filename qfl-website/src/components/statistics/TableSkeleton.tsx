export function TableSkeleton({ rows = 10, columns = 6 }: { rows?: number; columns?: number }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-12 bg-gray-100 border-b border-gray-200 w-full" />
            <div className="p-0">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex border-b border-gray-100 last:border-0">
                        {Array.from({ length: columns }).map((_, j) => (
                            <div key={j} className="p-4 flex-1">
                                <div className="h-4 bg-gray-100 rounded w-full" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
