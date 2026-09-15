import type {SupabaseClient} from '@supabase/supabase-js';
import {businessSchema,type BusinessData} from '@/schemas/business';
import type {BusinessSnapshot,BusinessStore} from '@/db/business-store';
function snapshot(row:{payload:unknown;revision:number;updated_at:string}):BusinessSnapshot{return {data:businessSchema.parse(row.payload),revision:row.revision,updatedAt:row.updated_at};}
export class SupabaseBusinessStore implements BusinessStore{
 constructor(private client:SupabaseClient,private userId:string){}
 async read(){const {data,error}=await this.client.from('business_information').select('payload,revision,updated_at').eq('user_id',this.userId).maybeSingle();if(error)throw error;return data?snapshot(data):null;}
 async write(data:BusinessData,expectedRevision:number){const result=await this.client.rpc('save_business_information',{new_payload:businessSchema.parse(data),expected_revision:expectedRevision}).single();if(result.error)throw result.error;return snapshot(result.data as {payload:unknown;revision:number;updated_at:string});}
}
