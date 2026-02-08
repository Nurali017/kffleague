'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        {t('errors.pageNotFound', 'Страница не найдена')}
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
      >
        {t('buttons.backToHome', 'На главную')}
      </Link>
    </div>
  );
}
