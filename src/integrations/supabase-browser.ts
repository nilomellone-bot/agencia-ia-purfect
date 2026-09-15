'use client';
import {createClient} from '@supabase/supabase-js';
import {supabaseUrl,supabasePublishableKey} from './supabase-config';
let client:ReturnType<typeof createClient>|undefined;
export function getAuthClient(){return client??=createClient(supabaseUrl,supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});}
