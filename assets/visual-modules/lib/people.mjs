import {interiorPosition} from './floor-layout.mjs';
export const profiles=[
 {name:'Alex',gender:'男',shirt:'#478f7c',height:1.9,width:1,accessory:'glasses'},
 {name:'Chloe',gender:'女',shirt:'#789bd7',height:1.8,width:.97,accessory:'headband'},
 {name:'Marcus',gender:'男',shirt:'#c68b53',height:1.96,width:1.05,accessory:'cap'},
 {name:'Emma',gender:'女',shirt:'#cb839d',height:1.86,width:1.03,accessory:'headphones'},
 {name:'Leo',gender:'男',shirt:'#438ea9',height:1.92,width:1.01,accessory:'visor'},
 {name:'Victoria',gender:'女',shirt:'#ad8752',height:1.82,width:.99,accessory:'earrings'}
];
export function seatFor(phase,index){
 const seats={
  0:[[4.6,5.4,-4.7],[6.2,5.4,-4.7],[7.8,5.4,-4.7],[9.4,5.4,-4.7],[4.6,5.4,-2.8],[6.2,5.4,-2.8]],
  2:[[5.8,0,4.1],[8,0,4.1],[5.8,0,6.4],[8,0,6.4],[10.2,0,4.1],[10.2,0,6.4]],
  3:[[-10,0,5.7],[-8.2,0,5.7],[-6.4,0,5.7],[-4.6,0,5.7],[-10,0,3.8],[-8.2,0,3.8]],
  4:[[-10.2,5.4,-4.9],[-8,5.4,-4.9],[-5.8,5.4,-4.9],[-10.2,5.4,-2.4],[-8,5.4,-2.4],[-5.8,5.4,-2.4]],
  7:[[-2.1,0,3.9],[-.7,0,3.9],[.7,0,3.9],[2.1,0,3.9],[-.7,0,5.7],[.7,0,5.7]],
  8:[[6,0,-4.3],[7.5,0,-4.3],[9,0,-4.3],[10.5,0,-4.3],[6,0,-2.6],[7.5,0,-2.6]]
 };const seat=seats[phase]?.[index];return seat?interiorPosition(seat):null;
}
