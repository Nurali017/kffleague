import { config } from '@/config';
import { ApiClientError } from './errors';

type Primitive = string | number | boolean;
export type QueryValue =
  | Primitive
  | null
  | undefined
  | Array<Primitive | null | undefined>;

export type QueryParams = Record<string, QueryValue>;

export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  query?: QueryParams;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

export interface ApiHttpClient {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>;
  get<T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
  post<T>(path: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>;
  put<T>(path: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>;
  patch<T>(path: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>;
  delete<T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>;
}

function serializeQuery(params?: QueryParams): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === null || item === undefined) return;
        searchParams.append(key, String(item));
      });
      return;
    }

    if (value === null || value === undefined) return;
    searchParams.append(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

function getBaseUrl(): string {
  return typeof window === 'undefined' ? config.api.serverBaseUrl : config.api.baseUrl;
}

function toAbsoluteUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

async function parsePayload(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export function createApiHttpClient(): ApiHttpClient {
  async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const method = options.method || 'GET';
    const query = serializeQuery(options.query);
    const url = `${toAbsoluteUrl(path)}${query}`;

    const headers = new Headers(options.headers || {});
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    let body: BodyInit | undefined;
    if (options.body !== undefined && options.body !== null) {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      if (typeof options.body === 'string' || options.body instanceof FormData) {
        body = options.body as BodyInit;
      } else {
        body = JSON.stringify(options.body);
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        method,
        headers,
        body,
      });

      const payload = await parsePayload(response);
      if (!response.ok) {
        throw new ApiClientError({
          url,
          method,
          status: response.status,
          payload,
        });
      }

      return payload as T;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw new ApiClientError({
        url,
        method,
        status: 0,
        payload: null,
        cause: error,
      });
    }
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, options) => request(path, { ...options, method: 'POST' }),
    put: (path, options) => request(path, { ...options, method: 'PUT' }),
    patch: (path, options) => request(path, { ...options, method: 'PATCH' }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  };
}

export const apiHttpClient = createApiHttpClient();

export function toQueryParams(
  params?: Record<string, string | number | boolean | (string | number)[]>
): QueryParams | undefined {
  if (!params) return undefined;
  return params;
}
