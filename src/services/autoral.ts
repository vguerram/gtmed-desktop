import { apiClient } from '@/lib/api';

// ============ QUESTÕES AUTORAIS ============

export interface AutoralQuestion {
  id: string;
  content: string;
  options: { letra: string; texto: string; correta: boolean }[];
  explanation_text_html: string | null;
  explanation_text: string | null;
  specialities: { name: string; type: string }[];
  tags: { name: string }[];
  difficulty: string;
  year: number;
}

export async function getAutoralQuestions(params?: {
  page?: number;
  limit?: number;
  grande_area?: string;
  especialidade?: string;
}): Promise<{ questions: AutoralQuestion[]; total: number }> {
  try {
    return await apiClient.get<{ questions: AutoralQuestion[]; total: number }>(
      '/autoral/questions',
      { page: params?.page || 1, limit: params?.limit || 20, grande_area: params?.grande_area, especialidade: params?.especialidade }
    );
  } catch {
    return { questions: [], total: 0 };
  }
}

export async function getAutoralQuestionsStats() {
  try {
    return await apiClient.get<{ total: number; grande_area: { name: string; count: number }[] }>('/autoral/questions/stats');
  } catch {
    return { total: 0, grande_area: [] };
  }
}

// ============ FLASHCARDS AUTORAIS ============

export interface AutoralFlashcard {
  id: string;
  frente: string;
  verso: string;
  verso_txt: string;
  grande_area: string;
  especialidade: string;
  tema: string;
  nivel_dificuldade: number;
}

export async function getAutoralFlashcards(params?: {
  page?: number;
  limit?: number;
}): Promise<{ flashcards: AutoralFlashcard[]; total: number }> {
  try {
    return await apiClient.get<{ flashcards: AutoralFlashcard[]; total: number }>(
      '/autoral/flashcards',
      { page: params?.page || 1, limit: params?.limit || 21 }
    );
  } catch {
    return { flashcards: [], total: 0 };
  }
}

export async function getAutoralFlashcardsByTema(tema: string): Promise<AutoralFlashcard[]> {
  try {
    const res = await apiClient.get<{ flashcards: AutoralFlashcard[]; total: number }>(
      '/autoral/flashcards',
      { page: 1, limit: 100 }
    );
    return (res.flashcards || []).filter((fc) => fc.tema === tema);
  } catch {
    return [];
  }
}

// ============ TEMAS DISPONÍVEIS ============

export async function getAutoralFlashcardTemas(): Promise<{ tema: string; count: number }[]> {
  try {
    const temas: Record<string, number> = {};
    let page = 1;
    while (page <= 100) {
      const res = await apiClient.get<{ flashcards: AutoralFlashcard[] }>(
        '/autoral/flashcards',
        { page, limit: 100 }
      );
      if (!res.flashcards?.length) break;
      for (const fc of res.flashcards) {
        temas[fc.tema] = (temas[fc.tema] || 0) + 1;
      }
      page++;
    }
    return Object.entries(temas).map(([tema, count]) => ({ tema, count })).sort((a, b) => a.tema.localeCompare(b.tema));
  } catch {
    return [];
  }
}
