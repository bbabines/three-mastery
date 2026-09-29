import * as THREE from 'three';
const { Vector3: V, Matrix4: M4, Matrix3: M3, Quaternion: Q, Euler: E, Object3D: O, Spherical } = THREE;
const r = (n) => Math.round(n * 1e6) / 1e6;
const f = (v) => `(${r(v.x)}, ${r(v.y)}, ${r(v.z)})`;
const log = (id, ...a) => console.log(`[${id}]`, ...a);

log('rev', THREE.REVISION);

// D1 normalize zero vector
log('normalize0', f(new V().normalize()));

// D1 dot range and acos NaN
const a = new V(3, 0, 0), b = new V(2, 2, 0);
log('dot-nonunit', a.dot(b));
const u = new V(1, 1e-8, 0).normalize();
const dUnit = u.dot(u) * (1 + 1e-15);
log('acos>1', Math.acos(1.0000000000000002), 'angleTo clamps:', new V(1, 0, 0).angleTo(new V(1, 0, 0)));
log('angleTo zero vector', new V().angleTo(new V(1, 0, 0)));
// dot of two "unit" vectors exceeding 1 due to float error
{
  let worst = 0, found = null;
  for (let i = 0; i < 200000 && !found; i++) {
    const v = new V(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    const d = v.dot(v.clone());
    if (d > 1) found = d;
  }
  log('unit-dot>1 found', found, found ? Math.acos(found) : '');
}

// D1 cross
const x = new V(1, 0, 0), y = new V(0, 1, 0);
log('cross x*y', f(x.clone().cross(y)), 'y*x', f(y.clone().cross(x)));
log('cross len', new V(2, 0, 0).cross(new V(0, 3, 0)).length(), 'parallel', f(new V(1, 2, 3).cross(new V(2, 4, 6))));
const orig = new V(1, 0, 0); orig.cross(y); log('cross mutates receiver', f(orig));

// projection / rejection
const p = new V(3, 4, 5);
log('projectOnVector unnormalized ok', f(p.clone().projectOnVector(new V(0, 10, 0))), 'projectOnPlane', f(p.clone().projectOnPlane(new V(0, 10, 0))));

// reflect with non-unit normal
log('reflect unit', f(new V(1, -1, 0).reflect(new V(0, 1, 0))), 'reflect n len2', f(new V(1, -1, 0).reflect(new V(0, 2, 0))));

// lerp
const l = new V(1, 0, 0).lerp(new V(0, 1, 0), 0.5);
log('lerp unit len', r(l.length()), 'extrapolate t=2', f(new V(0, 0, 0).lerp(new V(1, 0, 0), 2)));

// angleTo unsigned + signed angle
const a1 = new V(1, 0, 0), b1 = new V(0, 0, -1), axis = new V(0, 1, 0);
const signed = (p, q, ax) => Math.atan2(new V().crossVectors(p, q).dot(ax), p.dot(q));
log('angleTo', r(a1.angleTo(b1)), r(b1.angleTo(a1)), 'signed', r(signed(a1, b1, axis)), r(signed(b1, a1, axis)));

// Spherical
const s = new Spherical().setFromVector3(new V(1, 0, 0));
const s2 = new Spherical().setFromVector3(new V(0, 0, 1));
log('spherical +X', r(s.phi), r(s.theta), '+Z', r(s2.phi), r(s2.theta), 'top', JSON.stringify(new Spherical().setFromVector3(new V(0, 5, 0))));
log('fromSpherical phi=pi/2 theta=0', f(new V().setFromSphericalCoords(1, Math.PI / 2, 0)));

// triple product
log('triple xyz', x.dot(new V().crossVectors(y, new V(0, 0, 1))), 'det mirror', new M4().makeScale(-1, 1, 1).determinant());

// float equality
log('0.1+0.2 equals', new V(0.1 + 0.2, 0, 0).equals(new V(0.3, 0, 0)));

// D2 world vs scene root frame
{
  const scene = new THREE.Scene(); scene.position.set(5, 0, 0);
  const c = new O(); scene.add(c);
  log('scene offset -> child world', f(c.getWorldPosition(new V())));
}
// D2 matrixWorld stale
{
  const parent = new O(), c = new O(); parent.add(c);
  parent.updateMatrixWorld();
  c.position.set(1, 2, 3);
  log('matrixWorld stale', f(new V().setFromMatrixPosition(c.matrixWorld)), 'getWorldPosition', f(c.getWorldPosition(new V())));
  c.position.set(9, 9, 9);
  log('localToWorld auto-updates', f(c.localToWorld(new V())));
  const m = new M4().multiplyMatrices(parent.matrixWorld, c.matrix);
  log('matrixWorld == parent.matrixWorld*matrix', m.equals(c.matrixWorld));
}
// TRS order
{
  const m = new M4().compose(new V(10, 0, 0), new Q().setFromAxisAngle(new V(0, 0, 1), Math.PI / 2), new V(2, 1, 1));
  log('compose TRS applied to (1,0,0)', f(new V(1, 0, 0).applyMatrix4(m)), '(S:2,0,0 -> R:0,2,0 -> T:10,2,0)');
  const base = new M4().makeTranslation(10, 0, 0), rot = new M4().makeRotationZ(Math.PI / 2);
  log('multiply (local) origin->', f(new V().applyMatrix4(base.clone().multiply(rot))), 'premultiply (parent) origin->', f(new V().applyMatrix4(base.clone().premultiply(rot))));
}
// Shear from non-uniform parent scale
{
  const parent = new O(); parent.scale.set(2, 1, 1);
  const c = new O(); c.rotation.z = Math.PI / 4; parent.add(c); parent.updateMatrixWorld();
  const cx = new V(), cy = new V(), cz = new V(); c.matrixWorld.extractBasis(cx, cy, cz);
  log('child world basis x.y dot (0 = no shear)', r(cx.clone().normalize().dot(cy.clone().normalize())));
  const P = new V(), Qt = new Q(), S = new V();
  c.matrixWorld.decompose(P, Qt, S);
  const back = new M4().compose(P, Qt, S);
  log('decompose->compose equals sheared original', back.equals(c.matrixWorld), 'max elem diff', r(Math.max(...back.elements.map((e, i) => Math.abs(e - c.matrixWorld.elements[i])))));
}
// negative scale decompose
{
  const P = new V(), Qt = new Q(), S = new V();
  new M4().makeScale(1, -1, 1).decompose(P, Qt, S);
  log('decompose scale(1,-1,1) ->', f(S), 'quat', r(Qt.x), r(Qt.y), r(Qt.z), r(Qt.w));
}
// points vs directions
{
  const m = new M4().compose(new V(10, 0, 0), new Q(), new V(3, 3, 3));
  log('applyMatrix4 dir (1,0,0)', f(new V(1, 0, 0).applyMatrix4(m)), 'transformDirection', f(new V(1, 0, 0).transformDirection(m)), 'applyMatrix3(setFromMatrix4)', f(new V(1, 0, 0).applyMatrix3(new M3().setFromMatrix4(m))));
  const v4 = new THREE.Vector4(1, 0, 0, 0).applyMatrix4(m);
  log('Vector4 w=0', r(v4.x), r(v4.y), r(v4.z), r(v4.w));
}
// inverse vs transpose
{
  const rot = new M4().makeRotationY(0.7);
  const refl = new M4().makeScale(-1, 1, 1);
  const eq = (A, B) => A.elements.every((e, i) => Math.abs(e - B.elements[i]) < 1e-12);
  log('rot inv==T', eq(rot.clone().invert(), rot.clone().transpose()), 'reflection inv==T', eq(refl.clone().invert(), refl.clone().transpose()),
    'rot+translation inv==T', eq(rot.clone().setPosition(1, 2, 3).invert(), rot.clone().setPosition(1, 2, 3).transpose()));
}
// add vs attach
{
  const A = new O(); A.position.set(5, 0, 0);
  const B = new O(); B.position.set(0, 3, 0);
  const c1 = new O(); c1.position.set(1, 0, 0); A.add(c1);
  const c2 = new O(); c2.position.set(1, 0, 0); A.add(c2);
  A.updateMatrixWorld(); B.updateMatrixWorld();
  B.add(c1); B.attach(c2); B.updateMatrixWorld();
  log('add world', f(c1.getWorldPosition(new V())), 'attach world', f(c2.getWorldPosition(new V())), '(was 6,0,0)');
  // attach under non-uniform scale with rotated child
  const P = new O(); P.scale.set(2, 1, 1); P.updateMatrixWorld();
  const k = new O(); k.rotation.z = Math.PI / 4; k.updateMatrixWorld();
  const before = k.matrixWorld.clone();
  P.attach(k); P.updateMatrixWorld();
  log('attach to non-uniform parent keeps world matrix', before.elements.every((e, i) => Math.abs(e - k.matrixWorld.elements[i]) < 1e-9));
}
// pivot property
{
  const o = new O(); o.pivot = new V(1, 0, 0); o.rotation.z = Math.PI; o.updateMatrix();
  log('pivot rotates around (1,0,0): origin ->', f(new V().applyMatrix4(o.matrix)));
}
// normal matrix
{
  const m = new M4().makeRotationZ(Math.PI / 4).premultiply(new M4().makeScale(1, 3, 1));
  // surface: plane with tangent (1,-1,0)/? normal (1,1,0)/sqrt2 before transform
  const n = new V(1, 1, 0).normalize(), t = new V(1, -1, 0).normalize();
  const tW = t.clone().applyMatrix3(new M3().setFromMatrix4(m));
  const nDir = n.clone().transformDirection(m);
  const nNM = n.clone().applyNormalMatrix(new M3().getNormalMatrix(m));
  log('normal as direction dot tangent', r(nDir.dot(tW.clone().normalize())), 'normal matrix dot tangent', r(nNM.dot(tW.clone().normalize())));
}
// matrixAutoUpdate=false still recomputes world each frame
{
  const scene = new THREE.Scene();
  const kids = []; for (let i = 0; i < 100; i++) { const k = new O(); k.matrixAutoUpdate = false; k.updateMatrix(); scene.add(k); kids.push(k); }
  scene.updateMatrixWorld();
  let composes = 0, mults = 0;
  const oc = M4.prototype.compose, om = M4.prototype.multiplyMatrices;
  M4.prototype.compose = function (...a) { composes++; return oc.apply(this, a); };
  M4.prototype.multiplyMatrices = function (...a) { mults++; return om.apply(this, a); };
  scene.updateMatrixWorld();
  log('100 static kids, 1 frame: composes', composes, 'world multiplies', mults);
  composes = 0; mults = 0; scene.matrixAutoUpdate = false; scene.updateMatrixWorld();
  log('same with scene.matrixAutoUpdate=false: composes', composes, 'world multiplies', mults);
  M4.prototype.compose = oc; M4.prototype.multiplyMatrices = om;
}
// Euler order meaning
{
  const e = new E(0.3, 0.5, 0.7, 'XYZ');
  const m = new M4().makeRotationFromEuler(e);
  const mx = new M4().makeRotationX(0.3), my = new M4().makeRotationY(0.5), mz = new M4().makeRotationZ(0.7);
  const eq = (A, B) => A.elements.every((v, i) => Math.abs(v - B.elements[i]) < 1e-12);
  log('XYZ == Rx*Ry*Rz', eq(m, mx.clone().multiply(my).multiply(mz)), 'XYZ == Rz*Ry*Rx', eq(m, mz.clone().multiply(my).multiply(mx)));
  log('default order', new E().order, THREE.Euler.DEFAULT_ORDER);
}
// gimbal lock
{
  const e = new E(0.4, Math.PI / 2, 0.3, 'XYZ');
  const q = new Q().setFromEuler(e);
  const back = new E().setFromQuaternion(q, 'XYZ');
  const e2 = new E(0.7, Math.PI / 2, 0, 'XYZ');
  log('gimbal: (0.4, pi/2, 0.3) round-trips to', r(back.x), r(back.y), r(back.z), 'same rotation as (0.7,pi/2,0)?', r(Math.abs(new Q().setFromEuler(e2).dot(q))));
}
// Euler round trip different numbers
{
  const e = new E(0, 2, 0, 'XYZ');
  const back = new E().setFromQuaternion(new Q().setFromEuler(e));
  log('Euler (0,2,0) round-trip', r(back.x), r(back.y), r(back.z));
}
// rotateOnAxis local vs rotateOnWorldAxis
{
  const o = new O(); o.rotation.y = Math.PI / 2;
  const o2 = o.clone();
  o.rotateOnAxis(new V(1, 0, 0), Math.PI / 2); o2.rotateOnWorldAxis(new V(1, 0, 0), Math.PI / 2);
  log('rotateOnAxis +Z ->', f(new V(0, 0, 1).applyQuaternion(o.quaternion)), 'rotateOnWorldAxis +Z ->', f(new V(0, 0, 1).applyQuaternion(o2.quaternion)));
  // rotated parent: rotateOnWorldAxis is parent-space, not world
  const parent = new O(); parent.rotation.z = Math.PI / 2;
  const c = new O(); parent.add(c);
  c.rotateOnWorldAxis(new V(1, 0, 0), Math.PI / 2); parent.updateMatrixWorld();
  const wq = c.getWorldQuaternion(new Q());
  const expected = new Q().setFromAxisAngle(new V(1, 0, 0), Math.PI / 2).multiply(parent.quaternion);
  log('rotated parent: rotateOnWorldAxis matches true world-X rotation?', r(Math.abs(wq.dot(expected))) === 1);
}
// q and -q
{
  const q = new Q().setFromAxisAngle(new V(0, 1, 0), 1);
  const nq = new Q(-q.x, -q.y, -q.z, -q.w);
  log('q vs -q rotate (1,0,0)', f(new V(1, 0, 0).applyQuaternion(q)), f(new V(1, 0, 0).applyQuaternion(nq)));
  const a = new Q().setFromAxisAngle(new V(1, 0, 0), 1), b = new Q().setFromAxisAngle(new V(0, 1, 0), 1);
  log('q multiply noncommutative', a.clone().multiply(b).equals(b.clone().multiply(a)));
}
// slerp constant speed & shortest arc
{
  const qa = new Q(), qb = new Q().setFromAxisAngle(new V(0, 1, 0), 3);
  const ang = [0.25, 0.5, 0.75].map((t) => r(qa.clone().slerp(qb, t).angleTo(qa)));
  const qbNeg = new Q(-qb.x, -qb.y, -qb.z, -qb.w);
  log('slerp angles at .25/.5/.75', ang.join(','), 'with -qb', [0.5].map((t) => r(qa.clone().slerp(qbNeg, t).angleTo(qa))).join(','));
}
// basis columns, scaled
{
  const o = new O(); o.scale.set(2, 2, 2); o.rotation.y = Math.PI / 2; o.updateMatrixWorld();
  const bx = new V(), by = new V(), bz = new V(); o.matrixWorld.extractBasis(bx, by, bz);
  log('extractBasis scaled columns', f(bx), f(by), f(bz), 'getWorldDirection', f(o.getWorldDirection(new V())));
  const cam = new THREE.PerspectiveCamera(); cam.rotation.y = Math.PI / 2; cam.updateMatrixWorld();
  const cz = new V(); cam.matrixWorld.extractBasis(new V(), new V(), cz);
  log('camera col3', f(cz), 'camera getWorldDirection', f(cam.getWorldDirection(new V())));
}
// lookAt: objects +Z vs camera -Z; parallel up
{
  const o = new O(); o.lookAt(0, 0, -5);
  const cam = new THREE.PerspectiveCamera(); cam.lookAt(0, 0, -5);
  log('object +Z after lookAt(0,0,-5)', f(new V(0, 0, 1).applyQuaternion(o.quaternion)), 'camera -Z', f(new V(0, 0, -1).applyQuaternion(cam.quaternion)));
  const c2 = new THREE.PerspectiveCamera(); c2.lookAt(0, -5, 0);
  log('camera lookAt straight down: quat finite', [c2.quaternion.x, c2.quaternion.y, c2.quaternion.z, c2.quaternion.w].every(Number.isFinite), 'dir', f(c2.getWorldDirection(new V())));
}
// Vector4 axis-angle
{
  const v = new THREE.Vector4().setAxisAngleFromQuaternion(new Q().setFromAxisAngle(new V(0, 1, 0), 0.8));
  log('Vector4.setAxisAngleFromQuaternion', r(v.x), r(v.y), r(v.z), 'angle', r(v.w));
}
// D4 view matrix excludes scale
{
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.scale.set(2, 2, 2); cam.position.set(0, 0, 10); cam.updateMatrixWorld();
  const inv = cam.matrixWorld.clone().invert();
  log('scaled camera: matrixWorldInverse == inverse(matrixWorld)?', inv.equals(cam.matrixWorldInverse));
  const w = new V(1, 1, 0);
  const back = w.clone().project(cam).unproject(cam);
  log('scaled camera project->unproject returns', f(back), 'expected (1,1,0)');
}
// NDC y up, project behind camera
{
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.set(0, 0, 10); cam.updateMatrixWorld();
  log('point above center -> ndc y', r(new V(0, 1, 0).project(cam).y));
  const behind = new V(0.5, 0.5, 20).project(cam);
  log('point behind camera ndc', f(behind), 'in x,y [-1,1]:', Math.abs(behind.x) <= 1 && Math.abs(behind.y) <= 1);
  log('near plane unproject z=-1 dist', r(new V(0, 0, -1).unproject(cam).distanceTo(cam.position)), 'z=1', r(new V(0, 0, 1).unproject(cam).distanceTo(cam.position)));
  // depth nonlinearity: NDC z at 1/4,1/2 of range
  log('ndc z at depth 1, 10, 50', [1, 10, 50].map((d) => r(new V(0, 0, 10 - d).project(cam).z)).join(','));
}
// fov vertical: aspect change keeps vertical extent
{
  const cam = new THREE.PerspectiveCamera(60, 2, 0.1, 100); cam.updateProjectionMatrix();
  const vert = 2 * Math.atan(1 / cam.projectionMatrix.elements[5]) * 180 / Math.PI;
  const horiz = 2 * Math.atan(1 / cam.projectionMatrix.elements[0]) * 180 / Math.PI;
  log('fov=60 aspect=2: vertical', r(vert), 'horizontal', r(horiz));
}
// renderer.setSize doesn't touch camera: covered by source; world size per pixel
{
  const H = 800, fov = 50;
  const cam = new THREE.PerspectiveCamera(fov, 1, 0.1, 1000); cam.updateMatrixWorld();
  const d = 20;
  const perPx = 2 * d * Math.tan(THREE.MathUtils.degToRad(fov) / 2) / H;
  const p0 = new V(0, 0, -d).project(cam), p1 = new V(0, perPx, -d).project(cam);
  log('1 world-px at depth d -> pixels', r((p1.y - p0.y) / 2 * H));
  // off-axis: Euclidean distance vs view depth
  const off = new V(15, 0, -d); const euclid = off.length();
  const perPxEuclid = 2 * euclid * Math.tan(THREE.MathUtils.degToRad(fov) / 2) / H;
  const q0 = off.clone().project(cam), q1 = off.clone().add(new V(0, perPxEuclid, 0)).project(cam);
  log('using Euclidean distance off-axis -> pixels', r((q1.y - q0.y) / 2 * H));
  const camZ = new THREE.PerspectiveCamera(fov, 1, 0.1, 1000); camZ.zoom = 2; camZ.updateProjectionMatrix(); camZ.updateMatrixWorld();
  const z0 = new V(0, 0, -d).project(camZ), z1 = new V(0, perPx, -d).project(camZ);
  log('with zoom=2 -> pixels', r((z1.y - z0.y) / 2 * H));
}
// camera right = forward x up, unnormalized when pitched
{
  const cam = new THREE.PerspectiveCamera(); cam.rotation.x = -1.2; cam.updateMatrixWorld();
  const fwd = cam.getWorldDirection(new V());
  const right = new V().crossVectors(fwd, new V(0, 1, 0));
  log('pitched camera fwd x up', f(right), 'length', r(right.length()));
  const cam2 = new THREE.PerspectiveCamera(); cam2.lookAt(0, -1, 0);
  log('looking straight down fwd x up length', r(new V().crossVectors(cam2.getWorldDirection(new V()), new V(0, 1, 0)).length()));
}
// Frustum from proj*view uses bounding sphere
{
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.set(0, 0, 10); cam.updateMatrixWorld();
  const fr = new THREE.Frustum().setFromProjectionMatrix(new M4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
  log('frustum planes', fr.planes.length);
}
// texture byte length
log('RGBA8 1024^2 bytes', THREE.TextureUtils.getByteLength(1024, 1024, THREE.RGBAFormat, THREE.UnsignedByteType), 'RGBA half', THREE.TextureUtils.getByteLength(1024, 1024, THREE.RGBAFormat, THREE.HalfFloatType));
{ let s = 0; for (let w = 1024; w >= 1; w /= 2) s += w * w; log('mip chain ratio', r(s / (1024 * 1024))); }
// Texture not uploaded until needsUpdate
log('new Texture(img).version', new THREE.Texture({ width: 1, height: 1 }).version, 'DataTexture version', new THREE.DataTexture(new Uint8Array(4), 1, 1).version);
