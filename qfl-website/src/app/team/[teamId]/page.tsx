'use client';

import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { notFound, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  TeamCoachingStaff,
  TeamFullStats,
  TeamKeyStats,
  TeamMatches,
  TeamOverviewSection,
  TeamPageHero,
  TeamPageTabs,
  TeamSquad,
} from '@/components/team';
import { useTeamGames, useTeamOverview, useTeamPlayers } from '@/hooks/useTeam';
import { useTournament } from '@/contexts/TournamentContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { fadeInUp, staggerContainer } from '@/lib/motion/variants';
import { DEFAULT_TEAM_PAGE_TAB, parseTeamPageTab, TeamPageTab } from '@/components/team/tabState';

interface TeamPageProps {
  params: {
    teamId: string;
  };
}

export default function TeamPage({ params }: TeamPageProps) {
  const { t, i18n } = useTranslation('team');
  const { effectiveSeasonId, currentTournament } = useTournament();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';
  const teamId = Number(params.teamId);

  const parsedTab = parseTeamPageTab(searchParams.get('tab'));
  const activeTab = parsedTab ?? DEFAULT_TEAM_PAGE_TAB;

  useEffect(() => {
    if (parsedTab) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set('tab', DEFAULT_TEAM_PAGE_TAB);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [parsedTab, pathname, router, searchParams]);

  const handleTabChange = useCallback((tab: TeamPageTab) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('tab', tab);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const { overview, loading: overviewLoading, error: overviewError } = useTeamOverview(teamId, effectiveSeasonId);
  const { games, loading: gamesLoading } = useTeamGames(activeTab === 'matches' ? teamId : null, effectiveSeasonId);
  const { players, loading: playersLoading } = useTeamPlayers(activeTab === 'squad' ? teamId : null, effectiveSeasonId);

  if (overviewLoading && !overview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#090f1a]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!overview || overviewError) {
    if ((overviewError as { status?: number } | null)?.status === 404) notFound();
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage
          message={t('load_error', 'Не удалось загрузить данные команды')}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const tournamentName = (currentTournament.name as Record<string, string>)[lang] || currentTournament.name.short;

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-[#090f1a] pb-24 font-sans">
      <TeamPageHero
        team={overview.team}
        summary={overview.summary}
        seasonName={overview.season?.name}
        tournamentName={tournamentName}
      />

      <TeamPageTabs activeTab={activeTab} onChange={handleTabChange} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-8 md:space-y-10">
        {activeTab === 'overview' ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <TeamKeyStats stats={overview.summary} />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <TeamOverviewSection
                recentMatch={overview.recent_match}
                formLast5={overview.form_last5}
                upcomingMatches={overview.upcoming_matches}
                standingsWindow={overview.standings_window}
                leaders={overview.leaders}
                staffPreview={overview.staff_preview}
              />
            </motion.div>
          </motion.div>
        ) : null}

        {activeTab === 'matches' ? (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <TeamMatches games={games} teamId={teamId} loading={gamesLoading} />
          </motion.div>
        ) : null}

        {activeTab === 'squad' ? (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <TeamSquad players={players} loading={playersLoading} />
          </motion.div>
        ) : null}

        {activeTab === 'stats' ? (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <TeamFullStats teamId={teamId} />
          </motion.div>
        ) : null}

        {activeTab === 'staff' ? (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <TeamCoachingStaff teamId={teamId} />
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}

