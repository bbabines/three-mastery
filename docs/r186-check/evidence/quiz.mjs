import * as THREE from 'three';
const { Vector3, Group, Object3D, Mesh, BoxGeometry, PlaneGeometry, Matrix4, Matrix3, Quaternion, Scene, Raycaster, Box3, ObjectLoader, MeshBasicMaterial, InstancedMesh } = THREE;
const f = (v) => v.toArray().map((n) => +n.toFixed(4)).join(', ');
const log = (id, ...a) => console.log(id.padEnd(8), ...a);
// "render" stand-in: WebGLRenderer.render does scene.updateMatrixWorld() (WebGLRenderer.js:1663)
const render = (scene) => scene.updateMatrixWorld();

// ---- local-vs-world
{ const s = new Scene(); const fork = new Group(), hl = new Object3D(); s.add(fork); fork.add(hl); hl.position.set(0,1,2); fork.position.set(10,0,0);
  log('LW-Q1', f(hl.getWorldPosition(new Vector3()))); }
{ const s = new Scene(); const d = new Group(), p = new Object3D(); s.add(d); d.add(p); p.position.set(0,-1,0); d.position.y += 5;
  log('LW-Q2', p.position.y, 'world', p.getWorldPosition(new Vector3()).y); }
{ const s = new Scene(); const sh = new Group(), b = new Object3D(); s.add(sh); sh.scale.set(2,2,2); sh.add(b); b.position.set(0,1,0);
  log('LW-Q3', 'world y above shelf', b.getWorldPosition(new Vector3()).y - sh.getWorldPosition(new Vector3()).y); }
{ const s = new Scene(); const A = new Group(), B = new Group(); A.position.set(-3,0,0); B.position.set(5,0,2); s.add(A,B); const a = new Object3D(), b = new Object3D(); A.add(a); B.add(b); a.position.set(0,1,0); b.position.set(0,1,0);
  log('LW-Q4', 'gap', a.position.distanceTo(b.position), 'world gap', a.getWorldPosition(new Vector3()).distanceTo(b.getWorldPosition(new Vector3())), 'shelves gap', A.position.distanceTo(B.position)); }
{ const s = new Scene(); const desk = new Group(); desk.position.set(2,1,0); const lamp = new Object3D(); lamp.position.set(0,0.5,0); s.add(desk); desk.add(lamp);
  log('LW-Q5', 'localToWorld(0,.5,0)', f(lamp.localToWorld(new Vector3(0,0.5,0))), '(lamp at world', f(lamp.getWorldPosition(new Vector3())) + ')'); }
// README L114: part.localToWorld(part.position.clone()) double-counts
{ const s = new Scene(); const g = new Group(); g.position.set(1,0,0); s.add(g); const part = new Object3D(); part.position.set(0,2,0); g.add(part);
  log('LW-L114', 'localToWorld(position)', f(part.localToWorld(part.position.clone())), 'getWorldPosition', f(part.getWorldPosition(new Vector3()))); }
// math note L48: parent only moves but grandparent turned
{ const s = new Scene(); const gp = new Group(); gp.rotation.y = Math.PI/2; const p = new Group(); p.position.set(1,0,0); const c = new Object3D(); c.position.set(1,0,0); s.add(gp); gp.add(p); p.add(c);
  log('LW-L48', 'parentWorld+child.position', f(p.getWorldPosition(new Vector3()).add(c.position)), 'actual', f(c.getWorldPosition(new Vector3()))); }
// aim: lookAt(box.position) vs world
{ const s = new Scene(); const shelf = new Group(); shelf.position.set(1.5,0,-2.5); const box = new Object3D(); box.position.set(0,1.2,0); shelf.add(box); s.add(shelf); const t = new Object3D(); t.position.set(-3,0.6,1); s.add(t);
  t.lookAt(box.position); const d1 = t.getWorldDirection(new Vector3()); t.lookAt(box.getWorldPosition(new Vector3())); const d2 = t.getWorldDirection(new Vector3());
  log('LW-aim', 'wrong dir', f(d1), 'right dir', f(d2), 'toBox', f(box.getWorldPosition(new Vector3()).sub(t.position).normalize())); }

