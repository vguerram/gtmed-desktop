'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getRandomQuestions } from '@/services/questions';
import type { QuestionRow } from '@/services/questions';
import ComboIndicator from '@/components/ComboIndicator';

const TOTAL_SECS = 4 * 3600 + 30 * 60; // 4h30

function fmtTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function SimuladoEmAndamento() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [comboCount, setComboCount] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECS);
  const [status, setStatus] = useState<'loading' | 'active' | 'finished' | 'timeout'>('loading');
  const [xpTotal, setXpTotal] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getRandomQuestions({ limit: 100 }).then((qs) => {
      setQuestions(qs);
      setStatus('active');
    });
  }, []);

  useEffect(() => {
    if (status !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setStatus('timeout');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  function handleSelect(letra: string) {
    if (showAnswer) return;
    setSelected(letra);
  }

  function handleConfirm() {
    if (!selected) return;
    const q = questions[currentIdx];
    const correct = q.alternativas.find((a) => a.correta)?.letra;
    const isCorrect = selected === correct;
    const newCombo = isCorrect ? comboCount + 1 : 0;
    const xp = (isCorrect ? 15 : 3) + (newCombo >= 20 ? 400 : newCombo >= 10 ? 150 : newCombo >= 5 ? 60 : newCombo >= 3 ? 30 : 0);

    setShowAnswer(true);
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    setComboCount(newCombo);
    setMaxCombo((m) => Math.max(m, newCombo));
    setXpTotal((x) => x + xp);
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      setStatus('finished');
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  }

  // Loading
  if (status === 'loading') {
    return (
      <div className="max-w-3xl  text-center py-20">
        <div className="w-8 h-8 border-2 border-white/30 border-t-[#E8172C] rounded-full animate-spin mb-4" />
        <p style={{ color: '#8B949E' }}>Preparando simulado...</p>
      </div>
    );
  }

  // Result / Timeout
  if (status === 'finished' || status === 'timeout') {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const tempoGasto = TOTAL_SECS - timeLeft;
    return (
      <div className="max-w-2xl  text-center">
        <span className="text-6xl">{status === 'timeout' ? '⏰' : pct >= 70 ? '🏆' : '📊'}</span>
        <h1 className="text-2xl font-bold text-white mt-4 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          {status === 'timeout' ? 'Tempo Esgotado!' : 'Simulado Concluído'}
        </h1>

        <p className="text-5xl font-bold my-4" style={{ color: pct >= 70 ? '#00C853' : '#E8172C', fontFamily: 'Syne, sans-serif' }}>{pct}%</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MiniStat label="Corretas" value={`${score.correct}/${score.total}`} color="#00C853" />
          <MiniStat label="Tempo" value={fmtTime(tempoGasto)} color="#00CFFF" />
          <MiniStat label="Max Combo" value={`${maxCombo}x`} color="#FFB800" />
          <MiniStat label="XP Ganho" value={`${xpTotal}`} color="#E8172C" />
        </div>

        <button
          onClick={() => router.push('/dashboard/simulados')}
          className="px-8 py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
        >
          Voltar aos simulados
        </button>
      </div>
    );
  }

  // Active
  const q = questions[currentIdx];
  const correctLetra = q.alternativas.find((a) => a.correta)?.letra;
  const timePct = (timeLeft / TOTAL_SECS) * 100;
  const isLowTime = timeLeft < 30 * 60;

  return (
    <div className="max-w-3xl">
      {/* Timer bar */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[12px] font-bold" style={{ color: isLowTime ? '#E8172C' : '#00CFFF' }}>
          ⏱ {fmtTime(timeLeft)}
        </span>
        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#21262D' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${timePct}%`, backgroundColor: isLowTime ? '#E8172C' : '#00CFFF' }} />
        </div>
        <span className="text-[11px]" style={{ color: '#484F58' }}>{currentIdx + 1}/{questions.length}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Questão {currentIdx + 1}
        </h1>
        <div className="flex items-center gap-3">
          <ComboIndicator count={comboCount} />
          <span className="text-[12px] font-bold" style={{ color: '#FFB800' }}>{xpTotal} XP</span>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: '#F0F6FC' }}>{q.enunciado}</p>
      </div>

      {/* Alternatives */}
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
          Confirmar
        </button>
      ) : (
        <button onClick={handleNext} className="px-8 py-3 rounded-xl font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}>
          {currentIdx + 1 < questions.length ? 'Próxima →' : 'Ver resultado'}
        </button>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
      <p className="text-[10px] font-bold tracking-wider" style={{ color: '#484F58' }}>{label.toUpperCase()}</p>
      <p className="text-lg font-bold mt-0.5" style={{ color, fontFamily: 'Syne, sans-serif' }}>{value}</p>
    </div>
  );
}
