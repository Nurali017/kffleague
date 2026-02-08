'use client';

import { Instagram, Youtube, Send } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { LiveMatch } from './LiveMatch';
import { LiveMatchData } from './types';

// TikTok icon (not in lucide-react)
const TikTokIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const socialLinks = [
  { key: 'instagram', href: 'https://instagram.com/qpl_kz', icon: Instagram, label: 'Instagram' },
  { key: 'youtube', href: 'https://youtube.com/@qpl_kz', icon: Youtube, label: 'YouTube' },
  { key: 'telegram', href: 'https://t.me/qpl_kz', icon: Send, label: 'Telegram' },
  { key: 'tiktok', href: 'https://tiktok.com/@qpl_kz', icon: TikTokIcon, label: 'TikTok' },
];

interface TopBarProps {
  liveMatch?: LiveMatchData | null;
  className?: string;
}

export function TopBar({ liveMatch, className = '' }: TopBarProps) {
  return (
    <div className={`bg-primary-dark text-white ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6 h-8 flex items-center justify-between">
        {/* Social Links */}
        <div className="flex items-center gap-1">
          {socialLinks.map(({ key, href, icon: Icon, label }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              aria-label={label}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Live Match Indicator (center) */}
        <div className="hidden md:flex items-center">
          {liveMatch && <LiveMatch match={liveMatch} />}
        </div>

        {/* Language Switcher */}
        <div className="flex items-center">
          <LanguageSwitcher variant="dark" />
        </div>
      </div>
    </div>
  );
}
