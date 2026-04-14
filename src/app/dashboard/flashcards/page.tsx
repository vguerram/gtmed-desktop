'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDecks, createDeck, deleteDeck, getDeckById, reviewCard } from '@/services/flashcards';
import { getAutoralFlashcards } from '@/services/autoral';
import type { DeckWithStats, FlashcardCard } from '@/services/flashcards';
import type { AutoralFlashcard } from '@/services/autoral';

export default function FlashcardsPage() {
  const [mode, setMode] = useState<'decks' | 'autoral'>('decks');
  const [decks, setDecks] = useState<DeckWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [themes, setThemes] = useState('');

  // Autoral
  const [autoralCards, setAutoralCards] = useState<AutoralFlashcard[]>([]);
  const [autoralIdx, setAutoralIdx] = useState(0);
  const [autoralFlipped, setAutoralFlipped] = useState(false);
  const [autoralPage, setAutoralPage] = useState(1);
  const [autoralTotal, setAutoralTotal] = useState(0);
  const [autoralLoading, setAutoralLoading] = useState(false);

  // Session
  const [sessionCards, setSessionCards] = useState<FlashcardCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDeckId, setSessionDeckId] = useState('');

  useEffect(() => { loadDecks(); }, []);

  async function loadDecks() {
    setLoading(true);
    const d = await getDecks();
    setDecks(d);
    setLoading(false);
  }

  const loadAutoralCards = useCallback(async () => {
    setAutoralLoading(true);
    const res = await getAutoralFlashcards({ page: autoralPage, limit: 21 });
    setAutoralCards(res.flashcards || []);
    setAutoralTotal(res.total || 0);
    setAutoralIdx(0);
    setAutoralFlipped(false);
    setAutoralLoading(false);
  }, [autoralPage]);

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

  // ── Keyboard shortcut for flip ──
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === 'Space') { e.preventDefault(); setFlipped((f) => !f); setAutoralFlipped((f) => !f); }
      if (e.code === 'ArrowRight') { e.preventDefault(); if (autoralCards.length) { setAutoralFlipped(false); setAutoralIdx((i) => Math.min(i + 1, autoralCards.length - 1)); } }
      if (e.code === 'ArrowLeft') { e.preventDefault(); if (autoralCards.length) { setAutoralFlipped(false); setAutoralIdx((i) => Math.max(i - 1, 0)); } }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [autoralCards.length]);

  // ── Deck session view ──
  if (sessionCards.length > 0 && currentIdx < sessionCards.length) {
    const card = sessionCards[currentIdx];
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Card principal */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
              Flashcard {currentIdx + 1} de {sessionCards.length}
            </h1>
            <button onClick={() => { setSessionCards([]); setSessionDeckId(''); }} className="text-[12px]" style={{ color: '#484F58' }}>Encerrar</button>
          </div>

          <div
            onClick={() => setFlipped(!flipped)}
            className="rounded-2xl p-10 min-h-[350px] flex items-center justify-center cursor-pointer transition-all"
            style={{ backgroundColor: '#141414', border: `1.5px solid ${flipped ? '#00C853' : '#21262D'}` }}
          >
            {!flipped ? (
              <div className="text-center max-w-lg">
                <p className="text-[11px] font-semibold mb-4" style={{ color: '#E8172C' }}>{card.tema}</p>
                <p className="text-xl text-white leading-relaxed">{card.frente}</p>
                <p className="text-[11px] mt-8" style={{ color: '#484F58' }}>Clique ou pressione Espaço</p>
              </div>
            ) : (
              <div className="max-w-lg max-h-[400px] overflow-y-auto">
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: '#8B949E' }}>{card.verso_txt}</p>
              </div>
            )}
          </div>

          {flipped && (
            <div className="flex gap-4 mt-4">
              <button onClick={() => handleReview(false)} className="flex-1 py-3.5 rounded-xl text-[14px] font-semibold" style={{ backgroundColor: 'rgba(232,23,44,0.08)', border: '1.5px solid rgba(232,23,44,0.2)', color: '#E8172C' }}>
                ✕ Errei
              </button>
              <button onClick={() => handleReview(true)} className="flex-1 py-3.5 rounded-xl text-[14px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #00C853, #00A844)' }}>
                ✓ Acertei
              </button>
            </div>
          )}
        </div>

        {/* Progress lateral */}
        <div className="xl:col-span-1">
          <h3 className="text-[11px] font-bold tracking-wider mb-3" style={{ color: '#484F58' }}>PROGRESSO</h3>
          <div className="rounded-2xl p-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
            <div className="w-full h-2 rounded-full mb-3" style={{ backgroundColor: '#21262D' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / sessionCards.length) * 100}%`, backgroundColor: '#E8172C' }} />
            </div>
            <p className="text-[12px]" style={{ color: '#8B949E' }}>{currentIdx + 1} de {sessionCards.length} cards</p>
          </div>
          <p className="text-[10px] mt-3 text-center" style={{ color: '#484F58' }}>
            ⌨️ Espaço = virar · ← → = navegar
          </p>
        </div>
      </div>
    );
  }

  // ── Autoral session view ──
  if (mode === 'autoral' && autoralCards.length > 0 && autoralIdx < autoralCards.length) {
    const card = autoralCards[autoralIdx];
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
              Flashcard Autoral {autoralIdx + 1} de {autoralCards.length}
            </h1>
            <button onClick={() => { setAutoralCards([]); setMode('decks'); }} className="text-[12px]" style={{ color: '#484F58' }}>Voltar</button>
          </div>

          <div
            onClick={() => setAutoralFlipped(!autoralFlipped)}
            className="rounded-2xl p-10 min-h-[350px] flex items-center justify-center cursor-pointer transition-all"
            style={{ backgroundColor: '#141414', border: `1.5px solid ${autoralFlipped ? '#00C853' : '#21262D'}` }}
          >
            {!autoralFlipped ? (
              <div className="text-center max-w-lg">
                <p className="text-[11px] font-semibold mb-4" style={{ color: '#E8172C' }}>{card.tema}</p>
                <p className="text-xl text-white leading-relaxed">{card.frente}</p>
                <p className="text-[11px] mt-8" style={{ color: '#484F58' }}>Clique ou pressione Espaço</p>
              </div>
            ) : (
              <div className="max-w-lg max-h-[400px] overflow-y-auto">
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: '#8B949E' }}>{card.verso_txt}</p>
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
        </div>

        <div className="xl:col-span-1">
          <h3 className="text-[11px] font-bold tracking-wider mb-3" style={{ color: '#484F58' }}>INFO</h3>
          <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#21262D' }}>
              <div className="h-full rounded-full" style={{ width: `${((autoralIdx + 1) / autoralCards.length) * 100}%`, backgroundColor: '#E8172C' }} />
            </div>
            <p className="text-[12px]" style={{ color: '#8B949E' }}>{autoralIdx + 1} de {autoralCards.length} nesta página</p>
            <p className="text-[11px]" style={{ color: '#484F58' }}>{autoralTotal.toLocaleString()} flashcards autorais total</p>
          </div>
          <p className="text-[10px] mt-3 text-center" style={{ color: '#484F58' }}>
            ⌨️ Espaço = virar · ← → = navegar
          </p>
        </div>
      </div>
    );
  }

  // ── Deck list view — layout desktop: criar à esquerda, lista à direita ──
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>⚡ Flashcards</h1>
          <p className="text-[13px] mt-1" style={{ color: '#8B949E' }}>Crie decks ou estude os 9.362 flashcards autorais</p>
        </div>
        <div className="flex gap-2">
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
            🎯 Autorais GTMED
          </button>
        </div>
      </div>

      {mode === 'autoral' && autoralLoading && (
        <div className="text-center py-12">
          <div className="w-6 h-6 border-2 border-white/20 border-t-[#E8172C] rounded-full animate-spin mb-3" />
          <p className="text-[13px]" style={{ color: '#484F58' }}>Carregando flashcards autorais...</p>
        </div>
      )}

      {mode === 'decks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Criar deck */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl p-5 sticky top-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
              <h2 className="text-[14px] font-bold text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>Criar novo deck</h2>
              <div className="space-y-3">
                <input
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="Nome do deck"
                  className="w-full h-10 rounded-lg px-3 text-[13px] text-white outline-none"
                  style={{ backgroundColor: '#0C0E18', border: '1.5px solid #1A1C2C' }}
                />
                <input
                  value={themes}
                  onChange={(e) => setThemes(e.target.value)}
                  placeholder="Temas (separados por vírgula)"
                  className="w-full h-10 rounded-lg px-3 text-[13px] text-white outline-none"
                  style={{ backgroundColor: '#0C0E18', border: '1.5px solid #1A1C2C' }}
                />
                <button
                  onClick={handleCreate}
                  disabled={creating || !deckName.trim()}
                  className="w-full py-2.5 rounded-lg font-bold text-white text-[13px] disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
                >
                  {creating ? 'Criando...' : 'Criar deck'}
                </button>
              </div>
            </div>
          </div>

          {/* Lista de decks */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-6 h-6 border-2 border-white/20 border-t-[#E8172C] rounded-full animate-spin mb-3" />
                <p className="text-[13px]" style={{ color: '#484F58' }}>Carregando decks...</p>
              </div>
            ) : decks.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
                <span className="text-4xl">📭</span>
                <p className="text-[14px] font-semibold text-white mt-3">Nenhum deck criado</p>
                <p className="text-[12px] mt-1" style={{ color: '#484F58' }}>Crie um deck ao lado ou explore os autorais</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {decks.map((deck) => (
                  <div key={deck.id} className="rounded-2xl p-5" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
                    <h3 className="font-semibold text-white text-[14px] mb-1">{deck.name}</h3>
                    <p className="text-[12px] mb-4" style={{ color: '#484F58' }}>{deck.cards_count} cards</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartSession(deck.id)}
                        className="flex-1 py-2 rounded-lg font-semibold text-white text-[12px]"
                        style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
                      >
                        Estudar
                      </button>
                      <button
                        onClick={() => { deleteDeck(deck.id); loadDecks(); }}
                        className="py-2 px-3 rounded-lg text-[12px]"
                        style={{ backgroundColor: '#0C0E18', border: '1px solid #1A1C2C', color: '#484F58' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
