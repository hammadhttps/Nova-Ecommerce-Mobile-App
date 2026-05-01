import { User } from '@/types';
import { mockUser } from '@/services/mocks/users';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    return {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
    };
  },

  async signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!credentials.name || !credentials.email || !credentials.password) {
      throw new Error('All fields are required');
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    return {
      user: { ...mockUser, name: credentials.name, email: credentials.email },
      token: 'mock-jwt-token-' + Date.now(),
    };
  },

  async loginWithGoogle(): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      user: mockUser,
      token: 'mock-google-token-' + Date.now(),
    };
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};
