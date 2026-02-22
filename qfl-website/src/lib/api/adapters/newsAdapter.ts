import { NewsReactions } from '@/types';
import { ApiClientError, isApiClientError } from '@/lib/api/http/errors';

export function adaptNewsReactionsFallback(error: unknown): NewsReactions {
  if (isApiClientError(error) && error.status === 404) {
    return { views: 0, likes: 0, liked: false };
  }

  if (error instanceof ApiClientError && error.status === 0) {
    return { views: 0, likes: 0, liked: false };
  }

  return { views: 0, likes: 0, liked: false };
}

export function getNewsBackendGapMessage(): string {
  return 'Backend gap: /news/{id}/view, /news/{id}/like, /news/{id}/reactions';
}
