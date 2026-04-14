import { create } from 'zustand';

interface OnboardingState {
  nome: string | null;
  instituicao: string | null;
  dataProva: string | null;
  horasEstudo: string | null;

  setStep1: (nome: string) => void;
  setStep2: (instituicao: string) => void;
  setStep3: (horasEstudo: string) => void;
  setStep6: (dataProva: string) => void;
  getAll: () => Record<string, string | null>;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  nome: null,
  instituicao: null,
  dataProva: null,
  horasEstudo: null,

  setStep1: (nome) => set({ nome }),
  setStep2: (instituicao) => set({ instituicao }),
  setStep3: (horasEstudo) => set({ horasEstudo }),
  setStep6: (dataProva) => set({ dataProva }),
  getAll: () => {
    const s = get();
    return { nome: s.nome, instituicao: s.instituicao, dataProva: s.dataProva, horasEstudo: s.horasEstudo };
  },
  reset: () => set({ nome: null, instituicao: null, dataProva: null, horasEstudo: null }),
}));
