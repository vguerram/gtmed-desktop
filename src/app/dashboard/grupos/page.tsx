'use client';

export default function GruposPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>👥 Grupos</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Estude em grupo e acompanhe o progresso dos colegas</p>

      {/* Criar grupo */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <div className="text-center">
          <span className="text-4xl">🏫</span>
          <h3 className="text-lg font-bold text-white mt-3" style={{ fontFamily: 'Syne, sans-serif' }}>Crie seu esquadrão</h3>
          <p className="text-[12px] mt-1 mb-4" style={{ color: '#484F58' }}>Convide colegas para estudar juntos e competir no ranking do grupo</p>

          <div className="max-w-xs mx-auto mb-4">
            <input
              placeholder="Nome do grupo..."
              className="w-full h-11 rounded-[11px] px-3.5 text-[14px] text-white outline-none text-center"
              style={{ backgroundColor: '#0C0E18', border: '1.5px solid #1A1C2C' }}
            />
          </div>

          <button
            className="px-8 py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
          >
            Criar grupo
          </button>
        </div>
      </div>

      {/* Ou entrar em um */}
      <div className="h-px mb-4" style={{ backgroundColor: '#161B22' }} />
      <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Entrar com código</h2>
      <div className="rounded-2xl p-5" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <div className="flex gap-3">
          <input
            placeholder="Código do grupo"
            className="flex-1 h-11 rounded-[11px] px-3.5 text-[14px] text-white outline-none"
            style={{ backgroundColor: '#0C0E18', border: '1.5px solid #1A1C2C' }}
          />
          <button
            className="px-6 py-2.5 rounded-xl font-semibold text-white text-[13px]"
            style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
          >
            Entrar
          </button>
        </div>
      </div>

      {/* Seus grupos */}
      <div className="h-px my-4" style={{ backgroundColor: '#161B22' }} />
      <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Seus grupos</h2>
      <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
        <span className="text-3xl">📭</span>
        <p className="text-[13px] mt-2" style={{ color: '#484F58' }}>Você não faz parte de nenhum grupo ainda</p>
      </div>
    </div>
  );
}
