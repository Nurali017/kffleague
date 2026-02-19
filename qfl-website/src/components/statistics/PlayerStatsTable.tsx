'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatValue, getColumnsForSubTab } from '@/lib/mock/statisticsHelpers';
import { ExtendedPlayerStat, StatSubTab } from '@/types/statistics';
import { PlayerStatsNationalityFilter } from '@/types';
import { TableSkeleton } from './TableSkeleton';

interface PlayerStatsTableProps {
    subTab: StatSubTab;
    filters: { club: string; position: string; nationality: PlayerStatsNationalityFilter };
    players: ExtendedPlayerStat[];
    loading?: boolean;
}

const TEAM_LOGO_PLACEHOLDER_SRC = '/images/placeholders/team.svg';

const DEFAULT_SORT_BY: Record<StatSubTab, string> = {
    key_stats: 'goals',
    goals: 'goals',
    attempts: 'shots',
    distribution: 'passes',
    attacking: 'dribble',
    defending: 'tackle',
    goalkeeping: 'save_shot',
    disciplinary: 'yellow_cards',
};

function getDefaultSortBy(subTab: StatSubTab, columns: { key: string; sortable?: boolean }[]): string {
    const preferred = DEFAULT_SORT_BY[subTab];
    if (columns.some((c) => c.key === preferred)) return preferred;
    return columns.find((c) => c.sortable)?.key || columns[0]?.key || 'goals';
}

