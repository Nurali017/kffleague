import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/utils';
import { PlayerPageHero } from './PlayerPageHero';
import type { PlayerDetail } from '@/types/player';
import type { TeamDetail } from '@/types/team';

vi.mock('@/components/ui/HeroBackground', () => ({
  HeroBackground: () => <div data-testid="hero-bg" />,
}));

const basePlayer: PlayerDetail = {
  player_id: 10,
  first_name: 'Alihan',
  last_name: 'Tulegenov',
  photo_url: null,
  jersey_number: 77,
  team_id: 13,
  team_name: 'QFL Team',
  position: 'MID',
  nationality: 'Kazakhstan',
  country: {
    id: 1,
    code: 'KZ',
    name: 'Kazakhstan',
  },
};

const team: TeamDetail = {
  id: 13,
  name: 'QFL Team',
};

function getHeroContainer(container: HTMLElement) {
  const heroContainer = container.querySelector('div.rounded-3xl');
  expect(heroContainer).toBeTruthy();
  return heroContainer as HTMLDivElement;
}

function expectNoBorderClasses(node: HTMLElement) {
  const classTokens = node.className.split(/\s+/);
  const hasBorderToken = classTokens.some((token) => token === 'border' || token.startsWith('border-'));
  expect(hasBorderToken).toBe(false);
}

describe('PlayerPageHero', () => {
  it('renders clarity variant hero container without border classes', () => {
    const { container } = renderWithProviders(
      <PlayerPageHero player={basePlayer} team={team} variant="clarity" />
    );

    const heroContainer = getHeroContainer(container);
    expectNoBorderClasses(heroContainer);
    expect(heroContainer.className).toContain('rounded-3xl');
    expect(heroContainer.className).not.toContain('bg-white/10');
    expect(heroContainer.className).not.toContain('backdrop-blur-sm');
  });

  it('renders studio variant hero container without border classes', () => {
    const { container } = renderWithProviders(
      <PlayerPageHero player={basePlayer} team={team} variant="studio" />
    );

    const heroContainer = getHeroContainer(container);
    expectNoBorderClasses(heroContainer);
    expect(heroContainer.className).toContain('rounded-3xl');
    expect(heroContainer.className).not.toContain('bg-black/20');
    expect(heroContainer.className).not.toContain('backdrop-blur-md');
  });
});
