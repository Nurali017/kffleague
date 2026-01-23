import { config } from '@/config';

const API_BASE_URL = config.api.baseUrl;

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
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          data: null as T,
          success: false,
          error: {
            message: errorData.detail || errorData.message || `HTTP error ${response.status}`,
            status: response.status,
          },
        };
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          status: 0,
        },
      };
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | (string | number)[]>
  ): Promise<ApiResponse<T>> {
    let queryString = '';

    if (params) {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Для массивов добавляем каждый элемент отдельно: team_ids=1&team_ids=5
          value.forEach(v => searchParams.append(key, String(v)));
        } else if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });

      const str = searchParams.toString();
      if (str) queryString = '?' + str;
    }

    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
