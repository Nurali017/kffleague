'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { PlayerMatchPerformance } from '@/types/player';
import { formatMatchDate } from '@/lib/utils/dateFormat';

interface PlayerMatchHistoryProps {
  matches: PlayerMatchPerformance[];
  loading?: boolean;
}

function MatchHistorySkeleton() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-lg mb-2" />
      ))}
    </div>
  );
}

export function PlayerMatchHistory({ matches, loading }: PlayerMatchHistoryProps) {
  const { t, i18n } = useTranslation('player');

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#1E4D8C] mb-4">
          {t('matchHistory')}
        </h3>
        <MatchHistorySkeleton />
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#1E4D8C] mb-4">
          {t('matchHistory')}
        </h3>
        <p className="text-gray-500 text-center py-8">{t('noMatches')}</p>
      </div>
    );
  }

  const getResultBadge = (result?: 'W' | 'D' | 'L') => {
    switch (result) {
      case 'W':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">П</span>;
      case 'D':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">Н</span>;
      case 'L':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">П</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-[#1E4D8C] mb-4">
        {t('matchHistory')}
      </h3>

      {/* Mobile View */}
      <div className="block md:hidden space-y-3">
        {matches.map((match) => {
          const opponent = match.player_team === 'home' ? match.away_team : match.home_team;
          const score = match.home_score !== undefined && match.away_score !== undefined
            ? `${match.home_score}:${match.away_score}`
            : '—';

          return (
            <Link
              key={match.match_id}
              href={`/matches/${match.match_id}`}
              className="block p-4 border border-gray-100 rounded-lg hover:border-[#1E4D8C] hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500">
                  {formatMatchDate(match.date, i18n.language)}
                </div>
                {getResultBadge(match.result)}
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">
                  {opponent.name}
                </div>
                <div className="text-sm font-bold text-[#1E4D8C]">
                  {score}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>{match.minutes_played} мин</span>
                {match.goals > 0 && <span className="text-green-600">⚽ {match.goals}</span>}
                {match.assists > 0 && <span className="text-blue-600">🎯 {match.assists}</span>}
                {match.yellow_card && <span>🟨</span>}
                {match.red_card && <span>🟥</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2 text-xs font-bold text-gray-600 uppercase">
                {t('matchHistoryTable.date')}
              </th>
              <th className="text-left py-3 px-2 text-xs font-bold text-gray-600 uppercase">
                {t('matchHistoryTable.opponent')}
              </th>
              <th className="text-center py-3 px-2 text-xs font-bold text-gray-600 uppercase">
                {t('matchHistoryTable.result')}
              </th>
              <th className="text-center py-3 px-2 text-xs font-bold text-gray-600 uppercase">
                {t('matchHistoryTable.minutes')}
              </th>
              <th className="text-center py-3 px-2 text-xs font-bold text-gray-600 uppercase">
                {t('matchHistoryTable.goals')}
              </th>
              <th className="text-center py-3 px-2 text-xs font-bold text-gray-600 uppercase">
                {t('matchHistoryTable.assists')}
              </th>
              <th className="text-center py-3 px-2 text-xs font-bold text-gray-600 uppercase">
                {t('matchHistoryTable.cards')}
              </th>
              {matches.some(m => m.rating !== undefined) && (
                <th className="text-center py-3 px-2 text-xs font-bold text-gray-600 uppercase">
                  {t('matchHistoryTable.rating')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const opponent = match.player_team === 'home' ? match.away_team : match.home_team;
              const score = match.home_score !== undefined && match.away_score !== undefined
                ? `${match.home_score}:${match.away_score}`
                : '—';

              return (
                <tr
                  key={match.match_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-2">
                    <Link
                      href={`/matches/${match.match_id}`}
                      className="text-sm text-gray-600 hover:text-[#1E4D8C]"
                    >
                      {formatMatchDate(match.date, i18n.language)}
                    </Link>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {opponent.logo_url && (
                        <img
                          src={opponent.logo_url}
                          alt={opponent.name}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <Link
                        href={`/matches/${match.match_id}`}
                        className="text-sm font-medium text-gray-900 hover:text-[#1E4D8C]"
                      >
                        {opponent.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getResultBadge(match.result)}
                      <span className="text-sm text-gray-600">{score}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-sm text-gray-700">
                    {match.minutes_played}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`text-sm font-medium ${match.goals > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {match.goals}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`text-sm font-medium ${match.assists > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                      {match.assists}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {match.yellow_card && <span className="text-lg">🟨</span>}
                      {match.red_card && <span className="text-lg">🟥</span>}
                      {!match.yellow_card && !match.red_card && <span className="text-gray-400">—</span>}
                    </div>
                  </td>
                  {matches.some(m => m.rating !== undefined) && (
                    <td className="py-3 px-2 text-center">
                      {match.rating !== undefined ? (
                        <span className="text-sm font-bold text-[#1E4D8C]">
                          {match.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