// ---- points vs directions
{ const d = new Object3D(); d.position.set(0,5,0); d.updateMatrixWorld(); log('PD-Q1', f(new Vector3(0,0,1).transformDirection(d.matrixWorld)), 'applyMatrix4', f(new Vector3(0,0,1).applyMatrix4(d.matrixWorld))); }
{ const t = new Object3D(); t.scale.setScalar(3); t.updateMatrixWorld(); log('PD-Q2', f(new Vector3(0,1,0).applyMatrix4(t.matrixWorld)), '|', f(new Vector3(0,1,0).transformDirection(t.matrixWorld))); }
{ const sc = new Object3D(); sc.position.set(6,1,0); sc.updateMatrixWorld(); const a = new Vector3(0,0,-1).applyMatrix4(sc.matrixWorld); log('PD-Q3', f(a), 'normalized', f(a.clone().normalize()));
  const sc2 = new Object3D(); sc2.position.set(6,1,0); log('PD-Q3b', 'if matrixWorld never refreshed:', f(new Vector3(0,0,-1).applyMatrix4(sc2.matrixWorld))); }
{ const k = new Object3D(); k.rotation.y = 0.7; k.position.set(3,0,1); const q = k.getWorldQuaternion(new Quaternion()); k.updateMatrixWorld(); const v = () => new Vector3(0,0,4);
  log('PD-Q4', 'applyQ', f(v().applyQuaternion(q)), 'len', v().applyQuaternion(q).length().toFixed(3), '| tD len', v().transformDirection(k.matrixWorld).length().toFixed(3), '| aM4', f(v().applyMatrix4(k.matrixWorld))); }
{ const c = new Object3D(); c.position.set(4,0,2); log('PD-Q5', f(c.localToWorld(new Vector3(0,0,1)))); }
// raycast normal spaces (PD table L140; NM Q3)
{ const s = new Scene(); const sign = new Mesh(new PlaneGeometry(2,2), new MeshBasicMaterial()); sign.rotation.y = Math.PI/2; sign.position.set(0,0,0); s.add(sign); render(s);
  const rc = new Raycaster(new Vector3(5,0,0), new Vector3(-1,0,0)); const hit = rc.intersectObject(sign)[0];
  log('NM-Q3', 'face.normal', f(hit.face.normal), 'hit.normal', hit.normal ? f(hit.normal) : 'none', 'world via normalMatrix', f(hit.face.normal.clone().applyNormalMatrix(new Matrix3().getNormalMatrix(sign.matrixWorld))));
  const rc2 = new Raycaster(new Vector3(-5,0,0), new Vector3(1,0,0)); log('NM-Q3b', 'hit from back (FrontSide):', rc2.intersectObject(sign).length); }

// ---- matrix vs matrixWorld
{ const s = new Scene(); const table = new Group(), lamp = new Object3D(); s.add(table); table.add(lamp); lamp.position.set(0,1,0); table.position.set(3,0,0); render(s);
  log('MM-Q1', 'lamp.matrix pos', f(new Vector3().setFromMatrixPosition(lamp.matrix)), 'matrixWorld pos', f(new Vector3().setFromMatrixPosition(lamp.matrixWorld))); }
{ const s = new Scene(); const d = new Object3D(); s.add(d); d.position.set(0,5,0); render(s); d.position.set(0,9,0);
  log('MM-Q2', new Vector3().setFromMatrixPosition(d.matrixWorld).y, 'getWorldPosition', d.getWorldPosition(new Vector3()).y); }
{ const s = new Scene(); const cart = new Group(); const crate = new Mesh(new BoxGeometry(1,1,1)); s.add(cart); cart.add(crate); cart.position.set(20,0,0); render(s);
  crate.geometry.computeBoundingBox(); const b = crate.geometry.boundingBox.clone().applyMatrix4(crate.matrix);
  log('MM-Q3', 'box center', f(b.getCenter(new Vector3())), 'vs setFromObject', f(new Box3().setFromObject(crate).getCenter(new Vector3()))); }
{ const s = new Scene(); const rack = new Group(), bin = new Object3D(); s.add(rack); rack.add(bin); rack.position.set(10,0,0); bin.position.set(0,2,0); render(s);
  log('MM-Q4', 'bin.matrix pos', f(new Vector3().setFromMatrixPosition(bin.matrix))); }
{ const s = new Scene(); const A = new Group(), B = new Group(); A.position.set(0,0,0); B.position.set(4,0,0); s.add(A,B); const bin = new Object3D(); A.add(bin); bin.position.set(0,1,0); render(s);
  const m0 = bin.matrix.clone(), w0 = bin.matrixWorld.clone(); B.add(bin); render(s);
  log('MM-Q5', 'matrix same?', bin.matrix.equals(m0), 'matrixWorld same?', bin.matrixWorld.equals(w0)); }

