'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { NewsArticle } from '@/types';
import { NewsCard } from './NewsCard';
import { staggerContainer, fadeInUp } from '@/lib/motion';

interface NewsGridProps {
  news: NewsArticle[];
  loading?: boolean;
  variant?: 'grid' | 'list';
  showStats?: boolean;
  className?: string;
}

function NewsCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-4 p-4 bg-white dark:bg-dark-surface rounded-xl animate-pulse border border-gray-100 dark:border-slate-700">
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5" />
          </div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20 mt-2" />
        </div>
        <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-lg shrink-0" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-slate-700" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24 mt-4" />
      </div>
    </div>
  );
}

export function NewsGrid({
  news,
  loading = false,
  variant = 'grid',
  showStats = false,
  className = '',
}: NewsGridProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={className}>
        {variant === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <NewsCardSkeleton key={index} variant="compact" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <p className="text-gray-500 dark:text-slate-400 text-lg">
          {t('news.noResults', 'Новостей не найдено')}
        </p>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <motion.div
        className={`space-y-4 ${className}`}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {news.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <NewsCard news={item} variant="compact" showStats={showStats} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {news.map((item) => (
        <motion.div
          key={item.id}
          variants={fadeInUp}
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <NewsCard news={item} showStats={showStats} />
        </motion.div>
      ))}
    </motion.div>
  );
}
