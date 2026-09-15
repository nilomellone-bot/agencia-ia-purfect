'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {Session} from '@supabase/supabase-js';
import {getAuthClient} from '@/integrations/supabase-browser';
const Context=createContext<{session:Session|null;ready:boolean}|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const [session,setSession]=useState<Session|null>(null),[ready,setReady]=useState(false);
 useEffect(()=>{const client=getAuthClient();const {data:{subscription}}=client.auth.onAuthStateChange((_event,value)=>{setSession(value);setReady(true);});return()=>subscription.unsubscribe();},[]);
 return <Context.Provider value={{session,ready}}>{children}</Context.Provider>;
}
export function useAuth(){const value=useContext(Context);if(!value)throw new Error('AuthProvider missing');return value;}
