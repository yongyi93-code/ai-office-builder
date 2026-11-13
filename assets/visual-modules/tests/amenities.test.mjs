import test from 'node:test';
import assert from 'node:assert/strict';
import {gymStation,petPose} from '../lib/office-amenities.mjs';
import {advanceLife,candidates} from '../lib/leisure.mjs';
test('six gym stations are separate, finite, on the ground floor fitness annex',()=>{const stations=Array.from({length:6},(_,i)=>gymStation(i));for(const s of stations){assert.ok(s.position.every(Number.isFinite));assert.equal(s.position[1],0);assert.ok(s.position[0]<-13);}for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)assert.ok(Math.hypot(stations[i].position[0]-stations[j].position[0],stations[i].position[2]-stations[j].position[2])>2);});
test('pets move within their own corridor and reduced motion stops gait',()=>{for(let i=0;i<2;i++)for(let t=0;t<120;t+=.5){const p=petPose(i,t);assert.ok(p.x>=-2.1&&p.x<=3.1);assert.ok(p.z>=-1.1&&p.z<=2.1);assert.ok(Number.isFinite(p.angle));}assert.equal(petPose(0,5,true).stride,0);assert.notDeepEqual(petPose(0,1),petPose(0,5));});
test('fitness is selectable leisure but real work immediately interrupts it',()=>{assert.ok(candidates.some(c=>c.id==='gym'));const now=Date.parse('2026-11-06T14:00:00+08:00');const p=advanceLife({role:'PA',updatedAt:now,activity:{id:'gym',phase:19,until:now+60000},energy:70,hunger:30,social:40,recent:[],sequence:1},{role:'PA',index:3,now,working:true});assert.equal(p.activity.id,'work');});
