'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TOUR_STEPS = [
  {
    emoji: '🗺️',
    title: 'Trilha Galáctica',
    description: '45 semanas de estudo progressivo. Cada semana tem questões, flashcards, videoaulas e um Boss para derrotar!',
    color: '#E8172C',
  },
  {
    emoji: '📝',
    title: 'Questões de Residência',
    description: 'Mais de 5.000 questões autorais e de bancas reais (USP, UNIFESP, ENARE, SUS-SP). Filtros por área, especialidade e ano.',
    color: '#00CFFF',
  },
  {
    emoji: '⚡',
    title: 'Flashcards Inteligentes',
    description: 'Mais de 9.000 flashcards com repetição espaçada (SRS). O sistema aprende o que você erra e revisa automaticamente.',
    color: '#FFB800',
  },
  {
    emoji: '🎬',
    title: 'Videoaulas',
    description: '158 aulas gravadas por especialistas da USP. Assista no seu ritmo e acompanhe seu progresso.',
    color: '#7B2FF7',
  },
  {
    emoji: '🏆',
    title: 'Gamificação',
    description: 'Ganhe XP, suba de nível, mantenha seu streak, complete missões diárias e desafie outros alunos no ranking!',
    color: '#00C853',
  },
];

export default function TourPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const current = TOUR_STEPS[step];

  function handleNext() {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.push('/register');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#07090F' }}>
      <div className="w-full max-w-md text-center">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === step ? 24 : 8,
                backgroundColor: i === step ? current.color : '#21262D',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-8">
          <span className="text-[80px]">{current.emoji}</span>
          <h2 className="text-2xl font-bold text-white mt-4 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            {current.title}
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: '#8B949E' }}>
            {current.description}
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex justify-center gap-2 mb-8">
          {['5.174 questões', '9.362 flashcards', '158 aulas'].map((t, i) => (
            <span key={i} className="text-[10px] font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#141414', border: '1px solid #21262D', color: '#8B949E' }}>
              {t}
            </span>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full h-[52px] rounded-xl font-[800] text-[15px] text-white transition-transform active:scale-[0.97]"
          style={{
            background: `linear-gradient(135deg, ${current.color}, ${current.color}CC)`,
            fontFamily: 'Syne, sans-serif',
            boxShadow: `0 5px 20px ${current.color}50`,
          }}
        >
          {step < TOUR_STEPS.length - 1 ? 'Próximo →' : 'Começar! 🚀'}
        </button>

        {/* Skip */}
        <button
          onClick={() => router.push('/register')}
          className="w-full text-center mt-3 text-[12px]"
          style={{ color: '#484F58' }}
        >
          Pular tour
        </button>
      </div>
    </div>
  );
}
