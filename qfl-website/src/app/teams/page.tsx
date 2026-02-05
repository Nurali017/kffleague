'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { useTeams } from '@/hooks';
import { useTournament } from '@/contexts/TournamentContext';
import { HeroBackground } from '@/components/ui/HeroBackground';

function TeamCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-6 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 dark:bg-dark-surface-soft rounded-full mb-4" />
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
      className="group bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-6 hover:shadow-lg hover:border-[#1E4D8C] dark:hover:border-accent-cyan transition-all duration-300"
    >
      <div className="flex flex-col items-center">
        {/* Team Logo */}
        <div
          className="relative w-24 h-24 mb-4 rounded-full overflow-hidden bg-gray-50 dark:bg-dark-surface flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          style={colors ? {
            boxShadow: `0 0 0 3px ${colors.primary}40`
          } : undefined}
        >
          {logo_url ? (
            <Image
              src={logo_url}
              alt={name}
              width={80}
              height={80}
              className="object-contain"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 dark:bg-dark-surface-soft rounded-full" />
          )}
        </div>

        {/* Team Name */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center group-hover:text-[#1E4D8C] dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h3>

        {/* City */}
        {city && (
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {city}
          </p>
        )}

        {/* Color indicator */}
        {colors && (
          <div className="flex gap-1 mt-3">
            <div
              className="w-4 h-4 rounded-full border border-gray-200 dark:border-dark-border-soft"
              style={{ backgroundColor: colors.primary }}
            />
            <div
              className="w-4 h-4 rounded-full border border-gray-200 dark:border-dark-border-soft"
              style={{ backgroundColor: colors.secondary }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}

export default function TeamsPage() {
  const { t } = useTranslation('navigation');
  const { effectiveSeasonId } = useTournament();
  const { teams, loading, error } = useTeams(effectiveSeasonId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Header */}
      <div className="relative">
        <HeroBackground
          className="absolute inset-x-0 top-0 h-[300px]"
          patternClassName="absolute inset-x-0 top-0 h-[300px]"
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4">
          {/* Title */}
          <div className="pt-8 pb-24 md:pb-32">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {t('items.teams')}
            </h1>
            <p className="text-white/70 mt-2">
              {t('items.table')} 2024/25
            </p>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="max-w-[1400px] mx-auto px-4 -mt-16 relative z-20 pb-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <TeamCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8 text-center">
            <p className="text-red-500">Failed to load teams</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8 text-center">
            <p className="text-gray-500 dark:text-slate-400">No teams found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
