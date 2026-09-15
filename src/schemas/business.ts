import { z } from 'zod';
const amount = z.number().finite().min(0).max(1e12);
const line = z.string().trim().max(300);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Usá fecha AAAA-MM-DD').refine(v => {
 const d = new Date(`${v}T00:00:00Z`);
 return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === v;
}, 'La fecha no existe');
export const productSchema = z.object({sku:line.min(1),nombre:line.min(1),precio_neto:amount,costo_variable:amount,stock:z.number().int().min(0).max(1e7)}).strict();
export const dailySchema = z.object({fecha:date,ventas_netas:amount,pedidos:z.number().int().min(0).max(1e7),costos_variables:amount,pauta_meta:amount,ventas_atribuidas_meta:amount}).strict();
const documentSchema = z.object({id:z.string().max(100),title:line.min(1),category:z.enum(['Marca','Productos','Promociones','Operaciones','Investigación']),text:z.string().trim().min(1).max(50000)}).strict();
export const businessSchema = z.object({
 version:z.literal(1),updatedAt:z.string().datetime().nullable(),
 profile:z.object({name:line,website:line,description:z.string().max(5000),audience:z.string().max(5000),goals:z.string().max(5000)}).strict(),
 products:z.array(productSchema).max(2000),daily:z.array(dailySchema).max(3660),documents:z.array(documentSchema).max(50),
}).strict().superRefine((v,ctx)=>{
 for(const [key,rows,field] of [['products',v.products,'sku'],['daily',v.daily,'fecha']] as const){
  const seen=new Set<string>();
  for(const row of rows){const id=String((row as unknown as Record<string,unknown>)[field]);if(seen.has(id)){ctx.addIssue({code:'custom',path:[key],message:`Valor duplicado: ${id}`});break;}seen.add(id);}
 }
 if(new Set(v.documents.map(d=>d.id)).size!==v.documents.length)ctx.addIssue({code:'custom',path:['documents'],message:'Hay documentos duplicados'});
});
export type BusinessData=z.infer<typeof businessSchema>;
export type Product=z.infer<typeof productSchema>;
export type Daily=z.infer<typeof dailySchema>;
export const emptyBusiness:BusinessData={version:1,updatedAt:null,profile:{name:'Purfect Tienda Felina',website:'https://purfect.com.ar',description:'',audience:'',goals:''},products:[],daily:[],documents:[]};
