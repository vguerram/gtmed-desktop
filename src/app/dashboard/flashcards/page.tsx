'use client';

import { useState, useEffect } from 'react';
import { getDecks, createDeck, deleteDeck, getDeckById, reviewCard } from '@/services/flashcards';
import { getAutoralFlashcards } from '@/services/autoral';
import type { DeckWithStats, FlashcardCard } from '@/services/flashcards';
import type { AutoralFlashcard } from '@/services/autoral';

export default function FlashcardsPage() {
  const [mode, setMode] = useState<'decks' | 'autoral'>('decks');
  const [decks, setDecks] = useState<DeckWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Autoral mode
  const [autoralCards, setAutoralCards] = useState<AutoralFlashcard[]>([]);
  const [autoralIdx, setAutoralIdx] = useState(0);
  const [autoralFlipped, setAutoralFlipped] = useState(false);
  const [autoralPage, setAutoralPage] = useState(1);
  const [autoralTotal, setAutoralTotal] = useState(0);
  const [autoralLoading, setAutoralLoading] = useState(false);
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

  async function loadAutoralCards() {
    setAutoralLoading(true);
    const res = await getAutoralFlashcards({ page: autoralPage, limit: 21 });
    setAutoralCards(res.flashcards || []);
    setAutoralTotal(res.total || 0);
    setAutoralIdx(0);
    setAutoralFlipped(false);
    setAutoralLoading(false);
  }

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

  // Autoral session view
  if (mode === 'autoral' && autoralCards.length > 0 && autoralIdx < autoralCards.length) {
    const card = autoralCards[autoralIdx];
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Flashcard {autoralIdx + 1} de {autoralCards.length}
          </h1>
          <button onClick={() => { setAutoralCards([]); setMode('decks'); }} className="text-[12px]" style={{ color: '#484F58' }}>Voltar</button>
        </div>
        <div
          onClick={() => setAutoralFlipped(!autoralFlipped)}
          className="rounded-2xl p-8 min-h-[300px] flex items-center justify-center cursor-pointer transition-all"
          style={{ backgroundColor: '#141414', border: `1px solid ${autoralFlipped ? '#00C853' : '#21262D'}` }}
        >
          {!autoralFlipped ? (
            <div className="text-center">
              <p className="text-[11px] font-semibold mb-4" style={{ color: '#E8172C' }}>{card.tema}</p>
              <p className="text-xl text-white leading-relaxed">{card.frente}</p>
              <p className="text-[11px] mt-6" style={{ color: '#484F58' }}>Clique para ver a resposta</p>
            </div>
          ) : (
            <div className="text-center max-h-[400px] overflow-y-auto">
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: '#8B949E' }}>{card.verso_txt}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => { setAutoralFlipped(false); setAutoralIdx(Math.max(0, autoralIdx - 1)); }}
            disabled={autoralIdx === 0}
            className="flex-1 py-3 rounded-xl text-[13px] font-semibold disabled:opacity-30"
            style={{ backgroundColor: '#141414', border: '1px solid #21262D', color: '#8B949E' }}
          >
            ← Anterior
          </button>
          <button
            onClick={() => { setAutoralFlipped(false); setAutoralIdx(autoralIdx + 1); }}
            className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
          >
            {autoralIdx + 1 < autoralCards.length ? 'Próximo →' : 'Finalizar'}
          </button>
        </div>
        <p className="text-center text-[10px] mt-2" style={{ color: '#484F58' }}>
          Página {autoralPage} · {autoralTotal.toLocaleString()} flashcards autorais disponíveis
        </p>
      </div>
    );
  }

  // Deck list view
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Flashcards</h1>

      {/* Mode selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('decks')}
          className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
          style={{
            backgroundColor: mode === 'decks' ? 'rgba(232,23,44,0.15)' : '#141414',
            border: `1.5px solid ${mode === 'decks' ? '#E8172C' : '#21262D'}`,
            color: mode === 'decks' ? '#E8172C' : '#8B949E',
          }}
        >
          📋 Meus Decks
        </button>
        <button
          onClick={() => { setMode('autoral'); loadAutoralCards(); }}
          className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
          style={{
            backgroundColor: mode === 'autoral' ? 'rgba(232,23,44,0.15)' : '#141414',
            border: `1.5px solid ${mode === 'autoral' ? '#E8172C' : '#21262D'}`,
            color: mode === 'autoral' ? '#E8172C' : '#8B949E',
          }}
        >
          🎯 Autorais GTMED (9.362)
        </button>
      </div>

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
