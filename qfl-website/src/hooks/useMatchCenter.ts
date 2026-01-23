import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services';
import { MatchCenterFilters, GroupedMatchesResponse } from '@/types';

interface UseMatchCenterOptions extends MatchCenterFilters {
  enabled?: boolean;
}

export function useMatchCenter(options: UseMatchCenterOptions = {}) {
  const { i18n } = useTranslation();
  const { enabled = true, ...filters } = options;

  const filtersWithDefaults: MatchCenterFilters = {
    group_by_date: true,
    language: i18n.language,
    ...filters,
  };

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? ['match-center', JSON.stringify(filtersWithDefaults)] : null,
    () => matchService.getMatchCenter(filtersWithDefaults) as Promise<GroupedMatchesResponse>
  );

  return {
    groups: data?.groups ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
