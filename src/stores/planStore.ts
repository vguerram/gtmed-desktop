import { create } from 'zustand';

interface PlanState {
  tipo: 'gratuito' | 'pro';
  isPro: boolean;
  uso: { questoes: number; flashcards: number; data: string };

  setTipo: (tipo: 'gratuito' | 'pro') => void;
  setPro: (isPro: boolean) => void;
  incrementarQuestoes: () => boolean;
  incrementarFlashcards: () => boolean;
  getQuestoesRestantes: () => number;
  getFlashcardsRestantes: () => number;
}

const LIMITE_QUESTOES = 5;
const LIMITE_FLASHCARDS = 5;

function hoje() {
  return new Date().toISOString().split('T')[0];
}

export const usePlanStore = create<PlanState>((set, get) => ({
  tipo: 'gratuito',
  isPro: false,
  uso: { questoes: 0, flashcards: 0, data: hoje() },

  setTipo: (tipo) => set({ tipo, isPro: tipo === 'pro' }),
  setPro: (isPro) => set({ isPro, tipo: isPro ? 'pro' : 'gratuito' }),

  incrementarQuestoes: () => {
    const s = get();
    if (s.isPro) return true;
    const uso = s.uso.data === hoje() ? s.uso : { questoes: 0, flashcards: 0, data: hoje() };
    if (uso.questoes >= LIMITE_QUESTOES) return false;
    set({ uso: { ...uso, questoes: uso.questoes + 1 } });
    return true;
  },

  incrementarFlashcards: () => {
    const s = get();
    if (s.isPro) return true;
    const uso = s.uso.data === hoje() ? s.uso : { questoes: 0, flashcards: 0, data: hoje() };
    if (uso.flashcards >= LIMITE_FLASHCARDS) return false;
    set({ uso: { ...uso, flashcards: uso.flashcards + 1 } });
    return true;
  },

  getQuestoesRestantes: () => {
    const s = get();
    if (s.isPro) return 999;
    const uso = s.uso.data === hoje() ? s.uso : { questoes: 0, flashcards: 0, data: hoje() };
    return Math.max(0, LIMITE_QUESTOES - uso.questoes);
  },

  getFlashcardsRestantes: () => {
    const s = get();
    if (s.isPro) return 999;
    const uso = s.uso.data === hoje() ? s.uso : { questoes: 0, flashcards: 0, data: hoje() };
    return Math.max(0, LIMITE_FLASHCARDS - uso.flashcards);
  },
}));
