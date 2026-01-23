import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { pagesService } from '@/lib/api/services';
import { LeadershipPage, ContactsPage, DocumentsPage } from '@/types';

export function useLeadershipPage() {
  const { i18n } = useTranslation();
  const language = i18n.language || 'ru';

  const { data, error, isLoading, mutate } = useSWR<LeadershipPage | null>(
    ['leadershipPage', language],
    () => pagesService.getLeadershipPage(language),
    { revalidateOnFocus: false }
  );

  return {
    page: data,
    members: data?.structured_data?.members ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

export function useContactsPage() {
  const { i18n } = useTranslation();
  const language = i18n.language || 'ru';

  const { data, error, isLoading, mutate } = useSWR<ContactsPage | null>(
    ['contactsPage', language],
    () => pagesService.getContactsPage(language),
    { revalidateOnFocus: false }
  );

  return {
    page: data,
    contacts: data?.structured_data ?? null,
    contentText: data?.content_text ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

export function useDocumentsPage() {
  const { i18n } = useTranslation();
  const language = i18n.language || 'ru';

  const { data, error, isLoading, mutate } = useSWR<DocumentsPage | null>(
    ['documentsPage', language],
    () => pagesService.getDocumentsPage(language),
    { revalidateOnFocus: false }
  );

  return {
    page: data,
    documents: data?.structured_data?.documents ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
