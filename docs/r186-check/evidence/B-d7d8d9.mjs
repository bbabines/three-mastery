// Domains 7, 8, 9 checks against three r186
import * as THREE from 'three';
const log = (k, v) => console.log(k.padEnd(56), typeof v === 'string' ? v : JSON.stringify(v));
const r = (v) => v.toArray().map(x => +x.toFixed(4));

// ---------- Domain 7 ----------
{
  const root = new THREE.Group(); root.name = 'root';
  const a = new THREE.Group(); a.name = 'a';
  const a1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()); a1.name = 'dup';
  const b = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()); b.name = 'dup';
  root.add(a, b); a.add(a1);
  a.visible = false;
  const all = [], vis = [], anc = [];
  root.traverse(o => all.push(o.name));
  root.traverseVisible(o => vis.push(o.name));
  a1.traverseAncestors(o => anc.push(o.name));
  log('traverse', all);
  log('traverseVisible (a hidden)', vis);
  log('traverseAncestors from a1 (excludes self)', anc);
  log('getObjectByName("dup") is first depth-first (a1)', root.getObjectByName('dup') === a1);
  log('getObjectsByProperty("name","dup").length', root.getObjectsByProperty('name', 'dup').length);

  // remove inside traverse
  const scene = new THREE.Scene();
  for (let i = 0; i < 4; i++) { const h = new THREE.AxesHelper(); h.name = 'helper' + i; scene.add(h); }
  let err = null;
  try { scene.traverse(o => { if (o.isLineSegments) o.removeFromParent(); }); } catch (e) { err = e.constructor.name + ': ' + e.message; }
  log('remove inside traverse -> error', err);
  log('children left after failed pass', scene.children.map(c => c.name));
}

// Box3.setFromObject under rotation, precise flag, stale parents
{
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshBasicMaterial());
  m.rotation.set(0, Math.PI / 4, 0); m.updateMatrixWorld();
  const loose = new THREE.Box3().setFromObject(m);
  const tight = new THREE.Box3().setFromObject(m, true);
  log('sphere r=1 rotated 45deg: default box max.x', +loose.max.x.toFixed(4));
  log('sphere r=1 rotated 45deg: precise box max.x', +tight.max.x.toFixed(4));

  const parent = new THREE.Group(); const child = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  parent.add(child); parent.updateMatrixWorld();
  parent.position.x = 10; // not updated
  log('setFromObject(child) after moving parent, no update: min.x', new THREE.Box3().setFromObject(child).min.x);
  log('setFromObject(parent) after moving parent: min.x', new THREE.Box3().setFromObject(parent).min.x);

  const hidden = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  hidden.visible = false; hidden.position.x = 50;
  const g = new THREE.Group(); g.add(hidden);
  log('setFromObject includes invisible children: max.x', new THREE.Box3().setFromObject(g).max.x);
}

// Clone semantics
{
  const m = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 'white' }));
  const c = m.clone();
  log('clone shares geometry', c.geometry === m.geometry);
  log('clone shares material', c.material === m.material);
  c.material.color.set('red');
  log('original color after clone color change', m.material.color.getHexString());
  const arr = new THREE.Mesh(new THREE.BoxGeometry(), [new THREE.MeshBasicMaterial()]);
  const ca = arr.clone();
  log('material array: new array, same materials', [ca.material !== arr.material, ca.material[0] === arr.material[0]]);
  const g = new THREE.Group(); g.userData.meta = { id: 1 }; const gc = g.clone();
  log('userData deep-copied by clone (JSON)', gc.userData.meta !== g.userData.meta);
}

// Scene stats: draw calls not tested (needs WebGL); layers
{
  const l = new THREE.Layers();
  log('Layers default mask (layer 0 only)', l.mask);
}

// ---------- Domain 8 ----------
{
  // invisible objects are raycast; layers on parent do not exclude children
  const m = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  m.visible = false; m.updateMatrixWorld();
  const rc = new THREE.Raycaster(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -1));
  log('visible=false mesh hit count', rc.intersectObject(m).length);
  const mv = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ visible: false })); mv.updateMatrixWorld();
  log('material.visible=false mesh hit count', rc.intersectObject(mv).length);

  const parent = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()); parent.position.z = -5;
  const child = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()); child.position.z = 5;
  parent.add(child); parent.layers.set(1); parent.updateMatrixWorld(true);
  const hits = rc.intersectObject(parent);
  log('parent on layer 1, child on layer 0: hits', hits.map(h => h === undefined ? '' : (h.object === parent ? 'parent' : 'child')));

  // recursive default
  const grp = new THREE.Group(); const cm = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()); grp.add(cm); grp.updateMatrixWorld(true);
  log('intersectObject(group) default recursive hits', rc.intersectObject(grp).length);
  log('intersectObject(group,false) hits', rc.intersectObject(grp, false).length);

  // helpers get hit
  const gh = new THREE.GridHelper(10, 10); gh.rotation.x = Math.PI / 2; gh.updateMatrixWorld();
  const rc2 = new THREE.Raycaster(new THREE.Vector3(0.3, 0.2, 10), new THREE.Vector3(0, 0, -1));
  log('GridHelper hit by default raycaster', rc2.intersectObject(gh).length > 0);
  log('Raycaster.params.Line.threshold default', rc2.params.Line.threshold);
  const ah = new THREE.AxesHelper(5); ah.updateMatrixWorld();
  const rc3 = new THREE.Raycaster(new THREE.Vector3(2, 0.2, 10), new THREE.Vector3(0, 0, -1));
  log('AxesHelper hit', rc3.intersectObject(ah).length > 0);
  const bh = new THREE.Box3Helper(new THREE.Box3(new THREE.Vector3(-1,-1,-1), new THREE.Vector3(1,1,1))); bh.updateMatrixWorld();
  log('Box3Helper hit', new THREE.Raycaster(new THREE.Vector3(1, 0.2, 10), new THREE.Vector3(0, 0, -1)).intersectObject(bh).length > 0);
}

