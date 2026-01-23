'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { PlayerDetail } from '@/types/player';

interface PlayerProfileProps {
  player: PlayerDetail;
}

export function PlayerProfile({ player }: PlayerProfileProps) {
  const { t } = useTranslation('player');

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(player.date_of_birth);

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Player Photo */}
        <div className="md:col-span-1">
          <div className="relative">
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={`${player.first_name} ${player.last_name}`}
                className="w-full aspect-square object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            <div
              className={`w-full aspect-square rounded-xl bg-gradient-to-br from-[#1E4D8C] to-[#163a6b] flex items-center justify-center ${
                player.photo_url ? 'hidden' : ''
              }`}
            >
              <span className="text-6xl md:text-8xl font-bold text-white opacity-50">
                {player.first_name[0]}{player.last_name[0]}
              </span>
            </div>

            {/* Jersey Number Badge */}
            {player.jersey_number && (
              <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-[#E5B73B]">
                <span className="text-3xl font-bold text-[#1E4D8C]">
                  {player.jersey_number}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Player Info */}
        <div className="md:col-span-2">
          <div className="flex flex-col h-full justify-between">
            {/* Name and Position */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1E4D8C] mb-2">
                {player.first_name} {player.last_name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-[#E5B73B] text-white text-sm font-bold rounded-full">
                  {t(`positions.${player.position}`)}
                </span>

                {player.team_name && (
                  <div className="flex items-center gap-2">
                    {player.team_logo && (
                      <img
                        src={player.team_logo}
                        alt={player.team_name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {player.team_name}
                    </span>
                  </div>
                )}
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {age && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t('age')}</div>
                    <div className="text-lg font-bold text-gray-900">
                      {age} {t('years')}
                    </div>
                  </div>
                )}

                {player.height && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t('height')}</div>
                    <div className="text-lg font-bold text-gray-900">
                      {player.height} см
                    </div>
                  </div>
                )}

                {player.weight && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t('weight')}</div>
                    <div className="text-lg font-bold text-gray-900">
                      {player.weight} кг
                    </div>
                  </div>
                )}

                {player.nationality && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t('nationality')}</div>
                    <div className="text-lg font-bold text-gray-900">
                      {player.nationality}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Season Stats Summary */}
            {player.season_stats && (
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1E4D8C]">
                    {player.season_stats.games_played || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t('stats.games')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1E4D8C]">
                    {player.season_stats.goals || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t('stats.goals')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1E4D8C]">
                    {player.season_stats.assists || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t('stats.assists')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
