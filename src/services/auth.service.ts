import apiClient from './api';
import { User } from '@/entities/user/model/types';

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface PasswordResetData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

class AuthService {
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signin', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      await apiClient.post('/auth/signout');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
      };
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await apiClient.put<AuthResponse>(`/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed',
      };
    }
  }

  async forgotPassword(data: PasswordResetData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset request failed',
      };
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      };
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current user',
      };
    }
  }

  // Mock authentication for development
  mockSignIn(data: SignInData): AuthResponse {
    if (data.email === 'demo@imoestate.com' && data.password === 'demo123') {
      const mockUser: User = {
        id: '1',
        email: data.email,
        name: 'John Anderson',
        phone: '+1 (555) 987-6543',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'Agent',
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      return {
        success: true,
        user: mockUser,
        token: mockToken,
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }
  }
}

export const authService = new AuthService();
export default authService;