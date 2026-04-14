'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboardingStore';

const TOTAL_STEPS = 4;

const SUGESTOES_HOSPITAL = ['USP-SP', 'UNIFESP', 'ENARE', 'Santa Casa-SP', 'FMUSP'];
const MESES_PROVA = ['Nov/2026', 'Dez/2026', 'Nov/2027', 'Dez/2027', 'Nov/2028', 'Dez/2028'];
const OPCOES_HORAS = [
  { label: 'Menos de 2h', sublabel: 'Estudo leve — bom para quem trabalha', value: '< 2h', emoji: '🌱' },
  { label: '2 a 4 horas', sublabel: 'Ritmo equilibrado — recomendado', value: '2-4h', emoji: '⚡', recommended: true },
  { label: 'Mais de 4 horas', sublabel: 'Modo intensivo — dedicação total', value: '+4h', emoji: '🔥' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setStep1, setStep2, setStep3, setStep6 } = useOnboardingStore();
  const [step, setStep] = useState(1);

  const [nome, setNome] = useState('');
  const [hospital, setHospital] = useState('');
  const [dataProva, setDataProva] = useState<string | null>(null);
  const [horasEstudo, setHorasEstudo] = useState<string | null>(null);

  function handleNext() {
    if (step === 1) { setStep1(nome.trim()); setStep(2); }
    else if (step === 2) { setStep2(hospital.trim()); setStep(3); }
    else if (step === 3) { setStep6(dataProva!); setStep(4); }
    else if (step === 4) { setStep3(horasEstudo!); router.push('/register'); }
  }

  const isValid =
    (step === 1 && nome.trim().length >= 2) ||
    (step === 2 && hospital.trim().length >= 2) ||
    (step === 3 && dataProva !== null) ||
    (step === 4 && horasEstudo !== null);

  const stepConfig: Record<number, { emoji: string; question: string; highlight: string }> = {
    1: { emoji: '👨‍⚕️', question: 'Primeiro, me diz ', highlight: 'como você quer ser chamado' },
    2: { emoji: '🏥', question: 'Agora me conta: ', highlight: 'qual hospital ou instituição' },
    3: { emoji: '📅', question: 'Quando será ', highlight: 'sua prova de residência' },
    4: { emoji: '⏰', question: 'Quantas horas por dia ', highlight: 'você consegue estudar' },
  };

  const cfg = stepConfig[step];

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#07090F' }}>
      {/* Nebula decoration */}
      <div className="fixed top-[-80px] right-[-60px] w-[300px] h-[300px] rounded-full" style={{ backgroundColor: 'rgba(204,0,0,0.08)' }} />

      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex gap-1.5 mb-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: '#1E2030' }}>
                {i < step && (
                  <div className="h-full rounded-full" style={{ background: i === step - 1 ? 'linear-gradient(90deg, #E8172C, #FF4444)' : '#E8172C' }} />
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-right" style={{ color: '#484F58' }}>Etapa {step} de {TOTAL_STEPS}</p>
        </div>

        {/* Mascot */}
        <div className="text-center py-4">
          <span className="text-[80px]">{cfg.emoji}</span>
        </div>

        {/* Speech bubble */}
        <div className="rounded-t-[20px] rounded-br-[20px] rounded-bl p-4 px-5 mb-5" style={{ backgroundColor: '#111318', border: '1px solid #1E2030' }}>
          <p className="text-[14px] leading-[23px]" style={{ color: '#8B949E' }}>
            {cfg.question}
            <span className="font-bold text-white">{cfg.highlight}</span>
            ? {step === 1 ? 'Seu nome aparecerá no ranking e nas conquistas!' : step === 2 ? 'Vou montar seu plano direto pra lá!' : step === 3 ? '? Vou calcular quanto tempo falta!' : '? Vou ajustar seu ritmo ideal!'}
          </p>
        </div>

        {/* Step content */}
        <div className="mb-8">
          {step === 1 && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#484F58' }}>Seu nome ou apelido</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João, DrSilva, MedTop..."
                maxLength={20}
                className="w-full h-[54px] rounded-[16px] px-4.5 text-[16px] font-medium text-white outline-none"
                style={{ backgroundColor: '#111318', border: '1.5px solid #1E2030' }}
              />
              <p className="text-[11px] mt-2.5" style={{ color: '#484F58' }}>💡 Este será seu nickname no ranking — escolha bem!</p>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#484F58' }}>Instituição alvo</label>
              <input
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="Digite ou escolha abaixo"
                className="w-full h-[54px] rounded-[16px] px-4.5 text-[16px] font-medium text-white outline-none mb-3"
                style={{ backgroundColor: '#111318', border: '1.5px solid #1E2030' }}
              />
              <div className="flex flex-wrap gap-2">
                {SUGESTOES_HOSPITAL.map((s) => (
                  <button
                    key={s}
                    onClick={() => setHospital(s)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                    style={{
                      backgroundColor: hospital === s ? 'rgba(232,23,44,0.15)' : '#111318',
                      border: `1.5px solid ${hospital === s ? '#E8172C' : '#1E2030'}`,
                      color: hospital === s ? '#E8172C' : '#8B949E',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#484F58' }}>Data da prova</label>
              <div className="grid grid-cols-3 gap-2">
                {MESES_PROVA.map((m) => (
                  <button
                    key={m}
                    onClick={() => setDataProva(m)}
                    className="py-3 rounded-xl text-[13px] font-semibold transition-all"
                    style={{
                      backgroundColor: dataProva === m ? 'rgba(232,23,44,0.15)' : '#111318',
                      border: `1.5px solid ${dataProva === m ? '#E8172C' : '#1E2030'}`,
                      color: dataProva === m ? '#E8172C' : '#8B949E',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              {OPCOES_HORAS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setHorasEstudo(o.value)}
                  className="w-full text-left rounded-[16px] p-4 flex items-center gap-4 transition-all"
                  style={{
                    backgroundColor: horasEstudo === o.value ? 'rgba(232,23,44,0.08)' : '#111318',
                    border: `1.5px solid ${horasEstudo === o.value ? '#E8172C' : '#1E2030'}`,
                  }}
                >
                  <span className="text-2xl">{o.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-[14px]">{o.label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#484F58' }}>{o.sublabel}</p>
                  </div>
                  {o.recommended && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,200,83,0.15)', color: '#00C853' }}>
                      RECOMENDADO
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Continue button */}
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="w-full h-[54px] rounded-[16px] font-[800] text-[15px] text-white transition-transform active:scale-[0.97] disabled:opacity-30"
          style={{
            background: isValid ? 'linear-gradient(135deg, #E8172C, #FF3333)' : '#21262D',
            fontFamily: 'Syne, sans-serif',
            boxShadow: isValid ? '0 4px 10px rgba(232,23,44,0.35)' : 'none',
          }}
        >
          {step < TOTAL_STEPS ? 'Continuar →' : 'Criar minha conta →'}
        </button>

        {/* Back */}
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-center mt-3 text-[12px]"
            style={{ color: '#484F58' }}
          >
            ← Voltar
          </button>
        )}
      </div>
    </div>
  );
}
