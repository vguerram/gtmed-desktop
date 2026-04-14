'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

type Period = 'semanal' | 'mensal' | 'geral';

const DEMO_RANKING = [
  { pos: 1, nome: 'Ana L.', xp: 3200, nivel: 12 },
  { pos: 2, nome: 'Carlos M.', xp: 2800, nivel: 10 },
  { pos: 3, nome: 'Julia S.', xp: 2400, nivel: 9 },
  { pos: 4, nome: 'Pedro R.', xp: 2100, nivel: 8 },
  { pos: 5, nome: 'Maria F.', xp: 1900, nivel: 7 },
  { pos: 6, nome: 'Lucas P.', xp: 1700, nivel: 7 },
  { pos: 7, nome: 'Beatriz C.', xp: 1500, nivel: 6 },
  { pos: 8, nome: 'Gabriel N.', xp: 1350, nivel: 6 },
  { pos: 9, nome: 'Isabela O.', xp: 1200, nivel: 5 },
  { pos: 10, nome: 'Rafael T.', xp: 1050, nivel: 5 },
];

const MEDAL_COLORS = ['#FFB800', '#C0C0C0', '#CD7F32'];

export default function RankingPage() {
  const [period, setPeriod] = useState<Period>('semanal');
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>🏆 Ranking</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Compete com outros alunos e suba no ranking</p>

      {/* Period tabs */}
      <div className="flex gap-2 mb-6">
        {(['semanal', 'mensal', 'geral'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold capitalize transition-all"
            style={{
              backgroundColor: period === p ? 'rgba(232,23,44,0.15)' : '#141414',
              border: `1.5px solid ${period === p ? '#E8172C' : '#21262D'}`,
              color: period === p ? '#E8172C' : '#8B949E',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Your position */}
      <div className="rounded-2xl p-4 mb-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(232,23,44,0.1), rgba(232,23,44,0.02))', border: '1px solid rgba(232,23,44,0.2)' }}>
        <span className="text-lg font-bold" style={{ color: '#E8172C' }}>#—</span>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}>
          {user?.name?.[0] || '?'}
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-white">{user?.name || 'Você'}</p>
          <p className="text-[11px]" style={{ color: '#484F58' }}>Nível {user?.nivel || 1}</p>
        </div>
        <span className="text-[14px] font-bold" style={{ color: '#FFB800' }}>{user?.xpSemana || 0} XP</span>
      </div>

      {/* Ranking list */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        {DEMO_RANKING.map((r, i) => (
          <div
            key={r.pos}
            className="flex items-center gap-4 px-5 py-3.5"
            style={{ borderBottom: i < DEMO_RANKING.length - 1 ? '1px solid #161B22' : 'none' }}
          >
            <span
              className="text-[14px] font-bold w-6 text-center"
              style={{ color: i < 3 ? MEDAL_COLORS[i] : '#484F58' }}
            >
              {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${r.pos}`}
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{ backgroundColor: '#21262D' }}
            >
              {r.nome[0]}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-white">{r.nome}</p>
              <p className="text-[10px]" style={{ color: '#484F58' }}>Nível {r.nivel}</p>
            </div>
            <span className="text-[13px] font-bold" style={{ color: '#FFB800' }}>{r.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
