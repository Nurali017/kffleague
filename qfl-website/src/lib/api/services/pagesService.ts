import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_LANGUAGE } from '../endpoints';
import { LeadershipPage, ContactsPage, DocumentsPage } from '@/types';

export const pagesService = {
  async getLeadershipPage(
    language: string = DEFAULT_LANGUAGE
  ): Promise<LeadershipPage | null> {
    const response = await apiClient.get<LeadershipPage>(
      ENDPOINTS.PAGE_LEADERSHIP(language)
    );

    if (!response.success) {
      return null;
    }

    return response.data;
  },

  async getContactsPage(
    language: string = DEFAULT_LANGUAGE
  ): Promise<ContactsPage | null> {
    const response = await apiClient.get<ContactsPage>(
      ENDPOINTS.PAGE_CONTACTS(language)
    );

    if (!response.success) {
      return null;
    }

    return response.data;
  },

  async getDocumentsPage(
    language: string = DEFAULT_LANGUAGE
  ): Promise<DocumentsPage | null> {
    const response = await apiClient.get<DocumentsPage>(
      ENDPOINTS.PAGE_DOCUMENTS(language)
    );

    if (!response.success) {
      return null;
    }

    return response.data;
  },
};
