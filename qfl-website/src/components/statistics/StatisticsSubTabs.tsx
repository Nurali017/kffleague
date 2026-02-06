'use client';

import { useTranslation } from 'react-i18next';
import { StatSubTab } from '@/types/statistics';

interface StatisticsSubTabsProps {
    activeSubTab: StatSubTab;
    onSubTabChange: (tab: StatSubTab) => void;
    hideGoalkeeping?: boolean;
}

const SUB_TAB_IDS: StatSubTab[] = [
    'key_stats',
    'goals',
    'attempts',
    'distribution',
    'attacking',
    'defending',
    'goalkeeping',
    'disciplinary',
];

const SUB_TAB_KEYS: Record<StatSubTab, string> = {
    'key_stats': 'subTabs.keyStats',
    'goals': 'subTabs.goals',
    'attempts': 'subTabs.attempts',
    'distribution': 'subTabs.distribution',
    'attacking': 'subTabs.attacking',
    'defending': 'subTabs.defending',
    'goalkeeping': 'subTabs.goalkeeping',
    'disciplinary': 'subTabs.disciplinary',
};

export function StatisticsSubTabs({ activeSubTab, onSubTabChange, hideGoalkeeping }: StatisticsSubTabsProps) {
    const { t } = useTranslation('statistics');

    return (
        <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
            <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
                    {SUB_TAB_IDS.filter(id => !hideGoalkeeping || id !== 'goalkeeping').map(id => (
                        <button
                            key={id}
                            onClick={() => onSubTabChange(id)}
                            className={`px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-bold whitespace-nowrap transition-all rounded-md ${
                                activeSubTab === id
                                    ? 'text-[#1E4D8C] dark:text-accent-cyan bg-blue-50 dark:bg-cyan-500/10'
                                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-dark-surface-soft'
                            }`}
                        >
                            {t(SUB_TAB_KEYS[id])}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