// ---- update timing
{ const s = new Scene(); const crate = new Mesh(new BoxGeometry(1,1,1)); s.add(crate); render(s); crate.position.x = 4;
  const rc = new Raycaster(new Vector3(4,0,10), new Vector3(0,0,-1)); const n1 = rc.intersectObject(crate).length; crate.updateMatrixWorld(); const n2 = rc.intersectObject(crate).length;
  log('UT-Q1', 'hits before refresh', n1, 'after updateMatrixWorld', n2); }
{ const s = new Scene(); const shelf = new Group(), bin = new Object3D(); s.add(shelf); shelf.add(bin); render(s); shelf.position.x += 2; bin.updateMatrixWorld();
  const a = new Vector3().setFromMatrixPosition(bin.matrixWorld).x; bin.updateWorldMatrix(true,false); const b = new Vector3().setFromMatrixPosition(bin.matrixWorld).x;
  log('UT-Q2', 'after bin.updateMatrixWorld x=', a, 'after updateWorldMatrix(true,false) x=', b); }
{ const s = new Scene(); const shelf = new Group(); shelf.position.set(3,0,0); const bin = new Mesh(new BoxGeometry(1,1,1)); s.add(shelf); shelf.add(bin); render(s); shelf.scale.set(2,2,2);
  const b = new Box3().setFromObject(bin); log('UT-Q3', 'size', f(b.getSize(new Vector3())), 'center', f(b.getCenter(new Vector3())), '| setFromObject(shelf) size', f(new Box3().setFromObject(shelf).getSize(new Vector3()))); }
{ const s = new Scene(); const part = new Object3D(); s.add(part); part.position.set(1,0,0); render(s); part.position.set(4,0,0); const saved = part.toJSON();
  const back = new ObjectLoader().parse(saved); log('UT-Q4', 'loaded x', back.position.x); }
{ const s = new Scene(); const rack = new Mesh(new BoxGeometry(1,1,1)); rack.position.set(3,0,0); rack.matrixAutoUpdate = false; s.add(rack); render(s);
  log('UT-Q5', 'drawn at (matrixWorld)', f(new Vector3().setFromMatrixPosition(rack.matrixWorld)), 'getWorldPosition', f(rack.getWorldPosition(new Vector3()))); }
// L126/L127: auto-update off, parent moves; getWorldPosition vs render
{ const s = new Scene(); const g = new Group(); s.add(g); const rack = new Object3D(); rack.position.set(3,0,0); rack.updateMatrix(); rack.matrixAutoUpdate = false; g.add(rack); render(s);
  g.position.x = 10; const gw = rack.getWorldPosition(new Vector3()).x; render(s); const rw = new Vector3().setFromMatrixPosition(rack.matrixWorld).x;
  log('UT-L126', 'autoUpdate off, parent moved: getWorldPosition x=', gw, ' after render x=', rw); }
// setFromCamera doesn't refresh camera
{ const cam = new THREE.PerspectiveCamera(); cam.updateMatrixWorld(); cam.position.set(5,0,0); const rc = new Raycaster(); rc.setFromCamera(new THREE.Vector2(0,0), cam); log('UT-setFromCamera', 'ray origin', f(rc.ray.origin)); }
// lookAt refreshes parents
{ const s = new Scene(); const g = new Group(); s.add(g); const t = new Object3D(); g.add(t); render(s); g.position.set(0,0,5); t.lookAt(0,0,0); log('UT-lookAt', 'dir after parent moved', f(t.getWorldDirection(new Vector3()))); }

