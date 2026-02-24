'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { formatValue, getColumnsForSubTab } from '@/lib/mock/statisticsHelpers';
import { ExtendedPlayerStat, StatSubTab } from '@/types/statistics';
import { PlayerStatsNationalityFilter } from '@/types';
import { getPlayerHref, getTeamHref } from '@/lib/utils/entityRoutes';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { navigatePrimary, shouldSkipPrimaryNavigation } from '@/lib/utils/interactiveNavigation';
import { TableSkeleton } from './TableSkeleton';

interface PlayerStatsTableProps {
    subTab: StatSubTab;
    filters: { club: string; nationality: PlayerStatsNationalityFilter };
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

function toCompactPlayerName(firstName?: string | null, lastName?: string | null): string {
    const first = (firstName || '').trim();
    const last = (lastName || '').trim();

    if (last && first) return `${last} ${first[0].toUpperCase()}.`;
    if (last) return last;
    if (first) return first;
    return '—';
}

export function PlayerStatsTable({ subTab, filters, players, loading }: PlayerStatsTableProps) {
  const { t } = useTranslation('statistics');
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);
    const [hasInteractedWithXScroll, setHasInteractedWithXScroll] = useState(false);

    // Get columns based on subTab
    const columns = useMemo(() => getColumnsForSubTab(subTab, 'players'), [subTab]);
    const [sortBy, setSortBy] = useState<string>(() => getDefaultSortBy(subTab, columns));
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const updateOverflow = () => {
            const overflow = container.scrollWidth > container.clientWidth + 1;
            setHasHorizontalOverflow(overflow);
            if (!overflow) {
                setHasInteractedWithXScroll(false);
            }
        };

        const handleScroll = () => {
            if (container.scrollLeft > 8) {
                setHasInteractedWithXScroll(true);
            }
        };

