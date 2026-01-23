import { NavItem } from './types';

export const getNavItems = (t: (key: string) => string): NavItem[] => [
  {
    key: 'tournament',
    label: t('tournament'),
    children: [
      { key: 'table', label: t('table'), href: '/table' },
      { key: 'calendar', label: t('calendar'), href: '/matches' },
      { key: 'stats', label: t('stats'), href: '/stats' },
      { key: 'scorers', label: t('scorers'), href: '/scorers' },
    ],
  },
  {
    key: 'matches',
    label: t('matches'),
    href: '/matches',
    isLive: true,
  },
  {
    key: 'clubs',
    label: t('clubs'),
    children: [
      { key: 'all-clubs', label: t('allClubs'), href: '/clubs' },
    ],
  },
  {
    key: 'news',
    label: t('news'),
    href: '/news',
  },
  {
    key: 'media',
    label: t('media'),
    children: [
      { key: 'video', label: t('video'), href: '/video' },
      { key: 'photo', label: t('photo'), href: '/photo' },
      { key: 'podcasts', label: t('podcasts'), href: '/podcasts' },
    ],
  },
  {
    key: 'league',
    label: t('league'),
    children: [
      { key: 'management', label: t('management'), href: '/league/management' },
      { key: 'documents', label: t('documents'), href: '/league/documents' },
      { key: 'contacts', label: t('contacts'), href: '/contacts' },
    ],
  },
];

export const socialLinks = [
  { key: 'instagram', href: 'https://instagram.com/qpl_kz', icon: 'Instagram' },
  { key: 'youtube', href: 'https://youtube.com/@qpl_kz', icon: 'Youtube' },
  { key: 'telegram', href: 'https://t.me/qpl_kz', icon: 'Send' },
  { key: 'tiktok', href: 'https://tiktok.com/@qpl_kz', icon: 'TikTok' },
];
