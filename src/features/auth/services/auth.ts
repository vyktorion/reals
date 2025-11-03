  import { User } from '../../../hooks/useAuth';

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

class AuthService {
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      // For now, return mock response
      // In production: const response = await apiClient.post('/auth/signin', data);
      return {
        success: true,
        user: {
          id: '1',
          email: data.email,
          firstName: 'John',
          lastName: 'Anderson',
          phone: '+1 (555) 987-6543',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // For now, return mock response
      // In production: const response = await apiClient.post('/auth/signup', data);
      return {
        success: true,
        user: {
          id: Date.now().toString(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed',
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      // In production: await apiClient.post('/auth/signout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      // In production: const response = await apiClient.post('/auth/refresh');
      return {
        success: true,
        token: 'refreshed-token-' + Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token refresh failed',
      };
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      // In production: const response = await apiClient.put(`/users/${userId}`, updates);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Profile update failed',
      };
    }
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      // In production: await apiClient.post('/auth/forgot-password', { email });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Password reset failed',
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      // In production: await apiClient.post('/auth/reset-password', { token, newPassword });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Password reset failed',
      };
    }
  }
}

export const authService = new AuthService();
export default authService;