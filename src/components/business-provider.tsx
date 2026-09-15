'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {businessSchema,emptyBusiness,type BusinessData} from '@/schemas/business';
const KEY='purfect-business-v1';
const Context=createContext<{data:BusinessData;ready:boolean;error:string;save:(data:BusinessData)=>void}|null>(null);
export function BusinessProvider({children}:{children:ReactNode}){
 const [data,setData]=useState(emptyBusiness),[ready,setReady]=useState(false),[error,setError]=useState('');
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw)setData(businessSchema.parse(JSON.parse(raw)));}catch{setError('No se pudo leer la información guardada. No se sobrescribió el contenido anterior.');}setReady(true);},[]);
 function save(next:BusinessData){
  if(!ready)throw new Error('Esperá a que termine de cargar el guardado.');
  if(error)throw new Error('El guardado anterior no se pudo leer. Conservá el navegador y recuperá un respaldo antes de continuar.');
  const parsed=businessSchema.parse({...next,updatedAt:new Date().toISOString()});const raw=JSON.stringify(parsed);
  if(new Blob([raw]).size>2_000_000)throw new Error('El conjunto supera 2 MB. Reducí el texto de los documentos antes de guardar.');
  try{localStorage.setItem(KEY,raw);}catch{throw new Error('No se pudo guardar. El almacenamiento del navegador está lleno o bloqueado. Exportá un respaldo de lo que ya tenés.');}
  setData(parsed);
 }
 return <Context.Provider value={{data,ready,error,save}}>{children}</Context.Provider>;
}
export function useBusiness(){const value=useContext(Context);if(!value)throw new Error('BusinessProvider missing');return value;}
