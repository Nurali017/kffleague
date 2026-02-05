'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  TeamOverviewCoachPreview,
  TeamOverviewFormEntry,
  TeamOverviewLeaders,
  TeamOverviewMatch,
  TeamOverviewStandingEntry,
} from '@/types/team';
import { formatMatchDate } from '@/lib/utils/dateFormat';
import { EmptyState, SectionCard, SectionHeader } from './TeamUiPrimitives';
import { TeamPlayerStats } from './TeamPlayerStats';

interface TeamOverviewSectionProps {
  recentMatch: TeamOverviewMatch | null;
  formLast5: TeamOverviewFormEntry[];
  upcomingMatches: TeamOverviewMatch[];
  standingsWindow: TeamOverviewStandingEntry[];
  leaders: TeamOverviewLeaders;
  staffPreview: TeamOverviewCoachPreview[];
}

function MatchScore({ home, away }: { home: number | null; away: number | null }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[#1E4D8C]/10 dark:bg-cyan-300/20 text-[#1E4D8C] dark:text-cyan-300 border border-[#1E4D8C]/20 dark:border-cyan-300/30 px-3 py-1 font-black text-base">
      <span>{home ?? '-'}</span>
      <span className="text-[#1E4D8C]/60 dark:text-cyan-300/75">:</span>
      <span>{away ?? '-'}</span>
    </div>
  );
}

