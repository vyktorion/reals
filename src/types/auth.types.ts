// Auth Types - NextAuth integration and custom auth

export interface AuthUser {
  // Basic auth fields (NextAuth compatible)
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Custom fields
  role?: string;
  phone?: string;
  avatar?: string;
  // Additional user fields
  firstName?: string;
  lastName?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  verified?: boolean;
  // Session tokens
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthToken {
  id: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  role?: string;
  phone?: string;
  avatar?: string;
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  iat?: number;
  exp?: number;
}

export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'email' | 'credentials';
  clientId?: string;
  clientSecret?: string;
  options?: {
    client?: {
      host?: string;
      port?: number;
      path?: string;
      secure?: boolean;
      rejectUnauthorized?: boolean;
    };
    [key: string]: unknown;
  };
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthGoogle {
  clientId: string;
  clientSecret: string;
}

export interface AuthUserSession {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  phone?: string;
  // Session management
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  sessionExpires: Date;
}

export interface LoginResponse {
  user: AuthUser;
  session: AuthSession;
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'user' | 'agent';
  acceptTerms: boolean;
  marketingConsent?: boolean;
}

export interface RegisterResponse {
  user: AuthUser;
  message: string;
  emailVerificationSent: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetTokenSent: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  success: boolean;
  user: AuthUser;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
  sent: boolean;
}

export interface AuthError {
  error: string;
  errorDescription?: string;
  status: number;
}

export interface SessionContext {
  session: AuthSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: (data?: unknown) => Promise<void>;
  signOut: (callbackUrl?: string) => Promise<void>;
}

// Password validation
export interface PasswordValidation {
  isValid: boolean;
  score: number; // 0-4 (very weak to very strong)
  feedback: {
    warning: string;
    suggestions: string[];
  };
}

// Two-factor authentication
export interface TwoFactorAuth {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
  qrCode?: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  code: string;
}

export interface TwoFactorResponse {
  success: boolean;
  backupCodes?: string[];
}

// Auth security
export interface AuthSecurity {
  lastLoginAt: Date;
  lastPasswordChangeAt: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  suspiciousActivity: boolean;
  activeSessions: number;
  trustedDevices: TrustedDevice[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  browser: string;
  os: string;
  location: string;
  lastUsed: Date;
  trusted: boolean;
}

export interface AuthActivity {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'password_change' | 'profile_update' | '2fa_enabled' | '2fa_disabled';
  ipAddress: string;
  userAgent: string;
  location?: string;
  success: boolean;
  createdAt: Date;
}