import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GET,POST} from '../app/api/informacion/route';
test('private information API rejects missing and malformed authentication without revealing data',async()=>{
 for(const authorization of [undefined,'Basic nope','bearer nope']){
  const headers=authorization?{authorization}:undefined;
  for(const handler of [GET,POST]){
   const response=await handler(new Request('https://example.test/api/informacion',{headers}));
   assert.equal(response.status,401);assert.match(response.headers.get('cache-control')||'',/no-store/);
   const body=await response.json();assert.equal('snapshot' in body,false);
  }
 }
});
