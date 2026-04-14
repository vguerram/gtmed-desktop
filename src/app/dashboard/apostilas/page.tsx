'use client';

const AREAS_APOSTILAS = [
  {
    area: 'Clínica Médica',
    cor: '#E8172C',
    especialidades: [
      'Cardiologia', 'Pneumologia', 'Gastroenterologia', 'Nefrologia',
      'Endocrinologia', 'Reumatologia', 'Hematologia', 'Infectologia',
      'Neurologia', 'Dermatologia', 'Geriatria',
    ],
  },
  {
    area: 'Cirurgia Geral',
    cor: '#FF8C00',
    especialidades: [
      'Trauma', 'Cirurgia Digestiva', 'Urologia', 'Vascular',
      'Cirurgia Plástica', 'Ortopedia', 'Cabeça e Pescoço',
    ],
  },
  {
    area: 'Pediatria',
    cor: '#00C853',
    especialidades: ['Neonatologia', 'Puericultura', 'Urgências Pediátricas'],
  },
  {
    area: 'Ginecologia',
    cor: '#FF69B4',
    especialidades: ['Ginecologia Geral', 'Mastologia', 'Uroginecologia'],
  },
  {
    area: 'Obstetrícia',
    cor: '#7B2FF7',
    especialidades: ['Pré-natal', 'Parto', 'Obstetrícia Patológica'],
  },
  {
    area: 'Medicina Preventiva',
    cor: '#00CFFF',
    especialidades: ['Epidemiologia', 'Saúde Pública', 'Ética Médica'],
  },
];

export default function ApostilasPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>📚 Apostilas</h1>
      <p className="text-[13px] mb-6" style={{ color: '#8B949E' }}>Material de estudo organizado por especialidade</p>

      <div className="space-y-4">
        {AREAS_APOSTILAS.map((area) => (
          <div key={area.area} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
            <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid #161B22' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: area.cor }} />
              <h2 className="font-semibold text-white text-[14px]">{area.area}</h2>
              <span className="text-[11px] ml-auto" style={{ color: '#484F58' }}>{area.especialidades.length} especialidades</span>
            </div>
            <div className="p-3 grid grid-cols-2 lg:grid-cols-3 gap-2">
              {area.especialidades.map((esp) => (
                <div
                  key={esp}
                  className="flex items-center gap-2 rounded-xl p-3 cursor-pointer transition-all hover:border-[#E8172C]/30"
                  style={{ backgroundColor: '#0C0E18', border: '1px solid #1A1C2C' }}
                >
                  <span className="text-lg">📄</span>
                  <div>
                    <p className="text-[12px] font-medium text-white">{esp}</p>
                    <p className="text-[10px]" style={{ color: '#484F58' }}>Em breve</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
