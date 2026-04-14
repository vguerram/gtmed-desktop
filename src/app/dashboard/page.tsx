'use client';

import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const META_XP_SEMANAL = 1000;
const TOTAL_SEMANAS = 45;

const MISSOES_DEF = [
  { id: 'questoes', icon: '🎯', nome: 'Responda 10 questões', meta: 10, xp: 50, cor: '#E8172C', rota: '/dashboard/questoes' },
  { id: 'flashcards', icon: '⚡', nome: 'Revise 10 flashcards', meta: 10, xp: 30, cor: '#00CFFF', rota: '/dashboard/flashcards' },
  { id: 'revisao', icon: '🔁', nome: 'Faça 1 sessão de revisão', meta: 1, xp: 20, cor: '#7B2FF7', rota: '/dashboard/evolucao' },
];

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const nome = user?.name?.split(' ')[0] || 'Estudante';
  const nivel = user?.nivel || 1;
  const xpSemanal = user?.xpSemana || 0;
  const streakDias = user?.streakAtual || 0;

  const todayIdx = new Date().getDay();
  const streakSemana = Array.from({ length: 7 }, (_, i) => i < streakDias % 7);

  const xpPct = Math.min((xpSemanal / META_XP_SEMANAL) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto">

      {/* Topbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
            >
              {nome[0]}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ backgroundColor: '#E8172C', border: '2px solid #0A0A0A' }}
            >
              {nivel}
            </div>
          </div>
          <div>
            <p className="font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{nome}</p>
            <p className="text-[11px]" style={{ color: '#8B949E' }}>Calouro · Nível {nivel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
            🔔
          </button>
        </div>
      </div>

      {/* Streak Hero */}
      <div
        className="rounded-2xl p-5 mb-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A0000, #160808, #141414)', border: '1px solid #21262D' }}
      >
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(232,23,44,0.15)' }} />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            <div>
              <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{streakDias}</p>
              <p className="text-[10px] font-bold tracking-wider" style={{ color: '#8B949E' }}>DIAS DE<br/>STREAK</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {DIAS.map((d, i) => {
              const isOn = streakSemana[i];
              const isToday = i === todayIdx;
              return (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: isToday ? 'rgba(232,23,44,0.2)' : isOn ? 'rgba(0,200,83,0.2)' : '#141414',
                    border: isToday ? '2px solid #E8172C' : isOn ? '1px solid rgba(0,200,83,0.3)' : '1px solid #21262D',
                    color: isToday ? '#E8172C' : isOn ? '#fff' : '#484F58',
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Duo Row: XP + Ranking */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/dashboard/evolucao" className="rounded-2xl p-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span>
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,184,0,0.15)', color: '#FFB800' }}>ESTA SEMANA</span>
          </div>
          <p className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{xpSemanal} XP</p>
          <p className="text-[11px] mt-1" style={{ color: '#484F58' }}>
            {xpSemanal >= META_XP_SEMANAL ? 'Meta semanal atingida! 🎉' : `Faltam ${META_XP_SEMANAL - xpSemanal} para a meta`}
          </p>
          <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: '#21262D' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${xpPct}%`, backgroundColor: xpSemanal >= META_XP_SEMANAL ? '#00C853' : '#E8172C' }} />
          </div>
        </Link>

        <Link href="/dashboard/evolucao" className="rounded-2xl p-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏆</span>
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(232,23,44,0.15)', color: '#E8172C' }}>RANKING</span>
          </div>
          <p className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>#—</p>
          <p className="text-[11px] mt-1" style={{ color: '#484F58' }}>Responda questões para entrar</p>
          <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: '#21262D' }}>
            <div className="h-full rounded-full" style={{ width: '0%', backgroundColor: '#E8172C' }} />
          </div>
        </Link>
      </div>

      {/* Continuar Trilha */}
      <Link
        href="/dashboard/questoes"
        className="block rounded-2xl p-5 mb-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #E8172C, #C00F22)', boxShadow: '0 6px 20px rgba(232,23,44,0.3)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-white/60">SUA TRILHA — SEMANA 1 DE {TOTAL_SEMANAS}</p>
            <p className="text-2xl font-[800] text-white mt-1" style={{ fontFamily: 'Syne, sans-serif' }}>CONTINUAR</p>
            <div className="w-40 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <div className="h-full rounded-full" style={{ width: '2%', backgroundColor: '#fff' }} />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <span className="text-white text-xl">›</span>
          </div>
        </div>
      </Link>

      {/* Cronograma */}
      <Link
        href="/dashboard/questoes"
        className="flex items-center justify-between rounded-2xl p-4 mb-6"
        style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="font-semibold text-white text-sm">Cronograma de hoje</p>
            <p className="text-[11px]" style={{ color: '#484F58' }}>3 atividades pendentes · ~1h35</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: '#21262D' }}>
            <div className="h-full rounded-full" style={{ width: '33%', backgroundColor: '#E8172C' }} />
          </div>
          <span style={{ color: '#484F58' }}>›</span>
        </div>
      </Link>

      {/* Divider */}
      <div className="h-px mb-4" style={{ backgroundColor: '#161B22' }} />

      {/* Missões do Dia */}
      <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Missões do Dia</h2>

      <div className="space-y-3 mb-4">
        {MISSOES_DEF.map((m) => {
          const atual = 0;
          const progresso = Math.min(atual / m.meta, 1);
          const concluida = atual >= m.meta;
          return (
            <Link
              key={m.id}
              href={m.rota}
              className="flex items-center gap-4 rounded-2xl p-4"
              style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: m.cor + '22' }}>
                {m.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{m.nome}</p>
                <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: '#21262D' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${progresso * 100}%`, backgroundColor: m.cor }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px]" style={{ color: '#484F58' }}>{atual} / {m.meta}</span>
                  <span className="text-[10px] font-semibold" style={{ color: concluida ? '#00C853' : m.cor }}>
                    {concluida ? '✓ Concluída' : `+${m.xp} XP`}
                  </span>
                </div>
              </div>
              <span style={{ color: concluida ? '#00C853' : '#484F58' }}>{concluida ? '✓' : '›'}</span>
            </Link>
          );
        })}
      </div>

      <p className="text-center text-[12px] mb-6" style={{ color: '#484F58' }}>+50 XP bônus por completar todas as 3 hoje 🔥</p>

      {/* Divider */}
      <div className="h-px mb-4" style={{ backgroundColor: '#161B22' }} />

      {/* Desafios */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>⚔️ Desafios</h2>
        <Link href="/dashboard/questoes" className="text-[12px] font-semibold" style={{ color: '#E8172C' }}>Ver todos →</Link>
      </div>

      <div
        className="rounded-2xl p-5 mb-6 text-center"
        style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}
      >
        <span className="text-4xl">⚔️</span>
        <p className="font-semibold text-white mt-3" style={{ fontFamily: 'Syne, sans-serif' }}>Você ainda não desafiou ninguém hoje</p>
        <p className="text-[12px] mt-1" style={{ color: '#484F58' }}>Enquanto você espera, alguém está te ultrapassando no ranking</p>
        <button
          className="mt-4 px-6 py-2.5 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
        >
          🎯 Desafiar agora
        </button>
      </div>
    </div>
  );
}
