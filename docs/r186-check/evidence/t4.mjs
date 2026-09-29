import * as THREE from 'three';
const V = THREE.Vector3;
const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8), new THREE.MeshBasicMaterial()); mesh.position.set(0,0,-10); mesh.updateMatrixWorld();
for (const len of [1, 5, 0.2]) { const rc=new THREE.Raycaster(new V(0.5,0,0), new V(0,0,-len)); const h=rc.intersectObject(mesh); console.log('dir len', len, 'hits', h.length, h[0]?.distance); }
// Ray.distanceToPoint with non-unit direction
const ray = new THREE.Ray(new V(), new V(0,0,-5)); console.log('ray.distanceToPoint (0,1,-3) non-unit', ray.distanceToPoint(new V(0,1,-3)), 'unit', new THREE.Ray(new V(), new V(0,0,-1)).distanceToPoint(new V(0,1,-3)));
// sliver: collinear points -> normalized cross is arbitrary unit vector
const A=new V(0.1,0.2,0.3), B=new V(0.7,0.9,0.4); for (const t of [0.3, 0.37, 0.61]) { const C=A.clone().lerp(B,t); const n=new V().crossVectors(B.clone().sub(A), C.clone().sub(A)); console.log('collinear t', t, 'cross', n.toArray(), 'normalized', n.clone().normalize().toArray(), 'len', n.clone().normalize().length()); }
// lookAt with parallel up: camera straight down
const cam = new THREE.PerspectiveCamera(); cam.position.set(0,5,0); cam.lookAt(0,0,0); cam.updateMatrixWorld(); console.log('cam straight down quat', cam.quaternion.toArray().map(x=>+x.toFixed(4)), 'dir', cam.getWorldDirection(new V()).toArray().map(x=>+x.toFixed(4)), 'nan?', cam.quaternion.toArray().some(Number.isNaN));
