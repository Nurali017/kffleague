#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:8000';
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const OPENAPI_URL = process.env.OPENAPI_URL || `${BACKEND_BASE_URL}/openapi.json`;
const SEASON_ID = Number(process.env.AUDIT_SEASON_ID || 61);
const LANGUAGE = process.env.AUDIT_LANG || 'ru';
const TOURNAMENT_ID = process.env.AUDIT_TOURNAMENT_ID || 'pl';
const DEFAULT_TOUR = Number(process.env.AUDIT_TOUR || 26);
const ALLOW_TEAM_STATS_404 = process.env.AUDIT_ALLOW_TEAM_STATS_404 !== 'false';

const BACKEND_COMPOSE_FILE =
  process.env.BACKEND_COMPOSE_FILE ||
  path.resolve(ROOT, '../backend/docker-compose.yml');
const OUTPUT_JSON =
  process.env.AUDIT_OUTPUT_JSON ||
  path.resolve(ROOT, '../docs/frontend-api-audit-report.json');
const OUTPUT_MD =
  process.env.AUDIT_OUTPUT_MD ||
  path.resolve(ROOT, '../docs/frontend-api-audit-report.md');

const REQUEST_TIMEOUT_MS = 15000;
const NEGATIVE_ID = Number(process.env.AUDIT_NEGATIVE_ID || 999999999);

const startTime = new Date().toISOString();

const sections = [];
const allResults = [];
const observedRequests = [];

function log(message) {
  process.stdout.write(`${message}\n`);
}

function normalizePath(pathname) {
  return pathname.replace(/\$\{[^}]+\}/g, '{}').replace(/\{[^}]+\}/g, '{}');
}

