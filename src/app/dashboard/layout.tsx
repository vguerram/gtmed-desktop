'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { signOut, getStoredAuth } from '@/services/auth';
import { useEffect } from 'react';
import XPAnimation from '@/components/XPAnimation';
import LevelUpModal from '@/components/LevelUpModal';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/dashboard/trilha', label: 'Trilha', icon: '🗺️' },
  { href: '/dashboard/questoes', label: 'Questões', icon: '📝' },
  { href: '/dashboard/flashcards', label: 'Flashcards', icon: '⚡' },
  { href: '/dashboard/videoaulas', label: 'Videoaulas', icon: '🎬' },
  { href: '/dashboard/revisao', label: 'Revisão', icon: '🔁' },
  { href: '/dashboard/simulados', label: 'Simulados', icon: '🧪' },
  { href: '/dashboard/desafios', label: 'Desafios', icon: '⚔️' },
  { href: '/dashboard/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/dashboard/evolucao', label: 'Evolução', icon: '📊' },
  { href: '/dashboard/cronograma', label: 'Cronograma', icon: '📅' },
  { href: '/dashboard/boss', label: 'Boss', icon: '👹' },
  { href: '/dashboard/estatisticas', label: 'Estatísticas', icon: '📈' },
  { href: '/dashboard/plano', label: 'Plano', icon: '💎' },
  { href: '/dashboard/notificacoes', label: 'Notificações', icon: '🔔' },
  { href: '/dashboard/perfil', label: 'Perfil', icon: '👤' },
  { href: '/dashboard/configuracoes', label: 'Config', icon: '⚙️' },
  { href: '/dashboard/suporte', label: 'Suporte', icon: '💬' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const { user, token } = getStoredAuth();
    if (user && token) {
      setAuth(user, token);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [setAuth, setLoading, router]);

  async function handleLogout() {
    await signOut();
    useAuthStore.getState().reset();
    router.push('/login');
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col" style={{ backgroundColor: '#0A0A0A', borderRight: '1px solid #161B22' }}>
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center">
            <span className="text-xl font-[900] text-white" style={{ fontFamily: 'Syne, sans-serif' }}>GT</span>
            <span className="text-xl font-[900]" style={{ fontFamily: 'Syne, sans-serif', color: '#E8172C' }}>MED</span>
          </div>
          <p className="text-[9px] font-semibold tracking-[1.2px] mt-0.5" style={{ color: '#484F58' }}>RESIDÊNCIA MÉDICA</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all text-[13px] font-medium"
                style={{
                  backgroundColor: isActive ? 'rgba(232,23,44,0.1)' : 'transparent',
                  color: isActive ? '#E8172C' : '#8B949E',
                  border: isActive ? '1px solid rgba(232,23,44,0.2)' : '1px solid transparent',
                }}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4" style={{ borderTop: '1px solid #161B22' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
            >
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px]" style={{ color: '#484F58' }}>Nível {user?.nivel || 1}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[12px] transition-colors"
            style={{ color: '#484F58' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#E8172C')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#484F58')}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#0A0A0A' }}>
        {children}
      </main>

      {/* Gamification overlays */}
      <XPAnimation />
      <LevelUpModal />
    </div>
  );
}
