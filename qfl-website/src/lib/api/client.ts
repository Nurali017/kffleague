import { apiHttpClient, toQueryParams } from './http/client';
import { isApiClientError } from './http/errors';

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
}

class ApiClient {
  private mapError(error: unknown): ApiError {
    if (isApiClientError(error)) {
      return {
        message: error.message,
        status: error.status,
      };
    }

    return {
      message: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | (string | number)[]>
  ): Promise<ApiResponse<T>> {
    try {
      const data = await apiHttpClient.get<T>(endpoint, {
        query: toQueryParams(params),
      });
      return { data, success: true };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        error: this.mapError(error),
      };
    }
  }

  async post<T>(
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const data = await apiHttpClient.post<T>(endpoint, {
        body,
      });
      return { data, success: true };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        error: this.mapError(error),
      };
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
