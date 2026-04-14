'use client';

import { useAuthStore } from '@/stores/authStore';
import { signOut } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function ConfiguracoesPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    useAuthStore.getState().reset();
    router.push('/login');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>⚙️ Configurações</h1>

      {/* Conta */}
      <Section title="Conta">
        <InfoRow label="Nome" value={user?.name || '-'} />
        <InfoRow label="Email" value={user?.email || '-'} />
        <InfoRow label="Plano" value="Gratuito" badge />
      </Section>

      {/* Estudo */}
      <Section title="Preferências de Estudo">
        <ToggleRow label="Modo escuro" description="Tema dark ativado" enabled />
        <ToggleRow label="Sons" description="Efeitos sonoros ao ganhar XP" enabled />
        <ToggleRow label="Notificações" description="Lembretes de estudo diário" enabled />
      </Section>

      {/* Pomodoro */}
      <Section title="Pomodoro">
        <InfoRow label="Tempo de foco" value="25 min" />
        <InfoRow label="Tempo de pausa" value="5 min" />
        <InfoRow label="Pausa longa" value="15 min (a cada 4 sessões)" />
      </Section>

      {/* Dados */}
      <Section title="Dados">
        <InfoRow label="Questões respondidas" value="-" />
        <InfoRow label="Flashcards revisados" value="-" />
        <InfoRow label="Horas de estudo" value="-" />
      </Section>

      {/* Ações */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all"
          style={{ backgroundColor: 'rgba(232,23,44,0.1)', border: '1px solid rgba(232,23,44,0.2)', color: '#E8172C' }}
        >
          Sair da conta
        </button>
      </div>

      <p className="text-center text-[11px] mt-6" style={{ color: '#484F58' }}>
        GTMED Desktop v1.0.0 · Residência Médica
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-[10px] font-bold tracking-wider uppercase mb-2 px-1" style={{ color: '#484F58' }}>{title}</h2>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #161B22' }}>
      <span className="text-[13px]" style={{ color: '#8B949E' }}>{label}</span>
      {badge ? (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,207,255,0.15)', color: '#00CFFF' }}>
          {value}
        </span>
      ) : (
        <span className="text-[13px] text-white">{value}</span>
      )}
    </div>
  );
}

function ToggleRow({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #161B22' }}>
      <div>
        <p className="text-[13px] text-white">{label}</p>
        <p className="text-[11px]" style={{ color: '#484F58' }}>{description}</p>
      </div>
      <div className="w-10 h-5 rounded-full relative" style={{ backgroundColor: enabled ? '#E8172C' : '#21262D' }}>
        <div
          className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
          style={{ left: enabled ? 22 : 2 }}
        />
      </div>
    </div>
  );
}
