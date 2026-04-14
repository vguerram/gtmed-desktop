import { create } from 'zustand';

interface ExamQuestion {
  id: string;
  enunciado: string;
  alternativas: { letra: string; texto: string; correta: boolean }[];
  gabarito_comentado_txt: string | null;
}

interface ExamState {
  examId: string | null;
  questions: ExamQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  correctAnswers: Record<string, boolean>;
  showAnswer: boolean;
  comboCount: number;
  maxCombo: number;
  status: 'idle' | 'loading' | 'active' | 'finished';
  totalXpGanho: number;

  loadExam: (examId: string, questions: ExamQuestion[]) => void;
  answerQuestion: (questionId: string, letra: string, correta: boolean) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  toggleAnswer: () => void;
  finishExam: () => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  examId: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  correctAnswers: {},
  showAnswer: false,
  comboCount: 0,
  maxCombo: 0,
  status: 'idle',
  totalXpGanho: 0,

  loadExam: (examId, questions) => set({
    examId, questions, currentIndex: 0, answers: {}, correctAnswers: {},
    showAnswer: false, comboCount: 0, maxCombo: 0, status: 'active', totalXpGanho: 0,
  }),

  answerQuestion: (questionId, letra, correta) => {
    const s = get();
    const newCombo = correta ? s.comboCount + 1 : 0;
    const xp = 5 + (correta ? 20 : 0) + (newCombo >= 20 ? 400 : newCombo >= 10 ? 150 : newCombo >= 5 ? 60 : newCombo >= 3 ? 30 : 0);
    set({
      answers: { ...s.answers, [questionId]: letra },
      correctAnswers: { ...s.correctAnswers, [questionId]: correta },
      comboCount: newCombo,
      maxCombo: Math.max(s.maxCombo, newCombo),
      totalXpGanho: s.totalXpGanho + xp,
      showAnswer: true,
    });
  },

  nextQuestion: () => set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, s.questions.length - 1), showAnswer: false })),
  prevQuestion: () => set((s) => ({ currentIndex: Math.max(s.currentIndex - 1, 0), showAnswer: false })),
  goToQuestion: (index) => set({ currentIndex: index, showAnswer: false }),
  toggleAnswer: () => set((s) => ({ showAnswer: !s.showAnswer })),
  finishExam: () => set({ status: 'finished' }),
  resetExam: () => set({ examId: null, questions: [], currentIndex: 0, answers: {}, correctAnswers: {}, showAnswer: false, comboCount: 0, maxCombo: 0, status: 'idle', totalXpGanho: 0 }),
}));
