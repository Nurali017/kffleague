'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TeamResultsGrid } from '@/types';
import { ResultIcon } from './ResultIcon';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';

interface ResultsGridProps {
  teams: TeamResultsGrid[];
  totalTours: number;
}

export function ResultsGrid({ teams, totalTours }: ResultsGridProps) {
  const { t } = useTranslation('table');

  // Generate array of tour numbers
  const tours = Array.from({ length: totalTours }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Scrollable container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          {/* Header */}
          <thead>
            <tr className="bg-[#1E4D8C]">
              <th className="sticky left-0 z-10 bg-[#1E4D8C] py-3 px-3 text-center text-xs font-medium text-white w-10">
                #
              </th>
              <th className="sticky left-10 z-10 bg-[#1E4D8C] py-3 px-4 text-left text-xs font-medium text-white min-w-[160px]">
                {t('columns.team')}
              </th>
              {tours.map((tour) => (
                <th
                  key={tour}
                  className="py-3 px-1 text-center text-xs font-medium text-white/80 w-8"
                >
                  {tour}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-50">
            {teams.map((team) => {
              const logoUrl = team.team_logo || getTeamLogo(team.team_id);
              const teamColor = getTeamColor(team.team_id);

              return (
                <tr
                  key={team.team_id}
                  className="hover:bg-[#1E4D8C]/5 transition-colors"
                >
                  {/* Position - sticky */}
                  <td className="sticky left-0 z-10 bg-white py-2.5 px-3 text-center">
                    <span className="text-sm font-bold text-gray-700">
                      {team.position}
                    </span>
                  </td>

                  {/* Team - sticky */}
                  <td className="sticky left-10 z-10 bg-white py-2.5 px-4">
                    <Link
                      href={`/team/${team.team_id}`}
                      className="flex items-center gap-2.5 group"
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={team.team_name}
                          className="w-6 h-6 object-contain shrink-0 transition-transform group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${logoUrl ? 'hidden' : ''}`}
                        style={{ backgroundColor: teamColor }}
                      >
                        {team.team_name[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-[#1E4D8C] transition-colors whitespace-nowrap">
                        {team.team_name}
                      </span>
                    </Link>
                  </td>

                  {/* Results */}
                  {tours.map((tour, index) => (
                    <td key={tour} className="py-2.5 px-1 text-center">
                      <div className="flex justify-center">
                        <ResultIcon result={team.results[index]} size="sm" />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <ResultIcon result="W" size="sm" />
          <span>{t('legend.win')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ResultIcon result="D" size="sm" />
          <span>{t('legend.draw')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ResultIcon result="L" size="sm" />
          <span>{t('legend.loss')}</span>
        </div>
      </div>
    </div>
  );
}
