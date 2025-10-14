// Role-Based Access Control utilities for Cineverse
import { UserRole, ROLE_PERMISSIONS, AuthUser } from './authService';

// Permission definitions
export const PERMISSIONS = {
  // User management
  MANAGE_USERS: 'manage_users',
  
  // Movie management
  MANAGE_MOVIES: 'manage_movies',
  EDIT_MOVIE_INFO: 'edit_movie_info',
  
  // Review and rating permissions
  CREATE_REVIEWS: 'create_reviews',
  MODERATE_REVIEWS: 'moderate_reviews',
  RATE_MOVIES: 'rate_movies',
  
  // Content management
  BOOKMARK_MOVIES: 'bookmark_movies',
  EDIT_PROFILE: 'edit_profile',
  EDIT_SITE_CONTENT: 'edit_site_content',
  DELETE_CONTENT: 'delete_content',
  
  // Analytics and reporting
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_REPORTS: 'manage_reports',
  
  // Basic viewing permissions
  VIEW_MOVIES: 'view_movies',
  VIEW_REVIEWS: 'view_reviews'
} as const;

// Feature flags based on user roles
export const FEATURE_FLAGS = {
  // Admin-only features
  ADMIN_PANEL: [UserRole.ADMIN],
  USER_MANAGEMENT: [UserRole.ADMIN],
  SITE_SETTINGS: [UserRole.ADMIN],
  ANALYTICS_DASHBOARD: [UserRole.ADMIN],
  
  // Moderator features
  MODERATION_PANEL: [UserRole.ADMIN, UserRole.MODERATOR],
  CONTENT_MODERATION: [UserRole.ADMIN, UserRole.MODERATOR],
  
  // User features
  MOVIE_RATING: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  MOVIE_REVIEWS: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  BOOKMARKING: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  PROFILE_EDITING: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER],
  
  // Guest features (everyone including guests)
  MOVIE_BROWSING: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER, UserRole.GUEST],
  REVIEW_VIEWING: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER, UserRole.GUEST]
} as const;

export class RoleBasedAccessControl {
  /**
   * Check if user has a specific permission
   */
  static hasPermission(user: AuthUser | null, permission: string): boolean {
    if (!user) return false;
    return user.permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(user: AuthUser | null, permissions: string[]): boolean {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  }

  /**
   * Check if user has all specified permissions
   */
  static hasAllPermissions(user: AuthUser | null, permissions: string[]): boolean {
    if (!user) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  }

  /**
   * Check if user has a specific role
   */
  static hasRole(user: AuthUser | null, role: UserRole): boolean {
    if (!user) return false;
    return user.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(user: AuthUser | null, roles: UserRole[]): boolean {
    if (!user) return false;
    return roles.includes(user.role);
  }

  /**
   * Check if user can access a feature
   */
  static canAccessFeature(user: AuthUser | null, feature: keyof typeof FEATURE_FLAGS): boolean {
    if (!user) {
      // Only allow guest features for unauthenticated users
      return FEATURE_FLAGS[feature].includes(UserRole.GUEST);
    }
    return FEATURE_FLAGS[feature].includes(user.role);
  }

  /**
   * Get user's role hierarchy level (higher number = more permissions)
   */
  static getRoleLevel(role: UserRole): number {
    const hierarchy = {
      [UserRole.GUEST]: 0,
      [UserRole.USER]: 1,
      [UserRole.MODERATOR]: 2,
      [UserRole.ADMIN]: 3
    };
    return hierarchy[role] ?? 0;
  }

  /**
   * Check if user has equal or higher role than required
   */
  static hasMinimumRole(user: AuthUser | null, minRole: UserRole): boolean {
    if (!user) return minRole === UserRole.GUEST;
    return this.getRoleLevel(user.role) >= this.getRoleLevel(minRole);
  }

  /**
   * Filter items based on user permissions
   */
  static filterByPermission<T>(
    user: AuthUser | null,
    items: T[],
    getRequiredPermission: (item: T) => string
  ): T[] {
    if (!user) return [];
    return items.filter(item => this.hasPermission(user, getRequiredPermission(item)));
  }

  /**
   * Check if user can perform action on resource
   */
  static canPerformAction(
    user: AuthUser | null,
    action: string,
    resource?: { ownerId?: string; [key: string]: any }
  ): boolean {
    if (!user) return false;

    // Check if user has the required permission
    if (!this.hasPermission(user, action)) {
      return false;
    }

    // If resource has an owner, check if user is owner or has override permission
    if (resource?.ownerId) {
      const isOwner = user.id === resource.ownerId;
      const canOverride = this.hasAnyRole(user, [UserRole.ADMIN, UserRole.MODERATOR]);
      return isOwner || canOverride;
    }

    return true;
  }

  /**
   * Get available actions for user on a resource
   */
  static getAvailableActions(
    user: AuthUser | null,
    resourceType: 'movie' | 'review' | 'user' | 'profile',
    resource?: { ownerId?: string; [key: string]: any }
  ): string[] {
    if (!user) return [];

    const actionMap = {
      movie: [
        PERMISSIONS.RATE_MOVIES,
        PERMISSIONS.BOOKMARK_MOVIES,
        PERMISSIONS.CREATE_REVIEWS,
        PERMISSIONS.MANAGE_MOVIES,
        PERMISSIONS.EDIT_MOVIE_INFO
      ],
      review: [
        PERMISSIONS.CREATE_REVIEWS,
        PERMISSIONS.MODERATE_REVIEWS,
        PERMISSIONS.DELETE_CONTENT
      ],
      user: [
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.VIEW_ANALYTICS
      ],
      profile: [
        PERMISSIONS.EDIT_PROFILE,
        PERMISSIONS.MANAGE_USERS
      ]
    };

    const relevantActions = actionMap[resourceType] || [];
    return relevantActions.filter(action => 
      this.canPerformAction(user, action, resource)
    );
  }

  /**
   * Check if user is verified
   */
  static isVerified(user: AuthUser | null): boolean {
    return user?.isVerified || false;
  }

  /**
   * Check if action requires verification
   */
  static requiresVerification(action: string): boolean {
    const verificationRequiredActions = [
      PERMISSIONS.CREATE_REVIEWS,
      PERMISSIONS.RATE_MOVIES,
      PERMISSIONS.MANAGE_MOVIES,
      PERMISSIONS.MODERATE_REVIEWS
    ];
    return verificationRequiredActions.includes(action);
  }

  /**
   * Comprehensive permission check with verification requirement
   */
  static canUserPerformAction(
    user: AuthUser | null,
    action: string,
    resource?: { ownerId?: string; [key: string]: any }
  ): {
    allowed: boolean;
    reason?: string;
  } {
    if (!user) {
      return { allowed: false, reason: 'User not authenticated' };
    }

    if (!this.hasPermission(user, action)) {
      return { allowed: false, reason: 'Insufficient permissions' };
    }

    if (this.requiresVerification(action) && !this.isVerified(user)) {
      return { allowed: false, reason: 'Email verification required' };
    }

    if (resource?.ownerId) {
      const isOwner = user.id === resource.ownerId;
      const canOverride = this.hasAnyRole(user, [UserRole.ADMIN, UserRole.MODERATOR]);
      
      if (!isOwner && !canOverride) {
        return { allowed: false, reason: 'Can only perform this action on your own content' };
      }
    }

    return { allowed: true };
  }
}

// Utility hooks and components helpers
export const rbac = RoleBasedAccessControl;