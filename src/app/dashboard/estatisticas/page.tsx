'use client';

import { useState } from 'react';

const AREAS = [
  { nome: 'Clínica Médica', cor: '#E8172C', acertos: 0, total: 0 },
  { nome: 'Cirurgia Geral', cor: '#FF8C00', acertos: 0, total: 0 },
  { nome: 'Pediatria', cor: '#00C853', acertos: 0, total: 0 },
  { nome: 'Ginecologia', cor: '#FF69B4', acertos: 0, total: 0 },
  { nome: 'Obstetrícia', cor: '#7B2FF7', acertos: 0, total: 0 },
  { nome: 'Medicina Preventiva', cor: '#00CFFF', acertos: 0, total: 0 },
];

export default function EstatisticasPage() {
  const [filtro, setFiltro] = useState<'geral' | 'banca'>('geral');

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>📊 Estatísticas</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Acompanhe seu desempenho por área e por banca</p>

      <div className="flex gap-2 mb-6">
        {(['geral', 'banca'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold capitalize transition-all"
            style={{
              backgroundColor: filtro === f ? 'rgba(232,23,44,0.15)' : '#141414',
              border: `1.5px solid ${filtro === f ? '#E8172C' : '#21262D'}`,
              color: filtro === f ? '#E8172C' : '#8B949E',
            }}
          >
            {f === 'geral' ? 'Por Área' : 'Por Banca'}
          </button>
        ))}
      </div>

      {/* Performance por área */}
      <div className="space-y-3">
        {AREAS.map((area) => {
          const pct = area.total > 0 ? Math.round((area.acertos / area.total) * 100) : 0;
          return (
            <div key={area.nome} className="rounded-2xl p-5" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: area.cor }} />
                  <span className="text-[14px] font-medium text-white">{area.nome}</span>
                </div>
                <span className="text-[13px] font-bold" style={{ color: area.total > 0 ? (pct >= 70 ? '#00C853' : '#E8172C') : '#484F58' }}>
                  {area.total > 0 ? `${pct}%` : '—'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#21262D' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: area.cor }} />
              </div>
              <p className="text-[11px] mt-1.5" style={{ color: '#484F58' }}>
                {area.total > 0 ? `${area.acertos}/${area.total} questões corretas` : 'Nenhuma questão respondida'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Resumo */}
      <div className="mt-6 rounded-2xl p-6 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <span className="text-3xl">📈</span>
        <p className="text-[13px] mt-2" style={{ color: '#484F58' }}>
          Responda questões para ver suas estatísticas detalhadas
        </p>
      </div>
    </div>
  );
}
