'use client';

import { useAuthStore } from '@/stores/authStore';

export default function EvolucaoPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Evolução</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="XP Total" value={user?.xpTotal || 0} icon="⚡" color="#FFB800" />
        <StatCard label="Nível" value={user?.nivel || 1} icon="🎯" color="#E8172C" />
        <StatCard label="Streak Atual" value={`${user?.streakAtual || 0} dias`} icon="🔥" color="#FF8C00" />
        <StatCard label="Streak Máximo" value={`${user?.streakMaximo || 0} dias`} icon="🏆" color="#7B2FF7" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>XP por Período</h2>
          <div className="space-y-4">
            <XPRow label="Esta semana" value={user?.xpSemana || 0} />
            <XPRow label="Este mês" value={user?.xpMes || 0} />
            <XPRow label="Total" value={user?.xpTotal || 0} />
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Perfil</h2>
          <div className="space-y-4">
            <InfoRow label="Nome" value={user?.name || '-'} />
            <InfoRow label="Email" value={user?.email || '-'} />
            <InfoRow label="Membro desde" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-wider" style={{ color: '#484F58' }}>{label.toUpperCase()}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color, fontFamily: 'Syne, sans-serif' }}>{value}</p>
    </div>
  );
}

function XPRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px]" style={{ color: '#8B949E' }}>{label}</span>
      <span className="text-[14px] font-bold" style={{ color: '#FFB800' }}>{value.toLocaleString()} XP</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px]" style={{ color: '#8B949E' }}>{label}</span>
      <span className="text-[13px] text-white">{value}</span>
    </div>
  );
}
