'use client';

import Link from 'next/link';

const MISSOES = [
  { id: 'questoes', icon: '🎯', nome: 'Responda 10 questões', meta: 10, atual: 0, xp: 50, cor: '#E8172C', rota: '/dashboard/questoes' },
  { id: 'flashcards', icon: '⚡', nome: 'Revise 10 flashcards', meta: 10, atual: 0, xp: 30, cor: '#00CFFF', rota: '/dashboard/flashcards' },
  { id: 'revisao', icon: '🔁', nome: 'Faça 1 sessão de revisão', meta: 1, atual: 0, xp: 20, cor: '#7B2FF7', rota: '/dashboard/revisao' },
  { id: 'videoaula', icon: '🎬', nome: 'Assista 1 videoaula', meta: 1, atual: 0, xp: 50, cor: '#FF8C00', rota: '/dashboard/videoaulas' },
  { id: 'desafio', icon: '⚔️', nome: 'Vença 1 desafio', meta: 1, atual: 0, xp: 40, cor: '#FF69B4', rota: '/dashboard/desafios' },
];

export default function MissoesPage() {
  const totalXP = MISSOES.reduce((acc, m) => acc + m.xp, 0);
  const concluidas = MISSOES.filter((m) => m.atual >= m.meta).length;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>🎯 Missões do Dia</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>
        {concluidas}/{MISSOES.length} concluídas · {totalXP} XP disponíveis
      </p>

      {/* Progress geral */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: 'linear-gradient(135deg, rgba(232,23,44,0.08), rgba(232,23,44,0.02))', border: '1px solid rgba(232,23,44,0.15)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold" style={{ color: '#E8172C' }}>PROGRESSO DO DIA</span>
          <span className="text-[12px] font-bold" style={{ color: '#F0F6FC' }}>{concluidas}/{MISSOES.length}</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#21262D' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(concluidas / MISSOES.length) * 100}%`, backgroundColor: '#E8172C' }} />
        </div>
        <p className="text-[11px] mt-2" style={{ color: '#484F58' }}>
          Complete todas para ganhar +50 XP bônus! 🔥
        </p>
      </div>

      {/* Missões */}
      <div className="space-y-3">
        {MISSOES.map((m) => {
          const progresso = Math.min(m.atual / m.meta, 1);
          const concluida = m.atual >= m.meta;
          return (
            <Link
              key={m.id}
              href={m.rota}
              className="flex items-center gap-4 rounded-2xl p-4 transition-all"
              style={{ backgroundColor: '#141414', border: `1px solid ${concluida ? 'rgba(0,200,83,0.2)' : '#21262D'}` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: m.cor + '22' }}>
                {m.icon}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium" style={{ color: concluida ? '#8B949E' : '#F0F6FC', textDecoration: concluida ? 'line-through' : 'none' }}>
                  {m.nome}
                </p>
                <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: '#21262D' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${progresso * 100}%`, backgroundColor: m.cor }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px]" style={{ color: '#484F58' }}>{m.atual}/{m.meta}</span>
                  <span className="text-[10px] font-semibold" style={{ color: concluida ? '#00C853' : m.cor }}>
                    {concluida ? '✓ Concluída' : `+${m.xp} XP`}
                  </span>
                </div>
              </div>
              {concluida ? (
                <span className="text-lg" style={{ color: '#00C853' }}>✓</span>
              ) : (
                <span style={{ color: '#484F58' }}>›</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
