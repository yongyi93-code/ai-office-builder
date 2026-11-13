import test from 'node:test';
import assert from 'node:assert/strict';
import {profiles,seatFor} from '../lib/people.mjs';
import {officeActivity} from '../lib/routine.mjs';
test('six named looks include three men and three women with distinct clothing',()=>{assert.equal(new Set(profiles.map(p=>p.name)).size,6);assert.equal(profiles.filter(p=>p.gender==='男').length,3);assert.equal(profiles.filter(p=>p.gender==='女').length,3);assert.equal(new Set(profiles.map(p=>p.shirt)).size,6);});
test('every shared seated room reserves six separate human-sized spaces',()=>{for(const phase of [0,2,3,4,7,8]){const seats=profiles.map((_,i)=>seatFor(phase,i));for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)assert.ok(Math.hypot(seats[i][0]-seats[j][0],seats[i][2]-seats[j][2])>=1.1,'overlapping seats for phase '+phase);}});
test('idle staff stagger activities, then real work immediately wins',()=>{const time=new Date('2026-11-05T10:05:00+08:00').getTime();assert.ok(new Set(profiles.map((_,i)=>officeActivity('idle',i,time).phase)).size>=3);for(let i=0;i<6;i++)assert.equal(officeActivity('running',i,time).phase,9);assert.notEqual(officeActivity('idle',0,time).phase,officeActivity('idle',0,time+300000).phase);});
