'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initialStore } from '@/workflows/demo-director';
import { storeSchema, type DemoStore, type DecisionStatus, type DecisionCase, type Recommendation } from '@/schemas/decision';
import { transitionDecision } from '@/policies/decisions';
const KEY='purfect-agency-demo-v1';
const Context=createContext<{
  data:DemoStore; ready:boolean; storageError:string; question:string; setQuestion:(v:string)=>void;
  decide:(id:string,status:DecisionStatus,explicit?:boolean)=>void;
  addCase:(c:DecisionCase,r:Recommendation[])=>void;
} | null>(null);
export function DemoProvider({children}:{children:ReactNode}) {
  const [data,setData]=useState<DemoStore>(initialStore);
  const [ready,setReady]=useState(false);
  const [storageError,setStorageError]=useState('');
  const [question,setQuestion]=useState('');
  useEffect(()=>{
    try { const raw=localStorage.getItem(KEY); if(raw) {const parsed=storeSchema.safeParse(JSON.parse(raw)); if(parsed.success) setData(parsed.data); else setStorageError('El guardado anterior no es compatible. Se cargó el ejemplo inicial.');} }
    catch { setStorageError('No se pudo leer el guardado local. Esta sesión funciona en memoria.'); }
    setReady(true);
  },[]);
  useEffect(()=>{
    if(!ready) return;
    try { localStorage.setItem(KEY,JSON.stringify(data)); }
    catch { setStorageError('No se pudo guardar en este navegador. Los cambios podrían perderse al cerrar.'); }
  },[data,ready]);
  function decide(id:string,status:DecisionStatus,explicit=false) {
    const current=data.recommendations.find(r=>r.id===id);
    if(!current) throw new Error('No se encontró la recomendación.');
    const updated=transitionDecision(current,status,explicit);
    setData(previous=>({ ...previous,
      recommendations: previous.recommendations.map(r=>r.id===id?updated:r),
      audit:[...previous.audit,{ id:crypto.randomUUID(),recommendationId:id,at:new Date().toISOString(),from:current.status,to:status,actor:'Usuario demo' }],
    }));
  }
  function addCase(c:DecisionCase,r:Recommendation[]) {
    setData(previous=>({...previous,cases:[c,...previous.cases],recommendations:[...r,...previous.recommendations]}));
  }
  return <Context.Provider value={{data,ready,storageError,question,setQuestion,decide,addCase}}>{children}</Context.Provider>;
}
export function useDemo(){const value=useContext(Context);if(!value)throw new Error('DemoProvider missing');return value;}