function LastMatchCard({ match }: { match: TeamOverviewMatch | null }) {
  const { t, i18n } = useTranslation('team');

  if (!match) {
    return (
      <EmptyState
        description={t('empty.noRecentMatches', 'Нет сыгранных матчей')}
        className="h-full"
      />
    );
  }

  return (
    <SectionCard className="p-4 md:p-5">
      <SectionHeader title={t('sections.recentMatch', 'Последний матч')} />
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {match.home_team.logo_url ? (
            <img src={match.home_team.logo_url} alt={match.home_team.name} className="w-10 h-10 object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/15" />
          )}
          <span className="truncate text-sm font-bold text-slate-900 dark:text-white">{match.home_team.name}</span>
        </div>

        <MatchScore home={match.home_score} away={match.away_score} />

        <div className="flex items-center justify-end gap-2.5 min-w-0 flex-1">
          <span className="truncate text-sm font-bold text-slate-900 dark:text-white text-right">{match.away_team.name}</span>
          {match.away_team.logo_url ? (
            <img src={match.away_team.logo_url} alt={match.away_team.name} className="w-10 h-10 object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/15" />
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-white/60">
        <span>{formatMatchDate(match.date, i18n.language)}</span>
        <Link href={`/matches/${match.id}`} className="font-bold text-[#1E4D8C] dark:text-cyan-300 hover:text-[#163A6B] dark:hover:text-cyan-200">
          {t('buttons.matchCentre', 'Матч-центр')}
        </Link>
      </div>
    </SectionCard>
  );
}

function FormCard({ items }: { items: TeamOverviewFormEntry[] }) {
  const { t } = useTranslation('team');

  return (
    <SectionCard className="p-4 md:p-5">
      <SectionHeader title={t('sections.teamForm', 'Форма команды')} />
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-white/60">{t('empty.noRecentMatches', 'Нет сыгранных матчей')}</p>
      ) : (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {items.map((item) => (
            <div key={item.game_id} className="rounded-lg border border-gray-200 dark:border-white/10 p-2 text-center bg-gray-50 dark:bg-white/5">
              {item.opponent_logo ? (
                <img src={item.opponent_logo} alt={item.opponent_name} className="w-7 h-7 object-contain mx-auto" />
              ) : (
                <div className="w-7 h-7 mx-auto rounded-full bg-gray-300 dark:bg-white/20" />
              )}
              <div className="mt-1 text-[11px] font-bold text-slate-900 dark:text-white">
                {item.team_score}:{item.opponent_score}
              </div>
              <div className="mt-0.5 text-[10px] font-semibold text-slate-500 dark:text-white/60">{item.result}</div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function StandingsCard({ rows }: { rows: TeamOverviewStandingEntry[] }) {
  const { t } = useTranslation('table');

  if (!rows.length) {
    return (
      <EmptyState
        description={t('empty.noData', 'Таблица недоступна')}
      />
    );
  }

  return (
    <SectionCard className="overflow-hidden">
      <div className="p-4 md:p-5 border-b border-gray-200 dark:border-white/10">
        <SectionHeader
          title={t('title', 'Турнирная таблица')}
          action={
            <Link href="/table" className="text-xs font-bold text-[#1E4D8C] dark:text-cyan-300 hover:text-[#163A6B] dark:hover:text-cyan-200">
              {t('actions.fullTable', 'Полная таблица')}
            </Link>
          }
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="text-xs text-slate-500 dark:text-white/70 border-b border-gray-200 dark:border-white/10">
              <th className="text-left py-2 px-4 font-semibold">#</th>
              <th className="text-left py-2 font-semibold">{t('columns.team', 'Команда')}</th>
              <th className="text-center py-2 font-semibold">И</th>
              <th className="text-center py-2 font-semibold">РМ</th>
              <th className="text-right py-2 px-4 font-semibold">О</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.team_id} className="border-b border-gray-100 dark:border-white/10 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                <td className="py-2.5 px-4 font-bold text-slate-400 dark:text-white/50">{row.position}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2.5">
                    {row.team_logo ? (
                      <img src={row.team_logo} alt="" className="w-5 h-5 object-contain" />
                    ) : null}
                    <span className="font-semibold text-slate-900 dark:text-white">{row.team_name}</span>
                  </div>
                </td>
                <td className="py-2.5 text-center text-slate-600 dark:text-white/80">{row.games_played}</td>
                <td className="py-2.5 text-center text-slate-600 dark:text-white/80">
                  {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                </td>
                <td className="py-2.5 px-4 text-right font-black text-slate-900 dark:text-white">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function FixturesRail({ matches }: { matches: TeamOverviewMatch[] }) {
  const { t } = useTranslation('team');

  return (
    <SectionCard className="p-4 md:p-5">
      <SectionHeader title={t('sections.fixtures', 'Предстоящие матчи')} />
      {matches.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-white/60">{t('empty.noUpcomingMatches', 'Нет предстоящих матчей')}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="block rounded-xl border border-gray-200 dark:border-white/10 p-3 hover:border-gray-300 dark:hover:border-white/25 transition-colors"
            >
              <div className="text-[11px] text-slate-500 dark:text-white/60">
                {match.tour ? t('matches_sections.tour', { number: match.tour }) : '—'}
              </div>
              <div className="mt-1 flex items-center justify-between gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <span className="truncate">{match.home_team.name}</span>
                <span className="text-xs text-slate-400 dark:text-white/50">{match.time?.slice(0, 5) || 'TBD'}</span>
                <span className="truncate text-right">{match.away_team.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2">
        <Link
          href="/matches"
          className="inline-flex items-center justify-center gap-1 rounded-full bg-[#1E4D8C]/10 dark:bg-cyan-300/20 text-[#1E4D8C] dark:text-cyan-300 border border-[#1E4D8C]/20 dark:border-cyan-300/30 px-4 py-2 text-sm font-bold hover:bg-[#1E4D8C]/15 dark:hover:bg-cyan-300/30 transition-colors"
        >
          {t('buttons.viewAllFixtures', 'Все матчи')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/stats"
          className="inline-flex items-center justify-center gap-1 rounded-full border border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/10 px-4 py-2 text-sm font-bold text-slate-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
        >
          {t('buttons.seeAllStats', 'Вся статистика')}
        </Link>
      </div>
    </SectionCard>
  );
}

function StaffPreview({ coaches }: { coaches: TeamOverviewCoachPreview[] }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';

  return (
    <SectionCard className="p-4 md:p-5">
      <SectionHeader
        title={lang === 'kz' ? 'Жаттықтырушылар штабы' : 'Тренерский штаб'}
        action={
          <Link href="?tab=staff" className="text-xs font-bold text-[#1E4D8C] dark:text-cyan-300 hover:text-[#163A6B] dark:hover:text-cyan-200">
            {lang === 'kz' ? 'Толығырақ' : 'Подробнее'}
          </Link>
        }
      />
      {coaches.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-white/60">
          {lang === 'kz' ? 'Деректер жоқ' : 'Данные отсутствуют'}
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {coaches.map((coach) => (
            <div key={coach.id} className="flex items-center gap-3">
              {coach.photo_url ? (
                <img src={coach.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/15" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {coach.first_name} {coach.last_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/60 truncate">
                  {coach.country_name || coach.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export function TeamOverviewSection({
  recentMatch,
  formLast5,
  upcomingMatches,
  standingsWindow,
  leaders,
  staffPreview,
}: TeamOverviewSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LastMatchCard match={recentMatch} />
          <FormCard items={formLast5} />
        </div>

        <StandingsCard rows={standingsWindow} />
        <TeamPlayerStats leaders={leaders} />
      </div>

      <div className="space-y-4">
        <FixturesRail matches={upcomingMatches} />
        <StaffPreview coaches={staffPreview} />
      </div>
    </div>
  );
}
