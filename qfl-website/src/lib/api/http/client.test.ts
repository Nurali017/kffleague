import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApiHttpClient } from './client';
import { ApiClientError } from './errors';

describe('api http client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('serializes array query parameters as repeated keys', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const client = createApiHttpClient();
    await client.get('/games', {
      query: {
        team_ids: [1, 5],
        tours: [12, 13],
        status: 'live',
        hide_past: false,
      },
    });

    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain('/api/v1/games?');
    expect(calledUrl).toContain('team_ids=1');
    expect(calledUrl).toContain('team_ids=5');
    expect(calledUrl).toContain('tours=12');
    expect(calledUrl).toContain('tours=13');
    expect(calledUrl).toContain('status=live');
    expect(calledUrl).toContain('hide_past=false');
  });

  it('throws ApiClientError with backend detail', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ detail: 'Not found' }), {
          status: 404,
          headers: { 'content-type': 'application/json' },
        })
      )
    );

    const client = createApiHttpClient();
    const promise = client.get('/unknown');

    await expect(promise).rejects.toBeInstanceOf(ApiClientError);
    await expect(promise).rejects.toMatchObject({
      status: 404,
      message: 'Not found',
    });
  });
});
