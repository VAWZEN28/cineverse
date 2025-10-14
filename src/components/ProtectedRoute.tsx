import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/authService';
import { FEATURE_FLAGS } from '@/lib/rbac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lock, Mail, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  requiredFeature?: keyof typeof FEATURE_FLAGS;
  requiresVerification?: boolean;
  fallbackPath?: string;
  showUnauthorizedPage?: boolean;
}

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const UnauthorizedPage: React.FC<{
  reason: string;
  redirectToLogin?: boolean;
  onGoToLogin?: () => void;
  onGoHome?: () => void;
}> = ({ reason, redirectToLogin = false, onGoToLogin, onGoHome }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          {redirectToLogin ? (
            <Lock className="h-8 w-8 text-destructive" />
          ) : (
            <Shield className="h-8 w-8 text-destructive" />
          )}
        </div>
        <CardTitle className="text-2xl">
          {redirectToLogin ? 'Authentication Required' : 'Access Denied'}
        </CardTitle>
        <CardDescription>
          {reason}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {redirectToLogin 
              ? 'Please sign in to access this feature.'
              : 'You don\'t have the necessary permissions to view this content.'
            }
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-3">
          {redirectToLogin && onGoToLogin && (
            <Button onClick={onGoToLogin} className="flex-1">
              Sign In
            </Button>
          )}
          {onGoHome && (
            <Button 
              variant="outline" 
              onClick={onGoHome} 
              className={redirectToLogin ? "flex-1" : "w-full"}
            >
              Go Home
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

const UnverifiedUserPage: React.FC<{
  user: any;
  onResendVerification?: () => void;
}> = ({ user, onResendVerification }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <Mail className="h-8 w-8 text-accent" />
        </div>
        <CardTitle className="text-2xl">Email Verification Required</CardTitle>
        <CardDescription>
          Please verify your email address to access this feature.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            We've sent a verification link to <strong>{user?.email}</strong>. 
            Check your inbox and click the link to verify your account.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          {onResendVerification && (
            <Button onClick={onResendVerification} variant="outline" className="w-full">
              Resend Verification Email
            </Button>
          )}
          <Button variant="ghost" className="w-full" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requiredFeature,
  requiresVerification = false,
  fallbackPath = '/login',
  showUnauthorizedPage = true
}) => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    hasPermission, 
    hasAnyRole, 
    canAccessFeature 
  } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    if (showUnauthorizedPage) {
      return (
        <UnauthorizedPage
          reason="You need to be signed in to access this page."
          redirectToLogin={true}
          onGoToLogin={() => window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`}
          onGoHome={() => window.location.href = '/'}
        />
      );
    }
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check email verification requirement
  if (requiresVerification && !user.isVerified) {
    return (
      <UnverifiedUserPage
        user={user}
        onResendVerification={() => {
          // TODO: Implement resend verification email
          console.log('Resend verification email');
        }}
      />
    );
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    if (showUnauthorizedPage) {
      return (
        <UnauthorizedPage
          reason={`This page requires one of the following roles: ${requiredRoles.join(', ')}`}
          onGoHome={() => window.location.href = '/'}
        />
      );
    }
    return <Navigate to="/" replace />;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(permission => !hasPermission(permission));
    if (missingPermissions.length > 0) {
      if (showUnauthorizedPage) {
        return (
          <UnauthorizedPage
            reason={`You don't have the required permissions: ${missingPermissions.join(', ')}`}
            onGoHome={() => window.location.href = '/'}
          />
        );
      }
      return <Navigate to="/" replace />;
    }
  }

  // Check feature access
  if (requiredFeature && !canAccessFeature(requiredFeature)) {
    if (showUnauthorizedPage) {
      return (
        <UnauthorizedPage
          reason="This feature is not available for your account type."
          onGoHome={() => window.location.href = '/'}
        />
      );
    }
    return <Navigate to="/" replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
};

// Higher-order component for protecting routes
export const withProtection = (
  Component: React.ComponentType<any>,
  protectionOptions: Omit<ProtectedRouteProps, 'children'>
) => {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute {...protectionOptions}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Specific route protection components for common use cases
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
    {children}
  </ProtectedRoute>
);

export const ModeratorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.MODERATOR]}>
    {children}
  </ProtectedRoute>
);

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]}>
    {children}
  </ProtectedRoute>
);

export const VerifiedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute 
    requiredRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]} 
    requiresVerification={true}
  >
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;