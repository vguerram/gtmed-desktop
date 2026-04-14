// GTMED Design System — Cores centralizadas
// Baseado no protótipo mobile (src/design/colors.ts)

export const colors = {
  // Fundos
  bg: {
    primary: '#0A0A0A',
    secondary: '#141414',
    card: '#1A1A1A',
    elevated: '#212121',
    navy: '#07090F',
    input: '#0C0E18',
    formCard: '#111318',
  },

  // Marca GTMED
  brand: {
    red: '#E8172C',
    redDark: '#C00F22',
    redLight: '#FF4444',
    red3: '#FF1A1A',
    cyan: '#00CFFF',
    yellow: '#FFB800',
    green: '#00C853',
    purple: '#7B2FF7',
    orange: '#FF8C00',
    pink: '#FF69B4',
  },

  // Texto
  text: {
    primary: '#F0F6FC',
    secondary: '#8B949E',
    muted: '#484F58',
    label: '#3A3A55',
    divider: '#2A2A3A',
    link: '#44445A',
  },

  // Bordas
  border: {
    default: '#21262D',
    subtle: '#161B22',
    input: '#1A1C2C',
    form: '#1E2030',
    divider: '#191A28',
  },

  // Status
  status: {
    success: '#00C853',
    warning: '#FFB800',
    error: '#E8172C',
    info: '#00CFFF',
  },

  // Áreas médicas
  areas: {
    clinica: '#E8172C',
    cirurgia: '#FF8C00',
    pediatria: '#00C853',
    ginecologia: '#FF69B4',
    obstetricia: '#7B2FF7',
    preventiva: '#00CFFF',
  },

  // Gradientes (como string para usar em style)
  gradient: {
    redButton: 'linear-gradient(135deg, #E8172C, #FF4444)',
    redGlow: '0 5px 14px rgba(232, 23, 44, 0.35)',
    streak: 'linear-gradient(135deg, #1A0000, #160808, #141414)',
  },
} as const;
