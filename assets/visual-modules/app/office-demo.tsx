'use client';
import {useEffect,useState} from 'react';
import Office3D from './office-3d';
import {teamRoles} from '../lib/team.mjs';
import {advanceLife} from '../lib/leisure.mjs';
export default function OfficeDemo(){
 const [selected,setSelected]=useState(''),[plans,setPlans]=useState<any[]>([]);
 useEffect(()=>{const sync=()=>setPlans(prior=>teamRoles.map((r,index)=>advanceLife(prior.find(p=>p.role===r.name),{role:r.name,index,now:Date.now(),working:false})));sync();const timer=setInterval(sync,60000);return()=>clearInterval(timer)},[]);
 return <section className="ai-office-demo"><p role="status">演示模式：仅展示人物与模拟生活，未连接真实AI任务、邮件、数据库或云端调度。</p><Office3D roles={teamRoles} selected={selected} onSelect={setSelected} lifePlans={plans} roleState={()=>({state:'idle',summary:'执行器未连接'})}/></section>;
}
