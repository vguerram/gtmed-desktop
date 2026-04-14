'use client';

import Link from 'next/link';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const ATIVIDADES_HOJE = [
  { tipo: 'questoes', titulo: 'Questões de Reumatologia', tempo: '30 min', concluida: false, rota: '/dashboard/questoes', icon: '📝', cor: '#E8172C' },
  { tipo: 'flashcards', titulo: 'Flashcards de LES', tempo: '15 min', concluida: false, rota: '/dashboard/flashcards', icon: '⚡', cor: '#00CFFF' },
  { tipo: 'videoaula', titulo: 'Aula: Artrite Reumatológica', tempo: '50 min', concluida: false, rota: '/dashboard/videoaulas', icon: '🎬', cor: '#7B2FF7' },
];

export default function CronogramaPage() {
  const hoje = new Date();
  const diaIdx = hoje.getDay();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>📅 Cronograma</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Sua agenda de estudos organizada por dia</p>

      {/* Calendário da semana */}
      <div className="flex gap-2 mb-6">
        {DIAS_SEMANA.map((dia, i) => {
          const d = new Date(hoje);
          d.setDate(d.getDate() - (diaIdx - i));
          const isToday = i === diaIdx;
          return (
            <div
              key={i}
              className="flex-1 rounded-xl py-3 text-center"
              style={{
                backgroundColor: isToday ? 'rgba(232,23,44,0.1)' : '#141414',
                border: `1.5px solid ${isToday ? '#E8172C' : '#21262D'}`,
              }}
            >
              <p className="text-[10px] font-bold" style={{ color: isToday ? '#E8172C' : '#484F58' }}>{dia}</p>
              <p className="text-[16px] font-bold mt-0.5" style={{ color: isToday ? '#E8172C' : '#F0F6FC' }}>{d.getDate()}</p>
            </div>
          );
        })}
      </div>

      {/* Pomodoro mini */}
      <div className="rounded-2xl p-4 mb-6 flex items-center justify-between" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">⚡</span>
          <div>
            <p className="text-[13px] font-semibold text-white">Pomodoro</p>
            <p className="text-[11px]" style={{ color: '#484F58' }}>25:00 — Pronto para começar</p>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white"
          style={{ backgroundColor: '#6366F1' }}
        >
          ▶ Iniciar
        </button>
      </div>

      {/* Atividades do dia */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Hoje</h2>
        <span className="text-[12px]" style={{ color: '#484F58' }}>
          0/{ATIVIDADES_HOJE.length} concluídas · ~{ATIVIDADES_HOJE.reduce((acc, a) => acc + parseInt(a.tempo), 0)} min
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {ATIVIDADES_HOJE.map((a, i) => (
          <Link
            key={i}
            href={a.rota}
            className="flex items-center gap-4 rounded-2xl p-4 transition-all"
            style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: a.cor + '22' }}>
              {a.icon}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-white">{a.titulo}</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#484F58' }}>{a.tempo}</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  border: `2px solid ${a.concluida ? '#00C853' : '#21262D'}`,
                  backgroundColor: a.concluida ? '#00C853' : 'transparent',
                }}
              >
                {a.concluida && <span className="text-[10px] text-white">✓</span>}
              </div>
              <span style={{ color: '#484F58' }}>›</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Próximos dias */}
      <div className="h-px mb-4" style={{ backgroundColor: '#161B22' }} />
      <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Próximos dias</h2>
      <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <span className="text-3xl">📋</span>
        <p className="text-[13px] mt-2" style={{ color: '#484F58' }}>O cronograma se adapta ao seu progresso na trilha</p>
      </div>
    </div>
  );
}
