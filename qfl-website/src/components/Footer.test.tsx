import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { renderWithProviders, screen } from '@/test/utils';
import { Footer } from './Footer';

describe('Footer', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('ru');
  });

  it('renders ru localization and configured footer links', () => {
    renderWithProviders(<Footer />);

    expect(screen.getByRole('heading', { name: 'ТУРНИРЫ' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ИНФОРМАЦИЯ' })).toBeInTheDocument();
    expect(
      screen.getByText('Официальный технологический, дата- и инновационный партнер')
    ).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        `© ${currentYear} Премьер-лига Казахстана. При использовании материалов обязательна ссылка на официальный сайт.`
      )
    ).toBeInTheDocument();

    const expectedLinks = [
      { name: 'ПРЕМЬЕР-ЛИГА', href: '/table?tournament=pl' },
      { name: 'ПЕРВАЯ ЛИГА', href: '/table?tournament=1l' },
      { name: 'OLIMPBET КУБОК КАЗАХСТАНА', href: '/table?tournament=cup' },
      { name: 'СУПЕРКУБОК', href: '/matches' },
      { name: 'ВТОРАЯ ЛИГА', href: '/table?tournament=2l' },
      { name: 'ЖЕНСКАЯ ЛИГА', href: '/table?tournament=el' },
      { name: 'НОВОСТИ', href: '/news' },
      { name: 'ДОКУМЕНТЫ', href: '/league/documents' },
      { name: 'КОНТАКТЫ', href: '/contacts' },
    ];

    expectedLinks.forEach(({ name, href }) => {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    });

    expect(document.querySelector('a[href="#"]')).not.toBeInTheDocument();
  });

  it('renders kz localization', async () => {
    await i18n.changeLanguage('kz');

    renderWithProviders(<Footer />);

    expect(screen.getByRole('heading', { name: 'ТУРНИРЛЕР' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'АҚПАРАТ' })).toBeInTheDocument();
    expect(
      screen.getByText('Ресми технологиялық, деректер және инновациялық серіктес')
    ).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        `© ${currentYear} Қазақстан Премьер-лигасы. Материалдарды пайдалану кезінде ресми сайтқа сілтеме беру қажет.`
      )
    ).toBeInTheDocument();
  });
});
