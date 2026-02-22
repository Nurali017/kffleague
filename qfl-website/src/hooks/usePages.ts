import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { pagesService } from '@/lib/api/services';
import { LeadershipPage, ContactsPage, DocumentsPage } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

export function useLeadershipPage() {
  const { i18n } = useTranslation();
  const language = i18n.language || 'ru';
  const prefetched = useRoutePrefetchValue<LeadershipPage | null>(
    prefetchKeys.pagesLeadership(language)
  );

  const { data, error, isLoading, mutate } = useSWR<LeadershipPage | null>(
    queryKeys.pages.leadership(language),
    () => pagesService.getLeadershipPage(language),
    {
      fallbackData: prefetched,
      revalidateOnFocus: false,
    }
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
  const prefetched = useRoutePrefetchValue<ContactsPage | null>(
    prefetchKeys.pagesContacts(language)
  );

  const { data, error, isLoading, mutate } = useSWR<ContactsPage | null>(
    queryKeys.pages.contacts(language),
    () => pagesService.getContactsPage(language),
    {
      fallbackData: prefetched,
      revalidateOnFocus: false,
    }
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
  const prefetched = useRoutePrefetchValue<DocumentsPage | null>(
    prefetchKeys.pagesDocuments(language)
  );

  const { data, error, isLoading, mutate } = useSWR<DocumentsPage | null>(
    queryKeys.pages.documents(language),
    () => pagesService.getDocumentsPage(language),
    {
      fallbackData: prefetched,
      revalidateOnFocus: false,
    }
  );

  return {
    page: data,
    documents: data?.structured_data?.documents ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
