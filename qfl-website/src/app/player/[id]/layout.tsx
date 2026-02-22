import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { JsonLd } from '@/components/JsonLd';
import { playerService } from '@/lib/api/services/playerService';
import { teamService } from '@/lib/api/services/teamService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, playerTitle, getSeoLang } from '@/lib/seo/metadata';
import { personJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';

interface PlayerDetailLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const playerId = Number(params.id);
  if (!Number.isInteger(playerId) || playerId <= 0) return {};

  const language = getLanguageFromCookie();
  const player = await safePrefetch(() =>
    playerService.getPlayerById(playerId, DEFAULT_SEASON_ID, language)
  );
  if (!player) return {};

  let teamName: string | null = null;
  const teamId = player.teams?.[0];
  if (typeof teamId === 'number') {
    const team = await safePrefetch(() =>
      teamService.getTeamById(teamId, language)
    );
    teamName = team?.name ?? null;
  }

  const lang = getSeoLang();
  const title = playerTitle(player.first_name, player.last_name, teamName);
  const playerName = [player.first_name, player.last_name].filter(Boolean).join(' ');
  const description =
    lang === 'kz'
      ? `${playerName}${teamName ? ` — ${teamName} ойыншысы` : ''}. Қазақстан Премьер-Лигасы.`
      : `${playerName}${teamName ? ` — игрок ${teamName}` : ''}. Казахстанская Премьер-Лига.`;

  return buildMetadata({
    title,
    description,
    path: `/player/${playerId}`,
    ogImage: player.photo_url || null,
    ogType: 'profile',
  });
}

export default async function PlayerDetailLayout({
  children,
  params,
}: PlayerDetailLayoutProps) {
  const playerId = Number(params.id);
  if (!Number.isInteger(playerId) || playerId <= 0) {
    return children;
  }

  const { language, seasonId } = getServerPrefetchContext();
  const effectiveSeasonId = seasonId || DEFAULT_SEASON_ID;

  const [player, stats, teammates, tournaments] = await Promise.all([
    safePrefetch(() => playerService.getPlayerById(playerId, effectiveSeasonId, language)),
    safePrefetch(() => playerService.getPlayerStats(playerId, effectiveSeasonId, language)),
    safePrefetch(() => playerService.getPlayerTeammates(playerId, {
      seasonId: effectiveSeasonId,
      limit: 10,
      language,
    })),
    safePrefetch(() => playerService.getPlayerTournaments(playerId, language)),
  ]);

  const teamId = player?.teams?.[0];
  const team = typeof teamId === 'number'
    ? await safePrefetch(() => teamService.getTeamById(teamId, language))
    : undefined;

  const prefetch: Record<string, unknown> = {};
  if (player !== undefined) {
    prefetch[prefetchKeys.playerDetail(playerId, effectiveSeasonId, language)] = player;
  }
  if (stats !== undefined) {
    prefetch[prefetchKeys.playerSeasonStats(playerId, effectiveSeasonId, language)] = stats;
  }
  if (teammates !== undefined) {
    prefetch[prefetchKeys.playerTeammates(playerId, effectiveSeasonId, 10, language)] = teammates;
  }
  if (tournaments !== undefined) {
    prefetch[prefetchKeys.playerTournaments(playerId, language)] = tournaments;
  }
  if (team !== undefined && typeof teamId === 'number') {
    prefetch[prefetchKeys.teamDetail(teamId, language)] = team;
  }

  const jsonLd = player
    ? [
        personJsonLd({
          id: playerId,
          firstName: player.first_name,
          lastName: player.last_name,
          photoUrl: player.photo_url,
          teamName: team?.name,
          nationality: player.country?.name,
        }),
        breadcrumbJsonLd([
          { name: 'Ойыншылар', href: '/stats/players' },
          { name: [player.first_name, player.last_name].filter(Boolean).join(' ') || 'Player' },
        ]),
      ]
    : [];

  return (
    <RoutePrefetchProvider value={prefetch}>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
      {children}
    </RoutePrefetchProvider>
  );
}
