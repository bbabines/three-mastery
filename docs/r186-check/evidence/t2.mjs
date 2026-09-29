import * as THREE from 'three';
const V = THREE.Vector3;
// reflection
console.log('refl Q1', new V(2,-3,0).reflect(new V(0,1,0)).toArray());
console.log('refl Q2', new V(2,-3,0).reflect(new V(0,2,0)).toArray());
const deg=40, r=deg*Math.PI/180; const v=new V(Math.sin(r),-Math.cos(r),0).multiplyScalar(1.8);
const good=v.clone().reflect(new V(0,1,0)), bad=v.clone().reflect(new V(0,2,0));
console.log('scene 40deg good', good.toArray(), good.length(), 'bad', bad.toArray(), bad.length(), 'speed ratio', bad.length()/good.length(), 'vertical ratio', bad.y/good.y);
for (const d of [10,80]) { const rr=d*Math.PI/180; const vv=new V(Math.sin(rr),-Math.cos(rr),0).multiplyScalar(1.8); console.log('ratio at', d, vv.clone().reflect(new V(0,2,0)).length()/vv.length()); }
// raycast normals
const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial());
mesh.rotation.z = Math.PI/2; mesh.updateMatrixWorld();
const rc = new THREE.Raycaster(new V(0.3, 0.37, 5), new V(0,0,-1));
const hit = rc.intersectObject(mesh)[0];
console.log('face.normal', hit.face.normal.toArray(), 'len', hit.face.normal.length());
console.log('hit.normal', hit.normal.toArray(), 'len', hit.normal.length());
const worldN = hit.face.normal.clone().transformDirection(mesh.matrixWorld);
console.log('face normal in world', worldN.toArray());
// lerp
const a=new V(0,0,0), b=new V(4,0,0);
console.log('lerp .25', a.clone().lerp(b,0.25).toArray(), 'lerpVectors 1.5', new V().lerpVectors(a,b,1.5).toArray());
console.log('lerp opposite', new V(-1,0,0).lerp(new V(1,0,0),0.5).toArray());
console.log('lerp same dir', new V(1,0,0).lerp(new V(1,0,0),0.5).length());
console.log('Color.lerpColors', typeof THREE.Color.prototype.lerpColors, 'MathUtils.lerp', THREE.MathUtils.lerp(0,10,0.3), 'damp', typeof THREE.MathUtils.damp);
// angle
const fwd=new V(0,0,-1); const L=fwd.clone().applyAxisAngle(new V(0,1,0), Math.PI/4), R=fwd.clone().applyAxisAngle(new V(0,1,0), -Math.PI/4);
console.log('angleTo L R', fwd.angleTo(L), fwd.angleTo(R), 'Lx', L.x);
console.log('toFixed', (Math.PI/2).toFixed(0), '90rad turns', 90/(2*Math.PI), 'mod deg', THREE.MathUtils.radToDeg(90)%360);
const signed=(f,t)=>Math.atan2(new V().crossVectors(f,t).dot(new V(0,1,0)), f.dot(t));
console.log('signed L', signed(fwd,L), 'R', signed(fwd,R), 'behind', signed(fwd,new V(0,0,1)));
console.log('angleTo zero', new V().angleTo(new V(1,0,0)));
// spherical
console.log('sph(5,0,0)', new V().setFromSpherical(new THREE.Spherical(5,0,0)).toArray());
console.log('sph pole theta', new V().setFromSpherical(new THREE.Spherical(5,0,1)).toArray());
console.log('makeSafe', new THREE.Spherical(1,0,0).makeSafe().phi);
console.log('sph level', new V().setFromSpherical(new THREE.Spherical(5,Math.PI/2,0)).toArray());
// projection
console.log('proj', new V(3,4,0).projectOnVector(new V(1,0,0)).toArray(), new V(3,4,0).projectOnPlane(new V(0,1,0)).toArray());
console.log('proj non-unit dir', new V(3,4,0).projectOnVector(new V(5,0,0)).toArray(), new V(3,4,0).projectOnPlane(new V(0,7,0)).toArray());
const wn=new V(0.8,0,0.6); const vel=new V(-2,0,0);
console.log('wall dot', vel.dot(wn), 'slide', vel.clone().projectOnPlane(wn).toArray(), 'x0', vel.clone().setX(0).toArray(), 'angle from head-on deg', THREE.MathUtils.radToDeg(vel.angleTo(wn.clone().negate())));
console.log('Line3', new THREE.Line3(new V(0,0,0), new V(1,0,0)).closestPointToPoint(new V(5,1,0), false, new V()).toArray());
// triple / mirrored
const m = new THREE.Matrix4().compose(new V(), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI,0.3,0)), new V(1,1,1));
const x=new V(),y=new V(),z=new V(); m.extractBasis(x,y,z); console.log('upside-down triple', x.dot(new V().crossVectors(y,z)), m.determinant());
for (const s of [[-1,1,1],[-1,-1,1],[-1,-1,-1],[-2,1,1]]) { const mm=new THREE.Matrix4().makeScale(...s); mm.extractBasis(x,y,z); console.log('scale',s,'triple', x.dot(new V().crossVectors(y,z)), 'det', mm.determinant()); }
const p = new THREE.Plane().setFromCoplanarPoints(new V(0,0,0), new V(1,0,0), new V(0,0,-1)); console.log('plane normal', p.normal.toArray(), 'dist', p.distanceToPoint(new V(0,2,0)), p.distanceToPoint(new V(0,-2,0)));
console.log('fov default', new THREE.PerspectiveCamera().fov);
console.log('smootherstep', THREE.MathUtils.smootherstep(0.8,0.6,1));
