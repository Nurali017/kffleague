import { describe, expect, it } from 'vitest';
import { parseTeamPageTab } from '../tabState';

describe('team tab state', () => {
  it('parses valid tabs', () => {
    expect(parseTeamPageTab('overview')).toBe('overview');
    expect(parseTeamPageTab('matches')).toBe('matches');
    expect(parseTeamPageTab('squad')).toBe('squad');
    expect(parseTeamPageTab('stats')).toBe('stats');
    expect(parseTeamPageTab('staff')).toBe('staff');
  });

  it('returns null for invalid tabs', () => {
    expect(parseTeamPageTab('foo')).toBeNull();
    expect(parseTeamPageTab('')).toBeNull();
    expect(parseTeamPageTab(undefined)).toBeNull();
    expect(parseTeamPageTab(null)).toBeNull();
  });
});

