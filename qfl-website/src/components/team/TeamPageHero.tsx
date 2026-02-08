'use client';

import Link from 'next/link';
import { Globe, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TeamOverviewSummary, TeamOverviewTeam } from '@/types/team';
import { HeroBackground } from '@/components/ui/HeroBackground';

interface TeamPageHeroProps {
  team: TeamOverviewTeam;
  summary: TeamOverviewSummary;
  seasonName?: string | null;
  tournamentName?: string | null;
}

export function TeamPageHero({ team, summary, seasonName, tournamentName }: TeamPageHeroProps) {
  const { i18n, t } = useTranslation('team');
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';

  const accent = team.accent_color || '#E5B73B';
  const metaLabel = [tournamentName, seasonName].filter(Boolean).join(' · ');

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-8 md:pb-12 text-white">
      <HeroBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_55%)]" />
      <div
        className="absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accent }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="px-4 py-5 md:px-8 md:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6">
            <div className="h-24 w-24 md:h-32 md:w-32 shrink-0">
              {team.logo_url ? (
                <img src={team.logo_url} alt={team.name} className="h-full w-full object-contain drop-shadow-lg" />
              ) : (
                <div className="h-full w-full rounded-xl bg-white/10" />
              )}
            </div>

            <div className="min-w-0">
              {metaLabel ? (
                <div className="text-[11px] md:text-xs uppercase tracking-wider font-semibold text-white/60">{metaLabel}</div>
              ) : null}
              <h1 className="mt-1 text-2xl md:text-5xl font-black leading-tight">{team.name}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {team.stadium?.name ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{team.stadium.name}</span>
                  </div>
                ) : null}

                {team.website ? (
                  <Link
                    href={team.website.startsWith('http') ? team.website : `https://${team.website}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/15 transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span className="max-w-[170px] md:max-w-[220px] truncate">{team.website.replace(/^https?:\/\//, '')}</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
