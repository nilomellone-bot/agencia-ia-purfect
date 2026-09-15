'use client';
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <div className="empty-state"><h1>No pudimos cargar esta sección</h1><p>Los ejemplos guardados en el navegador no se borraron.</p><button onClick={reset} className="primary-button">Volver a intentar</button></div>;}
