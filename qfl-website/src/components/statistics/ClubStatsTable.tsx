'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ColumnDefinition,
  formatValue,
  getColumnsForSubTab,
} from '@/lib/mock/statisticsHelpers';
import { StatSubTab, TeamStatistics } from '@/types/statistics';
import { TableSkeleton } from './TableSkeleton';

interface ClubStatsTableProps {
  subTab: StatSubTab;
  teams: TeamStatistics[];
  loading?: boolean;
}

const DEFAULT_SORT_BY: Record<StatSubTab, string> = {
  key_stats: 'points',
  goals: 'goals_scored',
  attempts: 'shots',
  distribution: 'passes',
  attacking: 'possession',
  defending: 'tackles',
  goalkeeping: 'points',
  disciplinary: 'fouls',
};

const TEAM_LOGO_PLACEHOLDER_SRC = '/images/placeholders/team.svg';

function getDefaultSortBy(subTab: StatSubTab, columns: ColumnDefinition[]): string {
  const preferred = DEFAULT_SORT_BY[subTab];
  if (columns.some((c) => c.key === preferred)) return preferred;
  return columns.find((c) => c.sortable)?.key || columns[0]?.key || 'points';
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function ClubStatsTable({ subTab, teams, loading }: ClubStatsTableProps) {
  const { t } = useTranslation('statistics');

  const columns = useMemo(() => getColumnsForSubTab(subTab, 'clubs'), [subTab]);

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>(() =>
    getDefaultSortBy(subTab, columns)
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Ensure sort column exists in current subTab
  useEffect(() => {
    const columnKeys = new Set(columns.map((c) => c.key));
    if (!columnKeys.has(sortBy)) {
      setSortBy(getDefaultSortBy(subTab, columns));
      setSortOrder('desc');
    }
  }, [columns, sortBy, subTab]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTeams = useMemo(() => {
    if (!normalizedQuery) return teams;
    return teams.filter((team) =>
      (team.team_name || '').toLowerCase().includes(normalizedQuery)
    );
  }, [teams, normalizedQuery]);

  const sortedTeams = useMemo(() => {
    return [...filteredTeams].sort((a, b) => {
      const aNum = toFiniteNumber(a[sortBy as keyof TeamStatistics]);
      const bNum = toFiniteNumber(b[sortBy as keyof TeamStatistics]);

      // Keep null/undefined/NaN at the bottom
      if (aNum === null && bNum === null) return 0;
      if (aNum === null) return 1;
      if (bNum === null) return -1;

      return sortOrder === 'desc' ? bNum - aNum : aNum - bNum;
    });
  }, [filteredTeams, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  if (loading) return <TableSkeleton rows={10} columns={columns.length + 2} />;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('table.searchClub', { defaultValue: 'Поиск клуба…' })}
            className="w-full pl-10 pr-9 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] dark:focus:ring-blue-500 focus:border-transparent"
          />
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-surface-soft transition-colors"
              aria-label={t('table.clearSearch', {
                defaultValue: 'Очистить поиск',
              })}
            >
              <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] md:min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-dark-surface-soft border-b border-gray-200 dark:border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-16 sticky left-0 bg-gray-50 dark:bg-dark-surface-soft z-10">
                {t('table.position')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider sticky left-16 bg-gray-50 dark:bg-dark-surface-soft z-10 w-64 border-r border-gray-100 dark:border-dark-border">
                {t('table.club')}
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                    col.sortable
                      ? 'text-gray-500 dark:text-slate-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-surface-soft'
                      : 'text-gray-500 dark:text-slate-400'
                  } ${
                    sortBy === col.key
                      ? 'text-[#1E4D8C] dark:text-accent-cyan bg-blue-50/50 dark:bg-cyan-500/10'
                      : ''
                  }`}
                  aria-sort={
                    col.sortable
                      ? sortBy === col.key
                        ? sortOrder === 'desc'
                          ? 'descending'
                          : 'ascending'
                        : 'none'
                      : undefined
                  }
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="w-full flex items-center gap-1 text-left"
                    >
                      {col.label}
                      {sortBy === col.key && (
                        <span className="text-[10px]">
                          {sortOrder === 'desc' ? '▼' : '▲'}
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">{col.label}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedTeams.map((team, index) => (
              <tr
                key={team.team_id}
                className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface-soft transition-colors group"
              >
                <td className="px-4 py-4 text-sm text-gray-500 dark:text-slate-400 font-medium sticky left-0 bg-white dark:bg-dark-surface group-hover:bg-gray-50 dark:group-hover:bg-dark-surface-soft z-10">
                  {index + 1}
                </td>
                <td className="px-4 py-4 sticky left-16 bg-white dark:bg-dark-surface group-hover:bg-gray-50 dark:group-hover:bg-dark-surface-soft z-10 border-r border-gray-100 dark:border-dark-border">
                  <div className="flex items-center gap-3">
                    <img
                      src={team.team_logo || TEAM_LOGO_PLACEHOLDER_SRC}
                      alt={team.team_name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.dataset.fallbackApplied) return;
                        img.dataset.fallbackApplied = 'true';
                        img.src = TEAM_LOGO_PLACEHOLDER_SRC;
                      }}
                    />
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                      {team.team_name}
                    </span>
                  </div>
                </td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-4 text-sm text-gray-900 dark:text-slate-100 ${
                      sortBy === col.key
                        ? 'bg-blue-50/30 dark:bg-cyan-500/10 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-500/20 font-semibold'
                        : ''
                    }`}
                  >
                    {formatValue(team[col.key as keyof TeamStatistics], col.format)}
                  </td>
                ))}
              </tr>
            ))}

            {sortedTeams.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-4 py-12 text-center text-gray-500 dark:text-slate-400"
                >
                  {t('table.noClubsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
