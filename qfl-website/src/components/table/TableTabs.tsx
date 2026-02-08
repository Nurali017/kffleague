'use client';

import { useTranslation } from 'react-i18next';

export type TableTabType = 'standings' | 'results';

interface TableTabsProps {
  activeTab: TableTabType;
  onTabChange: (tab: TableTabType) => void;
}

export function TableTabs({ activeTab, onTabChange }: TableTabsProps) {
  const { t } = useTranslation('table');

  const tabs: { key: TableTabType; label: string }[] = [
    { key: 'standings', label: t('tabs.standings') },
    { key: 'results', label: t('tabs.results') },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`shrink-0 px-4 md:px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            activeTab === tab.key
              ? 'bg-accent text-primary-dark'
              : 'bg-white dark:bg-dark-surface text-primary dark:text-accent-cyan hover:bg-white/90 dark:hover:bg-dark-surface-soft'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
