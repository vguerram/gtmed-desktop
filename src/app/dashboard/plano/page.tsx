'use client';

import { usePlanStore } from '@/stores/planStore';

const PLANOS = [
  {
    id: 'gratuito',
    nome: 'Gratuito',
    preco: 'R$ 0',
    periodo: 'para sempre',
    cor: '#00CFFF',
    features: [
      '5 questões por dia',
      '5 flashcards por dia',
      'Trilha (Semana 1)',
      'Ranking semanal',
    ],
    limitacoes: [
      'Sem simulados',
      'Sem desafios PvP',
      'Sem acesso a todas as semanas',
    ],
  },
  {
    id: 'mensal',
    nome: 'Pro Mensal',
    preco: 'R$ 39,90',
    periodo: '/mês',
    cor: '#E8172C',
    popular: false,
    features: [
      'Questões ilimitadas',
      'Flashcards ilimitados',
      'Trilha completa (45 semanas)',
      'Simulados com timer',
      'Desafios PvP',
      'Ranking completo',
      'Suporte prioritário',
    ],
  },
  {
    id: 'anual',
    nome: 'Pro Anual',
    preco: 'R$ 29,90',
    periodo: '/mês (cobrado anualmente)',
    cor: '#FFB800',
    popular: true,
    features: [
      'Tudo do Pro Mensal',
      '25% de desconto',
      'Acesso antecipado a novidades',
      'Badge exclusivo no ranking',
    ],
  },
];

export default function PlanoPage() {
  const { tipo, isPro, getQuestoesRestantes, getFlashcardsRestantes } = usePlanStore();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>💎 Planos</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>
        {isPro ? 'Você é Pro! Aproveite todos os recursos.' : `Plano atual: Gratuito · ${getQuestoesRestantes()} questões restantes hoje`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANOS.map((p) => {
          const isActive = (p.id === 'gratuito' && !isPro) || (p.id !== 'gratuito' && isPro && tipo === 'pro');
          return (
            <div
              key={p.id}
              className="rounded-2xl p-6 relative"
              style={{
                backgroundColor: '#141414',
                border: `1.5px solid ${isActive ? p.cor : '#21262D'}`,
              }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#FFB800', color: '#0A0A0A' }}>
                  MAIS POPULAR
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{p.nome}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold" style={{ color: p.cor }}>{p.preco}</span>
                <span className="text-[12px]" style={{ color: '#484F58' }}>{p.periodo}</span>
              </div>

              <div className="space-y-2 mb-5">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[12px]" style={{ color: '#00C853' }}>✓</span>
                    <span className="text-[13px]" style={{ color: '#F0F6FC' }}>{f}</span>
                  </div>
                ))}
                {p.limitacoes?.map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[12px]" style={{ color: '#E8172C' }}>✕</span>
                    <span className="text-[13px]" style={{ color: '#484F58' }}>{l}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={isActive}
                className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-40 transition-transform active:scale-[0.97]"
                style={{
                  background: isActive ? '#21262D' : `linear-gradient(135deg, ${p.cor}, ${p.cor}CC)`,
                }}
              >
                {isActive ? 'Plano atual' : p.id === 'gratuito' ? 'Downgrade' : 'Assinar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
