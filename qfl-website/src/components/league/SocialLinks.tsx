'use client';

import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SocialLinks as SocialLinksType } from '@/types';

// Custom Instagram icon
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Custom YouTube icon
const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

// Custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

interface SocialLinksProps {
  social: SocialLinksType;
}

const socialConfig = {
  instagram: {
    icon: InstagramIcon,
    label: 'Instagram',
    hoverClass: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500',
    iconBg: 'bg-gradient-to-br from-purple-600/20 to-pink-500/20',
  },
  youtube: {
    icon: YouTubeIcon,
    label: 'YouTube',
    hoverClass: 'hover:bg-red-600',
    iconBg: 'bg-red-500/20',
  },
  telegram: {
    icon: Send,
    label: 'Telegram',
    hoverClass: 'hover:bg-blue-500',
    iconBg: 'bg-blue-500/20',
  },
  tiktok: {
    icon: TikTokIcon,
    label: 'TikTok',
    hoverClass: 'hover:bg-black dark:hover:bg-gray-900',
    iconBg: 'bg-black/10 dark:bg-white/10',
  },
};

export function SocialLinks({ social }: SocialLinksProps) {
  const { t } = useTranslation('league');

  const links = Object.entries(social).filter(([_, url]) => url);

  if (links.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#1E4D8C] dark:text-blue-400 mb-6">
        {t('contacts.socialMedia')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map(([platform, url]) => {
          const config = socialConfig[platform as keyof typeof socialConfig];
          if (!config || !url) return null;

          const Icon = config.icon;

          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-transparent ${config.hoverClass} hover:shadow-lg transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl ${config.iconBg} group-hover:bg-white/20 flex items-center justify-center transition-colors`}>
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors block">
                  {config.label}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-white/70 transition-colors">
                  @{platform}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
