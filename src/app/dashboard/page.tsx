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

const ATALHOS = [
  { href: '/dashboard/questoes', icon: '📝', label: 'Questões', sub: '5.174 autorais', cor: '#E8172C' },
  { href: '/dashboard/flashcards', icon: '⚡', label: 'Flashcards', sub: '9.362 cards', cor: '#00CFFF' },
  { href: '/dashboard/videoaulas', icon: '🎬', label: 'Videoaulas', sub: '158 aulas', cor: '#7B2FF7' },
  { href: '/dashboard/simulados', icon: '🧪', label: 'Simulados', sub: '4h30 cronometrado', cor: '#FF8C00' },
  { href: '/dashboard/desafios', icon: '⚔️', label: 'Desafios', sub: 'PvP com rivais', cor: '#FF69B4' },
  { href: '/dashboard/revisao', icon: '🔁', label: 'Revisão', sub: 'SRS inteligente', cor: '#00C853' },
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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>
            Olá, {nome}! 👋
          </h1>
          <p className="text-[13px] mt-1" style={{ color: '#8B949E' }}>Pronto para estudar hoje?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
            <span className="text-sm">🔥</span>
            <span className="text-[13px] font-bold" style={{ color: '#FF8C00' }}>{streakDias} dias</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
            <span className="text-sm">⚡</span>
            <span className="text-[13px] font-bold" style={{ color: '#FFB800' }}>{user?.xpTotal || 0} XP</span>
          </div>
        </div>
      </div>

      {/* Top row: Streak + XP + Ranking — 3 colunas no desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Streak card */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1A0000, #160808, #141414)', border: '1px solid #21262D' }}
        >
          <div className="absolute top-0 left-0 w-20 h-20 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(232,23,44,0.15)' }} />
          <div className="flex items-center gap-3 relative z-10 mb-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>{streakDias}</p>
              <p className="text-[9px] font-bold tracking-wider" style={{ color: '#8B949E' }}>DIAS DE STREAK</p>
            </div>
          </div>
          <div className="flex gap-1.5 relative z-10">
            {DIAS.map((d, i) => {
              const isOn = streakSemana[i];
              const isToday = i === todayIdx;
              return (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold flex-1"
                  style={{
                    backgroundColor: isToday ? 'rgba(232,23,44,0.2)' : isOn ? 'rgba(0,200,83,0.2)' : 'rgba(255,255,255,0.03)',
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

        {/* XP Semanal */}
        <Link href="/dashboard/evolucao" className="rounded-2xl p-5" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span>
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,184,0,0.15)', color: '#FFB800' }}>ESTA SEMANA</span>
          </div>
          <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>{xpSemanal} XP</p>
          <p className="text-[11px] mt-1" style={{ color: '#484F58' }}>
            {xpSemanal >= META_XP_SEMANAL ? 'Meta atingida! 🎉' : `Faltam ${META_XP_SEMANAL - xpSemanal} XP`}
          </p>
          <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: '#21262D' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${xpPct}%`, backgroundColor: xpSemanal >= META_XP_SEMANAL ? '#00C853' : '#E8172C' }} />
          </div>
        </Link>

        {/* Ranking */}
        <Link href="/dashboard/ranking" className="rounded-2xl p-5" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏆</span>
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(232,23,44,0.15)', color: '#E8172C' }}>RANKING</span>
          </div>
          <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>#—</p>
          <p className="text-[11px] mt-1" style={{ color: '#484F58' }}>Responda questões para entrar</p>
          <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: '#21262D' }}>
            <div className="h-full rounded-full" style={{ width: '0%', backgroundColor: '#E8172C' }} />
          </div>
        </Link>
      </div>

      {/* Continuar Trilha — full width */}
      <Link
        href="/dashboard/trilha"
        className="block rounded-2xl p-5 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #E8172C, #C00F22)', boxShadow: '0 6px 20px rgba(232,23,44,0.3)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-white/60">SUA TRILHA — SEMANA 1 DE {TOTAL_SEMANAS}</p>
            <p className="text-2xl font-[800] text-white mt-1" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>CONTINUAR ESTUDANDO</p>
            <div className="w-48 h-1.5 rounded-full mt-2" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <div className="h-full rounded-full" style={{ width: '2%', backgroundColor: '#fff' }} />
            </div>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <span className="text-white text-2xl">›</span>
          </div>
        </div>
      </Link>

      {/* Atalhos rápidos — grid 6 colunas no desktop, 3 no tablet, 2 no mobile */}
      <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>Acesso rápido</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {ATALHOS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-2xl p-4 text-center transition-all hover:scale-[1.02]"
            style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}
          >
            <span className="text-2xl">{a.icon}</span>
            <p className="text-[13px] font-semibold text-white mt-2">{a.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#484F58' }}>{a.sub}</p>
          </Link>
        ))}
      </div>

      {/* Bottom: Missões + Desafios — 2 colunas no desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missões */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>Missões do Dia</h2>
          <div className="space-y-2.5">
            {MISSOES_DEF.map((m) => {
              const atual = 0;
              const progresso = Math.min(atual / m.meta, 1);
              const concluida = atual >= m.meta;
              return (
                <Link
                  key={m.id}
                  href={m.rota}
                  className="flex items-center gap-3 rounded-xl p-3.5"
                  style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: m.cor + '22' }}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white">{m.nome}</p>
                    <div className="w-full h-1 rounded-full mt-1.5" style={{ backgroundColor: '#21262D' }}>
                      <div className="h-full rounded-full" style={{ width: `${progresso * 100}%`, backgroundColor: m.cor }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px]" style={{ color: '#484F58' }}>{atual}/{m.meta}</span>
                      <span className="text-[9px] font-semibold" style={{ color: concluida ? '#00C853' : m.cor }}>
                        {concluida ? '✓' : `+${m.xp} XP`}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
            <p className="text-center text-[11px]" style={{ color: '#484F58' }}>+50 XP bônus por completar todas 🔥</p>
          </div>
        </div>

        {/* Desafios */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>⚔️ Desafios</h2>
            <Link href="/dashboard/desafios" className="text-[12px] font-semibold" style={{ color: '#E8172C' }}>Ver todos →</Link>
          </div>
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
            <span className="text-4xl">⚔️</span>
            <p className="font-semibold text-white mt-3 text-[14px]" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif' }}>Ninguém desafiado hoje</p>
            <p className="text-[12px] mt-1 mb-4" style={{ color: '#484F58' }}>Enquanto você espera, alguém te ultrapassa</p>
            <Link
              href="/dashboard/desafios"
              className="inline-block px-6 py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
            >
              🎯 Desafiar agora
            </Link>
          </div>

          {/* Cronograma mini */}
          <Link
            href="/dashboard/cronograma"
            className="flex items-center gap-3 rounded-2xl p-4 mt-3"
            style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}
          >
            <span className="text-xl">📅</span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-white">Cronograma de hoje</p>
              <p className="text-[11px]" style={{ color: '#484F58' }}>3 atividades · ~1h35</p>
            </div>
            <span style={{ color: '#484F58' }}>›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
