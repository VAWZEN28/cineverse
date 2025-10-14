// API Client with JWT token interceptor for Cineverse
import { authService } from './authService';

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  retryOnAuthFailure?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: any;

  constructor(status: number, statusText: string, data?: any) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: Array<(config: RequestInit) => Promise<RequestInit> | RequestInit> = [];
  private responseInterceptors: Array<(response: Response) => Promise<Response> | Response> = [];

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add default request interceptor for authentication
    this.addRequestInterceptor(this.authInterceptor.bind(this));
    
    // Add default response interceptor for token refresh
    this.addResponseInterceptor(this.authResponseInterceptor.bind(this));
  }

  // Request interceptor for adding authentication headers
  private async authInterceptor(config: RequestInit & { skipAuth?: boolean }): Promise<RequestInit> {
    if (config.skipAuth) {
      return config;
    }

    const authHeaders = authService.getAuthHeader();
    
    if (Object.keys(authHeaders).length > 0) {
      config.headers = {
        ...config.headers,
        ...authHeaders,
      };
    }

    return config;
  }

  // Response interceptor for handling authentication errors and token refresh
  private async authResponseInterceptor(response: Response): Promise<Response> {
    // If the response is successful, return it as is
    if (response.ok) {
      return response;
    }

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401) {
      const token = authService.getAccessToken();
      
      // Only attempt refresh if we have a token and user is authenticated
      if (token && authService.isAuthenticated()) {
        try {
          await authService.refreshToken();
          
          // Retry the original request with new token
          const originalRequest = response.clone();
          const retryHeaders = {
            ...Object.fromEntries(originalRequest.headers.entries()),
            ...authService.getAuthHeader(),
          };

          const retryResponse = await fetch(originalRequest.url, {
            method: originalRequest.method || 'GET',
            headers: retryHeaders,
            body: await originalRequest.blob().then(blob => blob.size > 0 ? blob : undefined),
          });

          if (retryResponse.ok) {
            return retryResponse;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Token refresh failed, user needs to login again
          authService.removeTokens();
          window.location.href = '/login';
        }
      } else {
        // No token or not authenticated, redirect to login
        window.location.href = '/login';
      }
    }

    return response;
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: (config: RequestInit) => Promise<RequestInit> | RequestInit) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: (response: Response) => Promise<Response> | Response) {
    this.responseInterceptors.push(interceptor);
  }

  // Apply request interceptors
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let modifiedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    
    return modifiedConfig;
  }

  // Apply response interceptors
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    
    return modifiedResponse;
  }

  // Build full URL
  private buildURL(endpoint: string): string {
    // Handle absolute URLs
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    
    // Handle relative URLs
    const cleanBase = this.baseURL.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    
    return `${cleanBase}/${cleanEndpoint}`;
  }

  // Make HTTP request
  private async makeRequest<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      skipAuth = false,
      retryOnAuthFailure = true,
      ...requestOptions
    } = options;

    // Prepare request configuration
    const config: RequestInit & { skipAuth?: boolean } = {
      ...requestOptions,
      skipAuth,
      headers: {
        ...this.defaultHeaders,
        ...requestOptions.headers,
      },
    };

    // Apply request interceptors
    const finalConfig = await this.applyRequestInterceptors(config);

    const url = this.buildURL(endpoint);
    
    try {
      // Make the request
      let response = await fetch(url, finalConfig);

      // Apply response interceptors
      response = await this.applyResponseInterceptors(response);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: response.statusText };
          }
        } else {
          errorData = { message: response.statusText };
        }

        throw new ApiError(response.status, response.statusText, errorData);
      }

      // Parse response data
      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as unknown as T;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(0, 'Network Error', { 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
  }

  // HTTP Methods
  async get<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(
    endpoint: string, 
    data?: any, 
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(
    endpoint: string, 
    data?: any, 
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(
    endpoint: string, 
    data?: any, 
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Upload file
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const uploadOptions = {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...Object.fromEntries(
          Object.entries(options.headers || {}).filter(
            ([key]) => key.toLowerCase() !== 'content-type'
          )
        ),
      },
    };

    return this.makeRequest<T>(endpoint, uploadOptions);
  }

  // Configure base URL
  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Configure default headers
  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  // Remove default header
  removeDefaultHeader(key: string) {
    delete this.defaultHeaders[key];
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export class for creating additional instances if needed
export { ApiClient };

// Utility function for handling API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.data?.message) {
      return error.data.message;
    }
    return `${error.status}: ${error.statusText}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};