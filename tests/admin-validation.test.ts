import test from 'node:test';
import assert from 'node:assert/strict';
import { listingSchema } from '../lib/admin-validation';
import { parseBasket } from '../lib/basket';

const valid={slug:'a-new-residence',title:'A New Residence',category:'Houses',description:'An illustrative home with landscaped gardens.',caption:'Space for something new.',price:1000,value:125000000,capacity:10000,max:20,imageUrl:'/images/residence.jpg',imageAlt:'A modern home and its landscaped garden',status:'DRAFT'};
test('rejects invalid money, capacity and per-person limits',()=>{
  for(const change of [{price:-1},{price:1.2},{value:2147483648},{capacity:0},{max:10001},{slug:'../admin'},{status:'LIVE'}]) assert.equal(listingSchema.safeParse({...valid,...change}).success,false);
});
test('only accepts supplied local photos or credential-free HTTPS addresses',()=>{
  for(const imageUrl of ['http://example.com/photo.jpg','javascript:alert(1)','/api/admin/setup','https://user:password@example.com/photo.jpg']) assert.equal(listingSchema.safeParse({...valid,imageUrl}).success,false);
  assert.equal(listingSchema.safeParse({...valid,imageUrl:'https://example.com/house.jpg'}).success,true);
});
test('basket accepts new database listings and respects their current limits',()=>{
 assert.deepEqual(parseBasket(JSON.stringify([{slug:'custom-prize',quantity:10},{slug:'archived-prize',quantity:2}]),[{slug:'custom-prize',max:3}]),[{slug:'custom-prize',quantity:3}]);
});