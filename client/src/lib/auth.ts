import { User } from "@shared/schema";

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  studentId?: string;
  program?: string;
  isActive: boolean;
  createdAt: string;
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
  accessToken: string;
  user: AuthUser;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch("http://localhost:8080/api/v1/lms/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  const json = await response.json();
  const mappedResponse: AuthResponse = {
    accessToken: json.data.access_token,
    user: {
      id: json.data.User.id,
      username: json.data.User.username,
      fullName: json.data.User.full_name,
      email: json.data.User.email,
      role: json.data.User.role,
      studentId: json.data.User.student_id,
      program: json.data.User.program,
      isActive: json.data.User.is_active,
      createdAt: json.data.User.created_at,
    },
  };

  return mappedResponse;
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

export const saveAuthToken = (token: string): void => {
  localStorage.setItem('auth-token', token);
};

export const saveStudentID = (id: string): void => {
  localStorage.setItem('studentId', id);
};

export const getAuthUser = (): AuthUser | null => {
  const user = localStorage.getItem('auth-user');
  return user ? JSON.parse(user) : null;
};

export const clearAuthUser = (): void => {
  localStorage.removeItem('auth-user');
};
