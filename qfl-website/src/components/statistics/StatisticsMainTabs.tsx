'use client';

interface StatisticsMainTabsProps {
    activeTab: 'clubs' | 'players';
    onTabChange: (tab: 'clubs' | 'players') => void;
}

export function StatisticsMainTabs({ activeTab, onTabChange }: StatisticsMainTabsProps) {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="flex gap-1">
                    <button
                        onClick={() => onTabChange('clubs')}
                        className={`px-8 py-5 text-lg font-bold transition-all relative ${activeTab === 'clubs'
                                ? 'text-[#1E4D8C]'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Club stats
                        {activeTab === 'clubs' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1E4D8C] rounded-t-sm" />
                        )}
                    </button>
                    <button
                        onClick={() => onTabChange('players')}
                        className={`px-8 py-5 text-lg font-bold transition-all relative ${activeTab === 'players'
                                ? 'text-[#1E4D8C]'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Player stats
                        {activeTab === 'players' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1E4D8C] rounded-t-sm" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
