'use client';

import { useTranslation } from 'react-i18next';

interface NewsTabsProps {
  activeTab: 'all' | 'news' | 'analytics';
  onTabChange: (tab: 'all' | 'news' | 'analytics') => void;
  className?: string;
}

export function NewsTabs({ activeTab, onTabChange, className = '' }: NewsTabsProps) {
  const { t } = useTranslation('news');

  const tabs = [
    { id: 'all' as const, label: t('allNews') },
    { id: 'news' as const, label: t('typeNews') },
    { id: 'analytics' as const, label: t('typeAnalytics') },
  ];

  return (
    <div className={`border-b border-gray-200 dark:border-slate-700 ${className}`}>
      <nav className="flex gap-1 md:gap-2 -mb-px overflow-x-auto scrollbar-hide" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-3 py-2 md:px-6 md:py-3 font-semibold text-xs md:text-sm transition-all duration-200 whitespace-nowrap
              ${
                activeTab === tab.id
                  ? 'text-[#1E4D8C] dark:text-blue-400'
                  : 'text-gray-500 dark:text-slate-400 hover:text-[#1E4D8C] dark:hover:text-blue-400'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E4D8C] dark:bg-blue-400 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
