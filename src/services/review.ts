import { apiClient } from '@/lib/api';

export interface ReviewSummary {
  today: number;
  tomorrow: number;
  week: number;
  overdue: number;
}

export async function getReviewSummary(): Promise<ReviewSummary> {
  try {
    return await apiClient.get<ReviewSummary>('/review/summary');
  } catch {
    return { today: 0, tomorrow: 0, week: 0, overdue: 0 };
  }
}

export async function getReviewQuestions(limit = 10) {
  try {
    const res = await apiClient.get<{ questions?: unknown[] }>('/review/questions', { limit });
    return Array.isArray(res) ? res : res?.questions || [];
  } catch {
    return [];
  }
}

export async function getReviewFlashcards(limit = 10) {
  try {
    const res = await apiClient.get<{ flashcards?: unknown[] }>('/review/flashcards', { limit });
    return Array.isArray(res) ? res : res?.flashcards || [];
  } catch {
    return [];
  }
}

export async function completeReview(type: 'question' | 'flashcard', id: string, quality: number) {
  return apiClient.post(`/review/${type}/${id}`, { quality });
}
