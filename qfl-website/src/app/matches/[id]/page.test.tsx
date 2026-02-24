import { describe, expect, it, beforeEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

import { renderWithProviders, screen } from '@/test/utils';

import MatchDetailPage from './page';

const useMatchDetailMock = vi.fn();
const useMatchEventsMock = vi.fn();
const useMatchLineupMock = vi.fn();
const useMatchStatsMock = vi.fn();
const matchTabsMock = vi.fn();
const superCupMatchHeaderMock = vi.fn();
const matchEventTimelineMock = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'game-1' }),
}));

vi.mock('@/hooks', () => ({
  useMatchDetail: (...args: unknown[]) => useMatchDetailMock(...args),
  useMatchEvents: (...args: unknown[]) => useMatchEventsMock(...args),
  useMatchLineup: (...args: unknown[]) => useMatchLineupMock(...args),
  useMatchStats: (...args: unknown[]) => useMatchStatsMock(...args),
}));

vi.mock('@/components/MatchHeader', () => ({
  MatchHeader: () => <div data-testid="match-header" />,
}));

vi.mock('@/components/match/MatchEventTimeline', () => ({
  MatchEventTimeline: (props: unknown) => {
    matchEventTimelineMock(props);
    return <div data-testid="match-event-timeline" />;
  },
}));

vi.mock('@/components/supercup', () => ({
  SuperCupMatchHeader: (props: unknown) => {
    superCupMatchHeaderMock(props);
    return <div data-testid="supercup-match-header" />;
  },
  TrophyCabinet: () => <div data-testid="trophy-cabinet" />,
}));

