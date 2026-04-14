'use client';

export default function SuportePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>💬 Suporte</h1>

      <div className="space-y-4">
        <SupportCard
          icon="📧"
          title="E-mail"
          description="Envie sua dúvida ou sugestão"
          action="suporte@gtmed.com"
          href="mailto:suporte@gtmed.com"
        />
        <SupportCard
          icon="💬"
          title="WhatsApp"
          description="Atendimento rápido"
          action="Abrir WhatsApp"
          href="https://wa.me/5511999999999"
        />
        <SupportCard
          icon="📋"
          title="FAQ"
          description="Perguntas frequentes"
          action="Ver FAQ"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Reportar problema</h2>
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}>
          <textarea
            placeholder="Descreva o problema ou sugestão..."
            rows={4}
            className="w-full rounded-xl p-4 text-[14px] text-white outline-none resize-none"
            style={{ backgroundColor: '#0C0E18', border: '1.5px solid #1A1C2C' }}
          />
          <button
            className="mt-3 px-6 py-2.5 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

function SupportCard({ icon, title, description, action, href }: {
  icon: string; title: string; description: string; action: string; href?: string;
}) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag
      href={href}
      target={href ? '_blank' : undefined}
      className="flex items-center gap-4 rounded-2xl p-5 transition-all cursor-pointer"
      style={{ backgroundColor: '#141414', border: '1px solid #21262D' }}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="font-semibold text-white text-[14px]">{title}</p>
        <p className="text-[12px]" style={{ color: '#484F58' }}>{description}</p>
      </div>
      <span className="text-[12px] font-semibold" style={{ color: '#E8172C' }}>{action}</span>
    </Tag>
  );
}
