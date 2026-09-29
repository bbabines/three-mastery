import * as THREE from 'three';
const V = THREE.Vector3;
console.log(0.1+0.2, 0.1+0.2===0.3);
const up = new V(0,1,0);
for (const p of [new V(1,0,0), new V(0,0,1), new V(1,2,3), new V(0,5,0), new V(0,0,0), new V(2,0,0)]) {
  const m = p.clone().applyAxisAngle(up, Math.PI*2); console.log('fullturn', p.toArray(), '->', m.toArray(), 'equals', m.equals(p), 'dist', m.distanceTo(p));
}
let eqc=0, N=10000; for (let i=0;i<N;i++){ const p=new V(Math.random()*10-5,Math.random()*10-5,Math.random()*10-5); if (p.clone().applyAxisAngle(up,Math.PI*2).equals(p)) eqc++; } console.log('random points equal after full turn', eqc, 'of', N);
// float32 gaps
function gap(v){ const b=new Float32Array([v]); new Int32Array(b.buffer)[0]+=1; return b[0]-v; }
for (const d of [1,1000,5000,1e6,1e7]) console.log('gap', d, gap(Math.fround(d)));
// 1e-6 check near 5000 with identical float32 values
const f = new Float32Array([5000.123, 5000.123]); const a=new V(f[0],0,0), b=new V(f[1],0,0); console.log('same float32 ->', a.distanceTo(b) < 1e-6);
// getArea collinear
let zeroCount=0, nonzero=0, maxA=0; for (let i=0;i<N;i++){ const A=new V(Math.random(),Math.random(),Math.random()), B=new V(Math.random(),Math.random(),Math.random()); const t=Math.random(); const C=A.clone().lerp(B,t); const ar=new THREE.Triangle(A,B,C).getArea(); if (ar===0) zeroCount++; else {nonzero++; maxA=Math.max(maxA,ar);} }
console.log('collinear triangles: exact 0', zeroCount, 'nonzero', nonzero, 'max', maxA);
console.log('nice collinear', new THREE.Triangle(new V(0,0,0), new V(1,1,1), new V(2,2,2)).getArea(), new THREE.Triangle(new V(0,0,0), new V(0.1,0.2,0.3), new V(0.3,0.6,0.9)).getArea());
console.log('repeated point', new THREE.Triangle(new V(1,2,3), new V(1,2,3), new V(4,5,6)).getArea());
// exact-parallel sliver edges from real points: how often cross nonzero
let crossNZ=0; for (let i=0;i<N;i++){ const A=new V(Math.random(),Math.random(),Math.random()), B=new V(Math.random(),Math.random(),Math.random()); const C=A.clone().lerp(B,Math.random()); const n=new V().crossVectors(B.clone().sub(A), C.clone().sub(A)); if (n.lengthSq()>0) crossNZ++; } console.log('collinear-point edges with nonzero cross', crossNZ, 'of', N);
