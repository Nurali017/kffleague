import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import MatchesCalendarPage from './page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        title: 'Матчи',
        'calendarPdf.title': 'Календарь матчей 2026 (PDF)',
        'calendarPdf.description': 'Полный календарь дат матчей сезона 2026 в формате PDF.',
        'calendarPdf.open': 'Открыть PDF',
        'calendarPdf.download': 'Скачать PDF',
        'calendarPdf.fallback': 'Если PDF не отображается, откройте или скачайте файл',
      };
      return dict[key] ?? key;
    },
  }),
}));

describe('MatchesCalendarPage', () => {
  it('renders title and description', () => {
    render(<MatchesCalendarPage />);

    expect(screen.getByText('Календарь матчей 2026 (PDF)')).toBeInTheDocument();
    expect(
      screen.getByText('Полный календарь дат матчей сезона 2026 в формате PDF.')
    ).toBeInTheDocument();
  });

  it('renders open and download links with correct urls', () => {
    render(<MatchesCalendarPage />);

    const openLinks = screen.getAllByRole('link', { name: 'Открыть PDF' });
    const downloadLinks = screen.getAllByRole('link', { name: 'Скачать PDF' });

    expect(openLinks[0]).toHaveAttribute(
      'href',
      '/api/v1/files/view/documents/kpl-2026-calendar-dates.pdf'
    );
    expect(downloadLinks[0]).toHaveAttribute(
      'href',
      '/api/v1/files/download/documents/kpl-2026-calendar-dates.pdf'
    );
  });

  it('renders iframe with pdf view url', () => {
    render(<MatchesCalendarPage />);

    expect(screen.getByTitle('Календарь матчей 2026 (PDF)')).toHaveAttribute(
      'src',
      '/api/v1/files/view/documents/kpl-2026-calendar-dates.pdf'
    );
  });
});

