'use client';

import React from 'react';
import Link from 'next/link';
import { useSeasonStats } from '@/hooks';

// Simple icon components for the stats
const MatchesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="8" width="28" height="16" rx="2" stroke="#1E4D8C" strokeWidth="2" fill="none"/>
    <line x1="16" y1="8" x2="16" y2="24" stroke="#1E4D8C" strokeWidth="2"/>
    <circle cx="8" cy="16" r="3" stroke="#1E4D8C" strokeWidth="2" fill="none"/>
    <circle cx="24" cy="16" r="3" stroke="#1E4D8C" strokeWidth="2" fill="none"/>
  </svg>
);

const BallIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#1E4D8C" strokeWidth="2"/>
    <path d="M12 2C12 2 14 6 14 12C14 18 12 22 12 22" stroke="#1E4D8C" strokeWidth="1.5"/>
    <path d="M12 2C12 2 10 6 10 12C10 18 12 22 12 22" stroke="#1E4D8C" strokeWidth="1.5"/>
    <path d="M2 12H22" stroke="#1E4D8C" strokeWidth="1.5"/>
    <path d="M4 7H20" stroke="#1E4D8C" strokeWidth="1.5"/>
    <path d="M4 17H20" stroke="#1E4D8C" strokeWidth="1.5"/>
  </svg>
);

const WhistleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="15" cy="14" rx="6" ry="5" stroke="#1E4D8C" strokeWidth="2"/>
    <path d="M9 14L4 10" stroke="#1E4D8C" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="15" cy="14" r="2" fill="#1E4D8C"/>
  </svg>
);

const YellowCardIcon = () => (
  <div className="w-5 h-7 bg-yellow-400 rounded-sm shadow-sm" />
);

const DoubleYellowCardIcon = () => (
  <div className="flex -space-x-1">
    <div className="w-5 h-7 bg-yellow-400 rounded-sm shadow-sm" />
    <div className="w-5 h-7 bg-red-500 rounded-sm shadow-sm" />
  </div>
);

const RedCardIcon = () => (
  <div className="w-5 h-7 bg-red-500 rounded-sm shadow-sm" />
);

interface StatItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}

function StatItem({ label, value, icon, isFirst, isLast }: StatItemProps) {
  return (
    <div className={`p-4 md:p-6 ${!isLast ? 'border-r border-gray-200 sm:border-r' : ''} ${!isLast ? 'border-b sm:border-b-0' : ''} hover:bg-gray-50 transition-all duration-200 group cursor-default`}>
      <div className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-2xl md:text-3xl font-black text-[#1E4D8C] transition-transform duration-300 group-hover:scale-105">
          {value}
        </span>
        {icon && <span className="ml-2 transition-transform duration-300 group-hover:scale-110">{icon}</span>}
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function StatsSkeleton() {
  return (
    <section className="py-4 bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-gray-200 rounded" />
          <div className="h-5 w-28 bg-gray-200 rounded" />
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {[...Array(4)].map((_, rowIndex) => (
            <div key={rowIndex} className={`grid grid-cols-1 sm:grid-cols-3 ${rowIndex < 3 ? 'border-b border-gray-200' : ''}`}>
              {[...Array(3)].map((_, colIndex) => (
                <div key={colIndex} className={`p-4 md:p-6 ${colIndex < 2 ? 'border-r border-gray-200 sm:border-r' : ''} ${colIndex < 2 ? 'border-b sm:border-b-0' : ''}`}>
                  <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ))}
          <div className="p-4 border-t border-gray-200">
            <div className="h-3 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SeasonStats() {
  const { stats, loading, error } = useSeasonStats();

  if (loading) {
    return <StatsSkeleton />;
  }

  if (error || !stats) {
    return (
      <section className="py-4 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          <p className="text-red-500">Ошибка загрузки статистики</p>
        </div>
      </section>
    );
  }

  const statsRows = [
    [
      { label: 'СЫГРАННЫЕ МАТЧИ', value: formatNumber(stats.matches_played), icon: <MatchesIcon /> },
      { label: 'ПОБЕДЫ', value: formatNumber(stats.wins) },
      { label: 'НИЧЬИ', value: formatNumber(stats.draws) },
    ],
    [
      { label: 'ОБЩАЯ ПОСЕЩАЕМОСТЬ', value: formatNumber(stats.total_attendance) },
      { label: 'ГОЛЫ', value: formatNumber(stats.total_goals), icon: <BallIcon /> },
      { label: 'ГОЛЫ (СРЕДНЕЕ ЗА МАТЧ)', value: stats.goals_per_match.toFixed(2) },
    ],
    [
      { label: 'ПЕНАЛЬТИ', value: formatNumber(stats.penalties) },
      { label: 'ПЕНАЛЬТИ РЕАЛИЗОВАННЫЕ', value: formatNumber(stats.penalties_scored) },
      { label: 'ФОЛЫ (СРЕДНЕЕ ЗА МАТЧ)', value: formatNumber(stats.fouls_per_match), icon: <WhistleIcon /> },
    ],
    [
      { label: 'ЖЕЛТЫЕ КАРТОЧКИ', value: formatNumber(stats.yellow_cards), icon: <YellowCardIcon /> },
      { label: 'ДВОЙНЫЕ ЖЕЛТЫЕ КАРТОЧКИ', value: formatNumber(stats.second_yellow_cards), icon: <DoubleYellowCardIcon /> },
      { label: 'КРАСНЫЕ КАРТОЧКИ', value: formatNumber(stats.red_cards), icon: <RedCardIcon /> },
    ],
  ];

  const seasonTitle = stats.season_name ? `Статистика ${stats.season_name}` : 'Статистика сезона';

  return (
    <section className="py-4 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1E4D8C]">
            {seasonTitle}
          </h2>
          <Link
            href="/stats"
            className="text-gray-500 font-medium text-sm hover:text-[#1E4D8C] flex items-center transition-colors group"
          >
            Больше данных
            <svg className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {statsRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-1 sm:grid-cols-3 ${rowIndex < statsRows.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              {row.map((stat, colIndex) => (
                <StatItem
                  key={colIndex}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  isFirst={colIndex === 0}
                  isLast={colIndex === row.length - 1}
                />
              ))}
            </div>
          ))}
          <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
            * Приведенная выше статистика считается официальной через 24 часа после окончания последнего матча игрового тура.
          </div>
        </div>
      </div>
    </section>
  );
}
