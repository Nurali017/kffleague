import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '@/test/utils';
import { TeamPageTabs } from '../TeamPageTabs';

describe('TeamPageTabs', () => {
  it('calls onChange when user clicks another tab', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<TeamPageTabs activeTab="overview" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Матчи/i }));
    expect(onChange).toHaveBeenCalledWith('matches');
  });

  it('does not render staff tab in navigation', () => {
    renderWithProviders(<TeamPageTabs activeTab="overview" onChange={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /Персонал/i })).not.toBeInTheDocument();
  });
});
