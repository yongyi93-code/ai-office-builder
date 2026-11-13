// Lightweight, original neighborhood and activity props. No external asset fetches.
export function buildNeighborhood(T:any,scene:any,h:any,roles:any[]){
 const {box,ball,cyl,text,sofa,plant}=h,g=new T.Group();scene.add(g);
 box(g,5,-.22,15,49,.2,9,'#343c46');box(g,5,-.1,11.5,49,.12,1.4,'#c7c9bd');
 for(let x=-17;x<31;x+=3)box(g,x,-.1,15,1.3,.025,.1,'#f2d78b');
 for(const x of [-17,-1,17,33]){cyl(g,x,1.8,11.8,.065,3.6,'#445363');ball(g,x,3.65,11.8,.2,'#fff2bd');const l=new T.PointLight('#ffe8b0',9,12);l.position.set(x,3.5,11.8);g.add(l);}
 const homes=roles.map((r,i)=>{const x=-12+i*8;box(g,x,-.03,23,7.5,.25,9,'#bfb5a2');box(g,x,1.3,27.4,7.5,2.6,.15,'#575267');box(g,x-3.7,1.1,23,.15,2.2,8.8,'#8c8990');box(g,x+3.7,1.1,23,.15,2.2,8.8,'#8c8990');
  for(const dx of [-2.7,2.7])box(g,x+dx,.8,18.55,2,.1,2,'#a9b8a1');plant(g,x-2.8,18);text(g,r.label+'的家',x,3,24.5,4.8);
  box(g,x-1.8,.35,25.1,2.2,.65,3.6,'#8f735d');box(g,x-1.8,.76,25,2.25,.2,3.3,r.color);box(g,x-1.8,.93,23.8,1.8,.2,.55,'#f1ece2');
  sofa(g,x-1,21.4,'#8e9b91',2.8);box(g,x-1,.65,19.9,2,.12,.8,'#b9a383');box(g,x+1.8,1.3,19.3,1.4,.85,.08,'#4e6376');box(g,x+1.8,.65,19.3,1.8,.5,.6,'#9f876c');
  box(g,x+1.8,.5,22,2.6,1,1,'#c1ae8d');box(g,x+1.8,1.07,22,2.7,.1,1.1,'#ece4d1');cyl(g,x+1.8,1.21,22,.22,.12,'#45545e');
  box(g,x+2.1,.08,25.2,2.5,.12,2.8,'#adcbd1');const screen=new T.Mesh(new T.BoxGeometry(.06,2.25,2.8),new T.MeshStandardMaterial({color:'#b6d4d7',transparent:true,opacity:.55,roughness:.7}));screen.position.set(x+.7,1.18,25.2);g.add(screen);cyl(g,x+2.8,1.3,26.3,.035,2.5,'#a3b9c2');box(g,x+2.45,2.53,26.3,.7,.07,.4,'#a3b9c2');
  return {x,door:[x,0,18],sleep:[x-1.8,.93,26.4],shower:[x+2.1,0,25.2],kitchen:[x+1.8,0,21],living:[x-1,0,20.9]};
 });
 box(g,25,-.05,0,13,.25,16,'#b1b8b6');box(g,25,1.7,-7.9,13,3.4,.18,'#3c465a');text(g,'LIFE WALK · 生活商城',25,4,-6,8);
 for(let i=0;i<3;i++){const x=21+i*4;box(g,x,1.1,-5.5,3.4,2.2,3.5,['#a37a82','#738e9b','#9b9768'][i]);text(g,['面包书店','运动用品','生活咖啡'][i],x,2.8,-3.5,3.2);box(g,x,.72,-2.8,2.8,.12,.8,'#c7b38d');for(let j=0;j<5;j++)box(g,x-1+j*.5,1.05,-2.8,.25,.5,.35,['#e4b783','#87a9bb','#c5aecc'][j%3]);}
 for(const z of [1,4]){sofa(g,22,z,'#708595',2.5);cyl(g,26,.65,z,.8,.12,'#c4a27c');for(const x of [25,27])cyl(g,x,.4,z,.28,.6,'#778b85');}plant(g,30,6);plant(g,19,6);
 text(g,'步行回家 · 工作与生活',3,1.2,16.3,7);
 return {group:g,homes};
}
export function makeLifeProps(T:any,h:any,actor:any){
 const {box,cyl,ball}=h,g=actor.group,book=new T.Group();g.add(book);box(book,-.12,0,0,.24,.035,.32,'#d2ad6e');box(book,.12,0,0,.24,.035,.32,'#d2ad6e');box(book,-.12,.024,0,.22,.012,.3,'#f4eed9');box(book,.12,.024,0,.22,.012,.3,'#f4eed9');const page=new T.Group();book.add(page);box(page,.115,.04,0,.23,.008,.29,'#fff8e7');book.visible=false;
 const bag=new T.Group();g.add(bag);box(bag,0,0,0,.3,.4,.15,'#be9b67');for(const x of [-.09,.09])cyl(bag,x,.25,0,.012,.2,'#c9b69b');bag.visible=false;
 const drops=new T.Group();g.add(drops);const droplets=[];for(let n=0;n<24;n++)droplets.push(ball(drops,(n%5-2)*.1,2-n*.06,((n*7)%5-2)*.1,.015,'#b7e0ed'));drops.visible=false;
 const pen=cyl(g,-.12,1.08,.45,.012,.2,'#384964');pen.visible=false;
 const watering=new T.Group();g.add(watering);watering.position.set(.17,1.03,.4);cyl(watering,0,0,0,.12,.2,'#82a99c');const spout=cyl(watering,0,.02,.2,.025,.35,'#82a99c');spout.rotation.x=Math.PI/2;watering.visible=false;
 const spray=new T.Group();g.add(spray);spray.position.set(.17,1.02,.78);for(let n=0;n<10;n++)ball(spray,(n%3-1)*.025,-n*.05,0,.009,'#b7dfec');spray.visible=false;
 const weights=[-1,1].map(sign=>{const w=new T.Group();g.add(w);box(w,0,0,0,.3,.045,.045,'#b5c7ca');for(const x of [-.15,.15]){const plate=cyl(w,x,0,0,.09,.08,'#405462');plate.rotation.z=Math.PI/2;}return w;});return {book,page,bag,drops,droplets,pen,watering,spray,weights};
}
