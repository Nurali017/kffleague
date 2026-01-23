'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown, Instagram, Youtube, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { NavItem } from './types';
import { mobileMenuSlide, modalBackdrop, menuItemsStagger, menuItem } from '@/lib/motion';

// TikTok icon
const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const socialLinks = [
  { key: 'instagram', href: 'https://instagram.com/qpl_kz', icon: Instagram, label: 'Instagram' },
  { key: 'youtube', href: 'https://youtube.com/@qpl_kz', icon: Youtube, label: 'YouTube' },
  { key: 'telegram', href: 'https://t.me/qpl_kz', icon: Send, label: 'Telegram' },
  { key: 'tiktok', href: 'https://tiktok.com/@qpl_kz', icon: TikTokIcon, label: 'TikTok' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  hasLiveMatch?: boolean;
}

export function MobileMenu({ isOpen, onClose, navItems, hasLiveMatch }: MobileMenuProps) {
  const { t } = useTranslation('navigation');
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handleLinkClick = () => {
    onClose();
    setExpandedItems([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#1E4D8C] z-50 lg:hidden"
            variants={mobileMenuSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t('closeMenu')}
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>
          <LanguageSwitcher />
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
          <motion.ul
            className="space-y-1"
            variants={menuItemsStagger}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.includes(item.key);
              const isActive = pathname === item.href;
              const hasActiveChild = item.children?.some(child => child.href === pathname);

              return (
                <motion.li key={item.key} variants={menuItem}>
                  {hasChildren ? (
                    // Accordion item
                    <div>
                      {/* Разделить на Link + Toggle button */}
                      <div className="flex items-center">
                        {/* Кликабельная ссылка на главную категорию */}
                        <Link
                          href={item.href || '#'}
                          onClick={handleLinkClick}
                          className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide rounded-l-lg transition-colors ${
                            hasActiveChild
                              ? 'text-[#E5B73B] bg-white/10'
                              : 'text-white hover:bg-white/5'
                          }`}
                        >
                          {item.label}
                        </Link>

                        {/* Кнопка для toggle accordion */}
                        <button
                          onClick={() => toggleExpanded(item.key)}
                          className={`px-4 py-3 rounded-r-lg transition-colors ${
                            hasActiveChild
                              ? 'text-[#E5B73B] bg-white/10'
                              : 'text-white hover:bg-white/5'
                          }`}
                          aria-expanded={isExpanded}
                          aria-label={`Развернуть ${item.label}`}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Children */}
                      <motion.div
                        className="overflow-hidden"
                        initial={false}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <ul className="ml-4 mt-1 space-y-1 border-l border-white/20 pl-4">
                          {item.children?.map((child) => (
                            <li key={child.key}>
                              <Link
                                href={child.href || '#'}
                                onClick={handleLinkClick}
                                className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  pathname === child.href
                                    ? 'text-[#E5B73B] bg-white/10'
                                    : 'text-white/80 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  ) : (
                    // Simple link
                    <Link
                      href={item.href || '#'}
                      onClick={handleLinkClick}
                      className={`flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wide rounded-lg transition-colors ${
                        isActive
                          ? 'text-[#E5B73B] bg-white/10'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                      {/* Live badge */}
                      {item.isLive && hasLiveMatch && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded text-[10px] font-bold">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                          </span>
                          LIVE
                        </span>
                      )}
                    </Link>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* Footer with social links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map(({ key, href, icon: Icon, label }) => (
              <motion.a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-white"
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
