// Security utilities for Cineverse authentication system

/**
 * Rate limiting for authentication attempts
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000, blockDurationMs = 30 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier);

    if (!attempts) {
      return true;
    }

    // Check if block period has expired
    if (attempts.count >= this.maxAttempts) {
      if (now - attempts.lastAttempt > this.blockDurationMs) {
        this.attempts.delete(identifier);
        return true;
      }
      return false;
    }

    // Check if window has expired
    if (now - attempts.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return true;
    }

    return true;
  }

  recordAttempt(identifier: string, success: boolean): void {
    const now = Date.now();
    
    if (success) {
      // Clear attempts on successful login
      this.attempts.delete(identifier);
      return;
    }

    const attempts = this.attempts.get(identifier);
    
    if (!attempts || now - attempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    } else {
      this.attempts.set(identifier, { 
        count: attempts.count + 1, 
        lastAttempt: now 
      });
    }
  }

  getRemainingAttempts(identifier: string): number {
    const attempts = this.attempts.get(identifier);
    if (!attempts) return this.maxAttempts;
    
    const now = Date.now();
    
    // Check if window has expired
    if (now - attempts.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - attempts.count);
  }

  getBlockTimeRemaining(identifier: string): number {
    const attempts = this.attempts.get(identifier);
    if (!attempts || attempts.count < this.maxAttempts) {
      return 0;
    }

    const now = Date.now();
    const blockEndTime = attempts.lastAttempt + this.blockDurationMs;
    
    return Math.max(0, blockEndTime - now);
  }
}

export const authRateLimiter = new RateLimiter();

/**
 * Password strength validation
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Character variety checks
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain uppercase letters');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain numbers');
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain special characters');
  }

  // Common patterns check
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /login/i
  ];

  const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
  if (hasCommonPattern) {
    score -= 2;
    feedback.push('Password contains common patterns');
  }

  return {
    isValid: score >= 4 && feedback.length === 0,
    score: Math.max(0, Math.min(5, score)),
    feedback
  };
};

/**
 * Session management utilities
 */
export const sessionManager = {
  /**
   * Check if session is still valid based on activity
   */
  isSessionActive(): boolean {
    const lastActivity = localStorage.getItem('cineverse_last_activity');
    if (!lastActivity) return false;

    const lastActivityTime = parseInt(lastActivity, 10);
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    return (now - lastActivityTime) < thirtyMinutes;
  },

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    localStorage.setItem('cineverse_last_activity', Date.now().toString());
  },

  /**
   * Clear session data
   */
  clearSession(): void {
    localStorage.removeItem('cineverse_last_activity');
  },

  /**
   * Get session duration
   */
  getSessionDuration(): number {
    const lastActivity = localStorage.getItem('cineverse_last_activity');
    if (!lastActivity) return 0;

    return Date.now() - parseInt(lastActivity, 10);
  }
};

/**
 * Input sanitization utilities
 */
export const sanitizeInput = {
  /**
   * Sanitize string input to prevent XSS
   */
  string(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Sanitize email input
   */
  email(email: string): string {
    return email.toLowerCase().trim();
  },

  /**
   * Remove potentially dangerous characters from filenames
   */
  filename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '');
  }
};

/**
 * Security headers checker (for development)
 */
export const checkSecurityHeaders = (): Promise<{
  secure: boolean;
  missing: string[];
  recommendations: string[];
}> => {
  return new Promise((resolve) => {
    // This would typically be done server-side, but for demo purposes
    // we'll simulate checking important headers
    
    const missing: string[] = [];
    const recommendations: string[] = [];

    // Simulate header checks
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      missing.push('Content-Security-Policy');
      recommendations.push('Implement CSP to prevent XSS attacks');
    }

    if (!window.location.protocol.includes('https') && window.location.hostname !== 'localhost') {
      missing.push('HTTPS');
      recommendations.push('Use HTTPS in production to encrypt data in transit');
    }

    resolve({
      secure: missing.length === 0,
      missing,
      recommendations
    });
  });
};

/**
 * Device fingerprinting for additional security
 */
export const deviceFingerprint = {
  generate(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      !!window.localStorage,
      !!window.sessionStorage,
      canvas.toDataURL()
    ];

    return btoa(components.join('|')).slice(0, 32);
  },

  store(fingerprint: string): void {
    localStorage.setItem('cineverse_device_fp', fingerprint);
  },

  verify(): boolean {
    const stored = localStorage.getItem('cineverse_device_fp');
    const current = this.generate();
    
    if (!stored) {
      this.store(current);
      return true;
    }

    return stored === current;
  }
};

/**
 * Security event logging
 */
interface SecurityEvent {
  type: 'login_success' | 'login_failure' | 'logout' | 'token_refresh' | 'suspicious_activity';
  userId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 100;

  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      ip: 'unknown', // In a real app, this would come from the server
      userAgent: navigator.userAgent
    };

    this.events.unshift(securityEvent);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Store in localStorage for persistence (in production, send to server)
    localStorage.setItem('cineverse_security_log', JSON.stringify(this.events.slice(0, 10)));
    
    console.log('Security Event:', securityEvent);
  }

  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  clearEvents(): void {
    this.events = [];
    localStorage.removeItem('cineverse_security_log');
  }
}

export const securityLogger = new SecurityLogger();

/**
 * Token validation utilities
 */
export const tokenValidator = {
  /**
   * Validate JWT token structure (basic client-side validation)
   */
  validateStructure(token: string): boolean {
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Validate that each part is valid base64
      atob(parts[0]);
      atob(parts[1]);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if token is expired (client-side check)
   */
  isExpired(token: string): boolean {
    if (!this.validateStructure(token)) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  },

  /**
   * Get token expiration time
   */
  getExpiration(token: string): Date | null {
    if (!this.validateStructure(token)) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
};

/**
 * Initialize security monitoring
 */
export const initializeSecurity = (): void => {
  // Update activity on user interactions
  const updateActivity = () => sessionManager.updateActivity();
  
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, updateActivity, true);
  });

  // Check device fingerprint
  if (!deviceFingerprint.verify()) {
    securityLogger.log({
      type: 'suspicious_activity',
      metadata: { reason: 'Device fingerprint mismatch' }
    });
  }

  // Initialize rate limiter cleanup interval
  setInterval(() => {
    // Clean up old rate limiter entries
    const now = Date.now();
    authRateLimiter['attempts'].forEach((value, key) => {
      if (now - value.lastAttempt > 60 * 60 * 1000) { // 1 hour
        authRateLimiter['attempts'].delete(key);
      }
    });
  }, 10 * 60 * 1000); // Run every 10 minutes
};