'use client';

import { useTranslation } from 'react-i18next';

interface NewsTabsProps {
  activeTab: 'all' | 'news' | 'analytics';
  onTabChange: (tab: 'all' | 'news' | 'analytics') => void;
  className?: string;
  variant?: 'default' | 'hero';
}

export function NewsTabs({
  activeTab,
  onTabChange,
  className = '',
  variant = 'default',
}: NewsTabsProps) {
  const { t } = useTranslation('news');
  const isHero = variant === 'hero';

  const tabs = [
    { id: 'all' as const, label: t('allNews') },
    { id: 'news' as const, label: t('typeNews') },
    { id: 'analytics' as const, label: t('typeAnalytics') },
  ];

  const containerClass = isHero
    ? 'border-b border-white/20'
    : 'border-b border-gray-200 dark:border-dark-border';
  const activeTabClass = isHero
    ? 'text-white'
    : 'text-primary dark:text-accent-cyan';
  const inactiveTabClass = isHero
    ? 'text-white/70 hover:text-white'
    : 'text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent-cyan';
  const indicatorClass = isHero
    ? 'bg-white/80'
    : 'bg-primary dark:bg-accent-cyan';

  return (
    <div className={`${containerClass} ${className}`}>
      <nav className="flex gap-1 md:gap-2 -mb-px overflow-x-auto scrollbar-hide" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-3 py-2 md:px-6 md:py-3 font-semibold text-xs md:text-sm transition-all duration-200 whitespace-nowrap
              ${
                activeTab === tab.id
                  ? activeTabClass
                  : inactiveTabClass
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${indicatorClass} rounded-full`} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
