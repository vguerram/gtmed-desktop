import { create } from 'zustand';

const FOCUS_SECS = 25 * 60;
const BREAK_SECS = 5 * 60;
const LONG_BREAK_SECS = 15 * 60;

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  mode: 'focus' | 'break' | 'longBreak';
  sessionsCompleted: number;

  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  switchMode: (mode: 'focus' | 'break' | 'longBreak') => void;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  timeLeft: FOCUS_SECS,
  isRunning: false,
  mode: 'focus',
  sessionsCompleted: 0,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),

  reset: () => {
    const s = get();
    const time = s.mode === 'focus' ? FOCUS_SECS : s.mode === 'break' ? BREAK_SECS : LONG_BREAK_SECS;
    set({ timeLeft: time, isRunning: false });
  },

  tick: () => {
    const s = get();
    if (!s.isRunning) return;
    if (s.timeLeft <= 1) {
      if (s.mode === 'focus') {
        const newSessions = s.sessionsCompleted + 1;
        const nextMode = newSessions % 4 === 0 ? 'longBreak' : 'break';
        const nextTime = nextMode === 'longBreak' ? LONG_BREAK_SECS : BREAK_SECS;
        set({ timeLeft: nextTime, mode: nextMode, sessionsCompleted: newSessions, isRunning: false });
      } else {
        set({ timeLeft: FOCUS_SECS, mode: 'focus', isRunning: false });
      }
    } else {
      set({ timeLeft: s.timeLeft - 1 });
    }
  },

  switchMode: (mode) => {
    const time = mode === 'focus' ? FOCUS_SECS : mode === 'break' ? BREAK_SECS : LONG_BREAK_SECS;
    set({ mode, timeLeft: time, isRunning: false });
  },
}));
