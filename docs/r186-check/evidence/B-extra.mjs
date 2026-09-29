// Run as: cd repo && node --input-type=module < extra.mjs
import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

// TransformControls helper is hit by scene-wide raycasts (hidden pickers included)
const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.set(0, 0, 10); cam.updateMatrixWorld();
const scene = new THREE.Scene();
const box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()); scene.add(box);
const tc = new TransformControls(cam); tc.attach(box);
const helper = tc.getHelper(); scene.add(helper);
console.log('TransformControls is Object3D?', tc.isObject3D === true, '| helper is Object3D', helper.isObject3D);
scene.updateMatrixWorld(true);
const hits = new THREE.Raycaster(new THREE.Vector3(0.6, 0.02, 10), new THREE.Vector3(0, 0, -1)).intersectObjects(scene.children);
const underHelper = hits.filter(h => { let o = h.object; while (o) { if (o === helper) return true; o = o.parent; } return false; });
console.log('scene-wide raycast hits:', hits.length, '| hits on gizmo/picker meshes:', underHelper.length);

// InstancedMesh bounding sphere goes stale after setMatrixAt
const im = new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial(), 2);
im.setMatrixAt(0, new THREE.Matrix4()); im.setMatrixAt(1, new THREE.Matrix4()); im.updateMatrixWorld();
const rc = (x) => new THREE.Raycaster(new THREE.Vector3(x, 0, 10), new THREE.Vector3(0, 0, -1)).intersectObject(im).length;
console.log('initial hits at x=0:', rc(0), '| boundingSphere computed lazily:', im.boundingSphere !== null);
im.setMatrixAt(1, new THREE.Matrix4().makeTranslation(30, 0, 0)); im.instanceMatrix.needsUpdate = true;
console.log('instance 1 moved to x=30, stale bounds -> hits at x=30:', rc(30));
im.computeBoundingSphere(); console.log('after im.computeBoundingSphere():', rc(30));

// Watertight triangle test: a ray through a shared edge reports both triangles
const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial()); m.updateMatrixWorld();
const on = new THREE.Raycaster(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -1)).intersectObject(m);
const off = new THREE.Raycaster(new THREE.Vector3(0.3, 0.5, 10), new THREE.Vector3(0, 0, -1)).intersectObject(m);
console.log('ray through shared diagonal: hits', on.length, 'faceIndex', on.map(h => h.faceIndex), '| off-edge hits', off.length);
