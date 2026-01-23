import { SWRConfiguration } from 'swr';

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
  dedupingInterval: 5 * 60 * 1000, // 5 minutes (matches previous staleTime)
  errorRetryCount: 1,
  shouldRetryOnError: true,
};
