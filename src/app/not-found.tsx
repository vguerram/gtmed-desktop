import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#07090F' }}>
      <div className="text-center">
        <span className="text-6xl">🪐</span>
        <h1 className="text-3xl font-bold text-white mt-4 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Página não encontrada
        </h1>
        <p className="text-[14px] mb-6" style={{ color: '#8B949E' }}>
          Parece que você se perdeu no espaço...
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #E8172C, #FF4444)' }}
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
