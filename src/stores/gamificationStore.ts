import { create } from 'zustand';
import type { MongoUser } from './authStore';

interface GamificationState {
  xpTotal: number;
  xpSemana: number;
  streakAtual: number;
  streakMaximo: number;
  nivel: number;
  titulo: string;
  lastXPGain: number;
  showXPAnimation: boolean;
  showLevelUp: boolean;
  levelUpNivel: number;

  setFromUser: (user: MongoUser) => void;
  addXP: (amount: number) => void;
  dismissXPAnimation: () => void;
  dismissLevelUp: () => void;
}

function calcLevel(xp: number): { nivel: number; titulo: string } {
  const levels = [
    { min: 0, titulo: 'Calouro Espacial' }, { min: 100, titulo: 'Explorador' },
    { min: 300, titulo: 'Estudante' }, { min: 600, titulo: 'Dedicado' },
    { min: 1000, titulo: 'Aplicado' }, { min: 1500, titulo: 'Veterano' },
    { min: 2500, titulo: 'Expert' }, { min: 4000, titulo: 'Mestre' },
    { min: 6000, titulo: 'Lenda' }, { min: 10000, titulo: 'Lenda do GTMED' },
  ];
  let result = { nivel: 1, titulo: levels[0].titulo };
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].min) result = { nivel: i + 1, titulo: levels[i].titulo };
  }
  return result;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  xpTotal: 0, xpSemana: 0, streakAtual: 0, streakMaximo: 0,
  nivel: 1, titulo: 'Calouro Espacial',
  lastXPGain: 0, showXPAnimation: false, showLevelUp: false, levelUpNivel: 0,

  setFromUser: (user) => {
    const { nivel, titulo } = calcLevel(user.xpTotal);
    set({ xpTotal: user.xpTotal, xpSemana: user.xpSemana, streakAtual: user.streakAtual, streakMaximo: user.streakMaximo, nivel, titulo });
  },

  addXP: (amount) => {
    const s = get();
    const newXP = s.xpTotal + amount;
    const oldLevel = s.nivel;
    const { nivel, titulo } = calcLevel(newXP);
    set({
      xpTotal: newXP, nivel, titulo,
      lastXPGain: amount, showXPAnimation: true,
      showLevelUp: nivel > oldLevel, levelUpNivel: nivel,
    });
  },

  dismissXPAnimation: () => set({ showXPAnimation: false }),
  dismissLevelUp: () => set({ showLevelUp: false }),
}));
