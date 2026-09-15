import { dailySchema, productSchema, type BusinessData, type Daily, type Product } from '@/schemas/business';
export const dailyHeader='fecha,ventas_netas,pedidos,costos_variables,pauta_meta,ventas_atribuidas_meta';
export const productHeader='sku,nombre,precio_neto,costo_variable,stock';
export const templates={daily:dailyHeader+'\n2026-09-01,100000,2,60000,10000,50000\n',products:productHeader+'\nEJEMPLO-001,Producto de ejemplo,50000,30000,10\n'};
// Bounded RFC 4180-style CSV reader. Numeric formats are explicit, never guessed.
function csvRows(source:string){
 if(source.length>1_000_000)throw new Error('El archivo supera el límite de 1 MB de texto.');
 const text=source.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
 const delimiter=text.split('\n',1)[0].includes(';')?';':',';
 const rows:string[][]=[];let row:string[]=[];let cell='';let quoted=false;let closed=false;
 function finishCell(){row.push(cell.trim());cell='';closed=false;}
 function finishRow(){finishCell();if(row.some(Boolean))rows.push(row);row=[];}
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;continue;}
  if(c===delimiter){finishCell();continue;}if(c==='\n'){finishRow();continue;}
  if(closed){if(c===' '||c==='\t')continue;throw new Error('CSV inválido: texto después de cerrar comillas.');}
  if(c==='"'){if(cell.trim())throw new Error('CSV inválido: comillas dentro de un campo.');quoted=true;cell='';}else cell+=c;
 }
 if(quoted)throw new Error('CSV inválido: faltan cerrar comillas.');if(cell||row.length||closed)finishRow();
 return rows;
}
function decimal(value:string){
 if(!/^\d+(?:\.\d{1,2})?$/.test(value))throw new Error('Los números deben ser positivos o cero, sin $ ni separadores de miles y con punto decimal.');
 return Number(value);
}
export function parseBusinessCsv(kind:'daily',source:string):Daily[];
export function parseBusinessCsv(kind:'products',source:string):Product[];
export function parseBusinessCsv(kind:'daily'|'products',source:string):Daily[]|Product[]{
 const [header,...rows]=csvRows(source);const keys=(kind==='daily'?dailyHeader:productHeader).split(',');
 if(!header||header.join(',')!==keys.join(','))throw new Error('Las columnas no coinciden. Descargá la plantilla y conservá su encabezado.');
 if(!rows.length)throw new Error('Agregá al menos una fila de información.');
 if(rows.length>(kind==='daily'?3660:2000))throw new Error('Se superó el máximo de filas permitido.');
 const ids=new Set<string>();
 return rows.map((cells,index)=>{
  try{
   if(cells.length!==keys.length)throw new Error(`Se esperaban ${keys.length} columnas.`);
   const value=Object.fromEntries(keys.map((k,i)=>[k,kind==='daily'?(i===0?cells[i]:decimal(cells[i])):(i<2?cells[i]:decimal(cells[i]))]));
   const parsed=kind==='daily'?dailySchema.safeParse(value):productSchema.safeParse(value);
   if(!parsed.success)throw new Error(parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '));
   const id=String(kind==='daily'?(parsed.data as Daily).fecha:(parsed.data as Product).sku);
   if(ids.has(id))throw new Error(`Hay un ${kind==='daily'?'día':'SKU'} duplicado: ${id}.`);ids.add(id);
   return parsed.data;
  }catch(error){throw new Error(`Fila ${index+2}: ${error instanceof Error?error.message:'Valor inválido'}`);}
 }) as Daily[]|Product[];
}
export function businessTotals(rows:BusinessData['daily']){
 const sum=(key:keyof Omit<Daily,'fecha'>)=>rows.reduce((n,r)=>n+r[key],0);
 const revenue=sum('ventas_netas'),costs=sum('costos_variables'),spend=sum('pauta_meta'),orders=sum('pedidos');
 return {revenue,costs,spend,orders,contribution:revenue-costs,margin:revenue>0?(revenue-costs)/revenue:null,roas:spend>0?sum('ventas_atribuidas_meta')/spend:null};
}
