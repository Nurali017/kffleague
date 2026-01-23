'use client';

import { useMemo, useState } from 'react';
import { formatValue, getColumnsForSubTab } from '@/lib/mock/statisticsHelpers';
import { ExtendedPlayerStat, StatSubTab } from '@/types/statistics';
import { TableSkeleton } from './TableSkeleton';

interface PlayerStatsTableProps {
    subTab: StatSubTab;
    filters: { phase: string; club: string; position: string };
    players: ExtendedPlayerStat[];
    loading?: boolean;
}

export function PlayerStatsTable({ subTab, filters, players, loading }: PlayerStatsTableProps) {
    const [sortBy, setSortBy] = useState<string>('goals');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Get columns based on subTab
    const columns = useMemo(() => getColumnsForSubTab(subTab, 'players'), [subTab]);

    // Filter players
    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            // Phase filter would go here if data supported it
            if (filters.club !== 'all' && p.team_id.toString() !== filters.club) return false;
            if (filters.position !== 'all' && p.position !== filters.position) return false;
            return true;
        });
    }, [players, filters]);

    // Sort players
    const sortedPlayers = useMemo(() => {
        return [...filteredPlayers].sort((a, b) => {
            // Handle sorting
            // Check if key exists in object
            const key = sortBy as keyof ExtendedPlayerStat;
            const aVal = a[key] ?? 0; // Default to 0 if null/undefined
            const bVal = b[key] ?? 0;

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
            }
            return 0;
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

    if (loading) return <TableSkeleton rows={10} columns={columns.length + 3} />;

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-12 sticky left-0 bg-gray-50 z-10">
                                #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-12 bg-gray-50 z-10 w-64 border-r border-gray-100">
                                Player
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Club
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Pos
                            </th>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${sortBy === col.key ? 'text-[#1E4D8C] bg-blue-50/50' : ''
                                        }`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {sortBy === col.key && (
                                            <span className="text-[10px]">{sortOrder === 'desc' ? '▼' : '▲'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((player, index) => (
                            <tr
                                key={player.player_id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                            >
                                <td className="px-4 py-4 text-sm text-gray-500 font-medium sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-2 sticky left-12 bg-white group-hover:bg-gray-50 z-10 border-r border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                            {player.photo_url ? (
                                                <img src={player.photo_url} alt={player.last_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <span className="text-xs">No Img</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm leading-tight">{player.last_name}</div>
                                            <div className="text-xs text-gray-500">{player.first_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={player.team_logo}
                                            alt={player.team_name}
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/24?text=Tm';
                                            }}
                                        />
                                        <span className="text-sm text-gray-600 hidden xl:inline">{player.team_name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xs font-bold text-gray-500">
                                    <span className="px-2 py-1 bg-gray-100 rounded">{player.position}</span>
                                </td>
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className={`px-4 py-4 text-sm text-gray-900 ${sortBy === col.key ? 'bg-blue-50/30 group-hover:bg-blue-50/50 font-bold' : ''
                                            }`}
                                    >
                                        {formatValue((player as any)[col.key], col.format)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {sortedPlayers.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + 4} className="px-4 py-12 text-center text-gray-500">
                                    No players found. Try adjusting filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