function methodForEndpointKey(key) {
  if (key === 'NEWS_VIEW' || key === 'NEWS_LIKE') return 'POST';
  return 'GET';
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function detailFromBody(body) {
  if (body === null || body === undefined) return '';
  if (typeof body === 'string') return body.slice(0, 160);
  if (typeof body === 'object') {
    const keys = Object.keys(body);
    return `keys:${keys.slice(0, 6).join(',')}`;
  }
  return String(body);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toFiniteNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function pickFirstFiniteNumber(source, keys) {
  if (!source || typeof source !== 'object') return null;
  for (const key of keys) {
    const value = toFiniteNumber(source[key]);
    if (value !== null) return value;
  }
  return null;
}

function extractCollection(body) {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== 'object') return [];
  if (Array.isArray(body.items)) return body.items;
  if (Array.isArray(body.results)) return body.results;
  if (Array.isArray(body.data)) return body.data;
  if (body.data && typeof body.data === 'object' && Array.isArray(body.data.items)) {
    return body.data.items;
  }
  return [];
}

function extractEntityId(entity, keys) {
  return pickFirstFiniteNumber(entity, keys);
}

function extractTeamIdsFromGame(game) {
  if (!game || typeof game !== 'object') return [];
  const ids = [];
  const direct = [
    extractEntityId(game, [
      'home_team_id',
      'away_team_id',
      'team_home_id',
      'team_away_id',
      'home_id',
      'away_id',
    ]),
    extractEntityId(game, [
      'away_team_id',
      'home_team_id',
      'team_away_id',
      'team_home_id',
      'away_id',
      'home_id',
    ]),
  ];
  for (const value of direct) {
    if (value !== null && !ids.includes(value)) ids.push(value);
  }

  const nested = [
    game.home_team,
    game.away_team,
    game.team_home,
    game.team_away,
    game.homeTeam,
    game.awayTeam,
  ];
  for (const node of nested) {
    const value = extractEntityId(node, ['id', 'team_id']);
    if (value !== null && !ids.includes(value)) ids.push(value);
  }
  return ids;
}

function recordResult(section, result) {
  const entry = { section, ...result };
  allResults.push(entry);
  return entry;
}

function sectionSummary(sectionName, items) {
  const total = items.length;
  const passed = items.filter((x) => x.pass).length;
  const failed = total - passed;
  const ok = failed === 0;
  sections.push({ section: sectionName, ok, total, passed, failed });
  return { ok, total, passed, failed };
}

async function requestApi(method, apiPath, options = {}) {
  const url = `${BACKEND_BASE_URL}${apiPath}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
    const text = await response.text();
    const json = safeJsonParse(text);
    observedRequests.push({
      method,
      apiPath,
      status: response.status,
      ok: response.ok,
    });
    return {
      method,
      apiPath,
      status: response.status,
      ok: response.ok,
      body: json ?? text,
      bodyText: text,
    };
  } catch (error) {
    observedRequests.push({
      method,
      apiPath,
      status: 0,
      ok: false,
    });
    return {
      method,
      apiPath,
      status: 0,
      ok: false,
      body: null,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function requestApiWithRetry(method, apiPath, options = {}) {
  const attempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 350;
  let response = null;
  for (let i = 0; i < attempts; i += 1) {
    response = await requestApi(method, apiPath, options);
    if (response.ok) return response;
    if (i < attempts - 1) {
      await sleep(delayMs);
    }
  }
  return response;
}

function runShell(command) {
  try {
    const output = execSync(command, {
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
      cwd: ROOT,
    });
    return { ok: true, output: output.trim() };
  } catch (error) {
    const err = error;
    const stdout = typeof err.stdout === 'string' ? err.stdout : '';
    const stderr = typeof err.stderr === 'string' ? err.stderr : '';
    return {
      ok: false,
      output: `${stdout}\n${stderr}`.trim(),
    };
  }
}

async function loadFrontendEndpoints() {
  const endpointsPath = path.resolve(ROOT, 'src/lib/api/endpoints.ts');
  const source = await readFile(endpointsPath, 'utf8');
  const objectStart = source.indexOf('export const ENDPOINTS = {');
  const objectEnd = source.indexOf('} as const;', objectStart);
  if (objectStart === -1 || objectEnd === -1) {
    throw new Error('Could not parse ENDPOINTS object in endpoints.ts');
  }
  const objectBody = source.slice(objectStart, objectEnd);
  const regex =
    /([A-Z0-9_]+):\s*(?:\([^)]*\)\s*=>\s*)?(?:`([^`]+)`|'([^']+)')/g;
  const found = [];
  let match;
  while ((match = regex.exec(objectBody)) !== null) {
    const key = match[1];
    const rawPath = match[2] || match[3];
    const normalized = normalizePath(rawPath);
    const fullPath = `${API_PREFIX}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
    found.push({
      key,
      method: methodForEndpointKey(key),
      path: fullPath,
      normalizedPath: normalizePath(fullPath),
    });
  }
  return found;
}

async function runContractCheck() {
  log('\n[1/6] Contract check (frontend endpoints.ts vs OpenAPI)');
  const items = [];
  const openapi = await fetch(OPENAPI_URL).then((res) => res.json());
  const paths = openapi.paths || {};
  const openapiIndex = new Map();
  Object.entries(paths).forEach(([pathKey, operations]) => {
    const normalized = normalizePath(pathKey);
    if (!openapiIndex.has(normalized)) {
      openapiIndex.set(normalized, new Map());
    }
    const entry = openapiIndex.get(normalized);
    Object.keys(operations).forEach((method) => {
      entry.set(method.toUpperCase(), pathKey);
    });
  });

  const frontendEndpoints = await loadFrontendEndpoints();
  frontendEndpoints.forEach((endpoint) => {
    const methodMap = openapiIndex.get(endpoint.normalizedPath);
    const actualPath = methodMap?.get(endpoint.method) || null;
    const pass = Boolean(actualPath);
    items.push(
      recordResult('contract', {
        key: endpoint.key,
        method: endpoint.method,
        path: endpoint.path,
        pass,
        expected: endpoint.path,
        actual: actualPath,
        detail: pass ? 'ok' : 'missing in OpenAPI',
      })
    );
  });

  sectionSummary('contract', items);
}

function parseRevisionFromText(text) {
  const match = text.match(/\b([a-z0-9]{12})\b/gi);
  if (!match || match.length === 0) return null;
  return match[match.length - 1].toLowerCase();
}

async function runSchemaGuard() {
  log('\n[2/6] Schema guard');
  const items = [];

  const headsCmd =
    `afsad=1 docker compose -f "${BACKEND_COMPOSE_FILE}" exec -T backend alembic heads`;
  const currentCmd =
    `afsad=1 docker compose -f "${BACKEND_COMPOSE_FILE}" exec -T backend alembic current`;
  const versionCmd =
    `afsad=1 docker compose -f "${BACKEND_COMPOSE_FILE}" exec -T db ` +
    `psql -U postgres -d qfl_db -tA -c "select version_num from alembic_version;"`;
  const gamesIdTypeCmd =
    `afsad=1 docker compose -f "${BACKEND_COMPOSE_FILE}" exec -T db ` +
    `psql -U postgres -d qfl_db -tA -c "select data_type from information_schema.columns where table_name='games' and column_name='id';"`;
  const gamesSotaExistsCmd =
    `afsad=1 docker compose -f "${BACKEND_COMPOSE_FILE}" exec -T db ` +
    `psql -U postgres -d qfl_db -tA -c "select count(*) from information_schema.columns where table_name='games' and column_name='sota_id';"`;

  const heads = runShell(headsCmd);
  const current = runShell(currentCmd);
  const dbVersion = runShell(versionCmd);
  const gamesIdType = runShell(gamesIdTypeCmd);
  const gamesSotaExists = runShell(gamesSotaExistsCmd);

  const headRevision = heads.ok ? parseRevisionFromText(heads.output) : null;
  const currentRevision = current.ok ? parseRevisionFromText(current.output) : null;
  const versionRevision = dbVersion.ok ? dbVersion.output.split('\n').pop()?.trim() || null : null;
  const idType = gamesIdType.ok ? gamesIdType.output.split('\n').pop()?.trim().toLowerCase() : null;
  const sotaExistsCount = gamesSotaExists.ok
    ? Number(gamesSotaExists.output.split('\n').pop()?.trim() || '0')
    : 0;

  items.push(
    recordResult('schema', {
      key: 'alembic_head_vs_current',
      pass: Boolean(headRevision && currentRevision && headRevision === currentRevision),
      detail: `head=${headRevision || 'n/a'} current=${currentRevision || 'n/a'}`,
    })
  );
  items.push(
    recordResult('schema', {
      key: 'db_alembic_version',
      pass: Boolean(headRevision && versionRevision && headRevision === versionRevision),
      detail: `head=${headRevision || 'n/a'} version_table=${versionRevision || 'n/a'}`,
    })
  );
  items.push(
    recordResult('schema', {
      key: 'games_id_bigint',
      pass: idType === 'bigint',
      detail: `games.id type=${idType || 'n/a'}`,
    })
  );
  items.push(
    recordResult('schema', {
      key: 'games_sota_id_exists',
      pass: sotaExistsCount === 1,
      detail: `games.sota_id columns=${sotaExistsCount}`,
    })
  );

  sectionSummary('schema', items);
}

async function discoverRuntimeIds() {
  const ids = {
    teamId1: null,
    teamId2: null,
    playerId: null,
    newsId: 1,
    gameId: null,
  };

  const teams = await requestApiWithRetry(
    'GET',
    `${API_PREFIX}/teams?season_id=${SEASON_ID}&lang=${LANGUAGE}&limit=20`
  );
  if (teams.ok) {
    const teamItems = extractCollection(teams.body);
    if (teamItems.length > 0) {
      const uniqueTeamIds = Array.from(
        new Set(
          teamItems
            .map((item) => extractEntityId(item, ['id', 'team_id']))
            .filter((value) => value !== null)
        )
      );
      ids.teamId1 = uniqueTeamIds[0] ?? null;
      ids.teamId2 = uniqueTeamIds[1] ?? null;
    }
  }

  if (!ids.teamId1 || !ids.teamId2) {
    const table = await requestApiWithRetry(
      'GET',
      `${API_PREFIX}/seasons/${SEASON_ID}/table?lang=${LANGUAGE}`
    );
    if (table.ok) {
      const tableItems = extractCollection(table.body);
      const tableTeamIds = Array.from(
        new Set(
          tableItems
            .map((item) => extractEntityId(item, ['team_id', 'id']))
            .filter((value) => value !== null)
        )
      );
      if (!ids.teamId1) ids.teamId1 = tableTeamIds[0] ?? null;
      if (!ids.teamId2) {
        const second = tableTeamIds.find((value) => value !== ids.teamId1);
        ids.teamId2 = second ?? null;
      }
    }
  }

  const players = await requestApiWithRetry(
    'GET',
    `${API_PREFIX}/seasons/${SEASON_ID}/player-stats?sort_by=goals&limit=1&offset=0&lang=${LANGUAGE}`
  );
  if (players.ok) {
    const items = extractCollection(players.body);
    if (items.length > 0) {
      ids.playerId = extractEntityId(items[0], ['player_id', 'id']);
    }
  }

  const latestNews = await requestApiWithRetry(
    'GET',
    `${API_PREFIX}/news/latest?lang=${LANGUAGE}&limit=1&tournament_id=${TOURNAMENT_ID}`
  );
  if (latestNews.ok) {
    const latestItems = extractCollection(latestNews.body);
    const latestId = latestItems.length
      ? extractEntityId(latestItems[0], ['id', 'news_id'])
      : null;
    ids.newsId = latestId ?? ids.newsId;
  }

  const games = await requestApiWithRetry(
    'GET',
    `${API_PREFIX}/games?season_id=${SEASON_ID}&limit=5&lang=${LANGUAGE}`
  );
  if (games.ok) {
    const gameItems = extractCollection(games.body);
    if (gameItems.length > 0) {
      ids.gameId = extractEntityId(gameItems[0], ['id', 'game_id']);
      if (!ids.teamId1 || !ids.teamId2) {
        for (const game of gameItems) {
          const gameTeamIds = extractTeamIdsFromGame(game);
          for (const value of gameTeamIds) {
            if (!ids.teamId1) {
              ids.teamId1 = value;
              continue;
            }
            if (!ids.teamId2 && value !== ids.teamId1) {
              ids.teamId2 = value;
            }
          }
          if (ids.teamId1 && ids.teamId2) break;
        }
      }
    }
  }

  if (!ids.newsId) {
    ids.newsId = 1;
  }
  if (ids.teamId1 && !ids.teamId2) {
    ids.teamId2 = ids.teamId1;
  }

  return ids;
}

function passByExpectedStatus(status, expectedStatuses) {
  return expectedStatuses.includes(status);
}

async function runRuntimeGetSmoke() {
  log('\n[3/6] Runtime GET smoke');
  const ids = await discoverRuntimeIds();
  const items = [];
  items.push(
    recordResult('runtime_get', {
      key: 'discovered_ids',
      pass: Boolean(ids.teamId1 && ids.teamId2 && ids.playerId && ids.newsId && ids.gameId),
      detail: `team1=${ids.teamId1} team2=${ids.teamId2} player=${ids.playerId} news=${ids.newsId} game=${ids.gameId}`,
    })
  );

  const checks = [
    {
      key: 'season_table',
      path: `${API_PREFIX}/seasons/${SEASON_ID}/table?lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'season_results_grid',
      path: `${API_PREFIX}/seasons/${SEASON_ID}/results-grid?lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'season_games',
      path: `${API_PREFIX}/seasons/${SEASON_ID}/games?tour=${DEFAULT_TOUR}&lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'season_player_stats',
      path: `${API_PREFIX}/seasons/${SEASON_ID}/player-stats?sort_by=goals&limit=5&offset=0&lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'season_team_stats',
      path: `${API_PREFIX}/seasons/${SEASON_ID}/team-stats?sort_by=points&limit=20&offset=0&lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'season_statistics',
      path: `${API_PREFIX}/seasons/${SEASON_ID}/statistics?lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'season_goals_by_period',
      path: `${API_PREFIX}/seasons/${SEASON_ID}/goals-by-period`,
      expectedStatuses: [200],
    },
    {
      key: 'games_match_center',
      path: `${API_PREFIX}/games?season_id=${SEASON_ID}&group_by_date=true&lang=${LANGUAGE}&limit=10`,
      expectedStatuses: [200],
    },
    {
      key: 'news_slider',
      path: `${API_PREFIX}/news/slider?lang=${LANGUAGE}&limit=5&tournament_id=${TOURNAMENT_ID}`,
      expectedStatuses: [200],
    },
    {
      key: 'news_latest',
      path: `${API_PREFIX}/news/latest?lang=${LANGUAGE}&limit=10&tournament_id=${TOURNAMENT_ID}`,
      expectedStatuses: [200],
    },
    {
      key: 'news_paginated',
      path: `${API_PREFIX}/news?lang=${LANGUAGE}&page=1&per_page=12&tournament_id=${TOURNAMENT_ID}`,
      expectedStatuses: [200],
    },
    {
      key: 'news_by_id',
      path: `${API_PREFIX}/news/${ids.newsId}?lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'news_navigation',
      path: `${API_PREFIX}/news/${ids.newsId}/navigation?lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'news_reactions',
      path: `${API_PREFIX}/news/${ids.newsId}/reactions`,
      expectedStatuses: [200],
    },
    {
      key: 'teams_list',
      path: `${API_PREFIX}/teams?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'team_detail',
      path: `${API_PREFIX}/teams/${ids.teamId1}?lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.teamId1,
      skipReason: 'teamId1 not discovered',
      optional: false,
    },
    {
      key: 'team_overview',
      path: `${API_PREFIX}/teams/${ids.teamId1}/overview?season_id=${SEASON_ID}&fixtures_limit=5&leaders_limit=8&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.teamId1,
      skipReason: 'teamId1 not discovered',
      optional: false,
    },
    {
      key: 'team_stats',
      path: `${API_PREFIX}/teams/${ids.teamId1}/stats?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: ALLOW_TEAM_STATS_404 ? [200, 404] : [200],
      skip: !ids.teamId1,
      skipReason: 'teamId1 not discovered',
      optional: false,
    },
    {
      key: 'team_players',
      path: `${API_PREFIX}/teams/${ids.teamId1}/players?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.teamId1,
      skipReason: 'teamId1 not discovered',
      optional: false,
    },
    {
      key: 'team_games',
      path: `${API_PREFIX}/teams/${ids.teamId1}/games?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.teamId1,
      skipReason: 'teamId1 not discovered',
      optional: false,
    },
    {
      key: 'team_coaches',
      path: `${API_PREFIX}/teams/${ids.teamId1}/coaches?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.teamId1,
      skipReason: 'teamId1 not discovered',
      optional: false,
    },
    {
      key: 'head_to_head',
      path: `${API_PREFIX}/teams/${ids.teamId1}/vs/${ids.teamId2}/head-to-head?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.teamId1 || !ids.teamId2,
      skipReason: 'team IDs not discovered',
      optional: false,
    },
    {
      key: 'player_detail',
      path: `${API_PREFIX}/players/${ids.playerId}?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.playerId,
      skipReason: 'playerId not discovered',
      optional: false,
    },
    {
      key: 'player_games',
      path: `${API_PREFIX}/players/${ids.playerId}/games?season_id=${SEASON_ID}&limit=10&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.playerId,
      skipReason: 'playerId not discovered',
      optional: false,
    },
    {
      key: 'player_stats',
      path: `${API_PREFIX}/players/${ids.playerId}/stats?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.playerId,
      skipReason: 'playerId not discovered',
      optional: false,
    },
    {
      key: 'player_teammates',
      path: `${API_PREFIX}/players/${ids.playerId}/teammates?season_id=${SEASON_ID}&limit=10&lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.playerId,
      skipReason: 'playerId not discovered',
      optional: false,
    },
    {
      key: 'player_tournaments',
      path: `${API_PREFIX}/players/${ids.playerId}/tournaments?lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.playerId,
      skipReason: 'playerId not discovered',
      optional: false,
    },
    {
      key: 'match_detail',
      path: `${API_PREFIX}/games/${ids.gameId}?lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.gameId,
      skipReason: 'gameId not discovered',
      optional: false,
    },
    {
      key: 'match_stats',
      path: `${API_PREFIX}/games/${ids.gameId}/stats?lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.gameId,
      skipReason: 'gameId not discovered',
      optional: false,
    },
    {
      key: 'match_lineup',
      path: `${API_PREFIX}/games/${ids.gameId}/lineup?lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.gameId,
      skipReason: 'gameId not discovered',
      optional: false,
    },
    {
      key: 'match_events',
      path: `${API_PREFIX}/live/events/${ids.gameId}?lang=${LANGUAGE}`,
      expectedStatuses: [200],
      skip: !ids.gameId,
      skipReason: 'gameId not discovered',
      optional: false,
    },
    {
      key: 'page_leadership',
      path: `${API_PREFIX}/pages/leadership/${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'page_contacts',
      path: `${API_PREFIX}/pages/contacts/${LANGUAGE}`,
      expectedStatuses: [200],
    },
    {
      key: 'page_documents',
      path: `${API_PREFIX}/pages/documents/${LANGUAGE}`,
      expectedStatuses: [200],
    },
  ];

  for (const check of checks) {
    if (check.skip) {
      items.push(
        recordResult('runtime_get', {
          key: check.key,
          method: 'GET',
          path: check.path,
          pass: check.optional === true,
          skipped: true,
          detail: check.skipReason,
        })
      );
      continue;
    }
    const response = await requestApi('GET', check.path);
    const pass = passByExpectedStatus(response.status, check.expectedStatuses);
    items.push(
      recordResult('runtime_get', {
        key: check.key,
        method: 'GET',
        path: check.path,
        status: response.status,
        pass,
        expected: check.expectedStatuses.join('|'),
        detail: detailFromBody(response.body),
      })
    );
  }

  sectionSummary('runtime_get', items);
  return ids;
}

function numberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

async function runWriteFlowSmoke(ids) {
  log('\n[4/6] Runtime write-flow smoke (news reactions)');
  const items = [];

  if (!ids.newsId) {
    items.push(
      recordResult('runtime_write', {
        key: 'write_flow_skipped',
        pass: false,
        detail: 'newsId not discovered',
      })
    );
    sectionSummary('runtime_write', items);
    return;
  }

  const reactionsBefore = await requestApi(
    'GET',
    `${API_PREFIX}/news/${ids.newsId}/reactions`
  );
  const beforeViews = numberOrNull(reactionsBefore.body?.views);

  const viewResponse = await requestApi(
    'POST',
    `${API_PREFIX}/news/${ids.newsId}/view`,
    { body: {} }
  );
  items.push(
    recordResult('runtime_write', {
      key: 'post_view',
      method: 'POST',
      path: `${API_PREFIX}/news/${ids.newsId}/view`,
      status: viewResponse.status,
      pass: viewResponse.status === 200,
      expected: '200',
      detail: detailFromBody(viewResponse.body),
    })
  );

  const reactionsAfterView = await requestApi(
    'GET',
    `${API_PREFIX}/news/${ids.newsId}/reactions`
  );
  const afterViews = numberOrNull(reactionsAfterView.body?.views);
  const viewIncrementPass =
    reactionsAfterView.status === 200 &&
    (beforeViews === null || afterViews === null || afterViews >= beforeViews + 1);
  items.push(
    recordResult('runtime_write', {
      key: 'view_increment',
      method: 'GET',
      path: `${API_PREFIX}/news/${ids.newsId}/reactions`,
      status: reactionsAfterView.status,
      pass: viewIncrementPass,
      expected: 'views increment',
      detail: `beforeViews=${beforeViews ?? 'n/a'} afterViews=${afterViews ?? 'n/a'}`,
    })
  );

  const likeFirst = await requestApi(
    'POST',
    `${API_PREFIX}/news/${ids.newsId}/like`,
    { body: {} }
  );
  const likeFirstLiked = likeFirst.body?.liked;
  items.push(
    recordResult('runtime_write', {
      key: 'post_like_first',
      method: 'POST',
      path: `${API_PREFIX}/news/${ids.newsId}/like`,
      status: likeFirst.status,
      pass: likeFirst.status === 200 && likeFirstLiked === true,
      expected: '200 + liked=true',
      detail: detailFromBody(likeFirst.body),
    })
  );

  const reactionsAfterFirstLike = await requestApi(
    'GET',
    `${API_PREFIX}/news/${ids.newsId}/reactions`
  );
  items.push(
    recordResult('runtime_write', {
      key: 'reactions_after_first_like',
      method: 'GET',
      path: `${API_PREFIX}/news/${ids.newsId}/reactions`,
      status: reactionsAfterFirstLike.status,
      pass:
        reactionsAfterFirstLike.status === 200 &&
        reactionsAfterFirstLike.body?.liked === true,
      expected: '200 + liked=true',
      detail: detailFromBody(reactionsAfterFirstLike.body),
    })
  );

  const likeSecond = await requestApi(
    'POST',
    `${API_PREFIX}/news/${ids.newsId}/like`,
    { body: {} }
  );
  items.push(
    recordResult('runtime_write', {
      key: 'post_like_second',
      method: 'POST',
      path: `${API_PREFIX}/news/${ids.newsId}/like`,
      status: likeSecond.status,
      pass: likeSecond.status === 200 && likeSecond.body?.liked === false,
      expected: '200 + liked=false',
      detail: detailFromBody(likeSecond.body),
    })
  );

  const reactionsAfterSecondLike = await requestApi(
    'GET',
    `${API_PREFIX}/news/${ids.newsId}/reactions`
  );
  items.push(
    recordResult('runtime_write', {
      key: 'reactions_after_second_like',
      method: 'GET',
      path: `${API_PREFIX}/news/${ids.newsId}/reactions`,
      status: reactionsAfterSecondLike.status,
      pass:
        reactionsAfterSecondLike.status === 200 &&
        reactionsAfterSecondLike.body?.liked === false,
      expected: '200 + liked=false',
      detail: detailFromBody(reactionsAfterSecondLike.body),
    })
  );

  sectionSummary('runtime_write', items);
}

async function runNegativeChecks() {
  log('\n[5/6] Negative checks');
  const items = [];

  const checks = [
    {
      key: 'news_by_id_not_found',
      method: 'GET',
      path: `${API_PREFIX}/news/${NEGATIVE_ID}?lang=${LANGUAGE}`,
      expectedStatuses: [404],
    },
    {
      key: 'news_view_not_found',
      method: 'POST',
      path: `${API_PREFIX}/news/${NEGATIVE_ID}/view`,
      expectedStatuses: [404],
      body: {},
    },
    {
      key: 'news_like_not_found',
      method: 'POST',
      path: `${API_PREFIX}/news/${NEGATIVE_ID}/like`,
      expectedStatuses: [404],
      body: {},
    },
    {
      key: 'news_reactions_not_found',
      method: 'GET',
      path: `${API_PREFIX}/news/${NEGATIVE_ID}/reactions`,
      expectedStatuses: [404],
    },
    {
      key: 'team_not_found',
      method: 'GET',
      path: `${API_PREFIX}/teams/${NEGATIVE_ID}?lang=${LANGUAGE}`,
      expectedStatuses: [404],
    },
    {
      key: 'player_not_found',
      method: 'GET',
      path: `${API_PREFIX}/players/${NEGATIVE_ID}?season_id=${SEASON_ID}&lang=${LANGUAGE}`,
      expectedStatuses: [404],
    },
    {
      key: 'game_not_found',
      method: 'GET',
      path: `${API_PREFIX}/games/${NEGATIVE_ID}?lang=${LANGUAGE}`,
      expectedStatuses: [404],
    },
  ];

  for (const check of checks) {
    const response = await requestApi(check.method, check.path, {
      body: check.body,
    });
    const statusPass = passByExpectedStatus(response.status, check.expectedStatuses);
    const pass = statusPass && response.status !== 500;
    items.push(
      recordResult('negative', {
        key: check.key,
        method: check.method,
        path: check.path,
        status: response.status,
        pass,
        expected: check.expectedStatuses.join('|'),
        detail: detailFromBody(response.body),
      })
    );
  }

  sectionSummary('negative', items);
}

function extractTested500LogLines(logText) {
  const lines = logText.split('\n');
  const requestPrefixes = observedRequests.map((req) => req.apiPath.split('?')[0]);
  const uniquePrefixes = Array.from(new Set(requestPrefixes));
  return lines.filter((line) => {
    if (!line.includes('HTTP/1.1" 500')) return false;
    return uniquePrefixes.some((prefix) => line.includes(` ${prefix}`));
  });
}

async function runLogGuard() {
  log('\n[6/6] Backend log guard (no 500 for tested routes)');
  const items = [];
  const logsCmd =
    `afsad=1 docker compose -f "${BACKEND_COMPOSE_FILE}" logs --since "${startTime}" backend`;
  const logs = runShell(logsCmd);
  if (!logs.ok) {
    items.push(
      recordResult('log_guard', {
        key: 'backend_logs_available',
        pass: false,
        detail: 'Failed to read backend logs',
      })
    );
    sectionSummary('log_guard', items);
    return;
  }

  const failingLines = extractTested500LogLines(logs.output);
  items.push(
    recordResult('log_guard', {
      key: 'no_500_in_tested_routes',
      pass: failingLines.length === 0,
      detail:
        failingLines.length === 0
          ? 'no 500 lines'
          : failingLines.slice(0, 5).join(' | ').slice(0, 400),
    })
  );

  sectionSummary('log_guard', items);
}

function renderMarkdownReport(overallOk) {
  const lines = [];
  lines.push('# Frontend API Audit Report');
  lines.push('');
  lines.push(`- Timestamp: ${new Date().toISOString()}`);
  lines.push(`- Backend: ${BACKEND_BASE_URL}`);
  lines.push(`- OpenAPI: ${OPENAPI_URL}`);
  lines.push(`- Season: ${SEASON_ID}`);
  lines.push(`- Language: ${LANGUAGE}`);
  lines.push(`- Overall: ${overallOk ? 'PASS' : 'FAIL'}`);
  lines.push('');

  lines.push('## Section Summary');
  lines.push('');
  lines.push('| Section | Status | Passed | Failed |');
  lines.push('|---|---:|---:|---:|');
  sections.forEach((section) => {
    lines.push(
      `| ${section.section} | ${section.ok ? 'PASS' : 'FAIL'} | ${section.passed} | ${section.failed} |`
    );
  });
  lines.push('');

  const failed = allResults.filter((x) => !x.pass);
  lines.push('## Failing Checks');
  lines.push('');
  if (failed.length === 0) {
    lines.push('- none');
  } else {
    failed.forEach((item) => {
      lines.push(
        `- [${item.section}] \`${item.key}\` ${item.method ? `${item.method} ` : ''}\`${item.path || ''}\` ` +
          `status=${item.status ?? 'n/a'} expected=${item.expected ?? 'n/a'} detail=${item.detail ?? ''}`
      );
    });
  }
  lines.push('');

  lines.push('## Runtime Matrix');
  lines.push('');
  lines.push('| Section | Key | Method | Path | Status | Expected | Pass | Detail |');
  lines.push('|---|---|---|---|---:|---|---:|---|');
  allResults.forEach((item) => {
    lines.push(
      `| ${item.section} | ${item.key} | ${item.method || '-'} | ${item.path || '-'} | ${item.status ?? '-'} | ` +
        `${item.expected || '-'} | ${item.pass ? 'yes' : 'no'} | ${(item.detail || '').replace(/\|/g, '\\|')} |`
    );
  });

  return `${lines.join('\n')}\n`;
}

async function writeReports(overallOk) {
  const jsonPayload = {
    generatedAt: new Date().toISOString(),
    startedAt: startTime,
    backendBaseUrl: BACKEND_BASE_URL,
    openapiUrl: OPENAPI_URL,
    seasonId: SEASON_ID,
    language: LANGUAGE,
    tournamentId: TOURNAMENT_ID,
    overallOk,
    sections,
    results: allResults,
  };

  await mkdir(path.dirname(OUTPUT_JSON), { recursive: true });
  await writeFile(OUTPUT_JSON, `${JSON.stringify(jsonPayload, null, 2)}\n`, 'utf8');

  await mkdir(path.dirname(OUTPUT_MD), { recursive: true });
  await writeFile(OUTPUT_MD, renderMarkdownReport(overallOk), 'utf8');
}

function printConsoleSummary(overallOk) {
  log('\n=== API AUDIT SUMMARY ===');
  sections.forEach((section) => {
    log(
      `${section.ok ? 'PASS' : 'FAIL'} ${section.section} ` +
        `(passed=${section.passed} failed=${section.failed})`
    );
  });
  const failed = allResults.filter((x) => !x.pass);
  if (failed.length > 0) {
    log('\nTop failures:');
    failed.slice(0, 10).forEach((f) => {
      log(
        `- [${f.section}] ${f.key} ${f.method || ''} ${f.path || ''} ` +
          `status=${f.status ?? 'n/a'} expected=${f.expected ?? 'n/a'} detail=${f.detail ?? ''}`
      );
    });
  }
  log(`\nReport JSON: ${OUTPUT_JSON}`);
  log(`Report MD:   ${OUTPUT_MD}`);
  log(`Overall: ${overallOk ? 'PASS' : 'FAIL'}`);
}

async function main() {
  try {
    await runContractCheck();
    await runSchemaGuard();
    const ids = await runRuntimeGetSmoke();
    await runWriteFlowSmoke(ids);
    await runNegativeChecks();
    await runLogGuard();

    const overallOk = sections.every((x) => x.ok);
    await writeReports(overallOk);
    printConsoleSummary(overallOk);
    process.exitCode = overallOk ? 0 : 1;
  } catch (error) {
    log(`[audit:api] fatal error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

main();
