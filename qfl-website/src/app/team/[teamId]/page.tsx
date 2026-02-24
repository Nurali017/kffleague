'use client';

import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { notFound, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
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
import { useTeamGames, useTeamOverview, useTeamPlayers, useTeamSeasons, useTeamStats } from '@/hooks/useTeam';
import { useTournament, usePreSeasonEffectiveId } from '@/contexts/TournamentContext';
import { PageSeasonProvider } from '@/contexts/PageSeasonContext';
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
  const { currentTournament, setSeason } = useTournament();
  const effectiveSeasonId = usePreSeasonEffectiveId('previous');
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

  const { items: yearItems } = useTeamSeasons(teamId, currentTournament.id);

  useEffect(() => {
    if (!yearItems.length) return;
    if (!yearItems.some((item) => item.seasonId === effectiveSeasonId)) {
      setSeason(yearItems[0].seasonId);
    }
  }, [yearItems, effectiveSeasonId, setSeason]);

  const { overview, loading: overviewLoading, error: overviewError } = useTeamOverview(teamId, effectiveSeasonId);
  const { stats: detailedStats } = useTeamStats(activeTab === 'overview' ? teamId : null, effectiveSeasonId);
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
  const leaguePosition = overview.standings_window?.find(s => s.team_id === teamId)?.position ?? null;

  return (
    <PageSeasonProvider seasonId={effectiveSeasonId}>
      <main className="min-h-screen bg-slate-100 dark:bg-[#090f1a] pb-24 font-sans">
        <TeamPageHero
          team={overview.team}
          summary={overview.summary}
          seasonName={overview.season?.name}
          tournamentName={tournamentName}
          formLast5={overview.form_last5}
          leaguePosition={leaguePosition}
        />

        <TeamPageTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          yearItems={yearItems}
          selectedSeasonId={effectiveSeasonId}
          onSeasonChange={setSeason}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-8 md:space-y-10">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div
                key="overview"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={staggerContainer}
                className="space-y-6"
              >
                <motion.div variants={fadeInUp}>
                  <TeamKeyStats stats={overview.summary} details={detailedStats} />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <TeamOverviewSection
                    recentMatch={overview.recent_match}
                    formLast5={overview.form_last5}
                    upcomingMatches={overview.upcoming_matches}
                    standingsWindow={overview.standings_window}
                    leaders={overview.leaders}
                  />
                </motion.div>
              </motion.div>
            ) : null}

            {activeTab === 'matches' ? (
              <motion.div key="matches" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeInUp}>
                <TeamMatches games={games} teamId={teamId} loading={gamesLoading} />
              </motion.div>
            ) : null}

            {activeTab === 'squad' ? (
              <motion.div key="squad" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeInUp}>
                <TeamSquad players={players} loading={playersLoading} />
              </motion.div>
            ) : null}

            {activeTab === 'stats' ? (
              <motion.div key="stats" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeInUp}>
                <TeamFullStats teamId={teamId} />
              </motion.div>
            ) : null}

            {activeTab === 'staff' ? (
              <motion.div key="staff" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeInUp}>
                <TeamCoachingStaff teamId={teamId} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
    </PageSeasonProvider>
  );
}
