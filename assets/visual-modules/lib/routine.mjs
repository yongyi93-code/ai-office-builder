// Scene routine only; real backend tasks always take priority.
export function officeActivity(state,index=0,now=Date.now()){
 if(['blocked','failed','stale'].includes(state))return {atDesk:true,phase:9,area:'office',label:{blocked:'任务受阻 · 等待处理',failed:'执行失败 · 等待处理',stale:'执行失联 · 待核实'}[state]};
 if(state==='running'||state==='queued')return {atDesk:true,phase:9,area:'office',label:state==='running'?'工作中':'等待领取'};
 const d=new Date(now+8*3600000),hour=d.getUTCHours(),minute=d.getUTCMinutes(),weekend=[0,6].includes(d.getUTCDay());
 if(hour>=23||hour<7)return {atDesk:false,phase:5,area:'home',label:'在家睡觉 · 随时可唤醒'};
 if(hour<8)return {atDesk:false,phase:2,area:'home',label:'在家准备早餐'};
 if(hour<9)return {atDesk:false,phase:weekend?7:12,area:weekend?'home':'office',label:weekend?'在家阅读':'步行上班 · 尚无执行任务'};
 if(weekend&&hour>=10&&hour<18)return {atDesk:false,phase:10,area:'mall',label:'周末逛商城'};
 if(!weekend&&hour>=9&&hour<18&&hour!==12){const slot=((Math.floor((hour*60+minute-540)/5)+index*2)%5+5)%5;const phase=[9,7,2,3,8][slot];return {atDesk:phase===9,phase,area:'office',label:{9:'办公待命 · 暂无执行任务',7:'空闲阅读',2:'休息喝水',3:'客厅小休',8:'空闲录制练习'}[phase]||'待命'};}
 if(hour===12){const phase=minute<30?2:[3,7,0,2][(index+Math.floor((minute-30)/10))%4];return {atDesk:false,phase,area:'office',label:minute<30?'午餐':{3:'午休 · 客厅休息',7:'午休 · 阅读',0:'午休 · 游戏',2:'午休 · 喝水'}[phase]||'午间休息'};}
 if(hour===18&&minute<20)return {atDesk:false,phase:12,area:'home',label:'放工步行回家'};
 if(hour===18)return {atDesk:false,phase:index%2?6:1,area:'office',label:index%2?'游泳':'羽毛球'};
 if(hour===19)return {atDesk:false,phase:2,area:'home',label:'在家下厨 · 晚餐'};
 if(hour===21)return {atDesk:false,phase:11,area:'home',label:'在家洗澡'};
 if(hour>=22)return {atDesk:false,phase:7,area:'home',label:'睡前阅读'};
 const phase=[0,4,7,3][(Math.floor(minute/20)+index+hour)%4];return {atDesk:false,phase,area:'home',label:{0:'在家游戏',4:'在家看电影',7:'在家阅读',3:'在家休息'}[phase]||'在家休息'};
}
export function resolveRoleState(name,commands,runs,now=Date.now()){
 const stamp=r=>new Date(r?.updatedAt||r?.finishedAt||r?.startedAt||r?.createdAt||0).getTime()||0;
 const own=commands.filter(c=>c.target===name).sort((a,b)=>stamp(b)-stamp(a));
 let command=own.find(c=>c.status==='running')||own.find(c=>c.status==='queued');
 const latest=new Map();for(const r of runs.filter(r=>r.role===name).sort((a,b)=>stamp(b)-stamp(a))){const key=r.taskId||r.id||'legacy';if(!latest.has(key))latest.set(key,r);}
 const ordered=[...latest.values()].sort((a,b)=>stamp(b)-stamp(a));
 const active=ordered.find(r=>r.state==='running'&&now-new Date(r.heartbeatAt||r.updatedAt||r.startedAt||0).getTime()<=(r.heartbeatAt?120000:1800000));
 const unresolved=ordered.find(r=>r.state==='running'&&r.taskId&&r.heartbeatAt);
 if((active||unresolved)&&command?.status==='queued')command=undefined;
 const run=active||unresolved||ordered[0];
 let r;if(command)r={...command,role:name,taskId:command.id,source:'manual',state:command.status,step:command.providerStatus==='dispatching'?'正在提交 AI 请求':command.step||'正在处理指令',summary:(command.status==='running'?'正在执行你的指令：':'指令已收到，等待领取：')+command.text,updatedAt:command.updatedAt||command.startedAt||command.createdAt};
 else if(!active&&!unresolved&&own[0]&&stamp(own[0])>=stamp(run)){const c=own[0];r={...c,role:name,taskId:c.id,source:'manual',state:c.status,summary:c.result?(c.result.length>240?c.result.slice(0,240)+'…（完整结果见历史指令）':c.result):'任务已结束：'+c.text,updatedAt:c.updatedAt||c.finishedAt||c.createdAt};}
 else r=run;
 const heartbeat=new Date(r?.heartbeatAt||r?.updatedAt||r?.startedAt||0).getTime();
 const stale=r?.state==='running'&&now-heartbeat>(r.heartbeatAt?120000:1800000);
 return {...r,source:r?.source||(r?'scheduled':undefined),state:stale?'stale':r?.state||'idle'};
}
