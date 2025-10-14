import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/authService';
import { FEATURE_FLAGS } from '@/lib/rbac';

interface RoleBasedProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permissions?: string[];
  feature?: keyof typeof FEATURE_FLAGS;
  requiresVerification?: boolean;
  fallback?: React.ReactNode;
  requireAll?: boolean; // For permissions: require all permissions instead of any
}

/**
 * Conditionally renders children based on user roles, permissions, or features
 */
export const RoleBased: React.FC<RoleBasedProps> = ({
  children,
  roles = [],
  permissions = [],
  feature,
  requiresVerification = false,
  fallback = null,
  requireAll = false
}) => {
  const { 
    user, 
    isAuthenticated, 
    hasPermission, 
    hasAnyRole, 
    canAccessFeature 
  } = useAuth();

  // Check authentication
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Check email verification
  if (requiresVerification && !user.isVerified) {
    return <>{fallback}</>;
  }

  // Check roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return <>{fallback}</>;
  }

  // Check permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? permissions.every(permission => hasPermission(permission))
      : permissions.some(permission => hasPermission(permission));

    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  // Check feature access
  if (feature && !canAccessFeature(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Shows content only to admin users
 */
export const AdminOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => (
  <RoleBased roles={[UserRole.ADMIN]} fallback={fallback}>
    {children}
  </RoleBased>
);

/**
 * Shows content to admin and moderator users
 */
export const ModeratorPlus: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => (
  <RoleBased roles={[UserRole.ADMIN, UserRole.MODERATOR]} fallback={fallback}>
    {children}
  </RoleBased>
);

/**
 * Shows content to authenticated users (not guests)
 */
export const AuthenticatedOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => (
  <RoleBased roles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]} fallback={fallback}>
    {children}
  </RoleBased>
);

/**
 * Shows content only to verified users
 */
export const VerifiedOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => (
  <RoleBased 
    roles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]} 
    requiresVerification={true}
    fallback={fallback}
  >
    {children}
  </RoleBased>
);

/**
 * Shows content based on specific permission
 */
export const PermissionGated: React.FC<{
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}> = ({ children, permission, fallback = null }) => (
  <RoleBased permissions={[permission]} fallback={fallback}>
    {children}
  </RoleBased>
);

/**
 * Hook for conditional rendering logic in components
 */
export const useRoleCheck = () => {
  const { 
    user, 
    isAuthenticated, 
    hasPermission, 
    hasRole, 
    hasAnyRole, 
    canAccessFeature 
  } = useAuth();

  return {
    user,
    isAuthenticated,
    isAdmin: hasRole(UserRole.ADMIN),
    isModerator: hasRole(UserRole.MODERATOR),
    isUser: hasRole(UserRole.USER),
    isGuest: !isAuthenticated || hasRole(UserRole.GUEST),
    isVerified: user?.isVerified || false,
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccessFeature,
    canManageUsers: hasPermission('manage_users'),
    canManageMovies: hasPermission('manage_movies'),
    canModerateContent: hasPermission('moderate_reviews'),
    canRateMovies: hasPermission('rate_movies'),
    canCreateReviews: hasPermission('create_reviews'),
    canBookmarkMovies: hasPermission('bookmark_movies'),
  };
};

/**
 * Higher-order component for role-based rendering
 */
export const withRoleAccess = <P extends object>(
  Component: React.ComponentType<P>,
  accessConfig: Omit<RoleBasedProps, 'children'>
) => {
  return function RoleProtectedComponent(props: P) {
    return (
      <RoleBased {...accessConfig}>
        <Component {...props} />
      </RoleBased>
    );
  };
};

/**
 * Component that shows user role badge
 */
export const UserRoleBadge: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  const { user } = useAuth();

  if (!user) return null;

  const roleColors = {
    [UserRole.ADMIN]: 'bg-destructive/10 text-destructive border-destructive/20',
    [UserRole.MODERATOR]: 'bg-accent/10 text-accent border-accent/20',
    [UserRole.USER]: 'bg-primary/10 text-primary border-primary/20',
    [UserRole.GUEST]: 'bg-muted/10 text-muted-foreground border-muted/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${roleColors[user.role]} ${className}`}>
      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
    </span>
  );
};

/**
 * Component that shows verification status badge
 */
export const VerificationBadge: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full ${
      user.isVerified 
        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
    } ${className}`}>
      {user.isVerified ? 'Verified' : 'Unverified'}
    </span>
  );
};

/**
 * Navigation helper for role-based menu items
 */
export interface RoleBasedNavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  roles?: UserRole[];
  permissions?: string[];
  feature?: keyof typeof FEATURE_FLAGS;
  requiresVerification?: boolean;
}

export const filterNavItems = (
  items: RoleBasedNavItem[],
  user: any,
  hasPermission: (permission: string) => boolean,
  hasAnyRole: (roles: UserRole[]) => boolean,
  canAccessFeature: (feature: any) => boolean
): RoleBasedNavItem[] => {
  return items.filter(item => {
    // Check authentication
    if (!user && (item.roles || item.permissions || item.feature)) {
      return false;
    }

    // Check verification
    if (item.requiresVerification && !user?.isVerified) {
      return false;
    }

    // Check roles
    if (item.roles && item.roles.length > 0 && !hasAnyRole(item.roles)) {
      return false;
    }

    // Check permissions
    if (item.permissions && item.permissions.length > 0) {
      const hasRequiredPermission = item.permissions.some(permission => 
        hasPermission(permission)
      );
      if (!hasRequiredPermission) {
        return false;
      }
    }

    // Check feature access
    if (item.feature && !canAccessFeature(item.feature)) {
      return false;
    }

    return true;
  });
};