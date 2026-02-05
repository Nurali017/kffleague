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
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            activeTab === tab.key
              ? 'bg-[#E5B73B] text-[#0F2D52]'
              : 'bg-white dark:bg-dark-surface text-[#1E4D8C] dark:text-accent-cyan hover:bg-white/90 dark:hover:bg-dark-surface-soft'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
