import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { HomeMatches } from '@/components/HomeMatches';
import { HeroSection } from '@/components/HeroSection';
import { SeasonStats } from '@/components/SeasonStats';
import { PlayerLeaderboard } from '@/components/PlayerLeaderboard';
import { LeagueTable } from '@/components/LeagueTable';
import { NewsFeatured, NewsSideCards } from '@/components/NewsSection';
import { VideoGrid } from '@/components/VideoGrid';
import {
  leagueService,
  matchService,
  newsService,
  playerStatsService,
  seasonStatsService,
  cupService,
} from '@/lib/api/services';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { DEFAULT_SEASON_ID, DEFAULT_TOUR } from '@/lib/api/endpoints';
import { buildMetadata, getSeoLang, getDefaultDescription } from '@/lib/seo/metadata';
import { SITE_NAME } from '@/lib/seo/constants';
import { DEFAULT_TOURNAMENT_ID, getTournamentById } from '@/config/tournaments';
import {
  MatchCenterFilters,
  CupOverviewResponse,
  CupScheduleResponse,
  GroupedMatchesResponse,
  LeagueTableResponse,
} from '@/types';
import { TournamentHomeContent, type CupHomeData, type SecondLeagueHomeData } from '@/components/home';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getSeoLang();
  return buildMetadata({
    absoluteTitle: SITE_NAME,
    description: getDefaultDescription(lang),
    path: '/',
  });
}

function buildMatchCenterFiltersHash(
  language: string,
  filters: Omit<MatchCenterFilters, 'group_by_date' | 'language'>
) {
  return JSON.stringify({
    group_by_date: true,
    language,
    ...filters,
  });
}

