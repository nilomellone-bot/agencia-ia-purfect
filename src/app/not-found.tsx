import Link from 'next/link';
export default function NotFound(){return <div className="empty-state"><h1>No encontramos esta página</h1><p>Volvé al inicio para seguir explorando la Agencia.</p><Link href="/" className="primary-button">Ir al inicio</Link></div>;}
