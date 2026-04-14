import { apiClient } from '@/lib/api';
import type { MongoUser } from '@/stores/authStore';

const TOKEN_KEY = '@gtmed:token';
const USER_KEY = '@gtmed:user';

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: MongoUser; token: string }> {
  const data = await apiClient.post<{ user: MongoUser; token: string }>(
    '/auth/login',
    { email, password }
  );

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return data;
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
): Promise<{ user: MongoUser; token: string }> {
  const data = await apiClient.post<{ user: MongoUser; token: string }>(
    '/auth/register',
    { name, email, password }
  );

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return data;
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredAuth(): { user: MongoUser | null; token: string | null } {
  if (typeof window === 'undefined') return { user: null, token: null };
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  const user = userStr ? JSON.parse(userStr) : null;
  return { user, token };
}

export async function fetchProfile(): Promise<MongoUser> {
  return apiClient.get<MongoUser>('/auth/me');
}
