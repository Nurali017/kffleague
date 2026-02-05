'use client';

import { useTranslation } from 'react-i18next';
import { useDocumentsPage } from '@/hooks';
import { DocumentList } from '@/components/league';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function DocumentsPage() {
  const { t } = useTranslation('league');
  const { page, documents, loading, error, refetch } = useDocumentsPage();

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
          message={t('documents.error', 'Не удалось загрузить данные')}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 md:mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-[#E5B73B] rounded-full" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E4D8C] dark:text-accent-cyan">
            {page?.title || t('documents.title')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg ml-4 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
          {t('documents.description')}
        </p>
      </div>

      {/* Documents List */}
      <DocumentList documents={documents} />
    </div>
  );
}
