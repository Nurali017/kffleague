'use client';

import { useTranslation } from 'react-i18next';
import { useLeadershipPage } from '@/hooks';
import { LeadershipGrid } from '@/components/league';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function ManagementPage() {
  const { t } = useTranslation('league');
  const { page, members, loading, error, refetch } = useLeadershipPage();

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <ErrorMessage
          message={t('management.error', 'Не удалось загрузить данные')}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 md:mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-1 h-8 bg-[#E5B73B] rounded-full" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E4D8C] dark:text-blue-400">
            {page?.title || t('management.title')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('management.description')}
        </p>
      </div>

      {/* Leadership Grid */}
      <LeadershipGrid members={members} />
    </div>
  );
}
