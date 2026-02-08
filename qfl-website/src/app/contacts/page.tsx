'use client';

import { useTranslation } from 'react-i18next';
import { useContactsPage } from '@/hooks';
import { ContactInfo, SocialLinks } from '@/components/league';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function ContactsPage() {
  const { t, i18n } = useTranslation('league');
  const { page, contacts, loading, error, refetch } = useContactsPage();

  const language = i18n.language as 'kz' | 'ru';
  const address = contacts?.address?.[language] || contacts?.address?.ru;

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
          message={t('contacts.error', 'Не удалось загрузить данные')}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-accent rounded-full" />
          <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-accent-cyan">
            {page?.title || t('contacts.title')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        {contacts && (
          <ContactInfo
            emails={contacts.emails}
            phones={contacts.phones}
            address={address}
            contactPerson={contacts.contact_person}
          />
        )}

        {/* Social Links */}
        {contacts?.social && <SocialLinks social={contacts.social} />}
      </div>
    </div>
  );
}
