import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen, waitFor } from '@/test/utils';
import { TeamYearFilter } from '../TeamYearFilter';

describe('TeamYearFilter', () => {
  const yearItems = [
    { seasonId: 200, year: '2026' },
    { seasonId: 61, year: '2025' },
    { seasonId: 60, year: '2024' },
  ];

  it('renders only year options', () => {
    renderWithProviders(
      <TeamYearFilter items={yearItems} selectedSeasonId={200} onSeasonChange={vi.fn()} />
    );

    const select = screen.getByRole('combobox');
    const optionValues = Array.from(select.querySelectorAll('option')).map((option) => option.value);
    expect(optionValues).toEqual(['2026', '2025', '2024']);
  });

  it('calls onSeasonChange with season id for selected year', async () => {
    const onSeasonChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <TeamYearFilter items={yearItems} selectedSeasonId={200} onSeasonChange={onSeasonChange} />
    );

    await user.selectOptions(screen.getByRole('combobox'), '2025');
    expect(onSeasonChange).toHaveBeenCalledWith(61);
  });

  it('normalizes to first available year when selected season is not present', async () => {
    const onSeasonChange = vi.fn();

    renderWithProviders(
      <TeamYearFilter items={yearItems} selectedSeasonId={999} onSeasonChange={onSeasonChange} />
    );

    await waitFor(() => {
      expect(onSeasonChange).toHaveBeenCalledWith(200);
    });
  });
});
