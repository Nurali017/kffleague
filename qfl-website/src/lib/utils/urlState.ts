import { NewsFilters, MatchCenterFilters } from '@/types';

/**
 * Обновить URL search параметры без перезагрузки страницы
 */
export function updateSearchParams(
  params: Record<string, string | number | undefined>,
  options?: { replace?: boolean }
): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  // Обновить или удалить параметры
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, String(value));
    }
  });

  // Обновить URL без перезагрузки
  const queryString = searchParams.toString();
  const newUrl = queryString ? `${url.pathname}?${queryString}` : url.pathname;
  const currentUrl = `${url.pathname}${url.search}`;
  if (newUrl === currentUrl) return;

  if (options?.replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
}

/**
 * Получить фильтры из URL search параметров
 */
export function getFiltersFromSearchParams(searchParams: URLSearchParams): NewsFilters {
  const filters: NewsFilters = {};

  const tournamentId = searchParams.get('championship_code');
  if (tournamentId) filters.championship_code = tournamentId;

  const articleType = searchParams.get('article_type');
  if (articleType && ['news', 'analytics'].includes(articleType)) {
    filters.article_type = articleType as NewsFilters['article_type'];
  }

  const search = searchParams.get('search');
  if (search) filters.search = search;

  const sort = searchParams.get('sort');
  if (sort && ['date_desc', 'date_asc', 'views_desc', 'likes_desc'].includes(sort)) {
    filters.sort = sort as NewsFilters['sort'];
  }

  const dateFrom = searchParams.get('dateFrom');
  if (dateFrom) filters.dateFrom = dateFrom;

  const dateTo = searchParams.get('dateTo');
  if (dateTo) filters.dateTo = dateTo;

  return filters;
}

/**
 * Получить номер страницы из URL search параметров
 */
export function getPageFromSearchParams(searchParams: URLSearchParams): number {
  const page = searchParams.get('page');
  const pageNum = parseInt(page || '1', 10);
  return pageNum > 0 ? pageNum : 1;
}

/**
 * Синхронизировать фильтры и страницу с URL
 */
export function syncFiltersToUrl(filters: NewsFilters, page: number): void {
  updateSearchParams({
    championship_code: filters.championship_code,
    article_type: filters.article_type,
    search: filters.search,
    sort: filters.sort,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    page: page > 1 ? page : undefined, // Не показывать page=1 в URL
  });
}

/**
 * Получить фильтры матч-центра из URL search параметров
 */
export function getMatchCenterFiltersFromUrl(searchParams: URLSearchParams): MatchCenterFilters {
  const filters: MatchCenterFilters = {};

  const seasonId = searchParams.get('season_id');
  if (seasonId) filters.season_id = parseInt(seasonId, 10);

  const final = searchParams.get('final');
  if (final === 'true') {
    filters.final = true;
  } else {
    const group = searchParams.get('group');
    if (group) filters.group = group;
  }

  // Tours array
  const tours = searchParams.get('tours');
  if (tours) filters.tours = tours.split(',').map(id => parseInt(id, 10));

  // Team IDs array
  const teamIds = searchParams.get('team_ids');
  if (teamIds) filters.team_ids = teamIds.split(',').map(id => parseInt(id, 10));

  // Month (single value)
  const month = searchParams.get('month');
  if (month) filters.month = parseInt(month, 10);

  const year = searchParams.get('year');
  if (year) filters.year = parseInt(year, 10);

  // Status (single value)
  const status = searchParams.get('status');
  if (status && ['upcoming', 'finished', 'live', 'all'].includes(status)) {
    filters.status = status as 'upcoming' | 'finished' | 'live' | 'all';
  }

  const hidePast = searchParams.get('hide_past');
  if (hidePast) filters.hide_past = hidePast === 'true';

  return filters;
}

/**
 * Синхронизировать фильтры матч-центра с URL
 */
export function syncMatchCenterFiltersToUrl(filters: MatchCenterFilters): void {
  const params: Record<string, any> = {};

  if (filters.season_id) params.season_id = filters.season_id;
  if (filters.final) {
    params.final = 'true';
  } else if (filters.group) {
    params.group = filters.group;
  }
  if (filters.tours?.length) params.tours = filters.tours.join(',');
  if (filters.team_ids?.length) params.team_ids = filters.team_ids.join(',');
  if (filters.month) params.month = filters.month;
  if (filters.year) params.year = filters.year;
  if (filters.status) params.status = filters.status;
  if (filters.hide_past) params.hide_past = 'true';

  updateSearchParams(params);
}
