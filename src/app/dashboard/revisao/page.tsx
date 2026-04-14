'use client';

import { useState, useEffect } from 'react';
import { getReviewSummary } from '@/services/review';
import type { ReviewSummary } from '@/services/review';

export default function RevisaoPage() {
  const [summary, setSummary] = useState<ReviewSummary>({ today: 0, tomorrow: 0, week: 0, overdue: 0 });
  useEffect(() => { getReviewSummary().then(setSummary); }, []);
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>🔁 Revisão</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Revisão espaçada (SRS) de questões e flashcards</p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SummaryCard label="Hoje" value={summary.today} color="#E8172C" icon="📅" />
        <SummaryCard label="Amanhã" value={summary.tomorrow} color="#FF8C00" icon="⏰" />
        <SummaryCard label="Esta semana" value={summary.week} color="#00CFFF" icon="📆" />
        <SummaryCard label="Atrasados" value={summary.overdue} color="#FF1A1A" icon="⚠️" />
      </div>

      {/* Revisão de questões */}
      <div className="rounded-2xl p-6 mb-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📝</span>
          <div>
            <h3 className="font-semibold text-white text-[14px]">Questões para revisar</h3>
            <p className="text-[11px]" style={{ color: '#484F58' }}>0 questões pendentes</p>
          </div>
        </div>
        <button
          disabled
          className="w-full h-10 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
          style={{ backgroundColor: '#21262D' }}
        >
          Nenhuma questão para revisar
        </button>
      </div>

      {/* Revisão de flashcards */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h3 className="font-semibold text-white text-[14px]">Flashcards para revisar</h3>
            <p className="text-[11px]" style={{ color: '#484F58' }}>0 flashcards pendentes</p>
          </div>
        </div>
        <button
          disabled
          className="w-full h-10 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
          style={{ backgroundColor: '#21262D' }}
        >
          Nenhum flashcard para revisar
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold tracking-wider" style={{ color: '#484F58' }}>{label.toUpperCase()}</span>
        <span>{icon}</span>
      </div>
      <p className="text-xl font-bold" style={{ color, fontFamily: 'Syne, sans-serif' }}>{value}</p>
    </div>
  );
}
