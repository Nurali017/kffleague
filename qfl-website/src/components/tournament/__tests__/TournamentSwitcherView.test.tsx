import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@/test/utils';
import { Tournament } from '@/types/tournament';
import { TournamentSwitcherView } from '../TournamentSwitcherView';

const tournaments: Tournament[] = [
  {
    id: 'pl',
    seasonId: 61,
    type: 'league',
    format: 'round_robin',
    name: { ru: 'Премьер-Лига', kz: 'Премьер-Лига', short: 'ПЛ' },
    logo: '/images/tournaments/pl.png',
    colors: {
      primary: '#0E2A47',
      primaryLight: '#274F7A',
      primaryDark: '#091A2E',
      accent: '#F7C646',
      accentSoft: '#FDE9B4',
    },
    order: 1,
    hasTable: true,
    hasBracket: false,
  },
  {
    id: 'cup',
    seasonId: 71,
    type: 'cup',
    format: 'knockout',
    name: { ru: 'Кубок Казахстана', kz: 'Қазақстан Кубогы', short: 'Кубок' },
    logo: '/images/tournaments/cup.png',
    colors: {
      primary: '#153C2E',
      primaryLight: '#2A6D53',
      primaryDark: '#0D271E',
      accent: '#8BD17C',
      accentSoft: '#D9F2D3',
    },
    order: 2,
    hasTable: false,
    hasBracket: true,
  },
];

function Harness({ onSelect }: { onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <TournamentSwitcherView
      tournaments={tournaments}
      currentId="pl"
      lang="ru"
      open={open}
      onOpenChange={setOpen}
      onSelect={onSelect}
    />
  );
}

describe('TournamentSwitcherView', () => {
  it('opens and selects a tournament', async () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /выбрать турнир/i }));
    expect(screen.getByRole('dialog', { name: /выбор турнира/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });

    fireEvent.click(screen.getByRole('button', { name: /выбрать кубок/i }));
    expect(onSelect).toHaveBeenCalledWith('cup');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /выбор турнира/i })).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on backdrop click', async () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /выбрать турнир/i }));
    expect(screen.getByRole('dialog', { name: /выбор турнира/i })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('tournament-switcher-backdrop'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /выбор турнира/i })).not.toBeInTheDocument();
    });
    expect(onSelect).not.toHaveBeenCalled();
  });
});
