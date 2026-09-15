import {test} from 'node:test';
import assert from 'node:assert/strict';
import {businessSchema,emptyBusiness} from '../schemas/business';
import {businessTotals,parseBusinessCsv,templates,dailyHeader,productHeader} from '../services/business-import';
test('daily CSV validates every row and totals do not add attributed sales to revenue',()=>{
 const rows=parseBusinessCsv('daily',dailyHeader+'\n2026-09-01,100000,2,60000,10000,50000\n2026-09-02,200000,4,100000,20000,80000');
 assert.deepEqual(businessTotals(rows),{revenue:300000,costs:160000,spend:30000,orders:6,contribution:140000,margin:140000/300000,roas:130000/30000});
});
test('CSV supports BOM, CRLF, quoted delimiters and semicolons',()=>{
 const rows=parseBusinessCsv('products','\uFEFF'+productHeader.replaceAll(',',';')+'\r\nP1;"Circuito; felino";123.45;100;2\r\n');
 assert.equal(rows[0].nombre,'Circuito; felino');assert.equal(rows[0].precio_neto,123.45);
 assert.equal(parseBusinessCsv('products',productHeader+'\nP2,"Mueble, con ""respaldo""",100,50,1')[0].nombre,'Mueble, con "respaldo"');
});
test('invalid dates, duplicate IDs, ambiguous money and partial rows are rejected',()=>{
 for(const source of [dailyHeader+'\n2026-02-30,100,1,10,10,40',templates.daily+'2026-09-01,100,1,10,10,40',dailyHeader+'\n2026-09-01,-100,1,10,10,40',dailyHeader+'\n2026-09-01,Infinity,1,10,10,40',dailyHeader+'\n2026-09-01,100,1.5,10,10,40',dailyHeader+'\n2026-09-01,100,1,10,10',dailyHeader+'\n2026-09-01,"100"oops,1,10,10,40'])assert.throws(()=>parseBusinessCsv('daily',source));
 assert.throws(()=>parseBusinessCsv('products',templates.products+'EJEMPLO-001,Otro,1,1,1'));
});
test('backup schema rejects duplicate dates and unknown fields',()=>{
 const row=parseBusinessCsv('daily',templates.daily)[0];
 assert.equal(businessSchema.safeParse({...emptyBusiness,daily:[row,row]}).success,false);
 assert.equal(businessSchema.safeParse({...emptyBusiness,apiKey:'must not accept'}).success,false);
 assert.equal(businessSchema.safeParse({...emptyBusiness,profile:{...emptyBusiness.profile,description:'Información válida'},daily:[row]}).success,true);
});
test('empty data produces no inferred ratios',()=>{assert.equal(businessTotals([]).roas,null);assert.equal(businessTotals([]).margin,null);});