export default async function HomePage() {
  const { language, seasonId, tournamentId } = getServerPrefetchContext();
  const tournament = getTournamentById(tournamentId);
  const currentTournamentId = tournament?.id ?? DEFAULT_TOURNAMENT_ID;
  const effectiveSeasonId = seasonId || tournament?.seasonId || DEFAULT_SEASON_ID;

  const isSecondLeague = currentTournamentId === '2l';
  const isCup = currentTournamentId === 'cup';

  const tour = tournament?.currentRound ?? DEFAULT_TOUR;
  const shouldPrefetchByTour = typeof tournament?.currentRound === 'number';

  const newsLimit = 5;
  const leaderboardLimit = 5;
  const secondLeagueMatchLimit = 6;

  const homeMatchFilters: MatchCenterFilters = {
    season_id: effectiveSeasonId,
    group_by_date: true,
    language,
    limit: 20,
  };
  const homeMatchFiltersHash = buildMatchCenterFiltersHash(language, {
    season_id: effectiveSeasonId,
    limit: 20,
  });

  let matches: unknown;
  let stats: unknown;
  let table: LeagueTableResponse | undefined;
  let playerLeaderboard: unknown;
  let sliderNews: unknown;
  let latestNews: unknown;

  let groupATableResponse: LeagueTableResponse | undefined;
  let groupBTableResponse: LeagueTableResponse | undefined;
  let groupAMatchesResponse: GroupedMatchesResponse | undefined;
  let groupBMatchesResponse: GroupedMatchesResponse | undefined;
  let finalMatchesResponse: GroupedMatchesResponse | undefined;

  let cupOverviewResponse: CupOverviewResponse | undefined;
  let cupScheduleResponse: CupScheduleResponse | undefined;

  if (isSecondLeague) {
    const [
      sliderNewsRes,
      latestNewsRes,
      groupATableRes,
      groupBTableRes,
      groupAMatchesRes,
      groupBMatchesRes,
      finalMatchesRes,
    ] = await Promise.all([
      safePrefetch(() => newsService.getSlider(language, newsLimit, currentTournamentId)),
      safePrefetch(() => newsService.getLatest(language, newsLimit, currentTournamentId)),
      safePrefetch(() => leagueService.getTable(effectiveSeasonId, { group: 'A' }, language)),
      safePrefetch(() => leagueService.getTable(effectiveSeasonId, { group: 'B' }, language)),
      safePrefetch(() => matchService.getMatchCenter({
        season_id: effectiveSeasonId,
        group: 'A',
        group_by_date: true,
        language,
        limit: secondLeagueMatchLimit,
      }) as Promise<GroupedMatchesResponse>),
      safePrefetch(() => matchService.getMatchCenter({
        season_id: effectiveSeasonId,
        group: 'B',
        group_by_date: true,
        language,
        limit: secondLeagueMatchLimit,
      }) as Promise<GroupedMatchesResponse>),
      safePrefetch(() => matchService.getMatchCenter({
        season_id: effectiveSeasonId,
        final: true,
        group_by_date: true,
        language,
        limit: secondLeagueMatchLimit,
      }) as Promise<GroupedMatchesResponse>),
    ]);

    sliderNews = sliderNewsRes;
    latestNews = latestNewsRes;
    groupATableResponse = groupATableRes;
    groupBTableResponse = groupBTableRes;
    groupAMatchesResponse = groupAMatchesRes;
    groupBMatchesResponse = groupBMatchesRes;
    finalMatchesResponse = finalMatchesRes;
  } else if (isCup) {
    const [sliderNewsRes, latestNewsRes, cupOverviewRes, cupScheduleRes] = await Promise.all([
      safePrefetch(() => newsService.getSlider(language, newsLimit, currentTournamentId)),
      safePrefetch(() => newsService.getLatest(language, newsLimit, currentTournamentId)),
      safePrefetch(() => cupService.getOverview(effectiveSeasonId, language)),
      safePrefetch(() => cupService.getSchedule(effectiveSeasonId, language)),
    ]);

    sliderNews = sliderNewsRes;
    latestNews = latestNewsRes;
    cupOverviewResponse = cupOverviewRes;
    cupScheduleResponse = cupScheduleRes;
  } else {
    const [
      matchesRes,
      sliderNewsRes,
      latestNewsRes,
      statsRes,
      tableRes,
      playerLeaderboardRes,
    ] = await Promise.all([
      shouldPrefetchByTour
        ? safePrefetch(() => matchService.getGamesByTour(effectiveSeasonId, tour, language))
        : safePrefetch(() => matchService.getMatchCenter(homeMatchFilters)),
      safePrefetch(() => newsService.getSlider(language, newsLimit, currentTournamentId)),
      safePrefetch(() => newsService.getLatest(language, newsLimit, currentTournamentId)),
      safePrefetch(() => seasonStatsService.getSeasonStatistics(effectiveSeasonId, language)),
      safePrefetch(() => leagueService.getTable(effectiveSeasonId, undefined, language)),
      safePrefetch(async () => {
        const [scorersRes, assistersRes, cleanSheetsRes] = await Promise.all([
          playerStatsService.getPlayerStats({
            seasonId: effectiveSeasonId,
            sortBy: 'goals',
            limit: leaderboardLimit,
            language,
          }),
          playerStatsService.getPlayerStats({
            seasonId: effectiveSeasonId,
            sortBy: 'assists',
            limit: leaderboardLimit,
            language,
          }),
          playerStatsService.getPlayerStats({
            seasonId: effectiveSeasonId,
            sortBy: 'dry_match',
            limit: leaderboardLimit,
            language,
          }),
        ]);

        return {
          scorers: scorersRes.items,
          assisters: assistersRes.items,
          cleanSheets: cleanSheetsRes.items,
        };
      }),
    ]);

    matches = matchesRes;
    sliderNews = sliderNewsRes;
    latestNews = latestNewsRes;
    stats = statsRes;
    table = tableRes;
    playerLeaderboard = playerLeaderboardRes;
  }

  const prefetch: Record<string, unknown> = {};

  if (sliderNews !== undefined) {
    prefetch[prefetchKeys.newsSlider(language, newsLimit, currentTournamentId)] = sliderNews;
  }
  if (latestNews !== undefined) {
    prefetch[prefetchKeys.newsLatest(language, newsLimit, currentTournamentId)] = latestNews;
  }

  if (isSecondLeague) {
    if (groupATableResponse !== undefined) {
      prefetch[prefetchKeys.leagueTable(
        effectiveSeasonId,
        undefined,
        undefined,
        undefined,
        'A',
        false,
        language
      )] = groupATableResponse;
    }

    if (groupBTableResponse !== undefined) {
      prefetch[prefetchKeys.leagueTable(
        effectiveSeasonId,
        undefined,
        undefined,
        undefined,
        'B',
        false,
        language
      )] = groupBTableResponse;
    }

    if (groupAMatchesResponse !== undefined) {
      prefetch[prefetchKeys.matchCenter(buildMatchCenterFiltersHash(language, {
        season_id: effectiveSeasonId,
        group: 'A',
        limit: secondLeagueMatchLimit,
      }))] = groupAMatchesResponse;
    }

    if (groupBMatchesResponse !== undefined) {
      prefetch[prefetchKeys.matchCenter(buildMatchCenterFiltersHash(language, {
        season_id: effectiveSeasonId,
        group: 'B',
        limit: secondLeagueMatchLimit,
      }))] = groupBMatchesResponse;
    }

    if (finalMatchesResponse !== undefined) {
      prefetch[prefetchKeys.matchCenter(buildMatchCenterFiltersHash(language, {
        season_id: effectiveSeasonId,
        final: true,
        limit: secondLeagueMatchLimit,
      }))] = finalMatchesResponse;
    }
  }

  if (isCup && cupOverviewResponse !== undefined) {
    prefetch[prefetchKeys.cupOverview(effectiveSeasonId, language, 5, 5)] = cupOverviewResponse;
  }
  if (isCup && cupScheduleResponse !== undefined) {
    prefetch[prefetchKeys.cupSchedule(effectiveSeasonId, language, null)] = cupScheduleResponse;
  }

  if (!isSecondLeague && !isCup) {
    if (matches !== undefined) {
      if (shouldPrefetchByTour) {
        prefetch[prefetchKeys.matchesByTour(effectiveSeasonId, tour, language)] = matches;
      } else {
        prefetch[prefetchKeys.matchCenter(homeMatchFiltersHash)] = matches;
      }
    }

    if (stats !== undefined) {
      prefetch[prefetchKeys.seasonStats(effectiveSeasonId, language)] = stats;
    }

    if (table !== undefined) {
      prefetch[prefetchKeys.leagueTable(
        effectiveSeasonId,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        language
      )] = table;
    }

    if (playerLeaderboard !== undefined) {
      prefetch[prefetchKeys.playerLeaderboard(effectiveSeasonId, leaderboardLimit, language)] = playerLeaderboard;
    }
  }

  const secondLeagueData: SecondLeagueHomeData | null = isSecondLeague
    ? {
        groupAStandings: groupATableResponse?.table ?? [],
        groupBStandings: groupBTableResponse?.table ?? [],
        groupAMatches: groupAMatchesResponse ?? null,
        groupBMatches: groupBMatchesResponse ?? null,
        finalMatches: finalMatchesResponse ?? null,
      }
    : null;

  const cupData: CupHomeData | null = isCup
    ? {
        overview: cupOverviewResponse ?? null,
        schedule: cupScheduleResponse ?? null,
      }
    : null;

  if (isSecondLeague || isCup) {
    return (
      <RoutePrefetchProvider value={prefetch}>
        <TournamentHomeContent
          tournamentId={currentTournamentId}
          secondLeagueData={secondLeagueData}
          cupData={cupData}
        />
      </RoutePrefetchProvider>
    );
  }

  // KFF League videos from kffleague.kz - показываем 4 видео в одну строку
  const mediaVideos = [
    { id: 1, title: 'Премьер-лиганың 26-турының үздік голдары', youtubeId: '-LxnCdR-pxI' },
    { id: 2, title: 'Премьер-лиганың 22-турының үздік голдары', youtubeId: 'HcY3luVxyzo' },
    { id: 3, title: 'Премьер-лиганың 21-турының үздік голдары', youtubeId: 'K_6ov7ERSuE' },
    { id: 4, title: 'Премьер-лиганың 20-турының үздік голдары', youtubeId: 'hSb0s6kj_JA' },
  ];

  return (
    <RoutePrefetchProvider value={prefetch}>
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8 dark:bg-dark-bg">
        {/* Row 1: Hero + HomeMatches */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          <div className="lg:col-span-9 h-[340px] sm:h-[420px] lg:h-[500px]">
            <HeroSection />
          </div>
          <div className="lg:col-span-3 h-[360px] sm:h-[420px] lg:h-[500px]">
            <HomeMatches />
          </div>
        </div>

        {/* Row 2: News + LeagueTable (aligned with MatchCenter) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          {/* News section */}
          <section className="lg:col-span-9 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-xl shadow-sm p-4 md:p-6 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-primary dark:text-accent-cyan tracking-tight">Жаңалықтар</h2>
              <Link
                href="/news"
                className="text-gray-500 dark:text-slate-400 font-medium text-sm hover:text-primary dark:hover:text-accent-cyan flex items-center transition-colors group"
              >
                Барлық жаңалықтар
                <ChevronRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 flex-1 items-stretch">
              <div className="md:col-span-2 min-h-[350px]">
                <NewsFeatured />
              </div>
              <div className="h-full">
                <NewsSideCards />
              </div>
            </div>
          </section>

          {/* LeagueTable - same height as news */}
          <div className="lg:col-span-3 h-full">
            <LeagueTable />
          </div>
        </div>

        <section>
          <PlayerLeaderboard />
        </section>

        <section>
          <SeasonStats />
        </section>

        <section>
          <VideoGrid title="Медиа" videos={mediaVideos} />
        </section>
      </div>
    </RoutePrefetchProvider>
  );
}
