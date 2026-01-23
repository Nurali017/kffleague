'use client';

import { StatSubTab } from '@/types/statistics';

interface StatisticsSubTabsProps {
    activeSubTab: StatSubTab;
    onSubTabChange: (tab: StatSubTab) => void;
    hideGoalkeeping?: boolean;
}

const SUB_TABS: { id: StatSubTab; label: string }[] = [
    { id: 'key_stats', label: 'Key stats' },
    { id: 'goals', label: 'Goals' },
    { id: 'attempts', label: 'Attempts' },
    { id: 'distribution', label: 'Distribution' },
    { id: 'attacking', label: 'Attacking' },
    { id: 'defending', label: 'Defending' },
    { id: 'goalkeeping', label: 'Goalkeeping' },
    { id: 'disciplinary', label: 'Disciplinary' },
];

export function StatisticsSubTabs({ activeSubTab, onSubTabChange, hideGoalkeeping }: StatisticsSubTabsProps) {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
                    {SUB_TABS.filter(tab => !hideGoalkeeping || tab.id !== 'goalkeeping').map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onSubTabChange(tab.id)}
                            className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-all rounded-md ${activeSubTab === tab.id
                                    ? 'text-[#1E4D8C] bg-blue-50'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
