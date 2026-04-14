import { apiClient } from '@/lib/api';

export interface QuestionFilters {
  tipo_prova?: string;
  grande_area?: string;
  especialidade?: string;
  instituicao?: number;
  ano?: number;
  limit?: number;
}

export interface QuestionRow {
  id: string;
  enunciado: string;
  alternativas: { letra: string; texto: string; correta: boolean }[];
  gabarito_letra: string;
  gabarito_comentado: string | null;
  gabarito_comentado_txt: string | null;
  grande_area: string | null;
  especialidade: string | null;
  tema: string | null;
  instituicao_nome: string | null;
  ano: number;
  imagens: { url: string; order: number }[];
}

export async function getRandomQuestions(filters: QuestionFilters): Promise<QuestionRow[]> {
  try {
    const res = await apiClient.get<{ questions?: QuestionRow[] }>('/questions/random', {
      limit: filters.limit || 20,
      tipo_prova: filters.tipo_prova,
      grande_area: filters.grande_area,
      especialidade: filters.especialidade,
      instituicao: filters.instituicao,
      ano: filters.ano,
    });
    if (Array.isArray(res)) return res as QuestionRow[];
    if (Array.isArray(res?.questions)) return res.questions;
    return [];
  } catch {
    return [];
  }
}

export async function getFilterOptions() {
  try {
    const res = await apiClient.get<{
      grandes_areas?: string[];
      anos?: number[];
      instituicoes?: { id: number; name: string }[];
    }>('/filters/options');
    return {
      grandes_areas: res?.grandes_areas || [],
      anos: res?.anos || [],
      instituicoes: res?.instituicoes || [],
    };
  } catch {
    return { grandes_areas: [], anos: [], instituicoes: [] };
  }
}

export async function getEspecialidades(grandeArea: string): Promise<string[]> {
  try {
    const res = await apiClient.get<{ especialidades?: string[] }>('/filters/especialidades', { grande_area: grandeArea });
    if (Array.isArray(res)) return res as string[];
    if (Array.isArray(res?.especialidades)) return res.especialidades;
    return [];
  } catch {
    return [];
  }
}

export async function countQuestions(filters: QuestionFilters): Promise<number> {
  try {
    const res = await apiClient.get<{ count?: number }>('/questions/count', {
      tipo_prova: filters.tipo_prova,
      grande_area: filters.grande_area,
      especialidade: filters.especialidade,
      instituicao: filters.instituicao,
      ano: filters.ano,
    });
    if (typeof res === 'number') return res;
    return res?.count ?? 0;
  } catch {
    return 0;
  }
}
