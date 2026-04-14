'use client';

import { useRouter } from 'next/navigation';
import { usePlanStore } from '@/stores/planStore';

const FEATURES = [
  { icon: '📝', text: 'Questões ilimitadas', free: '5/dia', pro: 'Ilimitado' },
  { icon: '⚡', text: 'Flashcards ilimitados', free: '5/dia', pro: 'Ilimitado' },
  { icon: '🗺️', text: 'Trilha completa', free: 'Semana 1', pro: '45 semanas' },
  { icon: '🧪', text: 'Simulados com timer', free: '—', pro: '✓' },
  { icon: '⚔️', text: 'Desafios PvP', free: '—', pro: '✓' },
  { icon: '📊', text: 'Estatísticas avançadas', free: '—', pro: '✓' },
  { icon: '💬', text: 'Suporte prioritário', free: '—', pro: '✓' },
];

export default function PaywallPage() {
  const router = useRouter();
  const { getQuestoesRestantes, getFlashcardsRestantes } = usePlanStore();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#07090F' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-5xl">🚀</span>
          <h1 className="text-2xl font-bold text-white mt-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            Desbloqueie o <span style={{ color: '#E8172C' }}>GTMED Pro</span>
          </h1>
          <p className="text-[13px] mt-2" style={{ color: '#8B949E' }}>
            Você usou {5 - getQuestoesRestantes()}/5 questões gratuitas de hoje
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl overflow-hidden mb-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <div className="grid grid-cols-3 p-3" style={{ borderBottom: '1px solid #161B22' }}>
            <span className="text-[10px] font-bold tracking-wider" style={{ color: '#484F58' }}>RECURSO</span>
            <span className="text-[10px] font-bold tracking-wider text-center" style={{ color: '#484F58' }}>GRÁTIS</span>
            <span className="text-[10px] font-bold tracking-wider text-center" style={{ color: '#E8172C' }}>PRO</span>
          </div>
          {FEATURES.map((f, i) => (
            <div key={i} className="grid grid-cols-3 items-center px-3 py-2.5" style={{ borderBottom: i < FEATURES.length - 1 ? '1px solid #161B22' : 'none' }}>
              <div className="flex items-center gap-2">
                <span className="text-sm">{f.icon}</span>
                <span className="text-[12px] text-white">{f.text}</span>
              </div>
              <span className="text-[12px] text-center" style={{ color: '#484F58' }}>{f.free}</span>
              <span className="text-[12px] text-center font-semibold" style={{ color: '#00C853' }}>{f.pro}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="space-y-3 mb-6">
          <button
            className="w-full rounded-2xl p-5 text-left transition-all"
            style={{ background: 'linear-gradient(135deg, rgba(232,23,44,0.1), rgba(232,23,44,0.03))', border: '1.5px solid #E8172C' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-[14px]">Pro Anual</p>
                <p className="text-[12px]" style={{ color: '#8B949E' }}>Economia de 25%</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[18px]" style={{ color: '#E8172C' }}>R$ 29,90</p>
                <p className="text-[10px]" style={{ color: '#484F58' }}>/mês</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFB800', color: '#0A0A0A' }}>MAIS POPULAR</span>
            </div>
          </button>

          <button
            className="w-full rounded-2xl p-5 text-left transition-all"
            style={{ backgroundColor: '#141414', border: '1.5px solid #21262D' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-[14px]">Pro Mensal</p>
                <p className="text-[12px]" style={{ color: '#8B949E' }}>Cancele quando quiser</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[18px]" style={{ color: '#F0F6FC' }}>R$ 39,90</p>
                <p className="text-[10px]" style={{ color: '#484F58' }}>/mês</p>
              </div>
            </div>
          </button>
        </div>

        {/* CTA */}
        <button
          className="w-full h-[52px] rounded-xl font-[800] text-[15px] text-white transition-transform active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)', fontFamily: 'Syne, sans-serif', boxShadow: '0 5px 20px rgba(232,23,44,0.4)' }}
        >
          Assinar Pro →
        </button>
        <p className="text-center text-[11px] mt-2" style={{ color: '#484F58' }}>7 dias de garantia · Cancele a qualquer momento</p>

        {/* Skip */}
        <button
          onClick={() => router.back()}
          className="w-full text-center mt-4 text-[13px]"
          style={{ color: '#484F58' }}
        >
          Continuar com plano gratuito
        </button>
      </div>
    </div>
  );
}
