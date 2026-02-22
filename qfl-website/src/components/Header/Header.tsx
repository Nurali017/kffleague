'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MainNav } from './MainNav';
import { MobileMenu } from './MobileMenu';
import { NavItem, LiveMatchData } from './types';
import { useTournament } from '@/contexts/TournamentContext';

// Mock live match data - replace with actual API call
const mockLiveMatch: LiveMatchData | null = null; // Set to null when no live match
// Example with live match:
// const mockLiveMatch: LiveMatchData = {
//   id: '123',
//   homeTeam: 'Астана',
//   awayTeam: 'Кайрат',
//   homeScore: 2,
//   awayScore: 1,
//   minute: 67,
//   isLive: true,
// };

export function Header() {
  const { t, i18n } = useTranslation('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentTournament, effectiveSeasonId } = useTournament();
  const lang = i18n.language?.substring(0, 2) === 'kz' ? 'kz' : 'ru';
  const teamsHref = `/teams?tournament=${currentTournament.id}&season=${effectiveSeasonId}`;

  // Navigation items with translations
  const navItems: NavItem[] = [
    {
      key: 'table',
      label: t('items.table', { defaultValue: lang === 'kz' ? 'Кесте' : 'Таблица' }),
      href: '/table',
    },
    {
      key: 'teams',
      label: t('items.teams', { defaultValue: lang === 'kz' ? 'Командалар' : 'Команды' }),
      href: teamsHref,
    },
    {
      key: 'stats',
      label: t('items.stats', { defaultValue: lang === 'kz' ? 'Статистика' : 'Статистика' }),
      href: '/stats',
      children: [
        {
          key: 'teams',
          label: t('items.teams', { defaultValue: lang === 'kz' ? 'Командалар' : 'Команды' }),
          href: '/stats/teams',
        },
        {
          key: 'players',
          label: t('items.players', { defaultValue: lang === 'kz' ? 'Ойыншылар' : 'Игроки' }),
          href: '/stats/players',
        },
        // HIDDEN: Referees temporarily disabled
        // { key: 'referees', label: t('items.referees'), href: '/stats/referees' },
      ],
    },
    {
      key: 'news',
      label: t('items.news', { defaultValue: lang === 'kz' ? 'Жаңалықтар' : 'Новости' }),
      href: '/news',
      children: [
        {
          key: 'newsType',
          label: t('items.newsType', { defaultValue: lang === 'kz' ? 'Жаңалықтар' : 'Новости' }),
          href: '/news?article_type=news',
        },
        {
          key: 'analytics',
          label: t('items.analytics', { defaultValue: lang === 'kz' ? 'Спорттық мақала' : 'Спортивная статья' }),
          href: '/news?article_type=analytics',
        },
      ],
    },
    {
      key: 'matches',
      label: t('items.matches', { defaultValue: lang === 'kz' ? 'Матчтар' : 'Матчи' }),
      href: '/matches',
      isLive: true,
    },
    // HIDDEN: Media temporarily disabled
    // {
    //   key: 'media',
    //   label: t('items.media'),
    //   href: '/media',
    //   children: [
    //     { key: 'video', label: t('items.video'), href: '/video' },
    //     { key: 'photo', label: t('items.photo'), href: '/photo' },
    //   ],
    // },
    {
      key: 'league',
      label: t('items.league', { defaultValue: lang === 'kz' ? 'Лига' : 'Лига' }),
      href: '/league',
      children: [
        {
          key: 'management',
          label: t('items.management', { defaultValue: lang === 'kz' ? 'Басшылық' : 'Руководство' }),
          href: '/league/management',
        },
        {
          key: 'documents',
          label: t('items.documents', { defaultValue: lang === 'kz' ? 'Құжаттар' : 'Документы' }),
          href: '/league/documents',
        },
        {
          key: 'contacts',
          label: t('items.contacts', { defaultValue: lang === 'kz' ? 'Байланыс' : 'Контакты' }),
          href: '/contacts',
        },
      ],
    },
  ];

  // Handle scroll - shrink header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md shadow-black/10' : ''
      }`}
    >
      {/* Main navigation */}
      <MainNav
        navItems={navItems}
        hasLiveMatch={!!mockLiveMatch}
        onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        isScrolled={isScrolled}
      />

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        hasLiveMatch={!!mockLiveMatch}
      />
    </header>
  );
}
