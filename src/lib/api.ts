/**
 * Basic API client for Senda CMS
 * Handles authentication headers and error responses
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientConfig {
  baseUrl?: string;
  getToken?: () => string | null;
  onTokenRefreshNeeded?: () => Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }>;
  onAuthFailure?: () => void;
}

export class ApiClient {
  private baseUrl: string;
  private getToken: () => string | null;
  private onTokenRefreshNeeded?: () => Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }>;
  private onAuthFailure?: () => void;

  constructor(config?: ApiClientConfig) {
    this.baseUrl =
      config?.baseUrl ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:8000';
    this.getToken = config?.getToken || (() => null);
    this.onTokenRefreshNeeded = config?.onTokenRefreshNeeded;
    this.onAuthFailure = config?.onAuthFailure;
  }

  /**
   * Make an authenticated API request with automatic token refresh
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    // First attempt
    try {
      return await this.makeRequest<T>(endpoint, options);
    } catch (error) {
      // If 401 error and we have token refresh capability, try to refresh and retry
      if (
        error instanceof ApiError &&
        error.status === 401 &&
        this.onTokenRefreshNeeded
      ) {
        try {
          const refreshResponse = await this.onTokenRefreshNeeded();

          if (refreshResponse?.access_token) {
            // Retry the request with new token
            return await this.makeRequest<T>(endpoint, options);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);

          // Call auth failure handler if available
          this.onAuthFailure?.();
        }
      }

      // Re-throw the original error if refresh failed or wasn't attempted
      throw error;
    }
  }

  /**
   * Internal method to make the actual HTTP request
   */
  private async makeRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle error responses
    if (!response.ok) {
      const errorMessage = await this.extractErrorMessage(response);

      // Handle authentication/authorization errors
      if (response.status === 401 || response.status === 403) {
        throw new ApiError(
          errorMessage || 'Authentication failed',
          response.status,
          response,
        );
      }

      // Handle other HTTP errors
      throw new ApiError(
        errorMessage || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response,
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || response.status === 204) {
      return undefined as T;
    }

    // Parse JSON response
    try {
      return await response.json();
    } catch {
      throw new ApiError(
        'Failed to parse response as JSON',
        response.status,
        response,
      );
    }
  }

  /**
   * Extract error message from response
   */
  private async extractErrorMessage(response: Response): Promise<string> {
    try {
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const errorData = await response.json();

        // Common error message patterns
        return (
          errorData.message ||
          errorData.error ||
          errorData.detail ||
          'An error occurred'
        );
      }

      // Fallback to text content
      const text = await response.text();
      return text || response.statusText;
    } catch {
      return response.statusText || 'An error occurred';
    }
  }

  /**
   * Convenience methods for common HTTP verbs
   */
  async get<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Default API client instance
export const apiClient = new ApiClient();