        updateOverflow();
        container.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateOverflow);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateOverflow);
        };
    }, [players.length, columns.length]);

    if (loading) return <TableSkeleton rows={10} columns={columns.length + 3} />;

    const showMobileScrollHint = hasHorizontalOverflow && !hasInteractedWithXScroll;

    return (
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm">
            {showMobileScrollHint && (
                <div
                    data-testid="player-stats-scroll-hint"
                    className="md:hidden px-3 py-2 text-[11px] text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-dark-border"
                >
                    {t('table.scrollHint', { defaultValue: 'Проведите влево, чтобы увидеть все столбцы.' })}
                </div>
            )}
            <div ref={scrollContainerRef} data-testid="player-stats-scroll-container" className="relative overflow-x-auto no-scrollbar">
                {showMobileScrollHint && (
                    <div className="md:hidden pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-dark-surface to-transparent z-20" />
                )}
                {showMobileScrollHint && (
                    <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-dark-surface to-transparent z-20" />
                )}
                <table className="w-full min-w-[680px] md:min-w-[800px]">
                    <thead className="bg-gray-50 dark:bg-dark-surface-soft border-b border-gray-200 dark:border-dark-border">
                        <tr>
                            <th className="px-2.5 md:px-4 py-2.5 md:py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-10 md:w-12 sticky left-0 bg-gray-50 dark:bg-dark-surface-soft z-10">
                                #
                            </th>
                            <th className="px-2.5 md:px-4 py-2.5 md:py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider sticky left-10 md:left-12 bg-gray-50 dark:bg-dark-surface-soft z-10 w-[180px] md:w-64 border-r border-gray-100 dark:border-dark-border">
                                {t('table.player', { defaultValue: 'Player' })}
                            </th>
                            <th className="px-2.5 md:px-4 py-2.5 md:py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                {t('table.club', { defaultValue: 'Club' })}
                            </th>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`px-2.5 md:px-4 py-2.5 md:py-3 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
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
                        {sortedPlayers.map((player, index) => {
                            const playerHref = getPlayerHref(player.player_id);

                            return (
                            <tr
                                key={player.player_id}
                                className={`border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface-soft transition-colors group ${
                                    playerHref ? 'cursor-pointer' : ''
                                }`}
                                role={playerHref ? 'link' : undefined}
                                tabIndex={playerHref ? 0 : undefined}
                                onClick={(event) => {
                                    if (!playerHref) return;
                                    if (shouldSkipPrimaryNavigation(event)) return;
                                    navigatePrimary(router, playerHref, searchParams);
                                }}
                                onKeyDown={(event) => {
                                    if (!playerHref) return;
                                    if (event.key !== 'Enter' && event.key !== ' ') return;
                                    if (shouldSkipPrimaryNavigation(event)) return;
                                    event.preventDefault();
                                    navigatePrimary(router, playerHref, searchParams);
                                }}
                            >
                                <td className="px-2.5 md:px-4 py-3 md:py-4 text-sm text-gray-500 dark:text-slate-400 font-medium sticky left-0 bg-white dark:bg-dark-surface group-hover:bg-gray-50 dark:group-hover:bg-dark-surface-soft z-10">
                                    {index + 1}
                                </td>
                                <td className="px-2.5 md:px-4 py-2 sticky left-10 md:left-12 bg-white dark:bg-dark-surface group-hover:bg-gray-50 dark:group-hover:bg-dark-surface-soft z-10 border-r border-gray-100 dark:border-dark-border">
                                    {(() => {
                                        const content = (
                                            <div className="flex items-center gap-2.5 md:gap-3">
                                                <PlayerAvatar
                                                    photoUrl={player.photo_url}
                                                    firstName={player.first_name}
                                                    lastName={player.last_name}
                                                    size="sm"
                                                    className="md:w-10 md:h-10"
                                                />
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <span className="font-bold text-gray-900 dark:text-slate-100 text-sm leading-tight truncate max-w-[112px] md:max-w-none">
                                                            {toCompactPlayerName(player.first_name, player.last_name)}
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
                                                </div>
                                            </div>
                                        );

                                        if (!playerHref) return content;

                                        return (
                                            <Link
                                                href={playerHref}
                                                className="block rounded-md transition-colors hover:bg-blue-50/40 dark:hover:bg-cyan-500/10"
                                            >
                                                {content}
                                            </Link>
                                        );
                                    })()}
                                </td>
                                <td className="px-2.5 md:px-4 py-3 md:py-4">
                                    {(() => {
                                        const teamHref = getTeamHref(player.team_id);
                                        const logo = (
                                            <img
                                                src={player.team_logo || TEAM_LOGO_PLACEHOLDER_SRC}
                                                alt={player.team_name}
                                                className="w-5 h-5 md:w-6 md:h-6 object-contain shrink-0"
                                                onError={(e) => {
                                                    const img = e.currentTarget;
                                                    if (img.dataset.fallbackApplied) return;
                                                    img.dataset.fallbackApplied = 'true';
                                                    img.src = TEAM_LOGO_PLACEHOLDER_SRC;
                                                }}
                                            />
                                        );

                                        if (!teamHref) return logo;

                                        return (
                                            <Link
                                                href={teamHref}
                                                aria-label={player.team_name}
                                                className="inline-flex items-center justify-center rounded-md transition-colors hover:bg-blue-50/40 dark:hover:bg-cyan-500/10 p-0.5"
                                            >
                                                {logo}
                                            </Link>
                                        );
                                    })()}
                                </td>
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className={`px-2.5 md:px-4 py-3 md:py-4 text-sm text-gray-900 dark:text-slate-100 ${
                                            sortBy === col.key
                                                ? 'bg-blue-50/30 dark:bg-cyan-500/10 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-500/20 font-bold'
                                                : ''
                                        }`}
                                    >
                                        {formatValue((player as any)[col.key], col.format)}
                                    </td>
                                ))}
                            </tr>
                        )})}
                        {sortedPlayers.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + 3} className="px-4 py-12 text-center text-gray-500 dark:text-slate-400">
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
