'use client';

import { useState } from 'react';

export default function DesafiosPage() {
  const [tab, setTab] = useState<'pendentes' | 'ativos' | 'finalizados'>('pendentes');

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>⚔️ Desafios</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Desafie outros alunos e ganhe XP extra</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['pendentes', 'ativos', 'finalizados'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold capitalize transition-all"
            style={{
              backgroundColor: tab === t ? 'rgba(232,23,44,0.15)' : '#141414',
              border: `1.5px solid ${tab === t ? '#E8172C' : '#21262D'}`,
              color: tab === t ? '#E8172C' : '#8B949E',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CTA criar desafio */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <div className="text-center">
          <span className="text-4xl">⚔️</span>
          <h3 className="text-lg font-bold text-white mt-3" style={{ fontFamily: 'Syne, sans-serif' }}>Desafie alguém agora!</h3>
          <p className="text-[12px] mt-1 mb-4" style={{ color: '#484F58' }}>Escolha um rival, uma especialidade e o número de questões</p>

          <div className="max-w-xs mx-auto mb-4">
            <input
              placeholder="Buscar rival por nome..."
              className="w-full h-11 rounded-[11px] px-3.5 text-[14px] text-white outline-none text-center"
              style={{ backgroundColor: '#0C0E18', border: '1.5px solid #1A1C2C' }}
            />
          </div>

          <button
            className="px-8 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)', boxShadow: '0 5px 14px rgba(232,23,44,0.35)' }}
          >
            🎯 Criar desafio
          </button>
        </div>
      </div>

      {/* Medalhas */}
      <div className="h-px mb-4" style={{ backgroundColor: '#161B22' }} />
      <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>🏅 Suas Medalhas</h2>
      <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <p className="text-[13px]" style={{ color: '#484F58' }}>Ganhe medalhas vencendo desafios</p>
        <div className="flex justify-center gap-4 mt-4">
          {['🥇', '🥈', '🥉'].map((m, i) => (
            <div key={i} className="w-14 h-14 rounded-full flex items-center justify-center text-2xl opacity-20" style={{ backgroundColor: '#21262D' }}>
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
