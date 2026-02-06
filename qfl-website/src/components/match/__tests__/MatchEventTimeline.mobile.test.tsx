import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@/test/utils';
import { EnhancedMatchEvent, GameTeam } from '@/types';
import { MatchEventTimeline } from '../MatchEventTimeline';

const homeTeam: GameTeam = { id: 1, name: 'Home', logo_url: null };
const awayTeam: GameTeam = { id: 2, name: 'Away', logo_url: null };

const events: EnhancedMatchEvent[] = [
  {
    id: 101,
    half: 1,
    minute: 5,
    event_type: 'goal',
    team_id: 1,
    team_name: 'Home',
    player_id: 'p1',
    player_name: 'Player One',
    player_number: 9,
  },
];

describe('MatchEventTimeline (mobile)', () => {
  it('opens and closes the event details sheet on tap', async () => {
    render(
      <MatchEventTimeline
        events={events}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        currentMinute={90}
      />
    );

    const mobile = screen.getByTestId('match-timeline-mobile');
    fireEvent.click(within(mobile).getByTestId('timeline-event-101'));

    expect(screen.getByRole('dialog', { name: /детали события/i })).toBeInTheDocument();
    expect(screen.getByText('Player One')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('timeline-event-backdrop'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /детали события/i })).not.toBeInTheDocument();
    });
  });
});

