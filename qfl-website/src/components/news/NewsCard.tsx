'use client';

import Link from 'next/link';
import { Calendar, Eye, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { imageZoom, imageZoomMedium } from '@/lib/motion';
import { NewsArticle } from '@/types';
import { formatNewsDate } from '@/lib/utils/dateFormat';

interface NewsCardProps {
  news: NewsArticle;
  variant?: 'default' | 'compact' | 'featured';
  showStats?: boolean;
  className?: string;
}

export function NewsCard({
  news,
  variant = 'default',
  showStats = false,
  className = '',
}: NewsCardProps) {
  const { i18n, t } = useTranslation('news');

  if (variant === 'featured') {
    return (
      <Link
        href={`/news/${news.id}`}
        className={`group block h-full ${className}`}
      >
        <motion.div
          initial="rest"
          whileHover="hover"
          className="relative overflow-hidden rounded-2xl h-full bg-gray-100 dark:bg-dark-surface min-h-[400px]"
          variants={{
            rest: {},
            hover: {
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
              transition: { duration: 0.5 },
            },
          }}
        >
          <motion.img
            src={news.image_url || 'https://images.unsplash.com/photo-1579952363873-27f3bde9be2f?q=80&w=800'}
            alt={news.title}
            className="absolute inset-0 w-full h-full object-cover"
            variants={{
              rest: { scale: 1, filter: 'brightness(1)' },
              hover: {
                scale: 1.05,
                filter: 'brightness(1.1)',
                transition: { duration: 0.7, ease: 'easeOut' },
              },
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 via-60% to-black/20" />

          <motion.div
            className="absolute inset-x-0 bottom-0 p-6 md:p-8"
            variants={{
              rest: { y: 0 },
              hover: { y: -4, transition: { duration: 0.5 } },
            }}
          >
            {news.article_type && (
              <div className="mb-3">
                <span className={`inline-block px-3 py-1 text-white text-xs font-bold rounded uppercase ${
                  news.article_type === 'NEWS' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {news.article_type === 'NEWS' ? t('typeNews') : t('typeAnalytics')}
                </span>
              </div>
            )}
            <motion.h3
              className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-lg"
              whileHover={{ color: '#E5B73B' }}
              transition={{ duration: 0.3 }}
            >
              {news.title}
            </motion.h3>
            <p className="text-white/90 text-sm drop-shadow-md flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatNewsDate(news.publish_date, i18n.language)}
            </p>
          </motion.div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/news/${news.id}`}
        className={`group block ${className}`}
      >
        <motion.div
          className="flex gap-4 p-4 bg-white dark:bg-dark-surface rounded-xl h-full border border-gray-100 dark:border-dark-border"
          whileHover={{
            backgroundColor: 'rgb(249 250 251)',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            transition: { duration: 0.3 },
          }}
        >
          <div className="flex-1 min-w-0 flex flex-col">
            {news.article_type && (
              <div className="mb-1">
                <span className={`px-2 py-0.5 text-white text-xs font-bold rounded uppercase ${
                  news.article_type === 'NEWS' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {news.article_type === 'NEWS' ? t('typeNews') : t('typeAnalytics')}
                </span>
              </div>
            )}
            <motion.h3
              className="font-semibold text-[#1E4D8C] dark:text-accent-cyan leading-snug line-clamp-2 mb-2"
              whileHover={{ color: '#E5B73B' }}
              transition={{ duration: 0.3 }}
            >
              {news.title}
            </motion.h3>
            <div className="mt-auto flex items-center gap-3 text-gray-500 dark:text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatNewsDate(news.publish_date, i18n.language)}
              </span>
              {showStats && news.views !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {news.views}
                </span>
              )}
            </div>
          </div>
          <motion.div
            className="w-20 h-20 rounded-lg overflow-hidden shrink-0"
            whileHover={{
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              transition: { duration: 0.3 },
            }}
          >
            <motion.img
              src={news.image_url || 'https://images.unsplash.com/photo-1579952363873-27f3bde9be2f?q=80&w=200'}
              alt={news.title}
              className="w-full h-full object-cover"
              whileHover={{
                scale: 1.1,
                filter: 'brightness(1.05)',
                transition: { duration: 0.5 },
              }}
            />
          </motion.div>
        </motion.div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/news/${news.id}`}
      className={`group block ${className}`}
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-border h-full flex flex-col"
        variants={{
          rest: {
            y: 0,
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            transition: { duration: 0.3 },
          },
          hover: {
            y: -2,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            transition: { duration: 0.3 },
          },
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={news.image_url || 'https://images.unsplash.com/photo-1579952363873-27f3bde9be2f?q=80&w=800'}
            alt={news.title}
            className="w-full h-full object-cover"
            variants={imageZoom}
          />
          {news.article_type && (
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 text-white text-xs font-bold rounded uppercase ${
                news.article_type === 'NEWS' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {news.article_type === 'NEWS' ? t('typeNews') : t('typeAnalytics')}
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <motion.h3
            className="text-lg font-bold text-[#1E4D8C] dark:text-accent-cyan leading-tight mb-2 line-clamp-2"
            whileHover={{ color: '#E5B73B' }}
            transition={{ duration: 0.3 }}
          >
            {news.title}
          </motion.h3>
          {news.excerpt && (
            <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mb-3 line-clamp-2">
              {news.excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center gap-4 text-gray-500 dark:text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatNewsDate(news.publish_date, i18n.language)}
            </span>
            {showStats && news.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {news.views}
              </span>
            )}
            {showStats && news.likes !== undefined && (
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {news.likes}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
