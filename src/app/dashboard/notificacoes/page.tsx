'use client';

import { useNotificationStore } from '@/stores/notificationStore';
import { useEffect } from 'react';

const ICON_MAP: Record<string, string> = {
  xp: '⚡', mission: '🎯', streak: '🔥', level: '🎉',
  system: '📢', challenge: '⚔️', ranking: '🏆', social: '👥',
};

export default function NotificacoesPage() {
  const { notifications, unreadCount, markAllRead, markRead, remove, loadFromStorage } = useNotificationStore();

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>🔔 Notificações</h1>
          {unreadCount > 0 && <p className="text-[12px] mt-1" style={{ color: '#E8172C' }}>{unreadCount} não lidas</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[12px] font-semibold" style={{ color: '#E8172C' }}>
            Marcar todas como lidas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <span className="text-4xl">🔕</span>
          <p className="text-[13px] mt-3" style={{ color: '#484F58' }}>Nenhuma notificação ainda</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 rounded-xl p-4 transition-all cursor-pointer"
              style={{
                backgroundColor: n.read ? '#141414' : 'rgba(232,23,44,0.05)',
                border: `1px solid ${n.read ? '#21262D' : 'rgba(232,23,44,0.15)'}`,
              }}
              onClick={() => markRead(n.id)}
            >
              <span className="text-xl mt-0.5">{ICON_MAP[n.type] || '📌'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white">{n.title}</p>
                <p className="text-[12px] mt-0.5" style={{ color: '#8B949E' }}>{n.message}</p>
                <p className="text-[10px] mt-1" style={{ color: '#484F58' }}>
                  {new Date(n.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                className="text-[12px] mt-1"
                style={{ color: '#484F58' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
