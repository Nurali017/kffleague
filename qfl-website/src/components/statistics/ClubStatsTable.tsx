'use client';

import { useMemo, useState } from 'react';
import { ColumnDefinition, formatValue, getColumnsForSubTab } from '@/lib/mock/statisticsHelpers';
import { StatSubTab, TeamStatistics } from '@/types/statistics';
import { TableSkeleton } from './TableSkeleton';

interface ClubStatsTableProps {
    subTab: StatSubTab;
    phase: string;
    teams: TeamStatistics[];
    loading?: boolean;
}

export function ClubStatsTable({ subTab, teams, loading }: ClubStatsTableProps) {
    const [sortBy, setSortBy] = useState<string>('goals');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Get columns based on subTab
    const columns = useMemo(() => getColumnsForSubTab(subTab, 'clubs'), [subTab]);

    // Update default sort when subTab changes if current sortBy is not in new columns
    // (Simplified for now: keep existing sort if possible, or reset to first column)

    // Sort teams
    const sortedTeams = useMemo(() => {
        return [...teams].sort((a, b) => {
            const aVal = a[sortBy as keyof TeamStatistics];
            const bVal = b[sortBy as keyof TeamStatistics];

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
            }
            return 0;
        });
    }, [teams, sortBy, sortOrder]);

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
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16 sticky left-0 bg-gray-50 z-10">
                                Pos
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-16 bg-gray-50 z-10 w-64 border-r border-gray-100">
                                Club
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
                        {sortedTeams.map((team, index) => (
                            <tr
                                key={team.team_id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                            >
                                <td className="px-4 py-4 text-sm text-gray-500 font-medium sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-4 sticky left-16 bg-white group-hover:bg-gray-50 z-10 border-r border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={team.team_logo}
                                            alt={team.team_name}
                                            className="w-8 h-8 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=FC';
                                            }}
                                        />
                                        <span className="font-semibold text-gray-900">{team.team_name}</span>
                                    </div>
                                </td>
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className={`px-4 py-4 text-sm text-gray-900 ${sortBy === col.key ? 'bg-blue-50/30 group-hover:bg-blue-50/50 font-semibold' : ''
                                            }`}
                                    >
                                        {formatValue(team[col.key as keyof TeamStatistics], col.format)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {sortedTeams.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-gray-500">
                                    No clubs found for the selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