// Intersection anatomy: face.normal local, intersection.normal local, point world
{
  const m = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
  m.rotation.y = Math.PI / 2; m.position.set(0, 0, -3); m.updateMatrixWorld();
  const rc = new THREE.Raycaster(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -1));
  const h = rc.intersectObject(m);
  log('hit keys', Object.keys(h[0]).sort());
  log('face keys', Object.keys(h[0].face).sort());
  log('point (world)', r(h[0].point));
  log('face.normal (local; world would be 0,0,1)', r(h[0].face.normal));
  log('intersection.normal (local interpolated)', r(h[0].normal));
  const world = h[0].face.normal.clone().transformDirection(m.matrixWorld);
  log('face.normal.transformDirection(matrixWorld)', r(world));
  log('sorted ascending distance', h.map(x => +x.distance.toFixed(3)));
  // back face hit with DoubleSide: face.normal not flipped
  const d = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })); d.updateMatrixWorld();
  const back = new THREE.Raycaster(new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 1)).intersectObject(d)[0];
  log('DoubleSide back hit: face.normal vs normal', [r(back.face.normal), r(back.normal)]);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial()); front.updateMatrixWorld();
  log('FrontSide back hit count', new THREE.Raycaster(new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 1)).intersectObject(front).length);
}

// Stale boundingSphere breaks raycast early-out
{
  const g = new THREE.BoxGeometry(1, 1, 1);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial()); m.updateMatrixWorld();
  const rc = new THREE.Raycaster(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -1));
  rc.intersectObject(m); // computes sphere lazily
  g.translate(20, 0, 0); // translate() recomputes? check
  log('BufferGeometry.translate resets bounds? sphere center', r(g.boundingSphere.center));
  const g2 = new THREE.BoxGeometry(1, 1, 1);
  const m2 = new THREE.Mesh(g2, new THREE.MeshBasicMaterial()); m2.updateMatrixWorld();
  rc.intersectObject(m2);
  const p = g2.attributes.position; for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + 20); p.needsUpdate = true;
  const rc20 = new THREE.Raycaster(new THREE.Vector3(20, 0, 10), new THREE.Vector3(0, 0, -1));
  log('manual vertex edit, stale bounds: hit count', rc20.intersectObject(m2).length);
  g2.computeBoundingSphere();
  log('after computeBoundingSphere: hit count', rc20.intersectObject(m2).length);
}

// Ray-plane
{
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y = 0
  const t = new THREE.Vector3();
  log('parallel ray above plane', new THREE.Ray(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0)).intersectPlane(plane, t));
  log('parallel ray lying in plane -> hits at origin', new THREE.Ray(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)).intersectPlane(plane, t)?.toArray());
  log('plane behind ray (pointing away)', new THREE.Ray(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)).intersectPlane(plane, t));
  log('Plane.distanceToPoint below plane (signed)', plane.distanceToPoint(new THREE.Vector3(0, -3, 0)));
  const p2 = new THREE.Plane(new THREE.Vector3(0, 1, 0), -2);
  log('Plane(normal +Y, constant -2) contains y=2?', p2.distanceToPoint(new THREE.Vector3(0, 2, 0)));
}

// Ray-sphere
{
  const s = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1); const t = new THREE.Vector3();
  log('outside -> entry point', r(new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1)).intersectSphere(s, t)));
  log('inside -> exit point', r(new THREE.Ray(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)).intersectSphere(s, t)));
  log('behind -> null', new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, 1)).intersectSphere(s, t));
  log('miss -> null', new THREE.Ray(new THREE.Vector3(0, 2, 5), new THREE.Vector3(0, 0, -1)).intersectSphere(s, t));
}

// Ray-triangle returns point only
{
  const ray = new THREE.Ray(new THREE.Vector3(0.2, 0.2, 5), new THREE.Vector3(0, 0, -1));
  const out = ray.intersectTriangle(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), false, new THREE.Vector3());
  log('Ray.intersectTriangle returns', out.constructor.name + ' ' + JSON.stringify(r(out)));
  log('Ray.intersectTriangle backface cull (reversed winding)', new THREE.Ray(new THREE.Vector3(0.2, 0.2, 5), new THREE.Vector3(0, 0, -1)).intersectTriangle(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), true, new THREE.Vector3()));
  const bc = THREE.Triangle.getBarycoord(out, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3());
  log('Triangle.getBarycoord at hit', r(bc));
}

