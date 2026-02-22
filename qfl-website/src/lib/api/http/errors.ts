export interface ApiClientErrorOptions {
  url: string;
  method: string;
  status: number;
  payload?: unknown;
  cause?: unknown;
}

function toMessage(status: number, payload: unknown): string {
  if (payload && typeof payload === 'object') {
    const maybeDetail = (payload as Record<string, unknown>).detail;
    if (typeof maybeDetail === 'string' && maybeDetail.trim()) {
      return maybeDetail;
    }

    const maybeMessage = (payload as Record<string, unknown>).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  if (status === 0) {
    return 'Network error';
  }

  return `HTTP error ${status}`;
}

export class ApiClientError extends Error {
  readonly url: string;
  readonly method: string;
  readonly status: number;
  readonly payload?: unknown;

  constructor(options: ApiClientErrorOptions) {
    super(toMessage(options.status, options.payload));
    this.name = 'ApiClientError';
    this.url = options.url;
    this.method = options.method;
    this.status = options.status;
    this.payload = options.payload;
    if (options.cause) {
      // Preserve nested error for debugging in dev.
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}
