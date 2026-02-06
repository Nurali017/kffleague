'use client';

import { useTranslation } from 'react-i18next';

export type TabId = 'lineups' | 'statistics' | 'overview' | 'h2h';

interface Tab {
  id: TabId;
  labelKey: string;
}

interface MatchTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function MatchTabs({ activeTab, onTabChange }: MatchTabsProps) {
  const { t } = useTranslation('match');

  const tabs: Tab[] = [
    { id: 'overview', labelKey: 'tabs.overview' },
    { id: 'lineups', labelKey: 'tabs.lineups' },
    { id: 'statistics', labelKey: 'tabs.statistics' },
    { id: 'h2h', labelKey: 'tabs.h2h' },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-14 md:top-16 z-30 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-20">
        <nav className="flex gap-1 md:gap-8 overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-bold transition-all duration-200 whitespace-nowrap border-b-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t-lg
                  ${isActive
                    ? 'text-[#1E4D8C] dark:text-accent-cyan border-[#1E4D8C] dark:border-accent-cyan'
                    : 'text-gray-500 dark:text-slate-400 border-transparent hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-500'
                  }
                `}
              >
                {t(tab.labelKey)}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
