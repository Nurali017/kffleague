'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavDropdown } from './NavDropdown';
import { SearchModal } from '../SearchModal';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { NavItem } from './types';

interface MainNavProps {
  navItems: NavItem[];
  hasLiveMatch?: boolean;
  onMobileMenuToggle: () => void;
  isScrolled?: boolean;
  className?: string;
}

export function MainNav({ navItems, hasLiveMatch, onMobileMenuToggle, isScrolled = false, className = '' }: MainNavProps) {
  const { t } = useTranslation('navigation');
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className={`text-[#1E4D8C] border-b border-gray-200 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-sm'
          : 'bg-white'
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
              src="/kpl-logo.webp"
              alt="Қазақстан Премьер-Лигасы"
              className={`w-auto transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`}
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
                  isActive ? 'text-[#E5B73B]' : 'hover:text-primary-light'
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
                      Live
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
          {/* Search Input */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-40 lg:w-48 pl-3 pr-10 py-2 text-sm text-gray-600 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1E4D8C] transition-colors"
                onFocus={() => setIsSearchOpen(true)}
                readOnly
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Mobile Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t('search')}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onMobileMenuToggle}
            aria-label={t('openMenu')}
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
