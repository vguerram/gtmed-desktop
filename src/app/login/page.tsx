'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setAuth } = useAuthStore();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const { user, token } = await signInWithEmail(email.trim(), senha);
      setAuth(user, token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('conexão') || msg.includes('conexao') || msg.includes('network') || msg.includes('Failed to fetch')) {
        setError('Sem conexão com o servidor. Verifique sua internet e tente novamente.');
      } else if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError(msg || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#07090F' }}
    >
      <div className="w-full max-w-sm flex flex-col items-center">

        {/* Brand */}
        <div className="text-center mb-1">
          <div className="flex items-center justify-center">
            <span className="text-[30px] font-[900] tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>GT</span>
            <span className="text-[30px] font-[900] tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: '#E8172C' }}>MED</span>
          </div>
          <p className="text-[10px] font-semibold tracking-[1.3px] mt-0.5" style={{ color: '#44445A' }}>
            RESIDÊNCIA MÉDICA
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-[10px]" style={{ color: '#FFB800' }}>★</span>
            <span className="text-[11px]" style={{ color: '#7777AA' }}>Por especialistas da USP</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-[20px] font-[800] text-white text-center leading-[25px] mt-2.5" style={{ fontFamily: 'Syne, sans-serif' }}>
          Sua <span style={{ color: '#E8172C' }}>aprovação</span> começa aqui.
        </h1>

        {/* Social proof */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex">
            {['👩‍⚕️', '👨‍⚕️', '👩‍⚕️', '👨‍⚕️'].map((emoji, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] border-2"
                style={{
                  background: 'linear-gradient(135deg, #E8172C, #6366F1)',
                  borderColor: '#07090F',
                  marginLeft: i > 0 ? -8 : 0,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-[12px]" style={{ color: '#666688' }}>
            <span className="font-bold" style={{ color: '#4ADE80' }}>+1.000 alunos</span> já fazem parte
          </p>
        </div>

        {/* Free CTA */}
        <button
          className="w-full h-12 rounded-[14px] flex items-center justify-center gap-2 mt-3.5 font-[800] text-[14px] text-white transition-transform active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #E8172C, #FF4444)',
            fontFamily: 'Syne, sans-serif',
            boxShadow: '0 6px 14px rgba(232, 23, 44, 0.4)',
          }}
          onClick={() => router.push('/register')}
        >
          🚀 Começar gratuitamente
        </button>
        <p className="text-[11px] text-center mt-1" style={{ color: '#44445A' }}>
          Sem cartão de crédito · Acesso imediato
        </p>

        {/* Divider */}
        <div className="flex items-center gap-2.5 w-full my-3">
          <div className="flex-1 h-px" style={{ backgroundColor: '#191A28' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#2A2A3A' }}>ou entre na sua conta</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#191A28' }} />
        </div>

        {/* Social buttons */}
        <div className="flex gap-2.5 w-full">
          <button
            className="flex-1 h-11 rounded-xl flex items-center justify-center gap-1.5 transition-transform active:scale-[0.97]"
            style={{ backgroundColor: '#111318', border: '1.5px solid #1E2030' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className="text-[12px] font-semibold" style={{ color: '#888888' }}>Google</span>
          </button>
          <button
            className="flex-1 h-11 rounded-xl flex items-center justify-center gap-1.5 transition-transform active:scale-[0.97]"
            style={{ backgroundColor: '#111318', border: '1.5px solid #1E2030' }}
          >
            <svg className="w-4 h-4" fill="#F5F5F7" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.12 4.51-3.74 4.25z"/></svg>
            <span className="text-[12px] font-semibold" style={{ color: '#888888' }}>Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2.5 w-full my-3">
          <div className="flex-1 h-px" style={{ backgroundColor: '#191A28' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#2A2A3A' }}>ou com e-mail</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#191A28' }} />
        </div>

        {/* Form card */}
        <form
          onSubmit={handleEmailLogin}
          className="w-full rounded-[20px] p-4"
          style={{ backgroundColor: '#111318', border: '1px solid #1E2030' }}
        >
          <div className="mb-2">
            <label className="block text-[10px] font-bold tracking-[0.9px] mb-1" style={{ color: '#3A3A55' }}>
              E-MAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              placeholder="seu@email.com"
              autoComplete="email"
              className="w-full h-11 rounded-[11px] px-3.5 text-[14px] text-white outline-none"
              style={{
                backgroundColor: '#0C0E18',
                border: '1.5px solid #1A1C2C',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          <div className="mb-2">
            <label className="block text-[10px] font-bold tracking-[0.9px] mb-1" style={{ color: '#3A3A55' }}>
              SENHA
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); if (error) setError(''); }}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full h-11 rounded-[11px] px-3.5 text-[14px] text-white outline-none"
              style={{
                backgroundColor: '#0C0E18',
                border: '1.5px solid #1A1C2C',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          <div className="flex justify-end mt-1">
            <button type="button" className="text-[11px]" style={{ color: '#44445A' }}>
              Esqueci minha senha
            </button>
          </div>

          {error && (
            <p className="text-[12px] text-center mt-2" style={{ color: '#FF1A1A' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] rounded-xl flex items-center justify-center mt-3 font-[800] text-[15px] text-white transition-transform active:scale-[0.97] disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #E8172C, #FF4444)',
              fontFamily: 'Syne, sans-serif',
              boxShadow: '0 5px 10px rgba(232, 23, 44, 0.35)',
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Entrar →'
            )}
          </button>
        </form>

        {/* Sign up */}
        <div className="flex items-center justify-center mt-3">
          <span className="text-[13px]" style={{ color: '#44445A' }}>Não tem conta? </span>
          <button
            onClick={() => router.push('/register')}
            className="text-[13px] font-bold"
            style={{ color: '#E8172C' }}
          >
            Criar conta grátis
          </button>
        </div>
      </div>
    </div>
  );
}
