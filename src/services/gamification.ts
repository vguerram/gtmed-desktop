import { apiClient } from '@/lib/api';

export async function getGamificationHome() {
  try {
    return await apiClient.get<Record<string, unknown>>('/gamification/home');
  } catch {
    return null;
  }
}

export async function awardXP(amount: number, source: string) {
  return apiClient.post<{ newTotal: number; leveledUp: boolean; newLevel: number }>('/gamification/xp', { amount, source });
}

export async function getStreak() {
  try {
    return await apiClient.get<{ dias: number; ultimaAtividade: string | null }>('/gamification/streak');
  } catch {
    return { dias: 0, ultimaAtividade: null };
  }
}

export async function updateStreak() {
  return apiClient.post('/gamification/streak');
}

export async function logDailyActivity(tipo?: string) {
  return apiClient.post('/gamification/activity', tipo ? { tipo } : undefined);
}

export async function getMissions() {
  try {
    const res = await apiClient.get<unknown[]>('/gamification/missions');
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export async function claimMissionReward(missionId: string) {
  return apiClient.post(`/missions/${missionId}/claim`);
}
