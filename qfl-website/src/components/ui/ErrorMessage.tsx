'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorMessage({
  message,
  onRetry,
  compact = false,
}: ErrorMessageProps) {
  const { t } = useTranslation('errors');
  const { t: tCommon } = useTranslation();
  const displayMessage = message || t('generic');

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2 text-red-500 text-sm py-4">
        <AlertCircle className="w-4 h-4" />
        <span>{displayMessage}</span>
        {onRetry && (
          <button onClick={onRetry} className="hover:text-red-700">
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-gray-600 mb-4">{displayMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {tCommon('buttons.retry')}
        </button>
      )}
    </div>
  );
}
