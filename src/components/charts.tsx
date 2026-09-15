'use client';
import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { channels, dailyData } from '@/services/demo-data';
import { formatMoney, formatNumber } from '@/services/finance';
export function SalesChart({days=14}:{days?:number}){
 const id=useId().replaceAll(':','');
 return <div className="sales-chart" role="img" aria-label="Gráfico de ventas y publicidad de ejemplo en pesos argentinos, con dos escalas independientes"><ResponsiveContainer width="100%" height="100%" minWidth={0}>
  <AreaChart data={dailyData.slice(-days)} margin={{top:12,right:5,left:0,bottom:0}}>
   <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6571de" stopOpacity={.18}/><stop offset="100%" stopColor="#6571de" stopOpacity={0}/></linearGradient></defs>
   <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e9ecf2"/><XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={35} tick={{fill:'#8790a2',fontSize:12}} dy={9}/>
   <YAxis yAxisId="sales" tickFormatter={n=>`${formatNumber(n/1000000,1)} M`} width={58} axisLine={false} tickLine={false} tick={{fill:'#8790a2',fontSize:12}}/>
   <YAxis yAxisId="spend" orientation="right" tickFormatter={n=>`${formatNumber(n/1000)} k`} width={48} axisLine={false} tickLine={false} tick={{fill:'#819990',fontSize:12}}/>
   <Tooltip formatter={(v)=>formatMoney(Number(v))} contentStyle={{border:'1px solid #e7eaf0',borderRadius:10,fontSize:13}}/>
   <Area isAnimationActive={false} yAxisId="sales" type="monotone" dataKey="sales" name="Ventas" stroke="#5967db" strokeWidth={2.5} fill={`url(#${id})`}/>
   <Area isAnimationActive={false} yAxisId="spend" type="monotone" dataKey="spend" name="Publicidad" stroke="#69b6a5" strokeWidth={2} strokeDasharray="4 4" fill="transparent"/>
  </AreaChart>
 </ResponsiveContainer></div>;
}
export function ChannelChart(){return <><div className="donut-container" role="img" aria-label="Canales demo: Meta Ads 52%, orgánico 26%, directo 15%, email 7%"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie isAnimationActive={false} data={channels} dataKey="value" innerRadius={64} outerRadius={84} paddingAngle={3} stroke="none">{channels.map(c=><Cell key={c.name} fill={c.color}/>)}</Pie><Tooltip formatter={(v)=>`${v}%`}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>4</strong><span>canales</span></div></div><div className="channel-legend">{channels.map(c=><div key={c.name}><span><i style={{background:c.color}}/>{c.name}</span><strong>{c.value}%</strong></div>)}</div></>;}
