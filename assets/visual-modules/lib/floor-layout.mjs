export const defaultOfficeView='upper';
export const deskSpots=[[-9,-4],[-4,-4],[-9,.5],[-4,.5],[-18,-5],[-18,.5]];
export function workPosition(index){const [x,z]=deskSpots[index];return [x,5.4,z+1];}
// Convert legacy interior coordinates after exchanging office and leisure floors.
// Outdoor homes/mall coordinates must never pass through this mapping.
export function interiorPosition(position){const [x,y,z]=position;return [x,Math.round((y>=5.4?y-5.4:y+5.4)*1000)/1000,z];}
