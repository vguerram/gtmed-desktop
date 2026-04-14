'use client';

import { useState, useEffect } from 'react';
import { getTrailWeeks } from '@/services/trilha';
import type { TrailWeek } from '@/services/trilha';

const AREA_COLORS: Record<string, string> = {
  'CLÍNICA': '#E8172C',
  'CIRURGIA': '#FF8C00',
  'PEDIATRIA': '#00C853',
  'GINECOLOGIA': '#FF69B4',
  'OBSTETRÍCIA': '#7B2FF7',
  'PREVENTIVA': '#00CFFF',
};

export default function TrilhaPage() {
  const [weeks, setWeeks] = useState<TrailWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  useEffect(() => {
    getTrailWeeks().then((w) => {
      setWeeks(w);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>🗺️ Trilha</h1>
        <p style={{ color: '#484F58' }}>Carregando trilha...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>🗺️ Trilha</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>45 semanas de estudo gamificado para residência médica</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {weeks.map((week) => {
          const isExpanded = expandedWeek === week.semana;
          const areaColor = AREA_COLORS[week.nodes[0]?.grande_area?.toUpperCase()] || '#E8172C';
          const questNodes = week.nodes.filter(n => n.tipo === 'questoes');
          const fcNodes = week.nodes.filter(n => n.tipo === 'flashcards');
          const videoNodes = week.nodes.filter(n => n.tipo === 'videoaulas');
          const bossNode = week.nodes.find(n => n.tipo === 'boss');

          return (
            <div key={week.semana} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#141414', border: `1px solid ${isExpanded ? areaColor + '40' : '#21262D'}` }}>
              {/* Header */}
              <button
                onClick={() => setExpandedWeek(isExpanded ? null : week.semana)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: areaColor + '22', border: `2px solid ${areaColor}` }}
                  >
                    {week.semana}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-[14px]">{week.planeta}</p>
                    <p className="text-[11px]" style={{ color: '#484F58' }}>
                      {questNodes.length} questões · {fcNodes.length} flashcards · {videoNodes.length} aulas
                      {bossNode ? ' · 1 boss' : ''}
                    </p>
                  </div>
                </div>
                <span className="text-[14px]" style={{ color: '#484F58' }}>{isExpanded ? '▾' : '▸'}</span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {week.nodes.map((node) => {
                    const iconMap: Record<string, string> = { questoes: '📝', flashcards: '⚡', videoaulas: '🎬', boss: '👹' };
                    const hasContent = node.theme_ids && node.theme_ids.length > 0;
                    return (
                      <div
                        key={node.id}
                        className="flex items-center gap-3 rounded-xl p-3"
                        style={{ backgroundColor: '#0C0E18', border: '1px solid #1A1C2C' }}
                      >
                        <span className="text-lg">{iconMap[node.tipo] || '📋'}</span>
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-white">{node.titulo}</p>
                          <p className="text-[10px]" style={{ color: '#484F58' }}>
                            {hasContent ? `${node.theme_ids.length} temas` : 'Sem conteúdo'}
                          </p>
                        </div>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: hasContent ? '#00C853' : '#484F58' }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
