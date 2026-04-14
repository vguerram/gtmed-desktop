import { apiClient } from '@/lib/api';

export interface TrailNode {
  id: string;
  ordem: number;
  titulo: string;
  tipo: 'questoes' | 'flashcards' | 'videoaulas' | 'boss';
  planeta: string;
  grande_area: string;
  especialidade: string;
  theme_ids: string[];
}

export interface TrailWeek {
  semana: number;
  planeta: string;
  nodes: TrailNode[];
}

export async function getTrailNodes(): Promise<TrailNode[]> {
  try {
    const res = await apiClient.get<{ nodes: TrailNode[] }>('/trail/nodes');
    return res?.nodes || [];
  } catch {
    return [];
  }
}

export async function getTrailWeeks(): Promise<TrailWeek[]> {
  const nodes = await getTrailNodes();
  const weekMap: Record<string, TrailNode[]> = {};

  for (const node of nodes) {
    const planeta = node.planeta || 'Semana 1';
    if (!weekMap[planeta]) weekMap[planeta] = [];
    weekMap[planeta].push(node);
  }

  return Object.entries(weekMap)
    .map(([planeta, nodes]) => {
      const match = planeta.match(/\d+/);
      return { semana: match ? parseInt(match[0]) : 0, planeta, nodes };
    })
    .sort((a, b) => a.semana - b.semana);
}
