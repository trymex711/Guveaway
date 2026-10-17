import assert from 'node:assert/strict';
import test from 'node:test';
import {parseBasket} from '../lib/basket';
test('rejects malformed, unknown, and invalid basket entries',()=>{for(const raw of [null,'{','null','{}','[{"slug":"missing","quantity":2}]','[{"slug":"the-modern-residence","quantity":-1}]','[{"slug":"the-modern-residence","quantity":1.5}]']) assert.deepEqual(parseBasket(raw),[]);});
test('merges duplicate entries and caps at prize limit',()=>{assert.deepEqual(parseBasket(JSON.stringify([{slug:'the-modern-residence',quantity:15},{slug:'the-modern-residence',quantity:15}])),[{slug:'the-modern-residence',quantity:20}]);});
test('preserves valid selections',()=>{const items=[{slug:'the-modern-residence',quantity:3}];assert.deepEqual(parseBasket(JSON.stringify(items)),items);});