vi.mock('@/components/match/MatchTabs', () => ({
  MatchTabs: (props: {
    protocolUrl?: string | null;
    showLineupsTab?: boolean;
    onTabChange: (tab: 'overview' | 'h2h') => void;
  }) => {
    matchTabsMock(props);
    return (
      <div
        data-testid="match-tabs"
        data-protocol-url={props.protocolUrl ?? ''}
        data-show-lineups={props.showLineupsTab === false ? 'false' : 'true'}
      >
        <button type="button" onClick={() => props.onTabChange('overview')}>
          overview-tab
        </button>
        <button type="button" onClick={() => props.onTabChange('h2h')}>
          h2h-tab
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/match/MatchVideoCard', () => ({
  MatchVideoCard: () => <div data-testid="match-video-card" />,
}));

vi.mock('@/components/match/LineupField', () => ({
  LineupField: () => <div data-testid="lineup-field" />,
}));

vi.mock('@/components/match/LineupFieldMini', () => ({
  LineupFieldMini: () => <div data-testid="lineup-field-mini" />,
}));

vi.mock('@/components/match/TournamentTableMini', () => ({
  TournamentTableMini: () => <div data-testid="tournament-table-mini" />,
}));

vi.mock('@/components/match/MatchStatisticsTab', () => ({
  MatchStatisticsTab: () => <div data-testid="match-statistics-tab" />,
}));

vi.mock('@/components/match/MiniKeyStats', () => ({
  MiniKeyStats: () => <div data-testid="mini-key-stats" />,
}));

vi.mock('@/components/match/H2HContentCards', () => ({
  H2HContentCards: () => <div data-testid="h2h-content-cards" />,
}));

vi.mock('@/lib/api/transformers/matchTransformers', () => ({
  transformTeamStats: () => null,
}));

vi.mock('@/lib/utils/teamLogos', () => ({
  getTeamColor: () => '#1E4D8C',
}));

const baseMatch = {
  id: 'game-1',
  date: '2026-02-01',
  time: '16:00:00',
  tour: 1,
  season_id: 61,
  home_score: 1,
  away_score: 0,
  home_team: { id: 13, name: 'Team 1' },
  away_team: { id: 51, name: 'Team 2' },
  stadium: null,
  has_stats: false,
  has_lineup: false,
  visitors: null,
  is_live: false,
  status: 'finished' as const,
  ticket_url: null,
  video_url: null,
  protocol_url: null as string | null,
  is_schedule_tentative: false,
};

const superCupMatch = {
  ...baseMatch,
  home_team: { id: 13, name: 'Team 1' },
  away_team: { id: 90, name: 'Team 2' },
};

describe('MatchDetailPage protocol tabs integration', () => {
  beforeEach(() => {
    matchTabsMock.mockReset();
    superCupMatchHeaderMock.mockReset();
    matchEventTimelineMock.mockReset();
    useMatchEventsMock.mockReturnValue({ events: { events: [] }, loading: false });
    useMatchLineupMock.mockReturnValue({ lineup: null, loading: false });
    useMatchStatsMock.mockReturnValue({ stats: null, loading: false });
  });

  it('passes protocol_url to MatchTabs when it exists', () => {
    useMatchDetailMock.mockReturnValue({
      match: { ...baseMatch, protocol_url: 'https://example.com/protocol.pdf' },
      loading: false,
      error: null,
    });

    renderWithProviders(<MatchDetailPage />);

    expect(screen.getByTestId('match-tabs')).toHaveAttribute(
      'data-protocol-url',
      'https://example.com/protocol.pdf'
    );
    expect(matchTabsMock).toHaveBeenCalled();
  });

  it('passes empty protocol_url to MatchTabs when protocol is absent', () => {
    useMatchDetailMock.mockReturnValue({
      match: { ...baseMatch, protocol_url: null },
      loading: false,
      error: null,
    });

    renderWithProviders(<MatchDetailPage />);

    expect(screen.getByTestId('match-tabs')).toHaveAttribute('data-protocol-url', '');
    expect(matchTabsMock).toHaveBeenCalled();
  });

  it('hides lineup tab and sidebar lineup block when rendering mode is hidden', () => {
    useMatchDetailMock.mockReturnValue({
      match: { ...baseMatch, protocol_url: null },
      loading: false,
      error: null,
    });
    useMatchLineupMock.mockReturnValue({
      lineup: {
        match_id: 1,
        has_lineup: false,
        rendering: {
          mode: 'hidden',
          source: 'none',
          field_allowed_by_rules: false,
          field_data_valid: false,
        },
        lineups: {
          home_team: { team_id: 1, team_name: 'Home', formation: '4-4-2', starters: [], substitutes: [] },
          away_team: { team_id: 2, team_name: 'Away', formation: '4-4-2', starters: [], substitutes: [] },
        },
      },
      loading: false,
    });

    renderWithProviders(<MatchDetailPage />);

    expect(screen.getByTestId('match-tabs')).toHaveAttribute('data-show-lineups', 'false');
    expect(screen.queryByTestId('lineup-field-mini')).not.toBeInTheDocument();
  });

  it('keeps lineup sidebar block when rendering mode is list', () => {
    useMatchDetailMock.mockReturnValue({
      match: { ...baseMatch, protocol_url: null },
      loading: false,
      error: null,
    });
    useMatchLineupMock.mockReturnValue({
      lineup: {
        match_id: 1,
        has_lineup: true,
        rendering: {
          mode: 'list',
          source: 'matches_players',
          field_allowed_by_rules: true,
          field_data_valid: false,
        },
        lineups: {
          home_team: { team_id: 1, team_name: 'Home', formation: '4-4-2', starters: [], substitutes: [] },
          away_team: { team_id: 2, team_name: 'Away', formation: '4-4-2', starters: [], substitutes: [] },
        },
      },
      loading: false,
    });

    renderWithProviders(<MatchDetailPage />);

    expect(screen.getByTestId('match-tabs')).toHaveAttribute('data-show-lineups', 'true');
    expect(screen.getByTestId('lineup-field-mini')).toBeInTheDocument();
  });

  it('shows schedule disclaimer for tentative match', () => {
    useMatchDetailMock.mockReturnValue({
      match: { ...baseMatch, is_schedule_tentative: true },
      loading: false,
      error: null,
    });

    renderWithProviders(<MatchDetailPage />);

    expect(
      screen.getByText('Дата и время этого матча могут корректироваться. Окончательное время подтверждается за месяц до начала.')
    ).toBeInTheDocument();
  });

  it('hides schedule disclaimer for non-tentative match', () => {
    useMatchDetailMock.mockReturnValue({
      match: { ...baseMatch, is_schedule_tentative: false },
      loading: false,
      error: null,
    });

    renderWithProviders(<MatchDetailPage />);

    expect(
      screen.queryByText('Дата и время этого матча могут корректироваться. Окончательное время подтверждается за месяц до начала.')
    ).not.toBeInTheDocument();
  });

  it('does not render super cup mobile overview timeline for non-supercup matches', () => {
    useMatchDetailMock.mockReturnValue({
      match: baseMatch,
      loading: false,
      error: null,
    });

    renderWithProviders(<MatchDetailPage />);

    expect(screen.queryByTestId('supercup-mobile-overview-timeline')).not.toBeInTheDocument();
    expect(screen.queryByTestId('supercup-match-header')).not.toBeInTheDocument();
  });

  it('renders super cup mobile overview timeline inside overview content', () => {
    useMatchDetailMock.mockReturnValue({
      match: superCupMatch,
      loading: false,
      error: null,
    });

    renderWithProviders(<MatchDetailPage />);

    expect(screen.getByTestId('supercup-match-header')).toBeInTheDocument();
    expect(screen.getByTestId('supercup-mobile-overview-timeline')).toBeInTheDocument();
    expect(matchEventTimelineMock).toHaveBeenCalledTimes(1);
  });

  it('hides super cup mobile overview timeline when switching away from overview tab', () => {
    useMatchDetailMock.mockReturnValue({
      match: superCupMatch,
      loading: false,
      error: null,
    });

    renderWithProviders(<MatchDetailPage />);
    expect(screen.getByTestId('supercup-mobile-overview-timeline')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'h2h-tab' }));
    expect(screen.queryByTestId('supercup-mobile-overview-timeline')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'overview-tab' }));
    expect(screen.getByTestId('supercup-mobile-overview-timeline')).toBeInTheDocument();
  });
});