// ---- trs order
{ const mk = (order) => { const c = new Object3D(); for (const k of order) ({p:()=>c.position.set(3,0.5,0), r:()=>c.rotation.y=Math.PI/2, s:()=>c.scale.set(2,1,1)})[k](); c.updateMatrix(); return c.matrix; };
  log('TR-Q1', 'same matrix?', mk('prs').equals(mk('rsp'))); }
{ const m = new Object3D(); m.position.set(3,0.5,0); m.applyMatrix4(new Matrix4().makeRotationY(Math.PI/2)); log('TR-Q2', 'pos', f(m.position), 'rot.y', m.rotation.y.toFixed(4)); }
{ const pos = (angle) => { const m = new Matrix4().makeTranslation(4,0,0); m.multiply(new Matrix4().makeRotationY(angle)); return f(new Vector3().setFromMatrixPosition(m)); };
  log('TR-Q3', 'copy position at angle 0 / 1 / 2:', pos(0), '/', pos(1), '/', pos(2)); }
{ const p = new Object3D(); p.rotation.z = Math.PI/6; p.scale.x = 2; p.updateMatrix(); const ax = new Vector3(1,0,0).transformDirection(p.matrix); log('TR-Q4', 'stretch axis (local x in parent)', f(ax), 'len of x col', new Vector3().setFromMatrixColumn(p.matrix,0).length()); }
{ const s = new Scene(); const h = new Group(); h.scale.set(3,1,1); s.add(h); const tile = new Object3D(); h.add(tile); tile.rotation.z = Math.PI/4; render(s);
  const e0 = new Vector3().setFromMatrixColumn(tile.matrixWorld,0), e1 = new Vector3().setFromMatrixColumn(tile.matrixWorld,1);
  log('TR-Q5', 'edge images', f(e0), f(e1), 'angle deg', THREE.MathUtils.radToDeg(e0.angleTo(e1)).toFixed(2), 'tile.scale', f(tile.scale)); }
// rotateOnWorldAxis under a turned parent
{ const s = new Scene(); const par = new Group(); par.rotation.z = Math.PI/2; s.add(par); const o = new Object3D(); par.add(o);
  o.rotateOnWorldAxis(new Vector3(1,0,0), Math.PI/2); const before = new Quaternion().setFromAxisAngle(new Vector3(0,0,1), Math.PI/2);
  const wq = o.getWorldQuaternion(new Quaternion()); const expected = new Quaternion().setFromAxisAngle(new Vector3(1,0,0), Math.PI/2).multiply(before);
  log('TR-L84', 'rotateOnWorldAxis(X) under Z-turned parent: world quat matches world-X turn?', wq.angleTo(expected) < 1e-6, 'angle off (deg)', THREE.MathUtils.radToDeg(wq.angleTo(expected)).toFixed(1)); }
// multiplyMatrices == a.clone().multiply(b)
{ const a = new Matrix4().makeRotationY(0.3).setPosition(1,2,3), b = new Matrix4().makeScale(2,1,1); log('TR-L82', new Matrix4().multiplyMatrices(a,b).equals(a.clone().multiply(b))); }

// ---- pivots
{ const s = new Scene(); const hinge = new Group(); hinge.position.set(2,1,0); s.add(hinge); const door = new Object3D(); hinge.add(door); door.position.x = 0.4; hinge.rotation.y = Math.PI/2;
  const edge = door.localToWorld(new Vector3(-0.4,0,0)); log('PV-Q2', 'door middle world', f(door.getWorldPosition(new Vector3())), 'hinge-edge world', f(edge)); }
{ const shape = new BoxGeometry(0.8,2,0.05); const A = new Mesh(shape), B = new Mesh(shape); A.geometry.translate(0.4,0,0); B.geometry.computeBoundingBox();
  log('PV-Q3', 'doorB geometry bbox x', B.geometry.boundingBox.min.x.toFixed(3), B.geometry.boundingBox.max.x.toFixed(3), 'positions', A.position.x, B.position.x); }
