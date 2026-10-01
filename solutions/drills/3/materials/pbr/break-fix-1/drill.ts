import { MeshStandardMaterial } from 'three';
export function productFinish(kind:'steel'|'coat'|'rubber'):MeshStandardMaterial {
 if(kind==='steel') return new MeshStandardMaterial({color:'#aaaaaa',metalness:1,roughness:.2});
 if(kind==='coat') return new MeshStandardMaterial({color:'#c23522',metalness:0,roughness:.4});
 return new MeshStandardMaterial({color:'#222222',metalness:0,roughness:.9});
}
