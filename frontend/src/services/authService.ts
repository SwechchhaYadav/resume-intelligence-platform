import { apiRequest } from './apiClient';

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  message: string;
  user: AuthUser;
  access_token: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  full_name: string;
}

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

const persistAuth = (response: AuthResponse) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
  return response;
};

export const login = async (payload: LoginPayload) => {
  const response = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return persistAuth(response);
};

export const register = async (payload: RegisterPayload) => {
  const response = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return persistAuth(response);
};

export const getStoredUser = (): AuthUser | null => {
  const user = localStorage.getItem(USER_STORAGE_KEY);
  return user ? JSON.parse(user) as AuthUser : null;
};

export const getStoredToken = (): string | null => localStorage.getItem(TOKEN_STORAGE_KEY);

export const getProfile = async (): Promise<AuthUser> => {
  return apiRequest<AuthUser>('/api/auth/profile', {
    method: 'GET',
    auth: true,
  });
};

export const logout = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

