'use client';

import { useTranslation } from 'react-i18next';
import { useTeamCoaches } from '@/hooks/useTeam';
import { usePageSeason } from '@/contexts/PageSeasonContext';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { SectionCard, SectionHeader } from './TeamUiPrimitives';

interface TeamCoachingStaffProps {
  teamId: number;
}

const ROLE_LABELS: Record<string, Record<string, string>> = {
  head_coach: { kz: 'Бас бапкер', ru: 'Главный тренер' },
  assistant: { kz: 'Көмекші бапкер', ru: 'Помощник тренера' },
  goalkeeper_coach: { kz: 'Қақпашылар бапкері', ru: 'Тренер вратарей' },
  fitness_coach: { kz: 'Дене дайындық бапкері', ru: 'Тренер по физподготовке' },
  other: { kz: 'Басқа', ru: 'Другое' },
};

function CoachCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-surface animate-pulse">
      <div className="h-28 bg-gray-100 dark:bg-white/5" />
      <div className="pt-6 pb-4 px-3 space-y-2 flex flex-col items-center">
        <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded" />
      </div>
    </div>
  );
}

export function TeamCoachingStaff({ teamId }: TeamCoachingStaffProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';
  const effectiveSeasonId = usePageSeason();
  const { coaches, loading } = useTeamCoaches(teamId, effectiveSeasonId);

  const sectionTitle = lang === 'kz' ? 'Жаттықтырушылар штабы' : 'Тренерский штаб';

  if (loading) {
    return (
      <SectionCard className="p-5 md:p-6">
        <SectionHeader title={sectionTitle} />
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CoachCardSkeleton key={i} />
          ))}
        </div>
      </SectionCard>
    );
  }

  if (!coaches.length) return null;

  return (
    <SectionCard className="p-5 md:p-6">
      <SectionHeader title={sectionTitle} />

      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-surface shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 transition-all"
          >
            {/* Photo area with gradient */}
            <div className="h-28 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-[#0d1b36] dark:to-[#0a1424] flex items-end justify-center relative">
              <div className="mb-[-16px] relative z-10">
                <PlayerAvatar
                  photoUrl={coach.photo_url}
                  firstName={coach.first_name}
                  lastName={coach.last_name}
                  size="xl"
                  className="border-2 border-white dark:border-slate-800 shadow-lg"
                />
              </div>
            </div>

            {/* Info area */}
            <div className="pt-6 pb-4 px-3 text-center">
              <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {coach.first_name} {coach.last_name}
              </p>
              <span className="inline-block mt-1.5 rounded-full bg-primary/10 dark:bg-cyan-300/15 px-2.5 py-0.5 text-[10px] font-bold text-primary dark:text-cyan-300 uppercase tracking-wide">
                {ROLE_LABELS[coach.role]?.[lang] || coach.role}
              </span>
              {coach.country && (
                <p className="mt-1 text-[10px] text-slate-400 dark:text-white/50">
                  {coach.country.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
