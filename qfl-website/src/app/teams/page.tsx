'use client';

import { useTranslation } from 'react-i18next';
import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import Image from 'next/image';
import { useTeams } from '@/hooks';
import { useTournament } from '@/contexts/TournamentContext';
import { HeroBackground } from '@/components/ui/HeroBackground';
import { SeasonYearSelector } from '@/components/ui/SeasonYearSelector';

function TeamCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-4 md:p-6 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-dark-surface-soft rounded-full mb-4" />
        <div className="w-32 h-5 bg-gray-200 dark:bg-dark-surface-soft rounded mb-2" />
        <div className="w-20 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
      </div>
    </div>
  );
}

interface TeamCardProps {
  id: number;
  name: string;
  logo_url?: string;
  city?: string;
  colors?: { primary: string; secondary: string };
}

function TeamCard({ id, name, logo_url, city, colors }: TeamCardProps) {
  return (
    <Link
      href={`/team/${id}`}
      className="group relative bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Subtle accent gradient from team colors */}
      {colors && (
        <div
          className="h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
        />
      )}

      <div className="flex flex-col items-center px-3 py-5 md:px-5 md:py-6">
        {/* Team Logo */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {logo_url ? (
            <Image
              src={logo_url}
              alt={name}
              width={80}
              height={80}
              className="object-contain drop-shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 dark:bg-dark-surface-soft rounded-xl" />
          )}
        </div>

        {/* Team Name */}
        <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white text-center leading-tight group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h3>

        {/* City */}
        {city && (
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">
            {city}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function TeamsPage() {
  const { t } = useTranslation('navigation');
  const { effectiveSeasonId, tournamentSeasons } = useTournament();
  const { teams, loading, error } = useTeams(effectiveSeasonId);
  const errorMessage = error instanceof Error ? error.message : 'Failed to load teams';

  const selectedYear = tournamentSeasons.find((s) => s.seasonId === effectiveSeasonId)?.year
    ?? tournamentSeasons[0]?.year
    ?? '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Header */}
      <div className="relative">
        <HeroBackground
          className="absolute inset-x-0 top-0 h-[240px] md:h-[300px]"
          patternClassName="absolute inset-x-0 top-0 h-[240px] md:h-[300px]"
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
          {/* Title */}
          <div className="pt-6 md:pt-8 pb-20 md:pb-32">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl md:text-4xl font-bold text-white">
                {t('items.teams')}
              </h1>
              <SeasonYearSelector variant="hero" />
            </div>
            <p className="text-white/70 mt-2">
              {t('items.table')} {selectedYear}
            </p>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 -mt-12 md:-mt-16 relative z-20 pb-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <TeamCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8 text-center">
            <p className="text-red-500 font-semibold">Failed to load teams</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{errorMessage}</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8 text-center">
            <p className="text-gray-500 dark:text-slate-400">No teams found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                logo_url={team.logo_url}
                city={team.stadium?.city || team.stadium?.location}
                colors={team.colors}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