function toFiniteNumber(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function PlayerStatsTable({ subTab, filters, players, loading }: PlayerStatsTableProps) {
    const { t } = useTranslation('statistics');

    // Get columns based on subTab
    const columns = useMemo(() => getColumnsForSubTab(subTab, 'players'), [subTab]);
    const [sortBy, setSortBy] = useState<string>(() => getDefaultSortBy(subTab, columns));
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [brokenPhotoIds, setBrokenPhotoIds] = useState<Set<string>>(new Set());

    // Ensure sort column exists in current subTab
    useEffect(() => {
        const columnKeys = new Set(columns.map((c) => c.key));
        if (!columnKeys.has(sortBy)) {
            setSortBy(getDefaultSortBy(subTab, columns));
            setSortOrder('desc');
        }
    }, [columns, sortBy, subTab]);

    // Filter players
    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            // Phase filter would go here if data supported it
            if (filters.club !== 'all' && p.team_id.toString() !== filters.club) return false;
            const pos = p.position_code ?? null;
            if (filters.position !== 'all' && pos !== filters.position) return false;
            const countryCode = p.country?.code?.toUpperCase() ?? null;
            if (filters.nationality === 'kz' && countryCode !== 'KZ') return false;
            if (filters.nationality === 'foreign' && (!countryCode || countryCode === 'KZ')) return false;
            return true;
        });
    }, [players, filters]);

    // Sort players
    const sortedPlayers = useMemo(() => {
        return [...filteredPlayers].sort((a, b) => {
            const key = sortBy as keyof ExtendedPlayerStat;
            const aNum = toFiniteNumber(a[key]);
            const bNum = toFiniteNumber(b[key]);

            // Keep null/undefined/NaN at the bottom
            if (aNum === null && bNum === null) return 0;
            if (aNum === null) return 1;
            if (bNum === null) return -1;

            return sortOrder === 'desc' ? bNum - aNum : aNum - bNum;
        });
    }, [filteredPlayers, sortBy, sortOrder]);

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('desc');
        }
    };

    const handlePhotoError = (playerId: string) => {
        setBrokenPhotoIds((prev) => {
            if (prev.has(playerId)) return prev;
            const next = new Set(prev);
            next.add(playerId);
            return next;
        });
    };

    if (loading) return <TableSkeleton rows={10} columns={columns.length + 3} />;

    return (
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] md:min-w-[800px]">
                    <thead className="bg-gray-50 dark:bg-dark-surface-soft border-b border-gray-200 dark:border-dark-border">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-12 sticky left-0 bg-gray-50 dark:bg-dark-surface-soft z-10">
                                #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider sticky left-12 bg-gray-50 dark:bg-dark-surface-soft z-10 w-64 border-r border-gray-100 dark:border-dark-border">
                                {t('table.player', { defaultValue: 'Player' })}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                {t('table.club', { defaultValue: 'Club' })}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                {t('table.pos', { defaultValue: 'Pos' })}
                            </th>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                                        col.sortable
                                            ? 'text-gray-500 dark:text-slate-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-surface-soft'
                                            : 'text-gray-500 dark:text-slate-400'
                                    } ${sortBy === col.key ? 'text-primary dark:text-accent-cyan bg-blue-50/50 dark:bg-cyan-500/10' : ''}`}
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
                                            {col.labelKey ? t(col.labelKey, { defaultValue: col.label || col.key }) : col.label}
                                            {sortBy === col.key && (
                                                <span className="text-[10px]">{sortOrder === 'desc' ? '▼' : '▲'}</span>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            {col.labelKey ? t(col.labelKey, { defaultValue: col.label || col.key }) : col.label}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((player, index) => (
                            <tr
                                key={player.player_id}
                                className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface-soft transition-colors group"
                            >
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-slate-400 font-medium sticky left-0 bg-white dark:bg-dark-surface group-hover:bg-gray-50 dark:group-hover:bg-dark-surface-soft z-10">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-2 sticky left-12 bg-white dark:bg-dark-surface group-hover:bg-gray-50 dark:group-hover:bg-dark-surface-soft z-10 border-r border-gray-100 dark:border-dark-border">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-surface-soft overflow-hidden border border-gray-200 dark:border-dark-border-soft shrink-0">
                                            {player.photo_url && !brokenPhotoIds.has(player.player_id) ? (
                                                <img
                                                    src={player.photo_url}
                                                    alt={player.last_name}
                                                    className="w-full h-full object-cover object-top"
                                                    onError={() => handlePhotoError(player.player_id)}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-slate-400">
                                                    <span className="text-xs">{t('table.noImage', { defaultValue: 'No Img' })}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <span className="font-bold text-gray-900 dark:text-slate-100 text-sm leading-tight truncate">
                                                    {player.last_name}
                                                </span>
                                                {player.country?.flag_url ? (
                                                    <img
                                                        src={player.country.flag_url}
                                                        alt={player.country?.code ? `${player.country.code.toUpperCase()} flag` : 'flag'}
                                                        className="w-4 h-3 rounded-[1px] object-cover border border-gray-200 dark:border-dark-border-soft shrink-0"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-slate-400 truncate">{player.first_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={player.team_logo || TEAM_LOGO_PLACEHOLDER_SRC}
                                            alt={player.team_name}
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => {
                                                const img = e.currentTarget;
                                                if (img.dataset.fallbackApplied) return;
                                                img.dataset.fallbackApplied = 'true';
                                                img.src = TEAM_LOGO_PLACEHOLDER_SRC;
                                            }}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-slate-300 hidden xl:inline">{player.team_name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xs font-bold text-gray-500 dark:text-slate-400">
                                    <span
                                        className="inline-flex min-w-[44px] items-center justify-center px-2 py-1 bg-gray-100 dark:bg-dark-surface-soft/60 rounded"
                                        title={player.top_role || undefined}
                                    >
                                        {player.position_code ? t(`filters.positions.${player.position_code}`) : '—'}
                                    </span>
                                </td>
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className={`px-4 py-4 text-sm text-gray-900 dark:text-slate-100 ${
                                            sortBy === col.key
                                                ? 'bg-blue-50/30 dark:bg-cyan-500/10 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-500/20 font-bold'
                                                : ''
                                        }`}
                                    >
                                        {formatValue((player as any)[col.key], col.format)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {sortedPlayers.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + 4} className="px-4 py-12 text-center text-gray-500 dark:text-slate-400">
                                    {t('table.noPlayersFound', {
                                        defaultValue: 'No players found. Try adjusting filters.',
                                    })}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
