'use client';

import { Calendar, MapPin, Users, Flag } from 'lucide-react';
import { MatchDetail } from '@/types';
import { format } from 'date-fns';
import { ru, kk, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface MatchInfoCardProps {
  match: MatchDetail;
}

export function MatchInfoCard({ match }: MatchInfoCardProps) {
  const { t, i18n } = useTranslation('match');

  const localeMap = {
    ru: ru,
    kz: kk,
    en: enUS,
  };

  const currentLocale = localeMap[i18n.language as keyof typeof localeMap] || ru;

  const formattedTime = (() => {
    if (!match.date) return 'TBD';

    // If we have both date and time, combine them
    if (match.time) {
      const dateTimeString = `${match.date}T${match.time}`;
      return format(new Date(dateTimeString), 'PPp', { locale: currentLocale });
    }

    // If only date, show date only
    return format(new Date(match.date), 'PPP', { locale: currentLocale });
  })();

  const infoItems = [
    {
      icon: Flag,
      label: t('matchInfo.referee'),
      value: match.referee || '-',
      show: true,
    },
    {
      icon: MapPin,
      label: t('matchInfo.stadium'),
      value: match.stadium
        ? `${match.stadium.name}${match.stadium.city ? `, ${match.stadium.city}` : ''}`
        : '-',
      show: true,
    },
    {
      icon: Calendar,
      label: t('matchInfo.time'),
      value: formattedTime,
      show: true,
    },
    {
      icon: Users,
      label: t('matchInfo.attendance'),
      value: match.visitors ? match.visitors.toLocaleString() : '-',
      show: match.visitors !== undefined && match.visitors !== null,
    },
  ];

  const visibleItems = infoItems.filter(item => item.show);

  if (visibleItems.length === 0) return null;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {t('matchInfo.title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 truncate">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
