'use client';

import Link from 'next/link';
import { Globe, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TeamOverviewFormEntry, TeamOverviewSummary, TeamOverviewTeam } from '@/types/team';
import { HeroBackground } from '@/components/ui/HeroBackground';

interface TeamPageHeroProps {
  team: TeamOverviewTeam;
  summary: TeamOverviewSummary;
  seasonName?: string | null;
  tournamentName?: string | null;
  formLast5?: TeamOverviewFormEntry[];
  leaguePosition?: number | null;
}

function FormDot({ result }: { result: 'W' | 'D' | 'L' }) {
  const bg =
    result === 'W' ? 'bg-emerald-400' :
    result === 'D' ? 'bg-amber-400' :
    'bg-rose-400';
  return <span className={`inline-block h-2 w-2 rounded-full ${bg}`} title={result} />;
}

export function TeamPageHero({
  team,
  summary,
  seasonName,
  tournamentName,
  formLast5,
  leaguePosition,
}: TeamPageHeroProps) {
  const { i18n, t } = useTranslation('team');

  const accent = team.accent_color || '#E5B73B';
  const metaLabel = [tournamentName, seasonName].filter(Boolean).join(' · ');
  const hasStats = summary.games_played > 0;
  const gdSign = summary.goal_difference > 0 ? '+' : '';

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-8 md:pb-12 text-white">
      <HeroBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_55%)]" />
      <div
        className="absolute right-[-120px] top-[-120px] h-[380px] w-[380px] rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: accent }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-5 md:px-8 md:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6">
            <div className="h-24 w-24 md:h-36 md:w-36 shrink-0">
              {team.logo_url ? (
                <img src={team.logo_url} alt={team.name} className="h-full w-full object-contain drop-shadow-lg" />
              ) : (
                <div className="h-full w-full rounded-xl bg-white/10" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              {metaLabel ? (
                <div className="text-[11px] md:text-xs uppercase tracking-wider font-semibold text-white/60">{metaLabel}</div>
              ) : null}
              <h1 className="mt-1 text-2xl md:text-5xl font-black leading-tight">{team.name}</h1>

              {/* Subtle meta line */}
              {(team.stadium?.name || team.website) && (
                <p className="mt-2 text-xs text-white/50 flex items-center gap-1.5 flex-wrap">
                  {team.stadium?.name && (
                    <>
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{team.stadium.name}</span>
                    </>
                  )}
                  {team.stadium?.name && team.website && <span className="text-white/30">&middot;</span>}
                  {team.website && (
                    <Link
                      href={team.website.startsWith('http') ? team.website : `https://${team.website}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 hover:text-white/70 transition-colors"
                    >
                      <Globe className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[200px]">{team.website.replace(/^https?:\/\//, '')}</span>
                    </Link>
                  )}
                </p>
              )}

              {/* Stats strip */}
              {hasStats && (
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  {leaguePosition != null && (
                    <span className="inline-flex items-center rounded-md bg-white/15 px-2 py-0.5 text-xs font-black tabular-nums">
                      #{leaguePosition}
                    </span>
                  )}
                  <span className="font-bold tabular-nums">{summary.points} {t('hero.pts', 'очк.')}</span>
                  <span className="text-white/30">&middot;</span>
                  <span className="text-white/80 tabular-nums">
                    <span className="font-semibold">{summary.wins}</span>
                    <span className="text-emerald-300 text-[10px] ml-0.5 font-bold uppercase">W</span>
                    {' '}
                    <span className="font-semibold">{summary.draws}</span>
                    <span className="text-amber-300 text-[10px] ml-0.5 font-bold uppercase">D</span>
                    {' '}
                    <span className="font-semibold">{summary.losses}</span>
                    <span className="text-rose-300 text-[10px] ml-0.5 font-bold uppercase">L</span>
                  </span>
                  <span className="text-white/30">&middot;</span>
                  <span className="text-white/80 tabular-nums font-semibold">GD {gdSign}{summary.goal_difference}</span>

                  {/* Form dots */}
                  {formLast5 && formLast5.length > 0 && (
                    <>
                      <span className="text-white/30">&middot;</span>
                      <span className="inline-flex items-center gap-1">
                        {formLast5.map((entry) => (
                          <FormDot key={entry.game_id} result={entry.result} />
                        ))}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