// object.pivot in r186
{ const s = new Scene(); const door = new Object3D(); s.add(door); door.pivot = new Vector3(-0.6,0,0); door.rotation.y = Math.PI/2; render(s);
  const hingeEdge = new Vector3(-0.6,0,0).applyMatrix4(door.matrixWorld); log('PV-pivot', 'hinge edge stays at', f(hingeEdge), 'getWorldPosition', f(door.getWorldPosition(new Vector3())), 'position', f(door.position));
  const before = door.localToWorld(new Vector3(0.3,0,0)); const g = new Group(); g.position.set(1,0,0); s.add(g); render(s); g.attach(door); render(s); const after = door.localToWorld(new Vector3(0.3,0,0));
  log('PV-attach', 'point before attach', f(before), 'after attach', f(after)); }
// bbox-centre recipe
{ const s = new Scene(); const model = new Mesh(new BoxGeometry(2,1,1).translate(1,0.5,0.5)); model.position.set(3,0,0); s.add(model); render(s);
  const w0 = new Box3().setFromObject(model); const center = w0.getCenter(new Vector3()); const pivot = new Group(); pivot.position.copy(center); s.add(pivot); pivot.add(model); model.position.sub(center); render(s);
  const w1 = new Box3().setFromObject(model); pivot.rotation.y = 1; render(s); log('PV-bbox', 'no jump', w0.equals(w1), 'center after spin', f(new Box3().setFromObject(model).getCenter(new Vector3())), 'vs', f(center)); }
// bar grows up
{ const s = new Scene(); const base = new Group(); s.add(base); const bar = new Mesh(new BoxGeometry(0.3,1,0.3)); base.add(bar); bar.position.y = 0.5; base.scale.y = 3; render(s);
  const b = new Box3().setFromObject(bar); log('PV-bar', 'min.y', b.min.y.toFixed(3), 'max.y', b.max.y.toFixed(3)); }

// ---- compose/decompose
{ const crate = new Object3D(); crate.rotation.set(0.1,0.2,0.3); const m = new Matrix4().compose(new Vector3(1,2,3), crate.rotation, new Vector3(1,1,1));
  const els = m.elements; log('CD-Q1', 'NaN count', els.filter(Number.isNaN).length, 'of 16; finite elements:', els.map((e,i)=>Number.isNaN(e)?null:i).filter(i=>i!==null).join(',')); }
{ const s = new Scene(); const rack = new Group(); rack.scale.set(2,1,1); s.add(rack); const panel = new Object3D(); rack.add(panel); panel.rotation.z = Math.PI/4; render(s);
  const copy = new Object3D(); panel.matrixWorld.decompose(copy.position, copy.quaternion, copy.scale); copy.updateMatrix();
  log('CD-Q2', 'copy.matrix equals panel.matrixWorld?', copy.matrix.equals(panel.matrixWorld), 'copy.scale', f(copy.scale));
  const m2 = new Object3D(); m2.matrix.copy(panel.matrixWorld); m2.matrixAutoUpdate = false; s.add(m2); render(s); log('CD-L59', 'copy.matrix route equal?', m2.matrixWorld.equals(panel.matrixWorld));
  for (const deg of [0, 90]) { panel.rotation.z = THREE.MathUtils.degToRad(deg); render(s); const c = new Object3D(); panel.matrixWorld.decompose(c.position, c.quaternion, c.scale); c.updateMatrix();
    const diff = Math.max(...c.matrix.elements.map((e,i)=>Math.abs(e-panel.matrixWorld.elements[i]))); log('CD-L44', deg+'deg max diff', diff.toExponential(2)); } }
{ const s = new Scene(); const car = new Group(); s.add(car); const wheel = new Object3D(); car.add(wheel); car.rotation.y = Math.PI/2; const t = wheel.getWorldQuaternion(new Quaternion());
  log('CD-Q3', 'turn', f(t), 'wheel.quaternion', f(wheel.quaternion)); }
