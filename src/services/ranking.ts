import { apiClient } from '@/lib/api';

export interface RankedUser {
  userId: string;
  name: string;
  xp: number;
  nivel: number;
  posicao: number;
}

export async function getWeeklyRanking(limit = 50): Promise<RankedUser[]> {
  try {
    const res = await apiClient.get<{ ranking?: RankedUser[] }>('/ranking/weekly', { limit });
    return Array.isArray(res) ? res as RankedUser[] : res?.ranking || [];
  } catch {
    return [];
  }
}

export async function getMonthlyRanking(limit = 50): Promise<RankedUser[]> {
  try {
    const res = await apiClient.get<{ ranking?: RankedUser[] }>('/ranking/monthly', { limit });
    return Array.isArray(res) ? res as RankedUser[] : res?.ranking || [];
  } catch {
    return [];
  }
}

export async function getUserPosition(period: 'weekly' | 'monthly' | 'alltime') {
  try {
    return await apiClient.get<{ posicao: number; xp: number }>('/ranking/position', { period });
  } catch {
    return { posicao: 0, xp: 0 };
  }
}
