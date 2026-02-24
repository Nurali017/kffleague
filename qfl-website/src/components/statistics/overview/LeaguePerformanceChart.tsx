'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLeaguePerformance } from '@/hooks/useLeaguePerformance';
import { useTeams } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { usePreSeasonEffectiveId } from '@/contexts/TournamentContext';
import { Skeleton } from '@/components/ui/Skeleton';

const TEAM_COLORS = [
  '#1E4D8C', '#E5B73B', '#10B981', '#EF4444', '#8B5CF6',
  '#F97316', '#06B6D4', '#EC4899', '#84CC16', '#6366F1',
  '#14B8A6', '#F43F5E', '#A855F7', '#22C55E', '#3B82F6',
];

const TEAM_PLACEHOLDER = '/images/placeholders/team.svg';

export function LeaguePerformanceChart() {
  const { t } = useTranslation('statistics');
  const effectiveSeasonId = usePreSeasonEffectiveId('previous');
  const { teams: allTeams } = useTeams(effectiveSeasonId);

  // Default: show top 3 teams
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);

  const { data, loading } = useLeaguePerformance({
    seasonId: effectiveSeasonId,
  });

  // Determine which teams to show
  const displayTeamIds = useMemo(() => {
    if (selectedTeamIds.length > 0) return selectedTeamIds;
    // Default: first 3 teams from performance data (sorted by latest position)
    return data?.teams.slice(0, 3).map(t => t.team_id) ?? [];
  }, [selectedTeamIds, data]);

  const visibleTeams = useMemo(() => {
    if (!data) return [];
    return data.teams.filter(t => displayTeamIds.includes(t.team_id));
  }, [data, displayTeamIds]);

  // Build chart data: [{tour: 1, team1: pos, team2: pos, ...}, ...]
  const chartData = useMemo(() => {
    if (!data || !visibleTeams.length) return [];

    const tours: Array<Record<string, number>> = [];
    for (let i = 0; i < data.max_tour; i++) {
      const point: Record<string, number> = { tour: i + 1 };
      for (const team of visibleTeams) {
        if (i < team.positions.length) {
          point[`team_${team.team_id}`] = team.positions[i];
        }
      }
      tours.push(point);
    }
    return tours;
  }, [data, visibleTeams]);

  const teamColorMap = useMemo(() => {
    const map: Record<number, string> = {};
    visibleTeams.forEach((t, i) => {
      map[t.team_id] = TEAM_COLORS[i % TEAM_COLORS.length];
    });
    return map;
  }, [visibleTeams]);

  const toggleTeam = (teamId: number) => {
    setSelectedTeamIds(prev => {
      const base = prev.length > 0 ? prev : displayTeamIds;
      if (base.includes(teamId)) {
        const next = base.filter(id => id !== teamId);
        return next.length === 0 ? [] : next;
      }
      return [...base, teamId];
    });
  };

  const handleReset = () => setSelectedTeamIds([]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border p-6">
        <Skeleton className="h-6 w-64 mb-6" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!data || data.max_tour === 0) return null;
  const totalTeams = data.teams.length;
  const selectableTeams = data.teams.length > 0
    ? data.teams
    : allTeams.map((team) => ({
      team_id: team.id,
      team_name: team.name,
      team_logo: team.logo_url,
      positions: [],
    }));

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm">
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-slate-100 mb-4 uppercase tracking-wide">
          {t('overview.leaguePerformance', { defaultValue: 'Динамика в турнирной таблице' })}
        </h3>

        {/* Team selector */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">
            {t('overview.teams', { defaultValue: 'Команды' })}:
          </div>
          <div className="relative">
            <div
              data-testid="league-team-selector-scroller"
              className="flex md:flex-wrap gap-1.5 overflow-x-auto md:overflow-visible no-scrollbar"
            >
              {selectableTeams.map((team) => {
                const isActive = displayTeamIds.includes(team.team_id);
                return (
                  <button
                    key={team.team_id}
                    type="button"
                    onClick={() => toggleTeam(team.team_id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      isActive
                        ? 'bg-primary/10 dark:bg-accent-cyan/10 border-primary/30 dark:border-accent-cyan/30 text-primary dark:text-accent-cyan'
                        : 'bg-gray-50 dark:bg-dark-surface-soft border-gray-200 dark:border-dark-border text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-dark-border'
                    }`}
                  >
                    {team.team_logo && (
                      <img
                        src={team.team_logo}
                        alt=""
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = TEAM_PLACEHOLDER;
                        }}
                      />
                    )}
                    <span className="truncate max-w-[110px]">{team.team_name}</span>
                  </button>
                );
              })}
            </div>
            <div className="md:hidden pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-dark-surface to-transparent" />
            <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-dark-surface to-transparent" />
          </div>

          {selectedTeamIds.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors mt-2 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('overview.reset', { defaultValue: 'Сброс' })}
            </button>
          )}
        </div>

        {/* Legend */}
        <div data-testid="league-legend-scroller" className="flex md:flex-wrap gap-3 mb-4 overflow-x-auto md:overflow-visible no-scrollbar">
          {visibleTeams.map((team) => (
            <div key={team.team_id} className="flex items-center gap-1.5 shrink-0">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: teamColorMap[team.team_id] }}
              />
              <span className="text-xs text-gray-600 dark:text-slate-400 truncate max-w-[140px]">
                {team.team_name}
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div data-testid="league-chart-scroll-hint" className="md:hidden mb-2 text-[11px] text-gray-500 dark:text-slate-400">
          {t('overview.chartScrollHint', { defaultValue: 'Проведите влево, чтобы просмотреть график целиком.' })}
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div className="h-[300px] md:h-[380px] min-w-[620px] md:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
                <XAxis
                  dataKey="tour"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={false}
                  label={{ value: t('overview.matchweek', { defaultValue: 'Тур' }), position: 'insideBottom', offset: -5, fontSize: 11, fill: '#9CA3AF' }}
                />
                <YAxis
                  reversed
                  domain={[1, totalTeams || 'auto']}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={false}
                  allowDecimals={false}
                  label={{
                    value: t('overview.leaguePosition', { defaultValue: 'Позиция' }),
                    angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#9CA3AF',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  labelFormatter={(label) => `${t('overview.matchweek', { defaultValue: 'Тур' })} ${label}`}
                  formatter={(value, name) => {
                    const teamId = parseInt(String(name).replace('team_', ''));
                    const team = visibleTeams.find((teamItem) => teamItem.team_id === teamId);
                    return [String(value ?? ''), team?.team_name ?? String(name)];
                  }}
                />
                {visibleTeams.map((team) => (
                  <Line
                    key={team.team_id}
                    type="monotone"
                    dataKey={`team_${team.team_id}`}
                    stroke={teamColorMap[team.team_id]}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: teamColorMap[team.team_id] }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
