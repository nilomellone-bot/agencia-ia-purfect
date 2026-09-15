import {createClient} from '@supabase/supabase-js';
import {NextResponse} from 'next/server';
import {z} from 'zod';
import {businessSchema} from '@/schemas/business';
import {SupabaseBusinessStore} from '@/integrations/supabase-business-store';
import {supabaseUrl,supabasePublishableKey} from '@/integrations/supabase-config';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store','Vary':'Authorization'};
function reply(body:unknown,status=200){return NextResponse.json(body,{status,headers});}
async function storage(req:Request){const auth=req.headers.get('authorization');if(!auth?.startsWith('Bearer '))return null;const token=auth.slice(7);const client=createClient(supabaseUrl,supabasePublishableKey,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});const {data,error}=await client.auth.getUser(token);if(error||!data.user||data.user.is_anonymous)return null;return new SupabaseBusinessStore(client,data.user.id);}
export async function GET(req:Request){try{const store=await storage(req);if(!store)return reply({error:'Iniciá sesión para acceder a tu información privada.'},401);return reply({snapshot:await store.read()});}catch{return reply({error:'No se pudo leer el respaldo privado. Intentá nuevamente.'},503);}}
export async function POST(req:Request){
 try{
  const store=await storage(req);if(!store)return reply({error:'Iniciá sesión para guardar información privada.'},401);
  const reader=req.body?.getReader();if(!reader)return reply({error:'Falta el contenido.'},400);const chunks:Uint8Array[]=[];let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>2_100_000){await reader.cancel();return reply({error:'El respaldo supera 2 MB.'},413);}chunks.push(value);}
  const raw=Buffer.concat(chunks);let json:unknown;try{json=JSON.parse(raw.toString('utf8'));}catch{return reply({error:'El respaldo no es JSON válido.'},400);}
  const parsed=z.object({data:businessSchema,expectedRevision:z.number().int().min(0).max(2147483646)}).strict().safeParse(json);
  if(!parsed.success)return reply({error:'La información no cumple el formato requerido.'},400);
  return reply({snapshot:await store.write(parsed.data.data,parsed.data.expectedRevision)});
 }catch(error){if(typeof error==='object'&&error!==null&&'code' in error&&error.code==='40001')return reply({error:'Otra sesión actualizó el respaldo. Revisá la copia privada antes de guardar.'},409);return reply({error:'No se pudo guardar la copia privada. Tu información local se conserva.'},503);}
}
