'use client';

import Link from 'next/link';
import { Youtube, Instagram, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export function Footer() {
  const { t } = useTranslation('footer');
  const currentYear = new Date().getFullYear();

  const tournaments = [
    { key: 'tournaments.premierLeague', href: '/table?tournament=pl', defaultValue: 'ПРЕМЬЕР-ЛИГА' },
    { key: 'tournaments.firstLeague', href: '/table?tournament=1l', defaultValue: 'ПЕРВАЯ ЛИГА' },
    { key: 'tournaments.cup', href: '/table?tournament=cup', defaultValue: 'КУБОК КАЗАХСТАНА' },
    { key: 'tournaments.superCup', href: '/matches', defaultValue: 'СУПЕРКУБОК' },
    { key: 'tournaments.secondLeague', href: '/table?tournament=2l', defaultValue: 'ВТОРАЯ ЛИГА' },
    { key: 'tournaments.womenLeague', href: '/table?tournament=el', defaultValue: 'ЖЕНСКАЯ ЛИГА' },
  ];

  const info = [
    { key: 'info.news', href: '/news', defaultValue: 'НОВОСТИ' },
    { key: 'info.documents', href: '/league/documents', defaultValue: 'ДОКУМЕНТЫ' },
    { key: 'info.contacts', href: '/contacts', defaultValue: 'КОНТАКТЫ' },
  ];

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url(/footer-bg.webp)' }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-3">
            <Link href="/" className="block mb-4">
              <img
                src="/logo.png"
                alt={t('brand.logoAlt', 'Премьер-лига Казахстана')}
                className="h-24 md:h-36 w-auto brightness-0 invert"
              />
            </Link>
            <div className="text-white font-bold text-sm leading-tight">
              <p>{t('brand.country', 'КАЗАХСТАН')}</p>
              <p>{t('brand.premierLeague', 'ПРЕМЬЕР-ЛИГА')}</p>
              <p className="text-accent">{t('brand.sponsor', 'ALATAU CITY BANK')}</p>
            </div>
            <a
              href="https://t.me/kffleague"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('social.telegram', 'Telegram')}
              className="flex items-center gap-2 mt-4 text-white/80 hover:text-white transition-colors text-sm"
            >
              <Send className="w-4 h-4" />
              <span>@kffleague</span>
            </a>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-4 text-accent">
              {t('tournaments.title', 'ТУРНИРЛЕР')}
            </h3>
            <ul className="space-y-2">
              {tournaments.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {t(item.key, item.defaultValue)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-accent">
              {t('info.title', 'АҚПАРАТ')}
            </h3>
            <ul className="space-y-2">
              {info.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {t(item.key, item.defaultValue)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
            <div className="flex items-center gap-3 md:gap-6 mb-8">
              <img src="/official/kff.svg" alt="KFF" className="h-10 md:h-14 w-auto" />
              <span className="text-white font-black text-xl md:text-2xl tracking-tight">
                FIFA
              </span>
              <img src="/official/uefa.svg" alt="UEFA" className="h-8 md:h-10 w-auto" />
            </div>

            <div className="text-left lg:text-right">
              <p className="text-white/60 text-xs mb-2 max-w-[300px]">
                {t('partners.techPartner', 'Официальный технологический, дата- и инновационный партнер')}
              </p>
              <img src="/sota.svg" alt="SOTA" className="h-7 w-auto lg:ml-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-xs md:text-sm text-center md:text-left" suppressHydrationWarning>
              {t('copyright', {
                year: currentYear,
                defaultValue:
                  '© {{year}} Қазақстан Премьер-лигасы. Материалдарды пайдалану кезінде ресми сайтқа сілтеме қажет.',
              })}
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/pflkaz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('social.instagram', 'Instagram')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@kff_league?lang=ru-RU"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('social.tiktok', 'TikTok')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://t.me/kffleague"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('social.telegram', 'Telegram')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@KFFLEAGUE-2025"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('social.youtube', 'YouTube')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
