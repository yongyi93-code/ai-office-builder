// A bounded visual decision model, not consciousness or actual business work.
export const candidates=[
 {id:'gym',phase:19,label:'去健身房运动',energy:-.45,min:5,max:12,office:true},
 {id:'rest',phase:3,label:'坐下来放松',energy:.4,min:5,max:12},
 {id:'read',phase:7,label:'找本书看看',energy:.12,min:5,max:13},
 {id:'coffee',phase:16,label:'喝杯咖啡',energy:.2,min:3,max:7},
 {id:'game',phase:0,label:'玩一会儿游戏',energy:.02,min:5,max:12},
 {id:'film',phase:4,label:'看一会儿电影',energy:.12,min:7,max:16},
 {id:'badminton',phase:1,label:'去练羽毛球',energy:-.5,min:5,max:10,office:true},
 {id:'swim',phase:6,label:'去游一会儿泳',energy:-.5,min:5,max:10,office:true},
 {id:'walk',phase:13,label:'出去散散步',energy:-.08,min:3,max:7,outside:true},
 {id:'stretch',phase:14,label:'站起来伸展一下',energy:.05,min:2,max:4},
 {id:'chat',phase:15,label:'换个地方放空片刻',energy:.2,min:3,max:7},
 {id:'journal',phase:17,label:'随手写点东西',energy:.12,min:4,max:9},
 {id:'garden',phase:18,label:'照料一下绿植',energy:-.05,min:3,max:6,office:true},
 {id:'browse',phase:10,label:'去商城逛逛',energy:-.15,min:8,max:18,mall:true},
 {id:'cook',phase:2,label:'准备点吃的',energy:.08,min:5,max:12},
 {id:'shower',phase:11,label:'回家冲个澡',energy:.1,min:4,max:8,home:true},
 {id:'nap',phase:5,label:'回家小睡片刻',energy:.8,min:10,max:18,home:true},
 {id:'studio',phase:8,label:'试试录制表达',energy:-.03,min:4,max:8,office:true}
];
const preferences=[['read','garden','journal'],['coffee','walk','chat'],['badminton','browse','stretch'],['journal','film','read'],['read','studio','journal'],['walk','read','coffee']];
const bound=v=>Math.max(0,Math.min(100,Number(v)||0));
function random(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0)/4294967296;}
export function advanceLife(prior,{role,index,now,working}){
 const valid=prior&&prior.role===role&&Number.isFinite(prior.updatedAt);
 const p=valid?structuredClone(prior):{version:1,role,energy:60+index*7,hunger:35,social:30+index*8,recent:[],sequence:0,updatedAt:now};
 const elapsed=Math.max(0,Math.min(180,(now-p.updatedAt)/60000));const previous=p.activity?.id;const rate=previous==='work'?-.55:previous==='sleep'?.8:candidates.find(c=>c.id===previous)?.energy||0;
 p.energy=bound(p.energy+elapsed*rate);p.hunger=bound(p.hunger+elapsed*.13);p.social=bound(p.social+elapsed*.08);p.updatedAt=now;
 if(working){p.activity={id:'work',phase:9,atDesk:true,area:'office',label:'工作中',reason:'真实任务正在执行，休闲计划让位。',startedAt:p.activity?.id==='work'?p.activity.startedAt:now,until:now+60000};return p;}
 const d=new Date(now+8*3600000),hour=d.getUTCHours(),weekend=[0,6].includes(d.getUTCDay());
 if(hour>=23||hour<7){p.activity={id:'sleep',phase:5,atDesk:false,area:'home',label:'在家睡觉',reason:'到了夜间休息时段，有真实任务仍会优先响应。',startedAt:previous==='sleep'?p.activity.startedAt:now,until:now+60000};return p;}
 if(p.activity&&previous!=='work'&&previous!=='sleep'&&p.activity.until>now)return p;
 let options=candidates.filter(c=>c.id!==previous&&(!c.mall||((weekend||hour>=17)&&hour>=10&&hour<22))&&(!c.home||hour>=18||p.energy<25)&&(!c.office||hour>=8&&hour<22));
 if(p.energy<20)options=options.filter(c=>['rest','nap','read','coffee'].includes(c.id));
 const weights=options.map(c=>{let w=1+(preferences[index]?.includes(c.id)?2.3:0);const area=c.mall?'mall':c.outside?'outside':c.home||(!c.office&&hour>=18)?'home':'office';if(p.activity?.area&&p.activity.area!==area)w*=.75;if((p.recent||[]).includes(c.id))w*=.23;if(p.energy<45&&c.energy>0)w*=2;if(c.energy<-.2&&p.energy<45)w*=.15;if(c.id==='cook')w*=p.hunger>60?5:.35;if(c.id==='chat'&&p.social>60)w*=2;if(c.id==='nap')w*=p.energy<35?4:.15;if(c.id==='shower')w*=hour>=19?2:.1;return w;});
 let roll=random(role+':'+now+':'+p.sequence)*weights.reduce((a,b)=>a+b,0),chosen=options[0];for(let n=0;n<options.length;n++){roll-=weights[n];if(roll<=0){chosen=options[n];break;}}
 const home=chosen.home||(!chosen.office&&!chosen.mall&&!chosen.outside&&hour>=18);
 const reason=p.energy<25?'精力有点低，先挑一项能恢复状态的活动。':previous==='work'?'刚忙完，换个环境松一口气。':preferences[index]?.includes(chosen.id)?'这是偏好的活动，最近也没有一直重复。':p.hunger>60&&chosen.id==='cook'?'有些饿了，先准备点吃的。':'想换换节奏，试试和刚才不同的活动。';
 const duration=(chosen.min+random(role+':duration:'+now)*(chosen.max-chosen.min))*60000;
 p.sequence=(p.sequence||0)+1;p.recent=[chosen.id,...(p.recent||[])].slice(0,5);if(chosen.id==='cook')p.hunger=bound(p.hunger-45);if(chosen.id==='chat')p.social=bound(p.social-25);
 p.activity={id:chosen.id,phase:chosen.phase,atDesk:false,area:chosen.mall?'mall':chosen.outside?'outside':home?'home':'office',label:chosen.label,reason,startedAt:now,until:now+duration};return p;
}
