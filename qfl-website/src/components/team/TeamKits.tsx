export function TeamKits({ kits }: { kits?: { home: string, away: string } }) {
    if (!kits) return null;

    return (
        <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Team Kits</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl p-8 relative overflow-hidden group">
                    <span className="absolute top-6 left-6 text-sm font-bold text-gray-400 uppercase tracking-widest z-10">Home Kit</span>

                    <div className="flex justify-center items-center h-[300px] transition-transform duration-500 group-hover:scale-105">
                        <img
                            src={kits.home}
                            className="h-full object-contain drop-shadow-2xl"
                            alt="Home Kit"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.opacity = '0.1';
                            }}
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl p-8 relative overflow-hidden group">
                    <span className="absolute top-6 left-6 text-sm font-bold text-gray-400 uppercase tracking-widest z-10">Away Kit</span>

                    <div className="flex justify-center items-center h-[300px] transition-transform duration-500 group-hover:scale-105">
                        <img
                            src={kits.away}
                            className="h-full object-contain drop-shadow-2xl"
                            alt="Away Kit"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.opacity = '0.1';
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
