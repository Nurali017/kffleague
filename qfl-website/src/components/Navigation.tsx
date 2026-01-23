'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, User, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchModal } from './SearchModal';

export function Navigation() {
  const { t } = useTranslation('navigation');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'table', label: t('items.table'), to: '/table', active: true },
    { key: 'matches', label: t('items.matches'), to: '/matches', active: true },
    { key: 'news', label: t('items.news'), to: '/news', active: true },
    { key: 'video', label: t('items.video'), to: '#', active: false },
    { key: 'clubs', label: t('items.clubs'), to: '#', active: false },
    { key: 'players', label: t('items.players'), to: '#', active: false },
    { key: 'stats', label: t('items.stats'), to: '/statistics', active: true },
    { key: 'broadcasts', label: t('items.broadcasts'), to: '#', active: false },
    { key: 'kpl', label: t('items.kpl'), to: '#', active: false },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className={`bg-[#1E4D8C] text-white w-full relative transition-all duration-300 ${isScrolled ? 'shadow-lg shadow-black/20' : ''
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/kpl-logo.webp"
              alt="Қазақстан Премьер-Лигасы"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) =>
            item.active && item.to.startsWith('/') ? (
              <Link
                key={item.key}
                href={item.to}
                className={`text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${pathname === item.to ? 'text-[#E5B73B]' : 'hover:text-[#E5B73B]'
                  }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.key}
                className="text-sm font-bold uppercase tracking-wide text-white/40 cursor-not-allowed"
                title="Скоро"
              >
                {item.label}
              </span>
            )
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <button
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Поиск"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Профиль"
          >
            <User className="w-5 h-5" />
          </button>
          <button
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-16 left-0 right-0 bg-[#1E4D8C] border-t border-white/10 shadow-lg z-50 transition-all duration-300 ease-in-out ${isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) =>
              item.active && item.to.startsWith('/') ? (
                <Link
                  key={item.key}
                  href={item.to}
                  onClick={closeMenu}
                  className={`px-4 py-3 text-sm font-bold uppercase tracking-wide rounded-lg transition-colors duration-200 ${pathname === item.to
                      ? 'text-[#E5B73B] bg-white/10'
                      : 'hover:text-[#E5B73B] hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.key}
                  className="px-4 py-3 text-sm font-bold uppercase tracking-wide text-white/40 cursor-not-allowed"
                >
                  {item.label}
                  <span className="ml-2 text-xs normal-case font-normal">(скоро)</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
