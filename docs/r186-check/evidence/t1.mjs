import * as THREE from 'three';
const V = THREE.Vector3;
console.log('REV', THREE.REVISION);
// point-vs-direction Q2/Q3
let a = new V(1,0,0), b = new V(4,2,0);
console.log('pvd Q2', b.clone().sub(a).toArray());
b = new V(4,2,0); const move = b.sub(a); console.log('pvd Q3 b===move', move===b, b.toArray());
// camera getWorldDirection
const cam = new THREE.PerspectiveCamera(); console.log('cam dir', cam.getWorldDirection(new V()).toArray());
// length
console.log('len', new V(3,0,-4).length(), 'distTo', new V(1,2,3).distanceTo(new V(4,6,3)));
console.log('sqrt3', Math.sqrt(3));
const vel = new V(8,0,0).applyAxisAngle(new V(0,1,0), 0.7); const c = vel.clone().clampLength(0,5); console.log('clamp', c.length(), c.clone().normalize().toArray(), vel.clone().normalize().toArray());
// radius<1 case for squared vs plain
const r=0.5; console.log('r=0.5: d2<r means d<', Math.sqrt(r));
// normalize
console.log('norm', new V(3,0,-4).normalize().toArray(), 'zero', new V().normalize().toArray());
let origWarn = console.warn; let warned=false; console.warn=()=>{warned=true}; new V().normalize(); console.warn=origWarn; console.log('zero warned?', warned);
// raycaster.set does not normalize
const rc = new THREE.Raycaster(); rc.set(new V(), new V(0,0,-5)); console.log('ray dir after set', rc.ray.direction.toArray());
// dot
console.log('dot45', new V(1,0,0).dot(new V(1,0,-1).normalize()));
console.log('dot10', new V(0,0,-2).dot(new V(0,0,-5)));
console.log('cos60', Math.cos(THREE.MathUtils.degToRad(60)));
// find unit self dot > 1
let found=null, cnt=0, nan=0, N=100000;
for (let i=0;i<N;i++){ const v=new V(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).normalize(); const d=v.dot(v); if(d>1){cnt++; if(!found) found=[v.toArray(), d]; if (Number.isNaN(Math.acos(d))) nan++;} }
console.log('self-dot>1 count', cnt, 'of', N, 'nan', nan, found);
const u = new V(...found[0]); console.log('angleTo self', u.angleTo(u), 'acos', Math.acos(u.dot(u)));
// cross
console.log('cross right x away', new V(1,0,0).cross(new V(0,0,-1)).toArray());
console.log('right x up', new V(1,0,0).cross(new V(0,1,0)).toArray(), 'up x right', new V(0,1,0).cross(new V(1,0,0)).toArray());
console.log('edges', new V().crossVectors(new V(2,0,0), new V(0,0,-3)).toArray());
console.log('parallel', new V().crossVectors(new V(1,2,3), new V(2,4,6)).normalize().toArray());
console.log('left test', new V().crossVectors(new V(0,0,-1), new V(-1,0,0)).y, 'right', new V().crossVectors(new V(0,0,-1), new V(1,0,0)).y);
// almost parallel
const e1 = new V(1,0,0), e2 = new V(1,1e-9,0); const cr = new V().crossVectors(e1,e2); console.log('almost parallel cross', cr.toArray(), 'normalized', cr.clone().normalize().toArray());
// cross length vs angle
for (const deg of [0,45,90,135,180]) { const bb = new V(Math.cos(deg*Math.PI/180),0,-Math.sin(deg*Math.PI/180)); console.log('crosslen', deg, new V(1,0,0).cross(bb).length().toFixed(3)); }
// Triangle getArea
console.log('area', new THREE.Triangle(new V(0,0,0), new V(1,0,0), new V(0,1,0)).getArea());
// computeVertexNormals / setFromCoplanarPoints vs (b-a)x(c-a)
const A=new V(-1,0.2,1),B=new V(1.5,0.2,1),C=new V(0,1.7,-1);
console.log('n1', new V().crossVectors(B.clone().sub(A), C.clone().sub(A)).normalize().toArray());
console.log('plane', new THREE.Plane().setFromCoplanarPoints(A,B,C).normal.toArray());
// front face check: triangle CCW seen from +z
const g = new THREE.BufferGeometry().setFromPoints([new V(0,0,0), new V(1,0,0), new V(0,1,0)]); g.computeVertexNormals(); console.log('ccw normal', Array.from(g.getAttribute('normal').array.slice(0,3)));
