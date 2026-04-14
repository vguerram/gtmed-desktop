import { create } from 'zustand';

export interface MongoUser {
  id: string;
  _id?: string;
  email: string;
  name: string;
  admin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  xpTotal: number;
  xpSemana: number;
  xpMes: number;
  nivel: number;
  streakAtual: number;
  streakMaximo: number;
  streakUltimaAtividade: string | null;
  phone?: string | null;
  horasEstudoDia?: number;
}

interface AuthState {
  user: MongoUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setAuth: (user: MongoUser, token: string) => void;
  setUser: (user: MongoUser | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setAuth: (user, token) =>
    set({ user, token, isAuthenticated: true }),
  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({ user: null, token: null, isLoading: false, isAuthenticated: false }),
}));
