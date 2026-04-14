'use client';

import { useState, useEffect } from 'react';
import { getRandomQuestions } from '@/services/questions';
import type { QuestionRow } from '@/services/questions';

const BOSS_PASS_PCT = 70;
const BOSS_QUESTIONS = 40;

export default function BossPage() {
  const [semana, setSemana] = useState(1);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    const qs = await getRandomQuestions({ limit: BOSS_QUESTIONS });
    setQuestions(qs);
    setCurrentIdx(0);
    setSelected(null);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
    setStarted(true);
    setLoading(false);
  }

  function handleSelect(letra: string) {
    if (showAnswer) return;
    setSelected(letra);
  }

  function handleConfirm() {
    if (!selected) return;
    const q = questions[currentIdx];
    const correct = q.alternativas.find((a) => a.correta)?.letra;
    setShowAnswer(true);
    setScore((s) => ({
      correct: s.correct + (selected === correct ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function handleNext() {
    setCurrentIdx((i) => i + 1);
    setSelected(null);
    setShowAnswer(false);
  }

  // Result
  if (started && currentIdx >= questions.length && questions.length > 0) {
    const pct = Math.round((score.correct / score.total) * 100);
    const passed = pct >= BOSS_PASS_PCT;
    return (
      <div className="max-w-2xl  text-center">
        <span className="text-6xl">{passed ? '🏆' : '💀'}</span>
        <h1 className="text-3xl font-bold text-white mt-4 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          {passed ? 'Boss Derrotado!' : 'Boss Venceu...'}
        </h1>
        <p className="text-5xl font-bold my-4" style={{ color: passed ? '#00C853' : '#E8172C', fontFamily: 'Syne, sans-serif' }}>{pct}%</p>
        <p className="text-[14px] mb-2" style={{ color: '#8B949E' }}>{score.correct} de {score.total} corretas</p>
        <p className="text-[12px] mb-6" style={{ color: '#484F58' }}>Meta: {BOSS_PASS_PCT}% para passar</p>
        {passed && (
          <div className="rounded-2xl p-4 mb-6 inline-block" style={{ background: 'linear-gradient(135deg, rgba(255,184,0,0.15), rgba(255,184,0,0.05))', border: '1px solid rgba(255,184,0,0.2)' }}>
            <span className="text-[14px] font-bold" style={{ color: '#FFB800' }}>+100 XP bônus Boss Galáctico! 🎉</span>
          </div>
        )}
        <div>
          <button
            onClick={() => { setStarted(false); setQuestions([]); }}
            className="px-8 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
          >
            Voltar à trilha
          </button>
        </div>
      </div>
    );
  }

  // Battle
  if (started && questions.length > 0) {
    const q = questions[currentIdx];
    const correctLetra = q.alternativas.find((a) => a.correta)?.letra;
    const progressPct = ((currentIdx + 1) / questions.length) * 100;
    return (
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👹</span>
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Boss — Semana {semana}</h1>
          </div>
          <span className="text-[12px]" style={{ color: '#8B949E' }}>{currentIdx + 1}/{questions.length} · {score.correct} ✓</span>
        </div>

        {/* Boss HP bar */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-bold" style={{ color: '#E8172C' }}>BOSS HP</span>
          <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#21262D' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${100 - progressPct}%`, background: 'linear-gradient(90deg, #E8172C, #FF4444)' }} />
          </div>
          <span className="text-[10px] font-bold" style={{ color: '#484F58' }}>{Math.round(100 - progressPct)}%</span>
        </div>

        <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: '#F0F6FC' }}>{q.enunciado}</p>
        </div>

        <div className="space-y-2.5 mb-4">
          {q.alternativas.map((alt) => {
            let bg = '#141414';
            let border = '#21262D';
            if (showAnswer) {
              if (alt.letra === correctLetra) { bg = 'rgba(0,200,83,0.1)'; border = '#00C853'; }
              else if (alt.letra === selected) { bg = 'rgba(232,23,44,0.1)'; border = '#E8172C'; }
            } else if (alt.letra === selected) { border = '#E8172C'; }
            return (
              <button key={alt.letra} onClick={() => handleSelect(alt.letra)} className="w-full text-left rounded-xl px-5 py-4 transition-all" style={{ backgroundColor: bg, border: `1.5px solid ${border}` }}>
                <span className="font-bold mr-3" style={{ color: '#E8172C' }}>{alt.letra})</span>
                <span style={{ color: '#F0F6FC' }}>{alt.texto}</span>
              </button>
            );
          })}
        </div>

        {!showAnswer ? (
          <button onClick={handleConfirm} disabled={!selected} className="px-8 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40" style={{ background: selected ? 'linear-gradient(135deg, #E8172C, #FF4444)' : '#21262D' }}>
            Atacar! ⚔️
          </button>
        ) : (
          <button onClick={handleNext} className="px-8 py-3 rounded-xl font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}>
            {currentIdx + 1 < questions.length ? 'Próximo ataque →' : 'Ver resultado final'}
          </button>
        )}
      </div>
    );
  }

  // Start screen
  return (
    <div className="max-w-lg  text-center">
      <span className="text-[80px]">👹</span>
      <h1 className="text-2xl font-bold text-white mt-4 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Boss Galáctico</h1>
      <p className="text-[14px] mb-1" style={{ color: '#8B949E' }}>Semana {semana} — Prova final do capítulo</p>
      <p className="text-[12px] mb-6" style={{ color: '#484F58' }}>{BOSS_QUESTIONS} questões · Meta: {BOSS_PASS_PCT}% de acerto</p>

      <div className="rounded-2xl p-5 mb-6 text-left" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <h3 className="text-[12px] font-bold tracking-wider mb-3" style={{ color: '#484F58' }}>REGRAS DO BOSS</h3>
        <div className="space-y-2">
          {[
            { icon: '📝', text: `${BOSS_QUESTIONS} questões misturando todos os temas da semana` },
            { icon: '🎯', text: `Mínimo ${BOSS_PASS_PCT}% de acerto para passar` },
            { icon: '⚡', text: '+100 XP bônus ao derrotar o boss' },
            { icon: '🔓', text: 'Desbloqueia a próxima semana da trilha' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <span>{r.icon}</span>
              <p className="text-[13px]" style={{ color: '#8B949E' }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="px-10 py-3.5 rounded-xl font-[800] text-[15px] text-white disabled:opacity-50 transition-transform active:scale-[0.97]"
        style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)', fontFamily: 'Syne, sans-serif', boxShadow: '0 5px 20px rgba(232,23,44,0.4)' }}
      >
        {loading ? 'Preparando...' : '⚔️ Enfrentar o Boss'}
      </button>
    </div>
  );
}
