import { User } from "@shared/schema";

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  email: string;
  fullName: string;
  program?: string;
  studentId?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: string;
  program?: string;
  studentId?: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

export const logout = (): void => {
  localStorage.removeItem('auth-user');
  window.location.href = '/';
};

export const saveAuthUser = (user: AuthUser): void => {
  localStorage.setItem('auth-user', JSON.stringify(user));
};

export const getAuthUser = (): AuthUser | null => {
  const user = localStorage.getItem('auth-user');
  return user ? JSON.parse(user) : null;
};

export const clearAuthUser = (): void => {
  localStorage.removeItem('auth-user');
};
