import { apiClient } from '@/lib/api';

export interface FlashcardDeck {
  id: string;
  name: string;
  selectedThemes: string[];
  cards_count: number;
  created_at: string;
}

export interface FlashcardCard {
  id: string;
  frente: string;
  verso: string;
  verso_txt: string;
  tema: string;
  nivel_dominio: number;
  tentativas: number;
  acertos: number;
  proxima_revisao: string;
}

export interface DeckWithStats extends FlashcardDeck {
  cards_due: number;
  cards_mastered: number;
}

export async function createDeck(
  name: string,
  selectedThemes: string[],
  quantity?: number
): Promise<FlashcardDeck> {
  return apiClient.post<FlashcardDeck>('/flashcards/decks', {
    name,
    selectedThemes,
    quantity,
  });
}

export async function getDecks(): Promise<DeckWithStats[]> {
  try {
    const res = await apiClient.get<{ decks?: DeckWithStats[]; data?: DeckWithStats[] }>('/flashcards/decks');
    if (Array.isArray(res)) return res as DeckWithStats[];
    if (Array.isArray(res?.decks)) return res.decks;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  } catch {
    return [];
  }
}

export async function getDeckById(deckId: string): Promise<(FlashcardDeck & { cards: FlashcardCard[] }) | null> {
  try {
    return await apiClient.get<FlashcardDeck & { cards: FlashcardCard[] }>(`/flashcards/decks/${deckId}`);
  } catch {
    return null;
  }
}

export async function deleteDeck(deckId: string): Promise<void> {
  await apiClient.delete(`/flashcards/decks/${deckId}`);
}

export async function getCardsForReview(deckId: string, limit = 50): Promise<FlashcardCard[]> {
  try {
    const res = await apiClient.get<{ cards?: FlashcardCard[] }>(`/flashcards/decks/${deckId}/cards`, { mode: 'due', limit });
    if (Array.isArray(res)) return res as FlashcardCard[];
    if (Array.isArray(res?.cards)) return res.cards;
    return [];
  } catch {
    return [];
  }
}

export async function reviewCard(cardId: string, acertou: boolean): Promise<FlashcardCard | null> {
  try {
    return await apiClient.put<FlashcardCard>(`/flashcards/cards/${cardId}/review`, { acertou });
  } catch {
    return null;
  }
}
