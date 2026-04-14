'use client';

import { useAuthStore } from '@/stores/authStore';

export default function PerfilPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Perfil</h1>

      {/* Avatar + Info */}
      <div className="rounded-2xl p-6 mb-4 flex items-center gap-5" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
        >
          {user?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{user?.name || '-'}</h2>
          <p className="text-[13px] mt-0.5" style={{ color: '#8B949E' }}>{user?.email || '-'}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: 'rgba(232,23,44,0.15)', color: '#E8172C' }}>
              Nível {user?.nivel || 1}
            </span>
            <span className="text-[11px]" style={{ color: '#FFB800' }}>⚡ {user?.xpTotal || 0} XP</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="XP Total" value={user?.xpTotal || 0} icon="⚡" />
        <StatCard label="XP Semana" value={user?.xpSemana || 0} icon="📈" />
        <StatCard label="Streak Atual" value={`${user?.streakAtual || 0} dias`} icon="🔥" />
        <StatCard label="Streak Máximo" value={`${user?.streakMaximo || 0} dias`} icon="🏆" />
      </div>

      {/* Info */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Informações</h3>
        <div className="space-y-3">
          <InfoRow label="Membro desde" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'} />
          <InfoRow label="Horas de estudo/dia" value={user?.horasEstudoDia ? `${user.horasEstudoDia}h` : '-'} />
          <InfoRow label="Status" value={user?.isActive ? 'Ativo' : 'Inativo'} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold tracking-wider" style={{ color: '#484F58' }}>{label.toUpperCase()}</span>
        <span>{icon}</span>
      </div>
      <p className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1" style={{ borderBottom: '1px solid #161B22' }}>
      <span className="text-[13px]" style={{ color: '#8B949E' }}>{label}</span>
      <span className="text-[13px] text-white">{value}</span>
    </div>
  );
}
