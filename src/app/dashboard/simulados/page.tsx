'use client';

import { useState } from 'react';
import Link from 'next/link';

const TIPOS_SIMULADO = [
  { value: 'R1', label: 'R1 — Acesso Direto', desc: '100 questões · 4h30', icon: '🎯' },
  { value: 'R+CM', label: 'R+ Clínica Médica', desc: '100 questões · 4h30', icon: '🏥' },
  { value: 'R+CIR', label: 'R+ Cirurgia', desc: '100 questões · 4h30', icon: '🔪' },
  { value: 'REVALIDA', label: 'REVALIDA', desc: '100 questões · 4h30', icon: '📋' },
  { value: 'MISTO', label: 'Simulado Misto', desc: '100 questões · 4h30', icon: '🎲' },
];

export default function SimuladosPage() {
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Simulados</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Simule uma prova real de residência médica com tempo limitado</p>

      <div className="space-y-3 mb-6">
        {TIPOS_SIMULADO.map((tipo) => (
          <button
            key={tipo.value}
            onClick={() => setSelectedTipo(tipo.value)}
            className="w-full text-left rounded-2xl p-5 transition-all flex items-center gap-4"
            style={{
              backgroundColor: selectedTipo === tipo.value ? 'rgba(232,23,44,0.08)' : '#141414',
              border: `1.5px solid ${selectedTipo === tipo.value ? '#E8172C' : '#21262D'}`,
            }}
          >
            <span className="text-3xl">{tipo.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-white text-[14px]">{tipo.label}</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#484F58' }}>{tipo.desc}</p>
            </div>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                border: `2px solid ${selectedTipo === tipo.value ? '#E8172C' : '#21262D'}`,
                backgroundColor: selectedTipo === tipo.value ? '#E8172C' : 'transparent',
              }}
            >
              {selectedTipo === tipo.value && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>

      <button
        disabled={!selectedTipo}
        className="w-full h-12 rounded-xl font-[800] text-[15px] text-white disabled:opacity-40 transition-transform active:scale-[0.97]"
        style={{
          background: selectedTipo ? 'linear-gradient(135deg, #E8172C, #FF4444)' : '#21262D',
          fontFamily: 'Syne, sans-serif',
          boxShadow: selectedTipo ? '0 5px 14px rgba(232,23,44,0.35)' : 'none',
        }}
      >
        Iniciar simulado →
      </button>

      {/* Histórico */}
      <div className="mt-8">
        <div className="h-px mb-4" style={{ backgroundColor: '#161B22' }} />
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Histórico</h2>
        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <span className="text-3xl">📊</span>
          <p className="text-[13px] mt-2" style={{ color: '#484F58' }}>Nenhum simulado realizado ainda</p>
          <p className="text-[11px] mt-1" style={{ color: '#484F58' }}>Seus resultados aparecerão aqui</p>
        </div>
      </div>
    </div>
  );
}
