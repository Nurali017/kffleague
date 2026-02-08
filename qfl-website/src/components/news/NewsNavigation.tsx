'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NewsNavigation as NewsNavigationType } from '@/types';

interface NewsNavigationProps {
  navigation: NewsNavigationType;
  className?: string;
}

export function NewsNavigation({ navigation, className = '' }: NewsNavigationProps) {
  const { t } = useTranslation('news');

  const { previous, next } = navigation;

  if (!previous && !next) {
    return null;
  }

  return (
    <nav className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* Previous News */}
      <div className="flex-1">
        {previous ? (
          <Link
            href={`/news/${previous.id}`}
            className="group flex items-start gap-3 p-4 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl hover:border-primary dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
          >
            <div className="flex-shrink-0 p-2 bg-surface-soft dark:bg-dark-surface-soft rounded-lg group-hover:bg-primary dark:group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                {t('previousArticle')}
              </p>
              <h4 className="text-sm font-semibold text-primary dark:text-accent-cyan group-hover:text-accent dark:group-hover:text-accent transition-colors line-clamp-2">
                {previous.title}
              </h4>
            </div>
          </Link>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-dark-surface/50 border border-gray-200 dark:border-dark-border rounded-xl opacity-50">
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center">
              {t('noPrevious')}
            </p>
          </div>
        )}
      </div>

      {/* Next News */}
      <div className="flex-1">
        {next ? (
          <Link
            href={`/news/${next.id}`}
            className="group flex items-start gap-3 p-4 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl hover:border-primary dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
          >
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                {t('nextArticle')}
              </p>
              <h4 className="text-sm font-semibold text-primary dark:text-accent-cyan group-hover:text-accent dark:group-hover:text-accent transition-colors line-clamp-2">
                {next.title}
              </h4>
            </div>
            <div className="flex-shrink-0 p-2 bg-surface-soft dark:bg-dark-surface-soft rounded-lg group-hover:bg-primary dark:group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-dark-surface/50 border border-gray-200 dark:border-dark-border rounded-xl opacity-50">
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center">
              {t('noNext')}
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}
