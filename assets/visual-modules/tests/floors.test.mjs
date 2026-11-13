import test from 'node:test';
import assert from 'node:assert/strict';
import {workPosition,interiorPosition,defaultOfficeView} from '../lib/floor-layout.mjs';
import {seatFor} from '../lib/people.mjs';
import {gymStation} from '../lib/office-amenities.mjs';
test('all six actual work destinations are upstairs and individually separated',()=>{const positions=Array.from({length:6},(_,i)=>workPosition(i));assert.equal(defaultOfficeView,'upper');assert.equal(new Set(positions.map(p=>p.join(','))).size,6);for(const p of positions)assert.equal(p[1],5.4);});
test('leisure furniture, gym and seat destinations move together to ground floor',()=>{for(const phase of [0,4])for(let i=0;i<6;i++)assert.equal(seatFor(phase,i)[1],0);assert.equal(gymStation(0).position[1],0);assert.deepEqual(interiorPosition([7,5.7,4]),[7,.3,4]);assert.deepEqual(interiorPosition([0,0,4]),[0,5.4,4]);assert.equal(seatFor(7,0)[1],5.4);});
