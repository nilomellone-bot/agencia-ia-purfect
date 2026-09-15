'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, ChartNoAxesCombined, ChevronRight, CircleAlert, FlaskConical, Lightbulb, Megaphone, Send, ShieldCheck, ShoppingBag, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { Badge, DemoNote, Metric, Panel, TextLink } from './ui';
import { SalesChart, ChannelChart } from './charts';
import { useDemo } from './demo-provider';
import { agentInfo, getDemoMetrics } from '@/services/demo-data';
import { formatMoney, formatNumber, formatPercent } from '@/services/finance';
import { statusLabels } from '@/policies/decisions';
export function Dashboard(){
 const [days,setDays]=useState(14);const m=getDemoMetrics(days); const {data,question,setQuestion}=useDemo();const router=useRouter();
 function ask(e:React.FormEvent){e.preventDefault();if(!question.trim())setQuestion('¿Qué cambiarías hoy para aumentar las ventas sin bajar margen?');router.push('/director');}
 return <>
  <div className="dashboard-heading"><div><div className="eyebrow">TU NEGOCIO, EN PERSPECTIVA</div><h1>Hola, Nilo <span className="wave">👋</span></h1><p>Acá tenés el estado actual de Purfect y las principales oportunidades.</p></div><label className="date-select"><CalendarDays size={16}/><select aria-label="Período del dashboard" value={days} onChange={e=>setDays(Number(e.target.value))}><option value={14}>1–14 sep, 2026</option><option value={7}>8–14 sep, 2026</option></select></label></div>
  <div className="demo-strip"><span><span className="demo-dot"/>Estás explorando la versión demo</span><span>Datos de ejemplo · ARS<TextLink href="/configuracion">Ver conexiones</TextLink></span></div>
  <div className="metrics-grid">
   <Metric label="Ventas" value={formatMoney(m.revenue)} detail="Netas · datos demo" icon={Wallet}/>
   <Metric label="Pedidos" value={formatNumber(m.orders)} detail={`Ticket: ${formatMoney(m.averageOrder)}`} icon={ShoppingBag}/>
   <Metric label="Margen de contribución" value={formatPercent(m.contributionRate)} detail="Antes de pauta y costos fijos" icon={ChartNoAxesCombined}/>
   <Metric label="Meta Spend" value={formatMoney(m.adSpend)} detail="Inversión del período" icon={Megaphone}/>
   <Metric label="ROAS" value={`${formatNumber(m.roas??0,2)}x`} detail="Atribuido · no incremental" icon={TrendingUp}/>
  </div>
  <section className="director-callout"><div className="director-mark"><Sparkles size={25}/></div><div className="director-content"><div className="director-title"><h2>Una mirada completa. Una mejor decisión.</h2><Badge tone="blue">DIRECTOR IA</Badge></div><p>Tu equipo conecta los puntos entre inversión, rentabilidad y experiencia de compra.</p><form className="director-input" onSubmit={ask}><input aria-label="Preguntale al Director" placeholder="Preguntale al Director…" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={600}/><button type="submit"><span>Consultar</span><ArrowRight size={17}/></button></form><div className="director-bottom"><span>Probá: “¿Cómo aumentar las ventas sin bajar margen?”</span><span className="agent-flow">Meta Ads<ChevronRight/>Finanzas<ChevronRight/>Analytics<ChevronRight/>CRO</span></div></div></section>
  <div className="chart-grid"><Panel title="Ventas vs. Publicidad" subtitle="Cómo evoluciona el negocio durante el período" action={<div className="chart-key"><span><i/>Ventas</span><span><i/>Publicidad</span></div>}><SalesChart days={days}/><div className="chart-footnote">Ventas: eje izquierdo · Publicidad: eje derecho · Ambas en ARS</div></Panel><Panel title="Distribución de canales" subtitle="Ingresos asignados · ejemplo"><ChannelChart/></Panel></div>
  <Panel title="Tu equipo de especialistas" subtitle="Perspectivas distintas, una dirección compartida" action={<TextLink href="/director">Ver equipo</TextLink>} className="agents-panel"><div className="agent-grid">{agentInfo.map(a=><Link href={`/${a.id}`} key={a.id} className="agent-card"><div className="agent-card-top"><span className={`agent-avatar ${a.tone}`}>{a.initials}</span><ArrowUpRight size={16}/></div><h3>{a.name}</h3><p>{a.role}</p><div className={`agent-state ${a.id==='analytics'?'attention':''}`}><span/>{a.status}</div></Link>)}</div></Panel>
  <div className="insights-grid"><Panel title="En el radar" action={<Badge>2 insights demo</Badge>}><div className="insight-row"><span className="insight-icon green"><Lightbulb size={19}/></span><div><h3>Primero, convertir mejor</h3><p>Una prueba en Circuito Felino puede ayudar a entender qué información acerca al michi a su próximo mueble.</p><TextLink href="/cro">Explorar oportunidad</TextLink></div></div><div className="insight-row"><span className="insight-icon orange"><CircleAlert size={19}/></span><div><h3>Validar medición antes de escalar</h3><p>En este ejemplo, Analytics mantiene un bloqueo hasta conciliar compras y atribución.</p><TextLink href="/analytics">Revisar alerta</TextLink></div></div></Panel>
  <Panel title="Recomendaciones prioritarias" action={<TextLink href="/recomendaciones">Ver todas</TextLink>}><div className="recommendation-list">{data.recommendations.slice(0,3).map((r,i)=><Link href="/recomendaciones" className="recommendation-row" key={r.id}><span className="rec-index">0{i+1}</span><div><h3>{r.title}</h3><span>{r.agent} · Prioridad {r.priority.toLowerCase()}</span></div><Badge tone={r.status==='CONFLICTED'?'orange':r.status==='APPROVED'?'green':'blue'}>{statusLabels[r.status]}</Badge></Link>)}</div><div className="approval-foot"><ShieldCheck size={15}/>Las recomendaciones siempre pasan por vos.</div></Panel></div>
  <Panel title="Experimentos en seguimiento" subtitle="Aprender con una pregunta y una métrica claras" action={<TextLink href="/experimentos">Ver experimentos</TextLink>}><div className="experiment-preview"><span className="experiment-icon"><FlaskConical size={22}/></span><div><h3>Circuito Felino: landing vs. ficha de producto</h3><p>Hipótesis de conversión · Ejemplo de seguimiento</p></div><div className="experiment-progress"><div><span>7 de 14 días simulados</span><strong>50%</strong></div><progress value={7} max={14}/></div><Badge tone="blue">En medición · demo</Badge><Link className="icon-button" aria-label="Abrir experimento Circuito Felino" href="/experimentos"><ArrowRight size={19}/></Link></div></Panel>
  <DemoNote/>
 </>;
}