// baking recipe
{ const s = new Scene(); const part = new Mesh(new BoxGeometry(1,1,1)); part.position.set(2,0,0); part.rotation.y = 0.5; part.scale.set(1,2,1); s.add(part); render(s); const b0 = new Box3().setFromObject(part, true);
  part.updateMatrix(); part.geometry.applyMatrix4(part.matrix); part.position.set(0,0,0); part.quaternion.identity(); part.scale.set(1,1,1); render(s); const b1 = new Box3().setFromObject(part, true);
  log('CD-bake', 'same world box', b0.min.distanceTo(b1.min) < 1e-9 && b0.max.distanceTo(b1.max) < 1e-9, 'rotation.y after identity', part.rotation.y); }

// ---- add vs attach
{ const s = new Scene(); const chair = new Object3D(); chair.position.set(1,0,2); s.add(chair); const g = new Group(); g.position.set(3,0,0); s.add(g); g.add(chair);
  log('AA-Q1', 'world', f(chair.getWorldPosition(new Vector3())));
  const s2 = new Scene(); const c2 = new Object3D(); c2.position.set(1,0,2); s2.add(c2); const g2 = new Group(); g2.position.set(3,0,0); s2.add(g2); g2.attach(c2); log('AA-Q1b', 'attach pos', f(c2.position)); }
{ const s = new Scene(); const player = new Group(); s.add(player); const hand = new Group(); hand.position.set(0.3,1,0.2); player.add(hand); const cup = new Object3D(); cup.position.set(0.35,1,0.25); s.add(cup);
  hand.attach(cup); player.position.set(8,0,-6); render(s); const letGo = cup.getWorldPosition(new Vector3()); s.add(cup); render(s);
  log('AA-Q2', 'let go at', f(letGo), 'landed at', f(cup.getWorldPosition(new Vector3()))); }
{ const s = new Scene(); const bolt = new Object3D(); s.add(bolt); const rack = new Group(); s.add(rack); rack.scale.setScalar(0.01); rack.attach(bolt); log('AA-Q3', 'bolt.scale', f(bolt.scale), 'raw x', bolt.scale.x); }
{ const s = new Scene(); const part = new Object3D(); s.add(part); const rack = new Group(); rack.rotation.y = THREE.MathUtils.degToRad(35); s.add(rack); rack.attach(part); log('AA-L80', 'rotation.y deg', THREE.MathUtils.radToDeg(part.rotation.y).toFixed(3)); }
{ const s = new Scene(); const part = new Object3D(); s.add(part); const rack = new Group(); s.add(rack); render(s); rack.position.set(5,0,0); rack.attach(part); log('AA-L81', 'world after attach right after parent move', f(part.getWorldPosition(new Vector3()))); }
// attach with non-uniform parent
{ const s = new Scene(); const part = new Object3D(); part.rotation.z = Math.PI/4; s.add(part); render(s); const w0 = part.matrixWorld.clone(); const rack = new Group(); rack.scale.set(2,1,1); s.add(rack); rack.attach(part); render(s);
  log('AA-L82', 'kept in place under (2,1,1)?', part.matrixWorld.equals(w0), 'max diff', Math.max(...part.matrixWorld.elements.map((e,i)=>Math.abs(e-w0.elements[i]))).toFixed(3)); }

// ---- negative scale
{ const s = new Scene(); const g = new Group(); g.scale.x = -1; s.add(g); const panel = new Mesh(new BoxGeometry()); g.add(panel); render(s);
  log('NS-Q1', 'child matrixWorld detAffine', panel.matrixWorld.determinantAffine(), 'child matrix det', panel.matrix.determinant()); }
{ const a = new Matrix4().makeScale(-1,1,1), b = new Matrix4().makeScale(-1,-1,1); log('NS-Q2', a.determinant() < 0, b.determinant() < 0); }
{ const g = new BoxGeometry(1,1,1).toNonIndexed(); const before = new Vector3(); const tri = (geo) => { const p = geo.attributes.position; const A = new Vector3().fromBufferAttribute(p,0), B = new Vector3().fromBufferAttribute(p,1), C = new Vector3().fromBufferAttribute(p,2); const n = new THREE.Triangle(A,B,C).getNormal(new Vector3()); return { n, c: A.clone().add(B).add(C).divideScalar(3), stored: new Vector3().fromBufferAttribute(geo.attributes.normal,0) }; };
  const t0 = tri(g); g.scale(-1,1,1); const t1 = tri(g); log('NS-Q3', 'winding normal before', f(t0.n), 'centroid', f(t0.c), '| after bake winding normal', f(t1.n), 'centroid', f(t1.c), 'stored normal', f(t1.stored));
  const m = new Mesh(new BoxGeometry(1,1,1)); m.geometry.scale(-1,1,1); m.updateMatrixWorld(); log('NS-Q3b', 'mesh det after geometry bake', m.matrixWorld.determinantAffine()); }
