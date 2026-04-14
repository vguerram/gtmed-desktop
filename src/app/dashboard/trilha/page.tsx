'use client';

import { useState, useEffect, useRef } from 'react';
import { getTrailWeeks } from '@/services/trilha';
import type { TrailWeek } from '@/services/trilha';
import Link from 'next/link';

const AREA_COR: Record<string, string> = {
  'CLÍNICA': '#E8172C', 'CIRURGIA': '#FF8C00', 'PEDIATRIA': '#00C853',
  'GINECOLOGIA': '#FF69B4', 'OBSTETRÍCIA': '#7B2FF7', 'PREVENTIVA': '#00CFFF',
};

const MILESTONE_WEEKS = [10, 20, 30, 40];
const NODE_ICONS: Record<string, string> = {
  questoes: '📝', flashcards: '⚡', videoaulas: '🎬', boss: '👹',
};

export default function TrilhaPage() {
  const [weeks, setWeeks] = useState<TrailWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTrailWeeks().then((w) => { setWeeks(w); setLoading(false); });
  }, []);

  function scrollToWeek(semana: number) {
    setSelectedWeek(semana);
    const el = document.getElementById(`week-${semana}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-syne)' }}>🗺️ Trilha Galáctica</h1>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-white/20 border-t-[#E8172C] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>🗺️ Trilha Galáctica</h1>
          <p className="text-[13px] mt-1" style={{ color: '#8B949E' }}>{weeks.length} semanas de estudo progressivo</p>
        </div>
        <Link
          href="/dashboard/boss"
          className="px-4 py-2 rounded-xl text-[12px] font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
        >
          👹 Boss Battle
        </Link>
      </div>

      {/* Week chips */}
      <div ref={chipsRef} className="flex gap-1.5 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: 'none' }}>
        {weeks.filter(w => w.semana <= 41).map((w) => {
          const isActive = selectedWeek === w.semana;
          const isMilestone = MILESTONE_WEEKS.includes(w.semana);
          return (
            <button
              key={w.semana}
              onClick={() => scrollToWeek(w.semana)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{
                backgroundColor: isActive ? 'rgba(232,23,44,0.15)' : '#141414',
                border: `1.5px solid ${isActive ? '#E8172C' : isMilestone ? '#FFB800' : '#21262D'}`,
                color: isActive ? '#E8172C' : isMilestone ? '#FFB800' : '#8B949E',
              }}
            >
              S{w.semana}
            </button>
          );
        })}
      </div>

      {/* Trail */}
      <div className="relative">
        {weeks.map((week, wi) => {
          const areaColor = AREA_COR[week.nodes[0]?.grande_area?.toUpperCase()] || '#E8172C';
          const questNodes = week.nodes.filter(n => n.tipo === 'questoes');
          const fcNodes = week.nodes.filter(n => n.tipo === 'flashcards');
          const videoNodes = week.nodes.filter(n => n.tipo === 'videoaulas');
          const bossNode = week.nodes.find(n => n.tipo === 'boss');
          const hasContent = week.nodes.some(n => n.theme_ids?.length > 0);
          const isMilestone = MILESTONE_WEEKS.includes(week.semana);
          const isSelected = selectedWeek === week.semana;
          const isSimulado = week.semana >= 42;

          return (
            <div key={week.semana} id={`week-${week.semana}`}>
              {isMilestone && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px" style={{ backgroundColor: '#FFB800' }} />
                  <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,184,0,0.15)', color: '#FFB800', border: '1px solid rgba(255,184,0,0.3)' }}>
                    🏆 MILESTONE — SEMANA {week.semana}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#FFB800' }} />
                </div>
              )}

              <div
                className="flex items-stretch gap-4 mb-2 rounded-2xl overflow-hidden transition-all cursor-pointer"
                style={{
                  backgroundColor: isSelected ? 'rgba(232,23,44,0.03)' : '#141414',
                  border: `1.5px solid ${isSelected ? areaColor + '40' : '#21262D'}`,
                }}
                onClick={() => setSelectedWeek(isSelected ? null : week.semana)}
              >
                <div
                  className="w-14 flex flex-col items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: areaColor + '15', borderRight: `2px solid ${areaColor}30` }}
                >
                  <span className="text-[9px] font-bold" style={{ color: areaColor }}>{isSimulado ? 'SIM' : 'S'}</span>
                  <span className="text-lg font-[900] text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                    {isSimulado ? week.semana - 41 : week.semana}
                  </span>
                </div>

                <div className="flex-1 py-3 pr-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-semibold text-white">{isSimulado ? `Simulado Final ${week.semana - 41}` : week.planeta}</p>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hasContent ? '#00C853' : '#484F58' }} />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {!isSimulado && (
                      <>
                        <Pill icon="📝" count={questNodes.length} label="Quest" color={areaColor} active={questNodes.some(n => n.theme_ids?.length > 0)} />
                        <Pill icon="⚡" count={fcNodes.length} label="Flash" color="#00CFFF" active={fcNodes.some(n => n.theme_ids?.length > 0)} />
                        <Pill icon="🎬" count={videoNodes.length} label="Aulas" color="#7B2FF7" active={videoNodes.some(n => n.theme_ids?.length > 0)} />
                        {bossNode && <Pill icon="👹" count={1} label="Boss" color="#E8172C" active />}
                      </>
                    )}
                    {isSimulado && <Pill icon="🧪" count={100} label="questões" color="#FFB800" active />}
                  </div>
                </div>

                <div className="flex items-center pr-3">
                  <span className="text-[11px]" style={{ color: '#484F58' }}>{isSelected ? '▾' : '▸'}</span>
                </div>
              </div>

              {isSelected && (
                <div className="ml-[72px] mb-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                  {week.nodes.filter(n => n.tipo !== 'boss').map((node) => (
                    <div key={node.id} className="rounded-xl p-3 flex items-center gap-3" style={{ backgroundColor: '#0C0E18', border: '1px solid #1A1C2C' }}>
                      <span className="text-base">{NODE_ICONS[node.tipo] || '📋'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-white truncate">{node.titulo}</p>
                        <p className="text-[9px]" style={{ color: '#484F58' }}>{node.theme_ids?.length ? `${node.theme_ids.length} temas` : 'Sem conteúdo'}</p>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.theme_ids?.length ? '#00C853' : '#484F58' }} />
                    </div>
                  ))}
                  {bossNode && (
                    <Link href="/dashboard/boss" className="rounded-xl p-3 flex items-center gap-3 transition-all" style={{ backgroundColor: 'rgba(232,23,44,0.05)', border: '1px solid rgba(232,23,44,0.2)' }}>
                      <span className="text-base">👹</span>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold" style={{ color: '#E8172C' }}>Boss Battle</p>
                        <p className="text-[9px]" style={{ color: '#484F58' }}>Meta: 70%</p>
                      </div>
                      <span className="text-[11px]" style={{ color: '#E8172C' }}>⚔️</span>
                    </Link>
                  )}
                </div>
              )}

              {wi < weeks.length - 1 && !isMilestone && (
                <div className="flex ml-7"><div className="w-px h-1" style={{ backgroundColor: '#21262D' }} /></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Pill({ icon, count, label, color, active }: { icon: string; count: number; label: string; color: string; active: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold"
      style={{
        backgroundColor: active ? color + '12' : '#0C0E18',
        border: `1px solid ${active ? color + '30' : '#1A1C2C'}`,
        color: active ? color : '#484F58',
      }}
    >
      <span className="text-[10px]">{icon}</span>{count} {label}
    </span>
  );
}
