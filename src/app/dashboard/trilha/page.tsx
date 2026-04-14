'use client';

import { useState, useEffect } from 'react';
import { getTrailWeeks } from '@/services/trilha';
import type { TrailWeek } from '@/services/trilha';
import Link from 'next/link';

const AREA_COR: Record<string, string> = {
  'CLÍNICA': '#E8172C', 'CIRURGIA': '#FF8C00', 'PEDIATRIA': '#00C853',
  'GINECOLOGIA': '#FF69B4', 'OBSTETRÍCIA': '#7B2FF7', 'PREVENTIVA': '#00CFFF',
};

const MILESTONE_MAP: Record<number, { icon: string; text: string }> = {
  10: { icon: '🚀', text: 'DECOLAGEM COMPLETA' },
  20: { icon: '🏆', text: 'METADE DO CAMINHO' },
  30: { icon: '⭐', text: 'RETA FINAL À VISTA' },
  40: { icon: '🔥', text: 'QUASE LÁ' },
};

const ZIGZAG = ['left', 'center', 'right', 'center', 'left'] as const;

export default function TrilhaPage() {
  const [weeks, setWeeks] = useState<TrailWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState<{ semana: number } | null>(null);

  useEffect(() => {
    getTrailWeeks().then((w) => { setWeeks(w); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#E8172C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#07090F' }}>
      {/* Star field background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() > 0.8 ? 2 : 1,
              height: Math.random() > 0.8 ? 2 : 1,
              backgroundColor: `rgba(255,255,255,${0.1 + Math.random() * 0.4})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Cosmo mascot + header */}
      <div className="relative z-10 text-center pt-8 pb-4">
        <div className="text-6xl mb-2 animate-bounce" style={{ animationDuration: '3s' }}>👨‍🚀</div>
        <div className="inline-block px-4 py-1.5 rounded-full mb-2" style={{ backgroundColor: 'rgba(232,23,44,0.1)', border: '1px solid rgba(232,23,44,0.2)' }}>
          <span className="text-[12px] font-bold" style={{ color: '#E8172C' }}>📍 VOCÊ ESTÁ AQUI — SEMANA 1</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-lg">🔥</span>
          <span className="text-[13px] font-bold" style={{ color: '#FF8C00' }}>0 dias de streak</span>
        </div>
      </div>

      {/* Week chips */}
      <div className="relative z-10 flex gap-1.5 overflow-x-auto px-6 pb-4 mb-2" style={{ scrollbarWidth: 'none' }}>
        {weeks.filter(w => w.semana <= 41).map((w) => {
          const isMilestone = !!MILESTONE_MAP[w.semana];
          return (
            <button
              key={w.semana}
              onClick={() => {
                const el = document.getElementById(`week-${w.semana}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="flex-shrink-0 w-9 h-9 rounded-full text-[10px] font-bold transition-all"
              style={{
                backgroundColor: '#141414',
                border: `2px solid ${isMilestone ? '#FFB800' : '#21262D'}`,
                color: isMilestone ? '#FFB800' : '#8B949E',
              }}
            >
              {w.semana}
            </button>
          );
        })}
      </div>

      {/* Trail path */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 pb-20">
        {weeks.map((week, wi) => {
          const pos = ZIGZAG[wi % 5];
          const areaColor = AREA_COR[week.nodes[0]?.grande_area?.toUpperCase()] || '#E8172C';
          const hasContent = week.nodes.some(n => n.theme_ids?.length > 0);
          const isMilestone = !!MILESTONE_MAP[week.semana];
          const isSimulado = week.semana >= 42;
          const questCount = week.nodes.filter(n => n.tipo === 'questoes').length;
          const fcCount = week.nodes.filter(n => n.tipo === 'flashcards').length;
          const videoCount = week.nodes.filter(n => n.tipo === 'videoaulas').length;
          const hasBoss = week.nodes.some(n => n.tipo === 'boss');
          const isOpen = popup?.semana === week.semana;

          // Zigzag positioning
          const alignClass = pos === 'left' ? 'mr-auto' : pos === 'right' ? 'ml-auto' : 'mx-auto';

          return (
            <div key={week.semana} id={`week-${week.semana}`}>
              {/* Milestone */}
              {isMilestone && (
                <div className="flex items-center justify-center gap-3 my-6">
                  <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,184,0,0.3)' }} />
                  <div className="px-4 py-2 rounded-full text-center" style={{ backgroundColor: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.25)' }}>
                    <span className="text-lg">{MILESTONE_MAP[week.semana].icon}</span>
                    <p className="text-[10px] font-bold tracking-wider" style={{ color: '#FFB800' }}>{MILESTONE_MAP[week.semana].text}</p>
                    <p className="text-[9px]" style={{ color: '#8B949E' }}>{Math.round(week.semana / 45 * 100)}% concluída</p>
                  </div>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,184,0,0.3)' }} />
                </div>
              )}

              {/* Connector curve between nodes */}
              {wi > 0 && (() => {
                const prevPos = ZIGZAG[(wi - 1) % 5];
                const currPos = pos;
                const xMap = { left: 15, center: 50, right: 85 };
                const x1 = xMap[prevPos];
                const x2 = xMap[currPos];
                const midY = 35;
                return (
                  <svg width="100%" height="70" className="block" style={{ overflow: 'visible', marginTop: -8, marginBottom: -8 }}>
                    <path
                      d={`M ${x1}% 0 C ${x1}% ${midY}, ${x2}% ${midY}, ${x2}% 70`}
                      fill="none"
                      stroke="rgba(232,23,44,0.25)"
                      strokeWidth="2"
                      strokeDasharray="8 5"
                    />
                    {/* Glow line */}
                    <path
                      d={`M ${x1}% 0 C ${x1}% ${midY}, ${x2}% ${midY}, ${x2}% 70`}
                      fill="none"
                      stroke="rgba(232,23,44,0.08)"
                      strokeWidth="6"
                    />
                  </svg>
                );
              })()}

              {/* Node */}
              <div className={`w-fit ${alignClass}`}>
                <button
                  onClick={() => setPopup(isOpen ? null : { semana: week.semana })}
                  className="group relative"
                >
                  {/* Glow */}
                  <div
                    className="absolute inset-[-4px] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{ backgroundColor: hasContent ? areaColor : '#21262D' }}
                  />

                  {/* Circle */}
                  <div
                    className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: hasContent
                        ? `linear-gradient(135deg, ${areaColor}, ${areaColor}99)`
                        : 'linear-gradient(135deg, #1E2540, #131826)',
                      border: `3px solid ${hasContent ? areaColor : '#252D4A'}`,
                      boxShadow: hasContent ? `0 6px 16px ${areaColor}55` : 'none',
                      opacity: hasContent ? 1 : 0.5,
                    }}
                  >
                    <span className="text-3xl">{isSimulado ? '🧪' : hasBoss ? '👹' : '🪐'}</span>
                    <span className="text-[10px] font-bold text-white/80">
                      {isSimulado ? `SIM ${week.semana - 41}` : `S${week.semana}`}
                    </span>

                    {/* Done check */}
                    {false && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: '#22C55E', border: '2px solid #07090F' }}>
                        ✓
                      </div>
                    )}
                  </div>
                </button>

                {/* Week label below node */}
                <p className="text-center text-[10px] font-semibold mt-1.5" style={{ color: '#8B949E' }}>
                  {isSimulado ? `Simulado ${week.semana - 41}` : week.planeta.replace('Semana ', 'S')}
                </p>

                {/* Mini pills below */}
                <div className="flex justify-center gap-1.5 mt-1.5">
                  {questCount > 0 && <span className="text-[10px] px-2 py-1 rounded-md font-semibold" style={{ backgroundColor: areaColor + '20', color: areaColor }}>📝 {questCount}</span>}
                  {fcCount > 0 && <span className="text-[10px] px-2 py-1 rounded-md font-semibold" style={{ backgroundColor: '#00CFFF20', color: '#00CFFF' }}>⚡ {fcCount}</span>}
                  {videoCount > 0 && <span className="text-[10px] px-2 py-1 rounded-md font-semibold" style={{ backgroundColor: '#7B2FF720', color: '#7B2FF7' }}>🎬 {videoCount}</span>}
                  {hasBoss && <span className="text-[10px] px-2 py-1 rounded-md font-semibold" style={{ backgroundColor: '#E8172C20', color: '#E8172C' }}>👹 Boss</span>}
                </div>
              </div>

              {/* Expanded popup */}
              {isOpen && (
                <div
                  className="max-w-md mx-auto mt-3 mb-2 rounded-2xl p-5 relative"
                  style={{
                    background: `linear-gradient(135deg, ${areaColor}15, rgba(15,20,30,0.9))`,
                    border: `1.5px solid ${areaColor}40`,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${areaColor}40, transparent)` }} />

                  <p className="text-[11px] font-bold tracking-wider mb-1" style={{ color: areaColor }}>
                    {isSimulado ? `SIMULADO FINAL ${week.semana - 41}` : `SEMANA ${week.semana}`}
                  </p>
                  <p className="text-[16px] font-bold text-white mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
                    {week.planeta}
                  </p>

                  {/* Nodes grid — each item is clickable */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {week.nodes.map((node) => {
                      const icons: Record<string, string> = { questoes: '📝', flashcards: '⚡', videoaulas: '🎬', boss: '👹' };
                      const routes: Record<string, string> = {
                        questoes: '/dashboard/questoes',
                        flashcards: '/dashboard/flashcards',
                        videoaulas: '/dashboard/videoaulas',
                        boss: '/dashboard/boss',
                      };
                      const active = node.theme_ids?.length > 0;
                      return (
                        <Link
                          key={node.id}
                          href={routes[node.tipo] || '/dashboard/questoes'}
                          className="rounded-xl p-3 flex items-center gap-2 transition-all hover:scale-[1.02]"
                          style={{
                            backgroundColor: active ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)',
                            border: `1px solid ${active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}`,
                            cursor: 'pointer',
                          }}
                        >
                          <span className="text-lg">{icons[node.tipo] || '📋'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-white truncate">
                              {node.titulo.replace(/ — .*/, '')}
                            </p>
                            <p className="text-[9px]" style={{ color: '#484F58' }}>
                              {active ? `${node.theme_ids.length} temas` : 'Sem conteúdo'}
                            </p>
                          </div>
                          <span className="text-[11px]" style={{ color: active ? '#8B949E' : '#484F58' }}>›</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href="/dashboard/questoes"
                      className="flex-1 py-2 rounded-lg text-[12px] font-bold text-white text-center"
                      style={{ background: `linear-gradient(135deg, ${areaColor}, ${areaColor}CC)` }}
                    >
                      Estudar semana
                    </Link>
                    {hasBoss && (
                      <Link
                        href="/dashboard/boss"
                        className="py-2 px-4 rounded-lg text-[12px] font-bold text-center"
                        style={{ backgroundColor: 'rgba(232,23,44,0.1)', border: '1px solid rgba(232,23,44,0.2)', color: '#E8172C' }}
                      >
                        👹 Boss
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