// Ray-box, ray definition
{
  const b = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
  log('Ray.intersectBox hit', r(new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1)).intersectBox(b, new THREE.Vector3())));
  log('Ray.intersectBox box behind -> null', new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, 1)).intersectBox(b, new THREE.Vector3()));
  const ray = new THREE.Ray(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0));
  log('Ray.closestPointToPoint for point behind origin (clamped)', r(ray.closestPointToPoint(new THREE.Vector3(-5, 1, 0), new THREE.Vector3())));
  log('Ray.at(-2) (no clamping in at)', r(ray.at(-2, new THREE.Vector3())));
}

// Closest points
{
  const line = new THREE.Line3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0));
  log('Line3.closestPointToPoint(5,3,0, clamp)', r(line.closestPointToPoint(new THREE.Vector3(5, 3, 0), true, new THREE.Vector3())));
  const box = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
  log('Box3.clampPoint(5,0.5,0)', r(box.clampPoint(new THREE.Vector3(5, 0.5, 0), new THREE.Vector3())));
  const tri = new THREE.Triangle(new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0), new THREE.Vector3(0, 10, 0));
  log('Triangle.closestPointToPoint(5,5,5) (not a vertex)', r(tri.closestPointToPoint(new THREE.Vector3(5, 5, 5), new THREE.Vector3())));
}

// Frustum
{
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.updateMatrixWorld();
  const f = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
  log('Frustum.containsPoint(0,0,-5)', f.containsPoint(new THREE.Vector3(0, 0, -5)));
  log('Frustum.intersectsBox behind', f.intersectsBox(new THREE.Box3(new THREE.Vector3(-1, -1, 4), new THREE.Vector3(1, 1, 6))));
}

// ---------- Domain 9 ----------
{
  log('MathUtils.damp(0,1,5,1/60) == lerp(0,1,1-exp(-5/60))', THREE.MathUtils.damp(0, 1, 5, 1 / 60) === THREE.MathUtils.lerp(0, 1, 1 - Math.exp(-5 / 60)));
  const run = (hz) => { let x = 0; for (let i = 0; i < hz * 0.25; i++) x = THREE.MathUtils.lerp(x, 1, 0.1); return +x.toFixed(4); };
  log('lerp 0.1/frame after 0.25 s at 60 vs 120 Hz', [run(60), run(120)]);
  const rate = (hz) => -hz * Math.log(0.9);
  log('exponential rate per second 60 vs 120 Hz', [+rate(60).toFixed(3), +rate(120).toFixed(3)]);
  const dampRun = (hz) => { let x = 0; for (let i = 0; i < hz * 0.25; i++) x = THREE.MathUtils.damp(x, 1, 6, 1 / hz); return +x.toFixed(4); };
  log('damp(lambda 6) after 0.25 s at 60 vs 120 Hz', [dampRun(60), dampRun(120)]);
  log('MathUtils has clamp,smoothstep,mapLinear,lerp,inverseLerp,damp', ['clamp','smoothstep','smootherstep','mapLinear','lerp','inverseLerp','damp'].map(k => typeof THREE.MathUtils[k] === 'function'));
  log('MathUtils.remap exists?', typeof THREE.MathUtils.remap);
  log('Quaternion.slerp / slerpQuaternions', [typeof THREE.Quaternion.prototype.slerp, typeof THREE.Quaternion.prototype.slerpQuaternions]);
  log('THREE.Timer exists; Clock exists', [typeof THREE.Timer, typeof THREE.Clock]);

  // project behind camera
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.updateMatrixWorld();
  const behind = new THREE.Vector3(0.5, 0.5, 5).project(cam);
  const front = new THREE.Vector3(0.5, 0.5, -5).project(cam);
  log('project point in front (z in [-1,1])', r(front));
  log('project point behind camera (z > 1, x/y mirrored)', r(behind));

  // pointer NDC with DPR: DPR cancels
  const rect = { left: 100, top: 50, width: 800, height: 600 };
  const clientX = 500, clientY = 350, dpr = 2;
  const ndc = [((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1];
  const ndcDpr = [(((clientX - rect.left) * dpr) / (rect.width * dpr)) * 2 - 1, -(((clientY - rect.top) * dpr) / (rect.height * dpr)) * 2 + 1];
  log('NDC css px vs with DPR on both (same)', [ndc, ndcDpr]);
}

// Loader cache
log('THREE.Cache.enabled default', THREE.Cache.enabled);
// Memory math
{
  const base = 2048 * 2048 * 4;
  let mip = 0; for (let s = 2048; s >= 1; s >>= 1) mip += s * s * 4;
  log('2048^2 RGBA8 bytes, with full mip chain, ratio', [base, mip, +(mip / base).toFixed(4)]);
  log('with mips in MB (1e6) and MiB', [+(mip / 1e6).toFixed(2), +(mip / 2 ** 20).toFixed(2)]);
}
