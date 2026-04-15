'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { signOut, getStoredAuth } from '@/services/auth';
import { useEffect, useState } from 'react';
import { onAuthExpired } from '@/lib/api';
import XPAnimation from '@/components/XPAnimation';
import LevelUpModal from '@/components/LevelUpModal';

const navMain = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/dashboard/trilha', label: 'Trilha', icon: '🗺️' },
  { href: '/dashboard/questoes', label: 'Questões', icon: '📝' },
  { href: '/dashboard/flashcards', label: 'Flashcards', icon: '⚡' },
  { href: '/dashboard/videoaulas', label: 'Videoaulas', icon: '🎬' },
  { href: '/dashboard/revisao', label: 'Revisão', icon: '🔁' },
];

const navSecondary = [
  { href: '/dashboard/simulados', label: 'Simulados', icon: '🧪' },
  { href: '/dashboard/desafios', label: 'Desafios', icon: '⚔️' },
  { href: '/dashboard/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/dashboard/evolucao', label: 'Evolução', icon: '📊' },
  { href: '/dashboard/cronograma', label: 'Cronograma', icon: '📅' },
  { href: '/dashboard/missoes', label: 'Missões', icon: '🎯' },
];

const navExtra = [
  { href: '/dashboard/boss', label: 'Boss', icon: '👹' },
  { href: '/dashboard/apostilas', label: 'Apostilas', icon: '📚' },
  { href: '/dashboard/grupos', label: 'Grupos', icon: '👥' },
  { href: '/dashboard/estatisticas', label: 'Estatísticas', icon: '📈' },
  { href: '/dashboard/plano', label: 'Plano', icon: '💎' },
  { href: '/dashboard/comparativo', label: 'Comparativo', icon: '📊' },
  { href: '/dashboard/avatar', label: 'Avatar', icon: '🎨' },
  { href: '/dashboard/notificacoes', label: 'Notificações', icon: '🔔' },
  { href: '/dashboard/perfil', label: 'Perfil', icon: '👤' },
  { href: '/dashboard/configuracoes', label: 'Config', icon: '⚙️' },
  { href: '/dashboard/suporte', label: 'Suporte', icon: '💬' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, setAuth, setLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showExtra, setShowExtra] = useState(false);

  // Auth: restore from localStorage on mount
  useEffect(() => {
    const { user, token } = getStoredAuth();
    if (user && token) {
      setAuth(user, token);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auth: listen for 401 token expiration from API
  useEffect(() => {
    const unsub = onAuthExpired(() => {
      useAuthStore.getState().reset();
      router.push('/login');
    });
    return unsub;
  }, [router]);

  async function handleLogout() {
    await signOut();
    useAuthStore.getState().reset();
    router.push('/login');
  }

  // Loading state while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="w-6 h-6 border-2 border-white/20 border-t-[#E8172C] rounded-full animate-spin" />
      </div>
    );
  }

  function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all text-[13px]"
        style={{
          backgroundColor: isActive ? 'rgba(232,23,44,0.1)' : 'transparent',
          color: isActive ? '#E8172C' : '#8B949E',
        }}
      >
        <span className="text-sm w-5 text-center">{icon}</span>
        {sidebarOpen && <span className="font-medium">{label}</span>}
      </Link>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Sidebar colapsável */}
      <aside
        className="flex flex-col transition-all duration-200 overflow-hidden flex-shrink-0"
        style={{
          width: sidebarOpen ? 220 : 60,
          backgroundColor: '#0A0A0A',
          borderRight: '1px solid #161B22',
        }}
      >
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 flex items-center justify-between">
          {sidebarOpen ? (
            <div>
              <div className="flex items-baseline">
                <span className="font-extrabold leading-none text-white" style={{ fontFamily: 'Syne, var(--font-syne), sans-serif', fontSize: '18px', letterSpacing: '-1px' }}>GT</span>
                <span className="font-extrabold leading-none" style={{ fontFamily: 'Syne, var(--font-syne), sans-serif', fontSize: '18px', color: '#E8172C', letterSpacing: '-1px' }}>MED</span>
              </div>
              <p className="font-semibold mt-0.5" style={{ fontSize: '7px', letterSpacing: '1.5px', color: '#484F58' }}>RESIDÊNCIA MÉDICA</p>
            </div>
          ) : (
            <div className="mx-auto flex flex-col items-center">
              <span className="font-extrabold leading-none" style={{ fontFamily: 'Syne, var(--font-syne), sans-serif', fontSize: '14px', color: '#E8172C', letterSpacing: '-0.5px' }}>G</span>
              <span className="font-bold mt-0.5" style={{ fontSize: '6px', color: '#484F58' }}>MED</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-6 h-6 rounded flex items-center justify-center transition-colors"
            style={{ color: '#484F58', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#141414')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span className="text-[10px]">{sidebarOpen ? '◀' : '▶'}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 overflow-y-auto">
          {navMain.map((item) => <NavItem key={item.href} {...item} />)}

          <div className="h-px my-2" style={{ backgroundColor: '#161B22' }} />

          {navSecondary.map((item) => <NavItem key={item.href} {...item} />)}

          <div className="h-px my-2" style={{ backgroundColor: '#161B22' }} />

          <button
            onClick={() => setShowExtra(!showExtra)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 w-full text-left text-[12px]"
            style={{ color: '#484F58' }}
          >
            <span className="text-sm w-5 text-center">{showExtra ? '▾' : '▸'}</span>
            {sidebarOpen && <span>Mais</span>}
          </button>
          {showExtra && navExtra.map((item) => <NavItem key={item.href} {...item} />)}
        </nav>

        {/* User */}
        <div className="p-3" style={{ borderTop: '1px solid #161B22' }}>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
            >
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-white truncate">{user?.name}</p>
                <p className="text-[9px]" style={{ color: '#484F58' }}>Nível {user?.nivel || 1}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={handleLogout} className="text-[11px]" style={{ color: '#484F58' }}>
              Sair
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ backgroundColor: '#0A0A0A' }}>
        {children}
      </main>

      {/* Gamification overlays */}
      <XPAnimation />
      <LevelUpModal />
    </div>
  );
}
