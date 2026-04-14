import { apiClient } from '@/lib/api';

export interface ExamResult {
  examId: string;
  totalQuestions: number;
  totalCorrect: number;
  xpGanho: number;
  tempo: number;
}

export async function createExam(filters: Record<string, unknown>) {
  return apiClient.post<{ examId: string; questions: unknown[] }>('/exams', filters);
}

export async function getRecentExams(): Promise<unknown[]> {
  try {
    const res = await apiClient.get<{ exams?: unknown[] }>('/exams');
    return Array.isArray(res) ? res : res?.exams || [];
  } catch {
    return [];
  }
}

export async function answerQuestion(examQuestionId: string, selectedAnswer: string) {
  return apiClient.post('/exams/answer', { examQuestionId, selectedAnswer });
}

export async function finishExam(examId: string) {
  return apiClient.patch<ExamResult>(`/exams/${examId}/finish`);
}

export async function getPerformanceByArea() {
  try {
    return await apiClient.get<unknown[]>('/evolution/performance');
  } catch {
    return [];
  }
}

export async function getWeeklyTrend() {
  try {
    return await apiClient.get<unknown[]>('/evolution/trend');
  } catch {
    return [];
  }
}
