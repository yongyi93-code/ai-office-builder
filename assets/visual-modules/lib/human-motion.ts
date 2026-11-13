// Pose scanned skeletons towards local-space targets; props follow the hands.
export function captureRig(real:any){const bones:any={};real.traverse((b:any)=>{if(b.isBone){const m=b.name.match(/_(upperarm|lowerarm|hand|upperleg|lowerleg|foot)_(l|r)$/i);if(m)bones[m[1].toLowerCase()+'_'+m[2].toLowerCase()]=b;if(/_head$/i.test(b.name))bones.head=b;if(/_neck$/i.test(b.name))bones.neck=b;if(/_spine_03$/i.test(b.name))bones.chest=b;b.userData.lifeRest=b.quaternion.clone();b.userData.lifeRestPosition=b.position.clone();}});return bones;}
export function poseHuman(T:any,a:any,phase:number,working:boolean,walking:boolean,t:number,reduce:boolean,seatedOverride?:boolean){
 const wave=reduce?0:Math.sin(t*3+a.index),fast=reduce?0:Math.sin(t*11),rig=a.rig;
 const seated=!walking&&(seatedOverride??([0,3,4,7,15,16,17].includes(phase)||phase===9)),sport=!walking&&phase===1;
 if(a.real&&rig&&(!a.lastPoseAt||t-a.lastPoseAt>.075||a.posePhase!==phase||a.poseWalking!==walking)){a.lastPoseAt=t;a.posePhase=phase;a.poseWalking=walking;a.real.position.y=a.realBaseY-(seated?.28:0);
  if(!walking){a.real.traverse((b:any)=>{if(b.isBone&&b.userData.lifeRest){b.quaternion.copy(b.userData.lifeRest);b.position.copy(b.userData.lifeRestPosition);}});a.real.position.y=a.realBaseY-(seated?.28:0);}
  const point=(p:number[])=>a.group.localToWorld(new T.Vector3(...p));
  const aim=(bone:any,child:any,p:number[])=>{if(!bone||!child)return;a.group.updateMatrixWorld(true);const origin=bone.getWorldPosition(new T.Vector3()),direction=child.getWorldPosition(new T.Vector3()).sub(origin).normalize(),desired=point(p).sub(origin).normalize();const delta=new T.Quaternion().setFromUnitVectors(direction,desired),world=bone.getWorldQuaternion(new T.Quaternion()).premultiply(delta),parent=bone.parent.getWorldQuaternion(new T.Quaternion()).invert();bone.quaternion.copy(parent.multiply(world));};
  const limb=(part:string,side:string,knee:number[],end:number[])=>{const root=rig[part+'_'+side],mid=rig[(part==='upperarm'?'lowerarm':'lowerleg')+'_'+side],tip=rig[(part==='upperarm'?'hand':'foot')+'_'+side];if(!root||!mid||!tip)return;a.group.updateMatrixWorld(true);const origin=root.getWorldPosition(new T.Vector3()),middle=mid.getWorldPosition(new T.Vector3()),last=tip.getWorldPosition(new T.Vector3()),l1=origin.distanceTo(middle),l2=middle.distanceTo(last);const direction=point(end).sub(origin),distance=Math.max(.001,Math.min(direction.length(),l1+l2-.001));direction.normalize();const along=(l1*l1-l2*l2+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,l1*l1-along*along)),pole=point(knee).sub(origin);pole.addScaledVector(direction,-pole.dot(direction)).normalize();const joint=origin.clone().addScaledVector(direction,along).addScaledVector(pole,height);aim(root,mid,a.group.worldToLocal(joint).toArray());aim(mid,tip,end);};
  if(!walking){for(const [side,sign] of [['l',1],['r',-1]] as const){
   let elbow=[sign*.3,1.1,.14],hand=[sign*.2,.84,.12];
   if(seated){elbow=[sign*.31,.94,.22];hand=[sign*.18,1.1+(working?fast*.012:wave*.008),working?.7:.42];}
   if(sport){elbow=[sign*.35,side==='r'?1.7+wave*.14:1.2,.12];hand=side==='r'?[.3+wave*.2,1.95+wave*.23,.4]:[-.3,1.4,.22];}
   if(phase===19){elbow=[sign*.25,1.13+wave*.08,.1];hand=[sign*.18,1.1+wave*sign*.12,.32];}
   if(phase===20){elbow=[sign*.3,1.1,.12];hand=[sign*.25,1.05+(wave+1)*.18,.35];}
   if(phase===2){elbow=[sign*.3,1.1,.2];hand=[sign*.15,1.15+wave*.035,.4];}
   if(phase===11){elbow=[sign*.35,1.5,.12];hand=[sign*.15,1.8+wave*.08,.1];}
   if(phase===14){elbow=[sign*.35,1.5+wave*.1,.1];hand=[sign*.4,1.9+wave*.1,.1];}
   if(phase===15){elbow=[sign*.3,1.05,.2];hand=[sign*.22,1.15+wave*.06,.4];}
   if(phase===16&&side==='r'){elbow=[-.28,1.1,.2];hand=[-.12,1.24+(wave+1)*.13,.26];}
   if(phase===17&&side==='r'){hand=[-.12+wave*.025,1.1,.43];}
   if(phase===18){elbow=[sign*.3,1.1,.2];hand=[sign*.16,1.09,.45];}
   if(phase===8){elbow=[sign*.32,1.1,.15];hand=[sign*.18,1.25+wave*.08,.38];}
   if(phase===6){elbow=[sign*.45,1.4+wave*.25,.12];hand=[sign*.65,1.7+wave*.25,.2];}
   limb('upperarm',side,elbow,hand);if(seated){const wrist=rig['hand_'+side],finger=wrist?.children.find((b:any)=>b.isBone&&/middle|index/i.test(b.name));if(finger)aim(wrist,finger,[sign*.18,1.08,working?.9:.65]);}
   if(phase===19){limb('upperleg',side,[sign*.13,.55,.22+wave*sign*.13],[sign*.13,.08+Math.max(0,wave*sign)*.18,wave*sign*.28]);}
   if(seated){limb('upperleg',side,[sign*.13,.48,.36],[sign*.13,.12,.38]);const foot=rig['foot_'+side],toe=foot?.children.find((b:any)=>b.isBone&&/foot_end|toe/i.test(b.name));if(toe)aim(foot,toe,[sign*.13,.12,.62]);}
  }}
  if(!walking&&!reduce){if(rig.chest)rig.chest.rotateX(Math.sin(t*1.9+a.index)*.012);if(rig.neck){rig.neck.rotateY(Math.sin(t*.55+a.index)*.065);rig.neck.rotateX(phase===7?.14:working?.06:0);}}
 }
 if(a.accessory){const head=rig?.head;if(head){a.group.updateMatrixWorld(true);a.accessory.position.copy(a.group.worldToLocal(head.getWorldPosition(new T.Vector3())));a.accessory.quaternion.identity();}else a.accessory.position.set(0,1.64,0);}
 const props=a.life;if(!props)return;props.weights?.forEach((w:any,i:number)=>{w.visible=!walking&&phase===20;w.position.set((i?1:-1)*.25,1.05+(wave+1)*.18,.35);});props.book.visible=!walking&&[7,17].includes(phase);props.book.position.set(0,1.02,.43);props.page.rotation.z=reduce||phase===17?0:Math.max(0,Math.sin(t*.7+a.index))*Math.PI;
 props.pen.visible=!walking&&phase===17;props.pen.position.set(-.12+wave*.025,1.08,.45);props.pen.rotation.z=.45+wave*.1;
 props.watering.visible=!walking&&phase===18;props.watering.rotation.x=-.25+wave*.12;props.spray.visible=!walking&&phase===18;props.spray.children.forEach((d:any,n:number)=>d.position.y=-((t*.8+n*.06)% .6));
 props.bag.visible=phase===10;props.bag.position.set(.3,.76,.06);props.bag.rotation.z=walking?wave*.12:0;
 props.drops.visible=!walking&&phase===11;props.droplets.forEach((d:any,n:number)=>{d.position.y=2.2-((t*.9+n*.081)%1.7);});
 a.racket.visible=sport;a.controller.visible=!walking&&phase===0;a.controller.position.set(0,1.02,.43);a.cup.visible=!walking&&[2,16].includes(phase);a.cup.position.set(phase===16?-.12:.2,phase===16?1.24+(wave+1)*.13:1.12,phase===16?.3:.4);
 if(sport){const hand=rig?.hand_r;if(hand){a.group.updateMatrixWorld(true);a.racket.position.copy(a.group.worldToLocal(hand.getWorldPosition(new T.Vector3())));a.racket.rotation.set(0,0,wave*.7);}else{a.racket.position.set(.35,1.8,.2);a.racket.rotation.z=wave*.8;}}
 if(!a.real){a.legs.forEach((leg:any,i:number)=>{leg.rotation.x=walking||phase===19?Math.sin(t*8+i*Math.PI)*.42:seated?-1.3:phase===6?wave*.3:0;leg.userData.knee.rotation.x=seated?1.4:walking?Math.max(0,Math.sin(t*8+i*Math.PI))*.48:0;});a.arms.forEach((arm:any,i:number)=>{arm.rotation.x=walking?Math.sin(t*8+i*Math.PI)*.4:phase===20?-1.3-wave*.4:phase===19?-1+Math.sin(t*8+i*Math.PI)*.3:sport?-2+wave*.8:seated?-1.2:phase===11?-2.6+wave*.2:phase===2?-1.1+wave*.1:0;arm.userData.elbow.rotation.x=seated?-.8:-.15;});}
}
