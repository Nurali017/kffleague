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
  const { i18n } = useTranslation();

  const localeMap = {
    ru: ru,
    kz: kk,
    en: enUS,
  };

  const currentLocale = localeMap[i18n.language as keyof typeof localeMap] || ru;

  const formattedTime = match.time
    ? format(new Date(match.time), 'PPp', { locale: currentLocale })
    : 'TBD';

  const infoItems = [
    {
      icon: Flag,
      label: i18n.language === 'kz' ? 'Төреші' : i18n.language === 'en' ? 'Referee' : 'Судья',
      value: match.referee || '-',
      show: true,
    },
    {
      icon: MapPin,
      label: i18n.language === 'kz' ? 'Стадион' : i18n.language === 'en' ? 'Stadium' : 'Стадион',
      value: match.stadium
        ? `${match.stadium.name}${match.stadium.city ? `, ${match.stadium.city}` : ''}`
        : '-',
      show: true,
    },
    {
      icon: Calendar,
      label: i18n.language === 'kz' ? 'Уақыт' : i18n.language === 'en' ? 'Time' : 'Время',
      value: formattedTime,
      show: true,
    },
    {
      icon: Users,
      label: i18n.language === 'kz' ? 'Көрермендер' : i18n.language === 'en' ? 'Attendance' : 'Посещаемость',
      value: match.visitors ? match.visitors.toLocaleString() : '-',
      show: match.visitors !== undefined && match.visitors !== null,
    },
  ];

  const visibleItems = infoItems.filter(item => item.show);

  if (visibleItems.length === 0) return null;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {i18n.language === 'kz' ? 'Матч туралы' : i18n.language === 'en' ? 'Match Information' : 'Информация о матче'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
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
