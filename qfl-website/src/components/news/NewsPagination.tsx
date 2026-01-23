'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function NewsPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: NewsPaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label={t('news.pagination', 'Пагинация новостей')}
      className={`flex items-center justify-center gap-2 mt-8 ${className}`}
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-gray-700 dark:text-slate-300 hover:bg-surface-soft dark:hover:bg-dark-surface-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('news.previous', 'Предыдущая страница')}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">{t('news.previous', 'Назад')}</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500 dark:text-slate-400"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`
                min-w-[40px] px-3 py-2 rounded-lg border transition-all duration-200
                ${
                  isActive
                    ? 'bg-[#1E4D8C] dark:bg-blue-600 text-white border-[#1E4D8C] dark:border-blue-600 font-semibold'
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-surface-soft dark:hover:bg-dark-surface-soft hover:border-[#1E4D8C] dark:hover:border-blue-500'
                }
              `}
              aria-label={`${t('news.page', 'Страница')} ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-gray-700 dark:text-slate-300 hover:bg-surface-soft dark:hover:bg-dark-surface-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('news.next', 'Следующая страница')}
      >
        <span className="hidden sm:inline">{t('news.next', 'Вперед')}</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Page Info (Mobile) */}
      <div className="sm:hidden ml-2 text-sm text-gray-600 dark:text-slate-400">
        {currentPage} / {totalPages}
      </div>
    </nav>
  );
}
