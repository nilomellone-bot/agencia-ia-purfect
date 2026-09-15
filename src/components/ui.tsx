import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, ArrowRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:string}){return <span className={`badge ${tone}`}>{children}</span>;}
export function Panel({title,subtitle,children,action,className=''}:{title:string;subtitle?:string;children:ReactNode;action?:ReactNode;className?:string}){return <section className={`panel ${className}`}><div className="panel-heading"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>{children}</section>;}
export function PageHeading({eyebrow,title,description,action}:{eyebrow?:string;title:string;description:string;action?:ReactNode}){return <div className="page-heading"><div>{eyebrow&&<div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div>{action}</div>;}
export function TextLink({href,children}:{href:string;children:ReactNode}){return <Link className="text-link" href={href}>{children}<ArrowRight size={15}/></Link>;}
export function Metric({label,value,detail,icon:Icon,trend}:{label:string;value:string;detail:string;icon:LucideIcon;trend?:string}){return <article className="metric"><div className="metric-label">{label}<Icon size={17}/></div><strong>{value}</strong><div className="metric-foot">{trend&&<span><ArrowUpRight size={13}/>{trend}</span>}<small>{detail}</small></div></article>;}
export function DemoNote({children}:{children?:ReactNode}){return <div className="demo-note"><ShieldCheck size={16}/><span>{children||'Entorno de demostración. Los datos y análisis son ejemplos; no hay cuentas conectadas ni acciones automáticas.'}</span></div>;}
