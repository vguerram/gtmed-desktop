'use client';

import { useAuthStore } from '@/stores/authStore';

const DEMO_COMPARACAO = [
  { nome: 'Ana L.', xp: 3200, nivel: 12, streak: 28, questoes: 450, flashcards: 320 },
  { nome: 'Carlos M.', xp: 2800, nivel: 10, streak: 21, questoes: 380, flashcards: 280 },
  { nome: 'Julia S.', xp: 2400, nivel: 9, streak: 14, questoes: 320, flashcards: 250 },
];

const METRICAS = [
  { key: 'xp', label: 'XP Total', icon: '⚡', format: (v: number) => `${v.toLocaleString()} XP` },
  { key: 'nivel', label: 'Nível', icon: '🎯', format: (v: number) => `Nível ${v}` },
  { key: 'streak', label: 'Streak', icon: '🔥', format: (v: number) => `${v} dias` },
  { key: 'questoes', label: 'Questões', icon: '📝', format: (v: number) => `${v} resolvidas` },
  { key: 'flashcards', label: 'Flashcards', icon: '⚡', format: (v: number) => `${v} revisados` },
];

export default function ComparativoPage() {
  const user = useAuthStore((s) => s.user);

  const meusDados = {
    nome: user?.name || 'Você',
    xp: user?.xpTotal || 0,
    nivel: user?.nivel || 1,
    streak: user?.streakAtual || 0,
    questoes: 0,
    flashcards: 0,
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>📊 Comparativo</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Compare seu progresso com outros alunos</p>

      {/* Métricas */}
      {METRICAS.map((m) => {
        const meuValor = meusDados[m.key as keyof typeof meusDados] as number;
        const maxValor = Math.max(meuValor, ...DEMO_COMPARACAO.map((d) => d[m.key as keyof typeof d] as number));

        return (
          <div key={m.key} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span>{m.icon}</span>
              <span className="text-[12px] font-bold tracking-wider" style={{ color: '#484F58' }}>{m.label.toUpperCase()}</span>
            </div>

            <div className="rounded-2xl p-4 space-y-2.5" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
              {/* Eu */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}>
                  {meusDados.nome[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-white">Você</span>
                    <span className="text-[11px] font-bold" style={{ color: '#E8172C' }}>{m.format(meuValor)}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#21262D' }}>
                    <div className="h-full rounded-full" style={{ width: `${maxValor > 0 ? (meuValor / maxValor) * 100 : 0}%`, backgroundColor: '#E8172C' }} />
                  </div>
                </div>
              </div>

              {/* Outros */}
              {DEMO_COMPARACAO.map((d, i) => {
                const valor = d[m.key as keyof typeof d] as number;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: '#21262D' }}>
                      {d.nome[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px]" style={{ color: '#8B949E' }}>{d.nome}</span>
                        <span className="text-[11px]" style={{ color: '#484F58' }}>{m.format(valor)}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ backgroundColor: '#21262D' }}>
                        <div className="h-full rounded-full" style={{ width: `${maxValor > 0 ? (valor / maxValor) * 100 : 0}%`, backgroundColor: '#484F58' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
