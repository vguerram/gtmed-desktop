'use client';

interface ComboIndicatorProps {
  count: number;
}

const COMBO_LABELS: Record<number, { label: string; color: string }> = {
  3: { label: 'Em Chamas! 🔥', color: '#FF8C00' },
  5: { label: 'Imparável! ⚡', color: '#FFB800' },
  10: { label: 'Lendário! 💎', color: '#7B2FF7' },
  20: { label: 'MESTRE! 🏆', color: '#E8172C' },
};

export default function ComboIndicator({ count }: ComboIndicatorProps) {
  if (count < 3) return null;

  const threshold = [20, 10, 5, 3].find((t) => count >= t) || 3;
  const { label, color } = COMBO_LABELS[threshold];

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold animate-pulse"
      style={{
        backgroundColor: color + '20',
        border: `1.5px solid ${color}`,
        color,
      }}
    >
      <span>{count}x COMBO</span>
      <span>{label}</span>
    </div>
  );
}