// raycast on baked mirror (NS L90-91) and on scale.x=-1
{ const s = new Scene(); const baked = new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial()); baked.geometry.scale(-1,1,1); s.add(baked); render(s);
  const rc = new Raycaster(new Vector3(5,0,0), new Vector3(-1,0,0)); const h = rc.intersectObject(baked)[0]; log('NS-L90', 'baked: hit x', h.point.x, 'face.normal', f(h.face.normal));
  const s2 = new Scene(); const mir = new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial()); mir.scale.x = -1; s2.add(mir); render(s2); const h2 = rc.intersectObject(mir)[0]; log('NS-L94', 'scale.x=-1: hit x', h2.point.x, 'face.normal (local)', f(h2.face.normal));
  const g2 = new BoxGeometry(1,1,1).toNonIndexed(); g2.scale(-1,1,1); g2.computeVertexNormals(); const n0 = new Vector3().fromBufferAttribute(g2.attributes.normal,0), p0 = new Vector3().fromBufferAttribute(g2.attributes.position,0); log('NS-L92', 'computeVertexNormals after bake: normal', f(n0), 'on face at', f(p0)); }
// decompose of mirrored: attach with scale (1,-1,1)
{ const s = new Scene(); const o = new Object3D(); o.scale.set(1,-1,1); s.add(o); const g = new Group(); g.position.set(1,0,0); s.add(g); g.attach(o); log('NS-L100', 'after attach scale', f(o.scale), 'rotation', f(new Vector3(o.rotation.x,o.rotation.y,o.rotation.z))); }
// clone shares geometry/material
{ const r = new Mesh(new BoxGeometry(), new MeshBasicMaterial()); const l = r.clone(); log('NS-L62', 'shares geo', l.geometry === r.geometry, 'shares mat', l.material === r.material); }

