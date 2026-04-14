'use client';

import { useGamificationStore } from '@/stores/gamificationStore';

export default function LevelUpModal() {
  const { showLevelUp, levelUpNivel, titulo, dismissLevelUp } = useGamificationStore();

  if (!showLevelUp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="rounded-2xl p-8 text-center max-w-sm mx-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Nível {levelUpNivel}!
        </h2>
        <p className="text-[14px] mb-1" style={{ color: '#FFB800' }}>{titulo}</p>
        <p className="text-[12px] mb-6" style={{ color: '#8B949E' }}>
          Parabéns! Você subiu de nível. Continue estudando!
        </p>
        <button
          onClick={dismissLevelUp}
          className="px-8 py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
