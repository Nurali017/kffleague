import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/lib/api/client';

interface SeasonBrief {
  id: number;
  name: string;
  date_start?: string | null;
  date_end?: string | null;
}

interface TournamentInChampionship {
  id: number;
  name: string;
  seasons: SeasonBrief[];
}

interface ChampionshipTree {
  id: number;
  name: string;
  short_name?: string | null;
  slug?: string | null;
  tournaments: TournamentInChampionship[];
}

interface ChampionshipTreeResponse {
  items: ChampionshipTree[];
  total: number;
}

export interface FlatSeasonItem {
  seasonId: number;
  seasonName: string;
  year: string;
  tournamentName: string;
}

function extractYear(seasonName: string): string {
  const match = seasonName.match(/(\d{4})/);
  return match ? match[1] : seasonName;
}

function flattenTree(data: ChampionshipTreeResponse): FlatSeasonItem[] {
  const items: FlatSeasonItem[] = [];
  for (const champ of data.items) {
    for (const tournament of champ.tournaments) {
      for (const season of tournament.seasons) {
        const year = season.date_start
          ? new Date(season.date_start).getFullYear().toString()
          : extractYear(season.name);
        items.push({
          seasonId: season.id,
          seasonName: season.name,
          year,
          tournamentName: champ.name || tournament.name,
        });
      }
    }
  }
  return items;
}

export function useChampionshipsTree() {
  const { i18n } = useTranslation();

  const { data, error, isLoading } = useSWR<FlatSeasonItem[]>(
    ['/championships/tree', i18n.language],
    async () => {
      const response = await apiClient.get<ChampionshipTreeResponse>(
        '/championships/tree',
        { lang: i18n.language }
      );
      if (!response.success) {
        throw new Error('Failed to load championships tree');
      }
      return flattenTree(response.data);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 min
    }
  );

  return {
    items: data ?? [],
    loading: isLoading,
    error,
  };
}
