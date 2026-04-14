'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

const FACES = [
  { id: 'face-default', emoji: '🧑‍⚕️', level: 1 },
  { id: 'face-nerd', emoji: '🤓', level: 2 },
  { id: 'face-cool', emoji: '😎', level: 3 },
  { id: 'face-robot', emoji: '🤖', level: 5 },
  { id: 'face-alien', emoji: '👽', level: 8 },
  { id: 'face-ninja', emoji: '🥷', level: 10 },
  { id: 'face-crown', emoji: '🤴', level: 15 },
  { id: 'face-wizard', emoji: '🧙', level: 20 },
];

const HATS = [
  { id: 'hat-none', emoji: '—', level: 1 },
  { id: 'hat-grad', emoji: '🎓', level: 2 },
  { id: 'hat-stethoscope', emoji: '🩺', level: 3 },
  { id: 'hat-crown', emoji: '👑', level: 10 },
  { id: 'hat-rocket', emoji: '🚀', level: 15 },
  { id: 'hat-star', emoji: '⭐', level: 20 },
];

const BGS = [
  { id: 'bg-dark', emoji: '⬛', color: '#0A0A0A', level: 1 },
  { id: 'bg-red', emoji: '🟥', color: '#E8172C', level: 2 },
  { id: 'bg-blue', emoji: '🟦', color: '#00CFFF', level: 3 },
  { id: 'bg-green', emoji: '🟩', color: '#00C853', level: 5 },
  { id: 'bg-purple', emoji: '🟪', color: '#7B2FF7', level: 8 },
  { id: 'bg-gold', emoji: '🟨', color: '#FFB800', level: 15 },
];

export default function AvatarPage() {
  const user = useAuthStore((s) => s.user);
  const nivel = user?.nivel || 1;

  const [selectedFace, setSelectedFace] = useState('face-default');
  const [selectedHat, setSelectedHat] = useState('hat-none');
  const [selectedBg, setSelectedBg] = useState('bg-dark');

  const face = FACES.find((f) => f.id === selectedFace);
  const hat = HATS.find((h) => h.id === selectedHat);
  const bg = BGS.find((b) => b.id === selectedBg);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>🎨 Avatar</h1>

      {/* Preview */}
      <div className="flex justify-center mb-8">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center text-5xl relative"
          style={{ backgroundColor: bg?.color || '#0A0A0A', border: '3px solid #21262D' }}
        >
          {hat?.id !== 'hat-none' && (
            <span className="absolute -top-4 text-3xl">{hat?.emoji}</span>
          )}
          {face?.emoji}
        </div>
      </div>

      {/* Face selector */}
      <Section title="ROSTO">
        <div className="grid grid-cols-4 gap-3">
          {FACES.map((f) => {
            const locked = f.level > nivel;
            return (
              <button
                key={f.id}
                onClick={() => !locked && setSelectedFace(f.id)}
                disabled={locked}
                className="h-16 rounded-xl flex flex-col items-center justify-center gap-1 transition-all"
                style={{
                  backgroundColor: selectedFace === f.id ? 'rgba(232,23,44,0.1)' : '#0C0E18',
                  border: `1.5px solid ${selectedFace === f.id ? '#E8172C' : '#1A1C2C'}`,
                  opacity: locked ? 0.3 : 1,
                }}
              >
                <span className="text-2xl">{f.emoji}</span>
                {locked && <span className="text-[8px]" style={{ color: '#484F58' }}>Nv.{f.level}</span>}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Hat selector */}
      <Section title="ACESSÓRIO">
        <div className="grid grid-cols-6 gap-2">
          {HATS.map((h) => {
            const locked = h.level > nivel;
            return (
              <button
                key={h.id}
                onClick={() => !locked && setSelectedHat(h.id)}
                disabled={locked}
                className="h-14 rounded-xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: selectedHat === h.id ? 'rgba(232,23,44,0.1)' : '#0C0E18',
                  border: `1.5px solid ${selectedHat === h.id ? '#E8172C' : '#1A1C2C'}`,
                  opacity: locked ? 0.3 : 1,
                }}
              >
                <span className="text-xl">{h.emoji}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Background selector */}
      <Section title="FUNDO">
        <div className="grid grid-cols-6 gap-2">
          {BGS.map((b) => {
            const locked = b.level > nivel;
            return (
              <button
                key={b.id}
                onClick={() => !locked && setSelectedBg(b.id)}
                disabled={locked}
                className="h-14 rounded-xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: selectedBg === b.id ? 'rgba(232,23,44,0.1)' : '#0C0E18',
                  border: `1.5px solid ${selectedBg === b.id ? '#E8172C' : '#1A1C2C'}`,
                  opacity: locked ? 0.3 : 1,
                }}
              >
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: b.color, border: '1px solid #21262D' }} />
              </button>
            );
          })}
        </div>
      </Section>

      <button
        className="w-full py-3 rounded-xl font-bold text-white text-sm mt-4"
        style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
      >
        Salvar avatar
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-[10px] font-bold tracking-wider mb-2" style={{ color: '#484F58' }}>{title}</h3>
      {children}
    </div>
  );
}
