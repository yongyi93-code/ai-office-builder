// Visual leisure only. These coordinates never represent business execution.
export function gymStation(index){return {position:[-21+(index%3)*3,0,index<3?-4.7:1],phase:index<3?19:20};}
export function petPose(index,t,reduced=false){
 const cycle=t+index*9,rest=Math.floor(cycle/18)%3===2,a=rest||reduced?0:cycle*.28;
 return {x:index?2.4+Math.cos(a)*.6:-.5+Math.cos(a)*1.4,z:index?1+Math.sin(a):Math.sin(a),angle:rest?0:-a,stride:rest||reduced?0:Math.sin(t*9+index),rest};
}
