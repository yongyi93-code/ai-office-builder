import {gymStation,petPose} from './office-amenities.mjs';
export function buildAmenities(T:any,lower:any,upper:any,h:any){
 const {box,ball,cyl,text,plant}=h;
 box(upper,-18,-.17,-2.1,11,.34,11,'#a2a6a1');box(upper,-12.25,-.17,-2,1.5,.34,2,'#a2a6a1');
 box(upper,-18,.02,-2,10.5,.04,10.4,'#26323a');box(upper,-18,1.7,-7.5,11,3.4,.12,'#344b53');
 const mirror=new T.Mesh(new T.BoxGeometry(9,2,.04),new T.MeshStandardMaterial({color:'#b5cdd0',metalness:.85,roughness:.18}));mirror.position.set(-18,1.65,-7.4);upper.add(mirror);
 text(upper,'TEAM FIT · 健身房',-18,3.4,-6.8,7);plant(upper,-23,2.5);
 const belts:any[]=[];
 for(let i=0;i<3;i++){const x=-21+i*3;box(upper,x,.11,-4.7,1.65,.2,2.7,'#171f29');box(upper,x,.23,-4.7,1.3,.06,2.45,'#3c4b53');
  for(const dx of [-.72,.72]){cyl(upper,x+dx,.75,-5.7,.045,1.4,'#829b9c');box(upper,x+dx,1.45,-5.1,.07,.07,1.3,'#829b9c');}
  box(upper,x,1.5,-5.65,1.4,.12,.4,'#242c39');box(upper,x,1.65,-5.63,.6,.25,.08,'#77d6c4');
  const stripes=new T.Group();upper.add(stripes);for(let j=0;j<7;j++)box(stripes,x,.269,-5.7+j*.3,1.15,.007,.025,'#66777b');belts.push(stripes);
  box(upper,x,.03,1,1.9,.05,2.5,['#709d9c','#9c81a5','#a48f66'][i]);
 }
 box(upper,-18,.65,2.9,8,.1,.7,'#899b9b');for(const x of [-21,-18,-15]){for(const dx of [-.25,.25])cyl(upper,x+dx,.85,2.9,.16,.28,'#35424f').rotation.z=Math.PI/2;box(upper,x,.85,2.9,.6,.05,.05,'#b8c4c6');}
 text(upper,'跑步 · 力量 · 拉伸',-18,2.3,2.9,5);
 const pets=[0,1].map(i=>{const g=new T.Group();lower.add(g);const color=i?'#dbac72':'#e7dcc8',body=ball(g,0,.35,0,i?.25:.3,color);body.scale.set(.8,.85,1.65);ball(g,0,.55,.4,.22,color);ball(g,0,.48,.58,.13,i?'#e8d0ad':'#9d8062');ball(g,0,.51,.68,.05,'#272e32');for(const x of [-.1,.1]){ball(g,x,.62,.56,.025,'#273f45');const ear=i?new T.Mesh(new T.ConeGeometry(.09,.22,3),new T.MeshStandardMaterial({color})):ball(g,x*1.9,.5,.37,.11,'#9d8062');if(i){ear.position.set(x,.79,.4);g.add(ear);}else ear.scale.set(.7,1.8,.7);}
  const legs=[[-.15,-.23],[.15,-.23],[-.15,.23],[.15,.23]].map(([x,z])=>cyl(g,x,.14,z,.045,.28,color));
  const tail=new T.Group();g.add(tail);tail.position.set(0,.42,-.38);const shaft=cyl(tail,0,.12,-.13,.035,.4,color);shaft.rotation.x=-.8;
  const collar=cyl(g,0,.43,.3,.17,.07,i?'#cf8c9b':'#6fa7a0');collar.rotation.x=Math.PI/2;text(lower,i?'豆豆 · 办公室猫':'小麦 · 办公室狗',i?2.4:-.5,1.4,i?1:0,2.2);
  return {g,legs,tail};});
 box(lower,2.9,.04,2.7,1.4,.08,1.1,'#b18c87');cyl(lower,2.7,.1,2.1,.15,.12,'#adc7cf');cyl(lower,3.15,.1,2.1,.15,.12,'#dbbf8c');
 return {update(t:number,reduced:boolean,occupied:Set<number>){belts.forEach((b,i)=>b.position.z=occupied.has(i)&&!reduced?(t*.8)% .3:0);pets.forEach((p,i)=>{const a=petPose(i,t,reduced);p.g.position.set(a.x,a.rest?.02:Math.abs(a.stride)*.015,a.z);p.g.rotation.set(a.rest?-.12:0,a.angle,0);p.g.scale.y=a.rest?.7:1;p.legs.forEach((l:any,j:number)=>l.rotation.x=a.stride*(j%2?-.35:.35));p.tail.rotation.z=reduced?0:Math.sin(t*5+i)*.4;});}};
}
