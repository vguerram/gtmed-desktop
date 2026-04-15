'use client';

import { useState, useEffect } from 'react';
import { getFilterOptions, getEspecialidades, getRandomQuestions, countQuestions } from '@/services/questions';
import { getAutoralQuestions, getAutoralQuestionsStats } from '@/services/autoral';
import type { QuestionRow } from '@/services/questions';

const NUM_PRESETS = [10, 20, 30, 50];
const TIPO_PROVA_CHIPS = [
  { value: '', label: 'Todas' },
  { value: 'R1', label: 'R1' },
  { value: 'R+CM', label: 'R+ CM' },
  { value: 'R+CIR', label: 'R+ CIR' },
  { value: 'REVALIDA', label: 'REVALIDA' },
];
const FONTE_OPTIONS = [
  { value: 'bancas', label: '📋 Bancas' },
  { value: 'autorais', label: '🎯 Autorais GTMED' },
];

export default function QuestoesPage() {
  const [fonte, setFonte] = useState<'bancas' | 'autorais'>('autorais');
  const [grandeArea, setGrandeArea] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [tipoProva, setTipoProva] = useState('');
  const [quantidade, setQuantidade] = useState(10);
  const [areas, setAreas] = useState<string[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(0);

  useEffect(() => {
    getFilterOptions().then((opts) => setAreas(opts.grandes_areas));
  }, []);

  useEffect(() => {
    if (grandeArea) {
      getEspecialidades(grandeArea).then(setEspecialidades);
      setEspecialidade('');
    } else {
      setEspecialidades([]);
    }
  }, [grandeArea]);

  useEffect(() => {
    countQuestions({
      grande_area: grandeArea || undefined,
      especialidade: especialidade || undefined,
      tipo_prova: tipoProva || undefined,
    }).then(setTotalAvailable);
  }, [grandeArea, especialidade, tipoProva]);

  async function handleStart() {
    setLoading(true);
    let qs: QuestionRow[] = [];

    if (fonte === 'autorais') {
      const res = await getAutoralQuestions({
        page: 1,
        limit: quantidade,
        grande_area: grandeArea || undefined,
        especialidade: especialidade || undefined,
      });
      qs = (res.questions || []).map((q) => ({
        id: q.id,
        enunciado: q.content,
        alternativas: q.options?.map((o) => ({ letra: o.letra, texto: o.texto, correta: o.correta })) || [],
        gabarito_letra: q.options?.find((o) => o.correta)?.letra || 'A',
        gabarito_comentado: q.explanation_text_html,
        gabarito_comentado_txt: q.explanation_text,
        grande_area: q.specialities?.find((s) => s.type === 'grande_area')?.name || null,
        especialidade: q.specialities?.find((s) => s.type === 'especialidade')?.name || null,
        tema: q.tags?.[0]?.name || null,
        instituicao_nome: null,
        ano: q.year,
        imagens: [],
      }));
    } else {
      qs = await getRandomQuestions({
        grande_area: grandeArea || undefined,
        especialidade: especialidade || undefined,
        tipo_prova: tipoProva || undefined,
        limit: quantidade,
      });
    }

    setQuestions(qs);
    setCurrentIdx(0);
    setSelected(null);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
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

  // ── Result screen ──
  if (questions.length > 0 && currentIdx >= questions.length) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Resultado</h1>
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <p className="text-6xl font-bold mb-2" style={{ color: pct >= 70 ? '#00C853' : '#E8172C', fontFamily: 'Syne, sans-serif' }}>{pct}%</p>
          <p className="text-sm mb-6" style={{ color: '#8B949E' }}>{score.correct} de {score.total} corretas</p>
          <button
            onClick={() => setQuestions([])}
            className="px-8 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
          >
            Nova prova
          </button>
        </div>
      </div>
    );
  }

  // ── Question screen ──
  if (questions.length > 0) {
    const q = questions[currentIdx];
    const correctLetra = q.alternativas.find((a) => a.correta)?.letra;
    return (
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Questão {currentIdx + 1} de {questions.length}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold" style={{ color: '#00C853' }}>{score.correct} ✓</span>
            <span className="text-[12px]" style={{ color: '#8B949E' }}>{score.total} resp.</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mb-5" style={{ backgroundColor: '#21262D' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, backgroundColor: '#E8172C' }} />
        </div>

        {/* Enunciado */}
        <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: '#F0F6FC' }}>{q.enunciado}</p>
        </div>

        {/* Alternativas */}
        <div className="space-y-2.5 mb-4">
          {q.alternativas.map((alt) => {
            let bg = '#141414';
            let border = '#21262D';
            if (showAnswer) {
              if (alt.letra === correctLetra) { bg = 'rgba(0,200,83,0.1)'; border = '#00C853'; }
              else if (alt.letra === selected) { bg = 'rgba(232,23,44,0.1)'; border = '#E8172C'; }
            } else if (alt.letra === selected) {
              border = '#E8172C';
            }

            return (
              <button
                key={alt.letra}
                onClick={() => handleSelect(alt.letra)}
                className="w-full text-left rounded-xl px-5 py-4 transition-all"
                style={{ backgroundColor: bg, border: `1.5px solid ${border}` }}
              >
                <span className="font-bold mr-3" style={{ color: '#E8172C' }}>{alt.letra})</span>
                <span style={{ color: '#F0F6FC' }}>{alt.texto}</span>
              </button>
            );
          })}
        </div>

        {!showAnswer ? (
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="px-8 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-40"
            style={{ background: selected ? 'linear-gradient(135deg, #E8172C, #FF4444)' : '#21262D' }}
          >
            Confirmar
          </button>
        ) : (
          <div>
            {q.gabarito_comentado_txt && (
              <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#00C853' }}>Comentário</h3>
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: '#8B949E' }}>{q.gabarito_comentado_txt}</p>
              </div>
            )}
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
            >
              {currentIdx + 1 < questions.length ? 'Próxima →' : 'Ver resultado'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Filter/create screen ──
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Questões</h1>

      <div className="rounded-2xl p-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Configurar prova</h2>

        {/* Fonte */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold tracking-wider mb-2" style={{ color: '#3A3A55' }}>FONTE DAS QUESTÕES</label>
          <div className="flex gap-2">
            {FONTE_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFonte(f.value as 'bancas' | 'autorais')}
                className="flex-1 py-2.5 rounded-lg text-[12px] font-semibold transition-all"
                style={{
                  backgroundColor: fonte === f.value ? 'rgba(232,23,44,0.15)' : '#0C0E18',
                  border: `1.5px solid ${fonte === f.value ? '#E8172C' : '#1A1C2C'}`,
                  color: fonte === f.value ? '#E8172C' : '#8B949E',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] mt-1" style={{ color: '#484F58' }}>
            {fonte === 'autorais' ? '5.174 questões autorais GTMED (Opus 4.6)' : 'Questões de bancas reais (USP, UNIFESP, ENARE...)'}
          </p>
        </div>

        {/* Tipo de Prova (só para bancas) */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold tracking-wider mb-2" style={{ color: '#3A3A55' }}>TIPO DE PROVA</label>
          <div className="flex gap-2 flex-wrap">
            {TIPO_PROVA_CHIPS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTipoProva(t.value)}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
                style={{
                  backgroundColor: tipoProva === t.value ? 'rgba(232,23,44,0.15)' : '#0C0E18',
                  border: `1.5px solid ${tipoProva === t.value ? '#E8172C' : '#1A1C2C'}`,
                  color: tipoProva === t.value ? '#E8172C' : '#8B949E',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grande Área */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold tracking-wider mb-2" style={{ color: '#3A3A55' }}>GRANDE ÁREA</label>
          <select
            value={grandeArea}
            onChange={(e) => setGrandeArea(e.target.value)}
            className="w-full h-11 rounded-[11px] px-3.5 text-[14px] text-white outline-none appearance-none"
            style={{ backgroundColor: '#0C0E18', border: '1.5px solid #1A1C2C' }}
          >
            <option value="">Todas as áreas</option>
            {[...new Set(areas)].map((a, i) => (
              <option key={`${a}-${i}`} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Especialidade */}
        {especialidades.length > 0 && (
          <div className="mb-4">
            <label className="block text-[10px] font-bold tracking-wider mb-2" style={{ color: '#3A3A55' }}>ESPECIALIDADE</label>
            <select
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              className="w-full h-11 rounded-[11px] px-3.5 text-[14px] text-white outline-none appearance-none"
              style={{ backgroundColor: '#0C0E18', border: '1.5px solid #1A1C2C' }}
            >
              <option value="">Todas</option>
              {[...new Set(especialidades)].map((e, i) => (
                <option key={`${e}-${i}`} value={e}>{e}</option>
              ))}
            </select>
          </div>
        )}

        {/* Quantidade */}
        <div className="mb-5">
          <label className="block text-[10px] font-bold tracking-wider mb-2" style={{ color: '#3A3A55' }}>
            QUANTIDADE ({totalAvailable.toLocaleString()} disponíveis)
          </label>
          <div className="flex gap-2">
            {NUM_PRESETS.map((n) => (
              <button
                key={n}
                onClick={() => setQuantidade(n)}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all"
                style={{
                  backgroundColor: quantidade === n ? 'rgba(232,23,44,0.15)' : '#0C0E18',
                  border: `1.5px solid ${quantidade === n ? '#E8172C' : '#1A1C2C'}`,
                  color: quantidade === n ? '#E8172C' : '#8B949E',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Iniciar */}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full h-12 rounded-xl font-[800] text-[15px] text-white disabled:opacity-50 transition-transform active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #E8172C, #FF4444)',
            fontFamily: 'Syne, sans-serif',
            boxShadow: '0 5px 14px rgba(232,23,44,0.35)',
          }}
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            `Iniciar prova com ${quantidade} questões →`
          )}
        </button>
      </div>
    </div>
  );
}
