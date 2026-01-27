'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MainNav } from './MainNav';
import { MobileMenu } from './MobileMenu';
import { NavItem, LiveMatchData } from './types';

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
  const { t } = useTranslation('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation items with translations
  const navItems: NavItem[] = [
    { key: 'table', label: t('items.table'), href: '/table' },
    { key: 'teams', label: t('items.teams'), href: '/teams' },
    {
      key: 'stats',
      label: t('items.stats'),
      href: '/stats',
      children: [
        { key: 'teams', label: t('items.teams'), href: '/stats/teams' },
        { key: 'players', label: t('items.players'), href: '/stats/players' },
        // HIDDEN: Referees temporarily disabled
        // { key: 'referees', label: t('items.referees'), href: '/stats/referees' },
      ],
    },
    {
      key: 'news',
      label: t('items.news'),
      href: '/news',
      children: [
        { key: 'newsType', label: t('items.newsType'), href: '/news?article_type=news' },
        { key: 'analytics', label: t('items.analytics'), href: '/news?article_type=analytics' },
      ],
    },
    {
      key: 'matches',
      label: t('items.matches'),
      href: '/matches',
      isLive: true,
    },
    {
      key: 'media',
      label: t('items.media'),
      href: '/media',
      children: [
        { key: 'video', label: t('items.video'), href: '/video' },
        { key: 'photo', label: t('items.photo'), href: '/photo' },
      ],
    },
    {
      key: 'league',
      label: t('items.league'),
      href: '/league',
      children: [
        { key: 'management', label: t('items.management'), href: '/league/management' },
        { key: 'documents', label: t('items.documents'), href: '/league/documents' },
        { key: 'contacts', label: t('items.contacts'), href: '/contacts' },
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
