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
  protocolUrl?: string | null;
  showLineupsTab?: boolean;
  showStatisticsTab?: boolean;
  isSuperCup?: boolean;
}

export function MatchTabs({
  activeTab,
  onTabChange,
  protocolUrl,
  showLineupsTab = true,
  showStatisticsTab = true,
  isSuperCup = false,
}: MatchTabsProps) {
  const { t } = useTranslation('match');
  const hasProtocol = Boolean(protocolUrl);

  const tabs: Tab[] = [
    { id: 'overview', labelKey: 'tabs.overview' },
    ...(showLineupsTab ? [{ id: 'lineups', labelKey: 'tabs.lineups' } as Tab] : []),
    ...(showStatisticsTab ? [{ id: 'statistics', labelKey: 'tabs.statistics' } as Tab] : []),
    { id: 'h2h', labelKey: 'tabs.h2h' },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-14 md:top-16 z-30 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="flex items-end gap-2 md:gap-4">
          <nav className="flex flex-1 min-w-0 gap-1 md:gap-8 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    ${isSuperCup ? 'min-h-[44px] px-3 py-2.5 text-[13px]' : 'py-3 px-2 text-xs'} md:min-h-0 md:py-4 md:px-4 md:text-sm font-bold transition-all duration-200 whitespace-nowrap border-b-2 outline-none focus-visible:ring-2 ${isSuperCup ? 'focus-visible:ring-amber-400' : 'focus-visible:ring-blue-500'} rounded-t-lg
                    ${isActive
                      ? isSuperCup
                        ? 'text-amber-500 border-amber-500'
                        : 'text-primary dark:text-accent-cyan border-primary dark:border-accent-cyan'
                      : 'text-gray-500 dark:text-slate-400 border-transparent hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-500'
                    }
                  `}
                >
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </nav>

          {hasProtocol && isSuperCup && (
            <a
              href={protocolUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="protocol-link-mobile-inline"
              className="md:hidden inline-flex h-10 items-center justify-center rounded-lg bg-amber-400 text-[#0a1628] px-3 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap shrink-0 mb-1 hover:opacity-90 transition-opacity"
            >
              {t('tabs.protocol')}
            </a>
          )}

          {hasProtocol && (
            <a
              href={protocolUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="protocol-link-desktop"
              className={`hidden md:inline-flex items-center justify-center px-4 py-2 mb-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-opacity ${isSuperCup ? 'bg-amber-400 text-[#0a1628]' : 'bg-primary text-white'}`}
            >
              {t('tabs.protocol')}
            </a>
          )}
        </div>

        {hasProtocol && !isSuperCup && (
          <div className="md:hidden pb-3" data-testid="protocol-link-mobile-stacked">
            <a
              href={protocolUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {t('tabs.protocol')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
