import { describe, it, expect } from 'vitest';
import { apiClient } from '../client';

describe('apiClient', () => {
  it('should make a successful GET request', async () => {
    const response = await apiClient.get('/seasons/61/table');

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.table)).toBe(true);
  });

  it('should handle request with query params', async () => {
    const response = await apiClient.get('/seasons/61/games', {
      tour: 26,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.items)).toBe(true);
  });

  it('should return error for non-existent endpoint', async () => {
    const response = await apiClient.get('/non-existent');

    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
  });
});
