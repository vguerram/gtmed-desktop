'use client';

import { useEffect, useState } from 'react';
import { useGamificationStore } from '@/stores/gamificationStore';

export default function XPAnimation() {
  const { lastXPGain, showXPAnimation, dismissXPAnimation } = useGamificationStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showXPAnimation && lastXPGain > 0) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        dismissXPAnimation();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showXPAnimation, lastXPGain, dismissXPAnimation]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-8 z-50 animate-bounce pointer-events-none">
      <div
        className="px-4 py-2 rounded-full text-sm font-bold"
        style={{
          background: 'linear-gradient(135deg, #FFB800, #FF8C00)',
          color: '#0A0A0A',
          boxShadow: '0 4px 20px rgba(255,184,0,0.4)',
        }}
      >
        +{lastXPGain} XP ⚡
      </div>
    </div>
  );
}