// ---- normal matrix
{ const ramp = new Object3D(); ramp.scale.set(3,1,1); ramp.updateMatrixWorld(); const n = new Vector3(-0.6,0.8,0).transformDirection(ramp.matrixWorld); const good = new Vector3(-0.6,0.8,0).applyNormalMatrix(new Matrix3().getNormalMatrix(ramp.matrixWorld));
  const surf = new Vector3(0.8,0.6,0).multiply(new Vector3(3,1,1)).normalize(); log('NM-Q1', 'tD', f(n), 'dot surface', n.dot(surf).toFixed(3), '| normalMatrix', f(good), 'dot surface', good.dot(surf).toFixed(3)); }
{ const lamp = new Object3D(); lamp.scale.setScalar(2.5); lamp.rotation.y = THREE.MathUtils.degToRad(70); lamp.updateMatrixWorld(); const nrm = new Vector3(0.3,0.9,-0.2).normalize();
  const a = nrm.clone().transformDirection(lamp.matrixWorld), b = nrm.clone().applyNormalMatrix(new Matrix3().getNormalMatrix(lamp.matrixWorld)); log('NM-Q2', 'tD vs normalMatrix angle', a.angleTo(b).toExponential(2), 'len', a.length().toFixed(4)); }
{ const m = new Matrix3().getNormalMatrix(new Matrix4().makeScale(2,1,1)); log('NM-L49', 'normal matrix of scale(2,1,1) diag', m.elements[0], m.elements[4], m.elements[8]); const v = new Vector3(1,1,0).applyMatrix3(m); log('NM-L66', 'applyMatrix3 len', v.length().toFixed(3), 'applyNormalMatrix len', new Vector3(1,1,0).normalize().applyNormalMatrix(m).length().toFixed(3)); }
{ const box = new Object3D(); box.scale.set(2,1,1); box.updateMatrixWorld(); log('NM-L55', 'box side normals', f(new Vector3(1,0,0).transformDirection(box.matrixWorld)), f(new Vector3(0,1,0).transformDirection(box.matrixWorld))); }
{ const mesh = new Mesh(new BoxGeometry()); log('NM-L84', 'normalMatrix before render is identity', mesh.normalMatrix.equals(new Matrix3())); }
// NM-Q5 rim: object stretched y3, camera at +z looking down -z, normal tilted a bit up
{ const cam = new THREE.PerspectiveCamera(); cam.position.set(0,0,5); cam.updateMatrixWorld(); const part = new Object3D(); part.scale.set(1,3,1); part.updateMatrixWorld();
  const mv = new Matrix4().multiplyMatrices(cam.matrixWorldInverse, part.matrixWorld); const nm = new Matrix3().getNormalMatrix(mv); const m3 = new Matrix3().setFromMatrix4(mv);
  for (const deg of [0, 20, 40]) { const r = THREE.MathUtils.degToRad(deg); const n = new Vector3(0, Math.sin(r), Math.cos(r)); // local normal of a sphere-ish point
    const wrong = n.clone().applyMatrix3(m3).normalize(), right = n.clone().applyNormalMatrix(nm); log('NM-Q5', `local tilt ${deg}: rim wrong`, (1-wrong.z).toFixed(3), 'rim right', (1-right.z).toFixed(3)); } }

// ---- inverse
{ const sh = new Object3D(); sh.position.set(3,0,-2); log('IN-Q1', f(sh.worldToLocal(new Vector3(3,1,-2))), '| applyMatrix4(matrixWorld)', (sh.updateMatrixWorld(), f(new Vector3(3,1,-2).applyMatrix4(sh.matrixWorld)))); }
{ const c = new Object3D(); c.position.set(1,2,3); c.rotation.set(0.3,0.5,0.2); c.scale.set(1,2,3); c.updateMatrixWorld(); const tw = c.matrixWorld, tc = c.matrixWorld.clone().invert(); log('IN-Q2', f(new Vector3(0.2,0.5,0).applyMatrix4(tw).applyMatrix4(tc))); }
{ const s = new Scene(); const part = new Mesh(new BoxGeometry(1,1,1)); part.position.set(5,0,0); s.add(part); render(s); const before = part.matrixWorld.clone(); const toPart = part.matrixWorld.invert();
  log('IN-Q3', 'same object', toPart === part.matrixWorld, 'matrixWorld changed', !part.matrixWorld.equals(before)); const rc = new Raycaster(new Vector3(5,0,10), new Vector3(0,0,-1)); log('IN-Q3b', 'hits at real spot', rc.intersectObject(part).length); }
{ const arm = new Object3D(); arm.position.set(2,0,0); arm.rotation.y = Math.PI/4; arm.updateMatrixWorld(); const undo = arm.matrixWorld.clone().transpose(); const w = new Vector3(1,1,1).applyMatrix4(arm.matrixWorld);
  log('IN-Q4', 'transpose round-trip of (1,1,1):', f(w.clone().applyMatrix4(undo)), '| invert:', f(w.clone().applyMatrix4(arm.matrixWorld.clone().invert()))); }
{ const b = new Object3D(); b.scale.set(0,0,0); log('IN-Q5', f(b.worldToLocal(new Vector3(1,2,0))), '| inverse all zeros', b.matrixWorld.clone().invert().elements.every((e)=>e===0)); const b2 = new Object3D(); b2.scale.set(1,0,1); log('IN-L105', f(b2.worldToLocal(new Vector3(1,2,0)))); }
{ const cam = new THREE.PerspectiveCamera(); cam.position.set(1,2,3); cam.updateMatrixWorld(); log('IN-L110', 'matrixWorldInverse == inverse', cam.matrixWorldInverse.equals(cam.matrixWorld.clone().invert())); }
