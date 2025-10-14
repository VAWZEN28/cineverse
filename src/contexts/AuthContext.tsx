import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authService, AuthUser, UserRole, LoginCredentials, RegisterCredentials } from "@/lib/authService";
import { rbac } from "@/lib/rbac";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessFeature: (feature: any) => boolean;
  updateUser: (userData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = useCallback(async () => {
    setUser(null);
    setIsAuthenticated(false);
    authService.removeTokens();
  }, []);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            await handleLogout();
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [handleLogout]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.register(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await handleLogout();
    }
  }, [handleLogout]);

  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      const refreshedUser = authService.getCurrentUser();
      setUser(refreshedUser);
    } catch (error) {
      console.error('Token refresh error:', error);
      await handleLogout();
      throw error;
    }
  }, [handleLogout]);

  const hasPermission = useCallback((permission: string) => {
    return rbac.hasPermission(user, permission);
  }, [user]);

  const hasRole = useCallback((role: UserRole) => {
    return rbac.hasRole(user, role);
  }, [user]);

  const hasAnyRole = useCallback((roles: UserRole[]) => {
    return rbac.hasAnyRole(user, roles);
  }, [user]);

  const canAccessFeature = useCallback((feature: any) => {
    return rbac.canAccessFeature(user, feature);
  }, [user]);

  const updateUser = useCallback((userData: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccessFeature,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
