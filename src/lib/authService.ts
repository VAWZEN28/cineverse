// JWT Authentication Service for Cineverse
import { jwtDecode } from 'jwt-decode';

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}

// User permissions based on roles
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    'manage_users',
    'manage_movies',
    'moderate_reviews',
    'view_analytics',
    'edit_site_content',
    'delete_content'
  ],
  [UserRole.MODERATOR]: [
    'moderate_reviews',
    'edit_movie_info',
    'manage_reports'
  ],
  [UserRole.USER]: [
    'create_reviews',
    'rate_movies',
    'bookmark_movies',
    'edit_profile'
  ],
  [UserRole.GUEST]: [
    'view_movies',
    'view_reviews'
  ]
} as const;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
  avatar?: string;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'cineverse_access_token',
  REFRESH_TOKEN: 'cineverse_refresh_token',
  USER_DATA: 'cineverse_user_data'
} as const;

class AuthService {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  private tokenRefreshPromise: Promise<string> | null = null;

  // Token management
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  removeTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // JWT token validation
  isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Decode JWT token
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      return null;
    }
  }

  // Check if token needs refresh (expires within 5 minutes)
  shouldRefreshToken(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      const fiveMinutes = 5 * 60;
      return decoded.exp - currentTime < fiveMinutes;
    } catch {
      return true;
    }
  }

  // Get current user from token
  getCurrentUser(): AuthUser | null {
    const token = this.getAccessToken();
    if (!token || !this.isTokenValid(token)) {
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      permissions: payload.permissions,
      avatar: payload.avatar,
      isVerified: payload.isVerified,
      createdAt: new Date(payload.iat * 1000).toISOString(),
      lastLoginAt: new Date().toISOString()
    };
  }

  // Login with credentials
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // For demo purposes, simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo user data based on email
      const mockUser = this.getMockUserByEmail(credentials.email);
      const mockTokens = this.generateMockTokens(mockUser);

      this.setTokens(mockTokens.accessToken, mockTokens.refreshToken);

      return {
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiresIn: 3600 // 1 hour
      };

      // Real implementation would be:
      // const response = await fetch(`${this.baseURL}/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(credentials)
      // });
      
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Login failed');
      // }
      
      // const data = await response.json();
      // this.setTokens(data.accessToken, data.refreshToken);
      // return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    try {
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const mockUser: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        name: credentials.name,
        role: UserRole.USER,
        permissions: ROLE_PERMISSIONS[UserRole.USER],
        isVerified: false,
        createdAt: new Date().toISOString()
      };

      const mockTokens = this.generateMockTokens(mockUser);
      this.setTokens(mockTokens.accessToken, mockTokens.refreshToken);

      return {
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiresIn: 3600
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(): Promise<string> {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.tokenRefreshPromise;
      return newToken;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      // For demo purposes, generate new mock token
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No current user');
      }

      const mockTokens = this.generateMockTokens(currentUser);
      this.setTokens(mockTokens.accessToken, mockTokens.refreshToken);
      
      return mockTokens.accessToken;

      // Real implementation would be:
      // const response = await fetch(`${this.baseURL}/auth/refresh`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ refreshToken })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Token refresh failed');
      // }
      
      // const data = await response.json();
      // this.setTokens(data.accessToken, data.refreshToken);
      // return data.accessToken;
    } catch (error) {
      this.removeTokens();
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      
      // Real implementation would notify server:
      // if (refreshToken) {
      //   await fetch(`${this.baseURL}/auth/logout`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({ refreshToken })
      //   });
      // }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeTokens();
    }
  }

  // Permission checking
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token ? this.isTokenValid(token) : false;
  }

  // Get authentication header for API requests
  getAuthHeader(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Mock data generators for demo
  private getMockUserByEmail(email: string): AuthUser {
    // Admin user
    if (email.includes('admin')) {
      return {
        id: 'admin_001',
        email,
        name: email.split('@')[0],
        role: UserRole.ADMIN,
        permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        isVerified: true,
        createdAt: new Date().toISOString()
      };
    }

    // Moderator user
    if (email.includes('mod')) {
      return {
        id: 'mod_001',
        email,
        name: email.split('@')[0],
        role: UserRole.MODERATOR,
        permissions: ROLE_PERMISSIONS[UserRole.MODERATOR],
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5f1?w=100&h=100&fit=crop&crop=face',
        isVerified: true,
        createdAt: new Date().toISOString()
      };
    }

    // Regular user
    return {
      id: 'user_' + Math.random().toString(36).substr(2, 6),
      email,
      name: email.split('@')[0],
      role: UserRole.USER,
      permissions: ROLE_PERMISSIONS[UserRole.USER],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      isVerified: true,
      createdAt: new Date().toISOString()
    };
  }

  private generateMockTokens(user: AuthUser): { accessToken: string; refreshToken: string } {
    const now = Math.floor(Date.now() / 1000);
    
    // Create mock JWT payload
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      iat: now,
      exp: now + 3600, // 1 hour
      avatar: user.avatar,
      isVerified: user.isVerified
    };

    // In a real app, these would be proper JWTs signed by the server
    // For demo purposes, we'll create a base64 encoded version
    const header = { alg: 'HS256', typ: 'JWT' };
    const accessToken = [
      btoa(JSON.stringify(header)),
      btoa(JSON.stringify(payload)),
      'mock_signature'
    ].join('.');

    const refreshPayload = { ...payload, exp: now + (7 * 24 * 3600) }; // 7 days
    const refreshToken = [
      btoa(JSON.stringify(header)),
      btoa(JSON.stringify(refreshPayload)),
      'mock_refresh_signature'
    ].join('.');

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();