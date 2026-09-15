import type { Metadata } from 'next';
import { DemoProvider } from '@/components/demo-provider';
import { Shell } from '@/components/shell';
import './globals.css';
export const metadata:Metadata={title:{default:'Agencia IA Purfect · Inicio',template:'%s · Agencia IA Purfect'},description:'Espacio de trabajo de Agencia IA Purfect. V0 navegable con datos de demostración.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es-AR"><body><DemoProvider><Shell>{children}</Shell></DemoProvider></body></html>;}
