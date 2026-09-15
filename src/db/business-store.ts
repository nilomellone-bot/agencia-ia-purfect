import type {BusinessData} from '@/schemas/business';
export type BusinessSnapshot={data:BusinessData;revision:number;updatedAt:string|null};
/** Domain storage contract: integrations may use PostgreSQL or a provider API. */
export interface BusinessStore {read():Promise<BusinessSnapshot|null>;write(data:BusinessData,expectedRevision:number):Promise<BusinessSnapshot>;}
