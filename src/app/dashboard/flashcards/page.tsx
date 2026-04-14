'use client';

import { useState, useEffect } from 'react';
import { getDecks, createDeck, deleteDeck, getDeckById, reviewCard } from '@/services/flashcards';
import type { DeckWithStats, FlashcardCard } from '@/services/flashcards';

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<DeckWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [themes, setThemes] = useState('');

  // Session state
  const [sessionCards, setSessionCards] = useState<FlashcardCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDeckId, setSessionDeckId] = useState('');

  useEffect(() => {
    loadDecks();
  }, []);

  async function loadDecks() {
    setLoading(true);
    const d = await getDecks();
    setDecks(d);
    setLoading(false);
  }

  async function handleCreate() {
    if (!deckName.trim()) return;
    setCreating(true);
    const themeList = themes.split(',').map((t) => t.trim()).filter(Boolean);
    await createDeck(deckName, themeList.length ? themeList : ['Todas']);
    setDeckName('');
    setThemes('');
    await loadDecks();
    setCreating(false);
  }

  async function handleDelete(deckId: string) {
    await deleteDeck(deckId);
    await loadDecks();
  }

  async function handleStartSession(deckId: string) {
    const deck = await getDeckById(deckId);
    if (deck && deck.cards.length > 0) {
      setSessionCards(deck.cards);
      setCurrentIdx(0);
      setFlipped(false);
      setSessionDeckId(deckId);
    }
  }

  async function handleReview(acertou: boolean) {
    const card = sessionCards[currentIdx];
    await reviewCard(card.id, acertou);
    setFlipped(false);
    if (currentIdx + 1 < sessionCards.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setSessionCards([]);
      setSessionDeckId('');
      await loadDecks();
    }
  }

  // Flashcard session view
  if (sessionCards.length > 0 && currentIdx < sessionCards.length) {
    const card = sessionCards[currentIdx];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Flashcard {currentIdx + 1} de {sessionCards.length}</h1>
          <button
            onClick={() => { setSessionCards([]); setSessionDeckId(''); }}
            className="text-sm text-gray-500 hover:text-red-400"
          >
            Encerrar
          </button>
        </div>

        <div
          onClick={() => setFlipped(!flipped)}
          className="bg-[#141414] border border-[#21262D] rounded-xl p-8 min-h-[300px] flex items-center justify-center cursor-pointer hover:border-emerald-600/50 transition-colors"
        >
          {!flipped ? (
            <div className="text-center">
              <p className="text-xs text-[#E8172C] mb-4">{card.tema}</p>
              <p className="text-xl text-white leading-relaxed">{card.frente}</p>
              <p className="text-sm text-gray-600 mt-6">Clique para ver a resposta</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">{card.verso_txt}</p>
            </div>
          )}
        </div>

        {flipped && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleReview(false)}
              className="flex-1 bg-red-900/30 border border-red-700 text-red-400 font-semibold py-3 rounded-lg hover:bg-red-900/50 transition-colors"
            >
              Errei
            </button>
            <button
              onClick={() => handleReview(true)}
              className="flex-1 bg-emerald-900/30 border border-emerald-700 text-[#00C853] font-semibold py-3 rounded-lg hover:bg-emerald-900/50 transition-colors"
            >
              Acertei
            </button>
          </div>
        )}
      </div>
    );
  }

  // Deck list view
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Flashcards</h1>

      <div className="bg-[#141414] border border-[#21262D] rounded-xl p-6 mb-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-4">Criar novo deck</h2>
        <div className="space-y-3">
          <input
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Nome do deck"
            className="w-full bg-[#0C0E18] border border-[#1A1C2C] rounded-lg px-4 py-3 text-white"
          />
          <input
            value={themes}
            onChange={(e) => setThemes(e.target.value)}
            placeholder="Temas (separados por vírgula)"
            className="w-full bg-[#0C0E18] border border-[#1A1C2C] rounded-lg px-4 py-3 text-white"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !deckName.trim()}
            className="bg-[#E8172C] hover:bg-[#C00F22] disabled:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            {creating ? 'Criando...' : 'Criar deck'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando decks...</p>
      ) : decks.length === 0 ? (
        <p className="text-gray-500">Nenhum deck criado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div key={deck.id} className="bg-[#141414] border border-[#21262D] rounded-xl p-5">
              <h3 className="font-semibold mb-2">{deck.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{deck.cards_count} cards</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartSession(deck.id)}
                  className="flex-1 bg-[#E8172C] hover:bg-[#C00F22] text-white text-sm font-medium py-2 rounded-lg"
                >
                  Estudar
                </button>
                <button
                  onClick={() => handleDelete(deck.id)}
                  className="text-sm text-gray-500 hover:text-red-400 px-3"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
