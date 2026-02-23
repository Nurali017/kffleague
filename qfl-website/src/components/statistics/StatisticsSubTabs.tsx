'use client';

import { useEffect, useRef, useState } from 'react';
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
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const [showLeftHint, setShowLeftHint] = useState(false);
    const [showRightHint, setShowRightHint] = useState(false);
    const visibleTabs = SUB_TAB_IDS.filter((id) => !hideGoalkeeping || id !== 'goalkeeping');

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const updateHints = () => {
            const canScroll = scroller.scrollWidth > scroller.clientWidth + 1;
            setShowLeftHint(canScroll && scroller.scrollLeft > 0);
            setShowRightHint(canScroll && scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1);
        };

        updateHints();
        scroller.addEventListener('scroll', updateHints, { passive: true });
        window.addEventListener('resize', updateHints);
        return () => {
            scroller.removeEventListener('scroll', updateHints);
            window.removeEventListener('resize', updateHints);
        };
    }, [visibleTabs.length]);

    return (
        <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
                <div className="relative">
                    <div
                        ref={scrollerRef}
                        data-testid="stats-subtabs-scroller"
                        className="flex gap-1 overflow-x-auto scrollbar-hide py-2"
                    >
                        {visibleTabs.map((id) => (
                            <button
                                key={id}
                                onClick={() => onSubTabChange(id)}
                                className={`px-3 md:px-4 py-2.5 md:py-3 min-h-[40px] text-xs md:text-sm font-bold whitespace-nowrap transition-all rounded-md ${
                                    activeSubTab === id
                                        ? 'text-primary dark:text-accent-cyan bg-blue-50 dark:bg-cyan-500/10'
                                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-dark-surface-soft'
                                }`}
                            >
                                {t(SUB_TAB_KEYS[id])}
                            </button>
                        ))}
                    </div>
                    {showLeftHint && (
                        <div className="md:hidden pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-dark-surface to-transparent" />
                    )}
                    {showRightHint && (
                        <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-dark-surface to-transparent" />
                    )}
                </div>
            </div>
        </div>
    );
}
