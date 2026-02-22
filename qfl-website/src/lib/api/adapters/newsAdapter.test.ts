import { describe, expect, it } from 'vitest';
import { adaptNewsReactionsFallback, getNewsBackendGapMessage } from './newsAdapter';
import { ApiClientError } from '@/lib/api/http/errors';

describe('newsAdapter', () => {
  it('returns zeroed reactions fallback for backend gap errors', () => {
    const fallback = adaptNewsReactionsFallback(
      new ApiClientError({
        url: '/news/1/reactions',
        method: 'GET',
        status: 404,
        payload: { detail: 'Not found' },
      })
    );

    expect(fallback).toEqual({
      views: 0,
      likes: 0,
      liked: false,
    });
  });

  it('documents reactions endpoints as backend gap', () => {
    expect(getNewsBackendGapMessage()).toContain('/news/{id}/reactions');
  });
});
