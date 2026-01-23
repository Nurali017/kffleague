'use client';

import React from 'react';
import { Youtube, Instagram, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export function Footer() {
  const { t } = useTranslation('footer');
  const { t: tCommon } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const tournaments = [
    t('tournaments.premierLeague'),
    t('tournaments.firstLeague'),
    t('tournaments.cup'),
    t('tournaments.superCup'),
    t('tournaments.secondLeague'),
    t('tournaments.womenLeague'),
  ];

  const info = [
    t('info.news'),
    t('info.documents'),
    t('info.contacts'),
  ];

  return (
    <footer className="bg-[#1E4D8C] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url(/footer-bg.webp)' }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-3">
            <a href="/" className="block mb-4">
              <img
                src="/logo.png"
                alt={tCommon('league.name')}
                className="h-36 w-auto brightness-0 invert"
              />
            </a>
            <div className="text-white font-bold text-sm leading-tight">
              <p>{tCommon('league.country')}</p>
              <p>{tCommon('league.premierLeague')}</p>
              <p className="text-[#E5B73B]">{tCommon('league.sponsor')}</p>
            </div>
            <a
              href="https://t.me/kffleague"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-4 text-white/80 hover:text-white transition-colors text-sm"
            >
              <Send className="w-4 h-4" />
              <span>@kffleague</span>
            </a>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-bold text-lg mb-4 text-[#E5B73B]">
              {t('tournaments.title')}
            </h3>
            <ul className="space-y-2">
              {tournaments.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-[#E5B73B]">
              {t('info.title')}
            </h3>
            <ul className="space-y-2">
              {info.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
            <div className="flex items-center gap-6 mb-8">
              <img src="/official/kff.svg" alt="KFF" className="h-14 w-auto" />
              <span className="text-white font-black text-2xl tracking-tight">
                FIFA
              </span>
              <img src="/official/uefa.svg" alt="UEFA" className="h-10 w-auto" />
            </div>

            <div className="text-right">
              <p className="text-white/60 text-xs mb-2">
                {t('partners.techPartner')}
              </p>
              <img src="/sota.svg" alt="SOTA" className="h-7 w-auto ml-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              {t('copyright', { year: currentYear })}
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/pflkaz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@kff_league?lang=ru-RU"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://t.me/kffleague"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@KFFLEAGUE-2025"
                target="_blank"
                rel="noopener noreferrer"
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
