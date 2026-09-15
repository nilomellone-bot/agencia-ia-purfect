'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowUpRight, BarChart3, BookOpen, BrainCircuit, ChevronDown, ChevronRight, CircleHelp, FlaskConical, House, Layers3, Menu, Megaphone, PanelLeftClose, PawPrint, Settings2, ShieldCheck, Sparkles, Wallet, X } from 'lucide-react';
import { useDemo } from './demo-provider';
const navigation=[
 {label:'Inicio',href:'/',icon:House}, {label:'Director',href:'/director',icon:Sparkles},
 {label:'Meta Ads',href:'/meta-ads',icon:Megaphone}, {label:'Finanzas',href:'/finanzas',icon:Wallet},
 {label:'Analytics',href:'/analytics',icon:BarChart3}, {label:'CRO',href:'/cro',icon:Layers3},
 {label:'Recomendaciones',href:'/recomendaciones',icon:BrainCircuit}, {label:'Experimentos',href:'/experimentos',icon:FlaskConical},
 {label:'Memoria',href:'/memoria',icon:BookOpen}, {label:'Cargar información',href:'/informacion',icon:BookOpen}, {label:'Configuración',href:'/configuracion',icon:Settings2}, {label:'Acceso privado',href:'/acceso',icon:ShieldCheck},
];
export function Shell({children}:{children:React.ReactNode}){
 const pathname=usePathname(); const [open,setOpen]=useState(false); const [isMobile,setIsMobile]=useState(false); const {data,storageError}=useDemo();
 const menuRef=useRef<HTMLButtonElement>(null); const closeRef=useRef<HTMLButtonElement>(null);
 const pending=data.recommendations.filter(r=>['VALIDATED','PROPOSED'].includes(r.status)).length;
 useEffect(()=>{setOpen(false);},[pathname]);
 useEffect(()=>{const media=window.matchMedia('(max-width: 800px)');const update=()=>{setIsMobile(media.matches);if(!media.matches)setOpen(false);};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{if(!open)return;closeRef.current?.focus(); const old=document.body.style.overflow;document.body.style.overflow='hidden'; const listener=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);menuRef.current?.focus();}};document.addEventListener('keydown',listener);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',listener);};},[open]);
 return <div className="app-shell">
  <a href="#main-content" className="skip-link">Ir al contenido</a>
  {open&&<button className="sidebar-backdrop" aria-label="Cerrar menú" onClick={()=>setOpen(false)}/>}
  <aside className={`sidebar ${open?'is-open':''}`} aria-label="Navegación principal" inert={isMobile&&!open}>
   <Link className="brand" href="/"><span className="brand-icon"><PawPrint size={23}/></span><span>PURFECT<span className="brand-sub">AGENCIA IA</span></span></Link>
   <button ref={closeRef} className="mobile-close icon-button" aria-label="Cerrar navegación" onClick={()=>{setOpen(false);menuRef.current?.focus();}}><X size={20}/></button>
   <div className="workspace"><span className="workspace-avatar">P</span><div>Purfect Tienda Felina<small>Tu espacio de trabajo</small></div><ChevronDown size={14}/></div>
   <div className="nav-label">GENERAL</div>
   <nav>{navigation.map(({label,href,icon:Icon},i)=><div key={href}>{i===2&&<div className="nav-label">TU EQUIPO</div>}{i===6&&<div className="nav-label">GESTIÓN</div>}<Link className={`nav-item ${pathname===href?'active':''}`} href={href} aria-current={pathname===href?'page':undefined}><Icon size={18}/><span>{label}</span>{label==='Recomendaciones'&&<span className="nav-count">{pending}</span>}</Link></div>)}</nav>
   <div className="sidebar-bottom"><div className="safe-mode"><ShieldCheck size={17}/><span>Vos tenés el control<small>Cada acción necesita tu aprobación.</small></span></div><Link className="help-link" href="/documentacion"><CircleHelp size={17}/>Cómo funciona la Agencia<ArrowUpRight size={14}/></Link><div className="profile"><span className="profile-avatar">NM</span><div>Nilo Mellone<small>Espacio local</small></div><span className="version">V0.3</span></div></div>
  </aside>
  <div className="app-main" inert={isMobile&&open}><header className="topbar"><div className="breadcrumb"><button ref={menuRef} className="icon-button menu-button" aria-label="Abrir navegación" aria-expanded={open} onClick={()=>setOpen(true)}><Menu size={21}/></button><PanelLeftClose size={18} className="desktop-icon"/><span>Agencia IA</span><ChevronRight size={14}/><strong>{navigation.find(n=>n.href===pathname)?.label||'Documentación'}</strong></div><div className="topbar-right"><span className="demo-chip"><span/>{pathname==='/informacion'||pathname==='/'?'V0 · LOCAL':'MODO DEMO'}</span><Link className="header-help" href="/documentacion" aria-label="Ver documentación"><CircleHelp size={19}/></Link><span className="tiny-avatar">N</span></div></header>
   <main id="main-content" tabIndex={-1}>{storageError&&<div role="alert" className="warning">{storageError}</div>}{children}</main>
   <footer className="app-footer"><span>Purfect · Un equipo, decisiones coordinadas.</span><span><Activity size={13}/>V0 · Carga local · Integraciones pendientes</span></footer>
  </div>
 </div>;
}
