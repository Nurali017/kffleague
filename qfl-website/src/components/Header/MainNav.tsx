'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';
import { NavDropdown } from './NavDropdown';
import { SearchModal } from '../SearchModal';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import { NavItem } from './types';

interface MainNavProps {
  navItems: NavItem[];
  hasLiveMatch?: boolean;
  onMobileMenuToggle: () => void;
  isScrolled?: boolean;
  className?: string;
}

export function MainNav({ navItems, hasLiveMatch, onMobileMenuToggle, isScrolled = false, className = '' }: MainNavProps) {
  const { t, i18n } = useTranslation('navigation');
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { currentTournament } = useTournament();
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';

  return (
    <nav className={`text-[#1E4D8C] dark:text-accent-cyan border-b border-gray-200 dark:border-dark-border transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-dark-surface shadow-sm'
          : 'bg-white dark:bg-dark-surface'
      } ${className}`}>
      <div className={`max-w-[1400px] mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'h-16' : 'h-20'
      }`}>
        {/* Logo + Navigation group */}
        <div className="flex items-center gap-8">
          {/* Logo with hover animation */}
          <Link
            href="/"
            className="flex items-center shrink-0 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(229,183,59,0.5)]"
          >
            <img
              src={currentTournament.id === 'pl' ? '/kpl-logo.webp' : currentTournament.logo}
              alt={currentTournament.name[lang] || 'Қазақстан Премьер-Лигасы'}
              className={`w-auto transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'} ${
                currentTournament.id !== 'pl' ? 'brightness-0 sepia saturate-[10] hue-rotate-[190deg] dark:invert dark:sepia-0 dark:saturate-100 dark:hue-rotate-0' : ''
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            // Item with children = dropdown
            if (item.children && item.children.length > 0) {
              return <NavDropdown key={item.key} item={item} />;
            }

            // Simple link
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href || '#'}
                className={`relative text-base font-bold transition-colors duration-200 ${
                  isActive ? 'text-[#E5B73B] dark:text-accent' : 'hover:text-primary-light dark:hover:text-accent'
                }`}
              >
                <span className="flex items-center gap-2" suppressHydrationWarning>
                  {item.label}
                  {/* Live badge */}
                  {item.isLive && hasLiveMatch && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500 rounded text-[10px] font-bold uppercase">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                      </span>
                      {t('liveBadge', { defaultValue: lang === 'kz' ? 'Тікелей' : 'Онлайн' })}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* HIDDEN: Desktop Search Input - temporarily disabled
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-40 lg:w-48 pl-3 pr-10 py-2 text-sm text-gray-600 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-400 bg-gray-50 dark:bg-dark-surface-soft border border-gray-200 dark:border-dark-border-soft rounded-lg focus:outline-none focus:border-[#1E4D8C] dark:focus:border-blue-400 transition-colors"
                onFocus={() => setIsSearchOpen(true)}
                readOnly
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
            </div>
          </div>
          */}

          {/* HIDDEN: Mobile Search - temporarily disabled
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-surface-soft rounded-full transition-colors"
            aria-label={t('search')}
          >
            <Search className="w-5 h-5" />
          </button>
          */}

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-surface-soft rounded-full transition-colors"
            onClick={onMobileMenuToggle}
            aria-label={t('openMenu', lang === 'kz' ? 'Мәзірді ашу' : 'Открыть меню')}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
