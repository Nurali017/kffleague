'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLatestNews } from '@/hooks';

interface NewsItem {
  id: number;
  title: string;
  image_url?: string;
  category?: string;
  publish_date: string;
  excerpt?: string;
}

function formatDate(dateStr: string, format: 'short' | 'long' = 'short', language: string = 'ru') {
  const date = new Date(dateStr);
  const locale = language === 'kz' ? 'kk-KZ' : 'ru-RU';

  if (format === 'long') {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString(locale, options);
  }
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
  };
  return date.toLocaleDateString(locale, options);
}

// Featured card - large with image background (lighter gradient)
function FeaturedCard({ news, className, language = 'ru' }: { news: NewsItem; className?: string; language?: string }) {
  return (
    <Link href={`/news/${news.id}`} className="group block h-full">
      <div className={`relative overflow-hidden rounded-2xl h-full bg-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10 ${className || 'min-h-[300px]'}`}>
        <img
          src={news.image_url || '/images/news-placeholder.svg'}
          alt={news.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 via-60% to-black/10" />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 transition-transform duration-500 group-hover:-translate-y-1">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 sm:mb-3 group-hover:text-[#E5B73B] transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {news.title}
          </h3>
          <span className="text-white/90 text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] inline-block transition-all duration-500 group-hover:translate-x-1">{formatDate(news.publish_date, 'long', language)}</span>
        </div>
      </div>
    </Link>
  );
}

// Horizontal card - soft background, title + date left, image right
function HorizontalCard({ news, className, language = 'ru' }: { news: NewsItem; className?: string; language?: string }) {
  return (
    <Link href={`/news/${news.id}`} className={`group block ${className || ''}`}>
      <div className="flex gap-4 sm:gap-3 p-4 bg-surface-soft dark:bg-dark-surface-soft hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all duration-300 hover:shadow-sm h-full">
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 leading-snug group-hover:text-primary-light dark:group-hover:text-blue-400 transition-colors">
            {news.title}
          </h3>
          <span className="text-gray-400 dark:text-slate-500 text-sm mt-auto pt-2 block transition-all duration-300 group-hover:translate-x-0.5">{formatDate(news.publish_date, 'long', language)}</span>
        </div>
        <div className="w-20 rounded-lg overflow-hidden shrink-0 transition-shadow duration-300 group-hover:shadow-md">
          <img
            src={news.image_url || '/images/news-placeholder.svg'}
            alt={news.title}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
          />
        </div>
      </div>
    </Link>
  );
}

// Skeleton components
function FeaturedSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-slate-700 rounded-2xl h-full min-h-[300px]" />
  );
}

function HorizontalSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex gap-4 p-4 bg-surface-soft dark:bg-dark-surface-soft rounded-xl animate-pulse items-center ${className || ''}`}>
      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20 mt-2" />
      </div>
      <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-lg shrink-0" />
    </div>
  );
}

// Featured news component - standalone for use in grid layout
export function NewsFeatured() {
  const { i18n } = useTranslation();
  const { latestNews, loading } = useLatestNews({ limit: 5 });
  const featuredNews = latestNews[0];

  if (loading) {
    return <FeaturedSkeleton />;
  }

  if (!featuredNews) {
    return null;
  }

  return <FeaturedCard news={featuredNews} language={i18n.language} />;
}

// Side cards component - standalone for use in grid layout (3 cards)
export function NewsSideCards() {
  const { i18n } = useTranslation();
  const { latestNews, loading } = useLatestNews({ limit: 4 });
  const sideNews = latestNews.slice(1, 4);

  return (
    <div className="flex flex-col h-full gap-2">
      {loading ? (
        <>
          <HorizontalSkeleton className="flex-1" />
          <HorizontalSkeleton className="flex-1" />
          <HorizontalSkeleton className="flex-1" />
        </>
      ) : (
        sideNews.map((news) => (
          <HorizontalCard key={news.id} news={news} className="flex-1" language={i18n.language} />
        ))
      )}
    </div>
  );
}

// Original NewsSection for backward compatibility (e.g., /news page)
export function NewsSection() {
  const { t, i18n } = useTranslation('common');
  const { latestNews, loading } = useLatestNews({ limit: 5 });

  const featuredNews = latestNews[0];
  const sideNews = latestNews.slice(1, 3);
  const bottomNews = latestNews.slice(3, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1E4D8C] dark:text-blue-400 tracking-tight">{t('newsSection.title')}</h2>
        <Link
          href="/news"
          className="text-gray-500 dark:text-slate-400 font-medium text-sm hover:text-[#1E4D8C] dark:hover:text-blue-400 flex items-center transition-colors group"
        >
          {t('newsSection.viewAll')}
          <ChevronRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Main grid: Featured (left) + 2 side cards (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Featured large news */}
        <div className="lg:row-span-2">
          {loading ? <FeaturedSkeleton /> : featuredNews ? <FeaturedCard news={featuredNews} language={i18n.language} /> : null}
        </div>

        {/* 2 side cards stacked */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <>
              <HorizontalSkeleton />
              <HorizontalSkeleton />
            </>
          ) : (
            sideNews.map((news) => (
              <HorizontalCard key={news.id} news={news} language={i18n.language} />
            ))
          )}
        </div>
      </div>

      {/* Bottom row: 2 horizontal cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {loading ? (
          <>
            <HorizontalSkeleton />
            <HorizontalSkeleton />
          </>
        ) : (
          bottomNews.map((news) => (
            <HorizontalCard key={news.id} news={news} language={i18n.language} />
          ))
        )}
      </div>
    </div>
  );
}
