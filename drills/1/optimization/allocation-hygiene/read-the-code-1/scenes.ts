// Scenes for the allocation hygiene page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, hideFloorHelpers, label, line, overlay, setLine, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const SIDE = 20;
const UP = new THREE.Vector3(0, 1, 0); // the cone's tip, before it's turned
const ONE = new THREE.Vector3(1, 1, 1);
const n = (value: number) => value.toLocaleString('en-US');

export const markers: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 3.1, 4.0);
  controls.target.set(0, 0.35, 0.1);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 5, 3), 0.7, 2);

  const target = ball(COLORS.yellow, 1, 0.14);
  scene.add(target);

  const count = SIDE * SIDE;
  const markers = new THREE.InstancedMesh(new THREE.ConeGeometry(0.05, 0.22, 8), new THREE.MeshStandardMaterial({ color: COLORS.blue }), count);
  const spots = Array.from({ length: count }, (_, i) => new THREE.Vector3(-1.9 + (i % SIDE) * 0.2, 0.15, -1.9 + Math.floor(i / SIDE) * 0.2));
  // The markers turn but never move, so bounds worked out from their spots stay right.
  spots.forEach((spot, i) => markers.setMatrixAt(i, new THREE.Matrix4().makeTranslation(spot)));
  markers.computeBoundingSphere();
  scene.add(markers);

  // Made once, for the scratch version.
  const _dir = new THREE.Vector3();
  const _turn = new THREE.Quaternion();
  const _matrix = new THREE.Matrix4();

  let scratch = false;
  let created = 0;
  let total = 0;
  choiceButtons(overlay(container, 'controls'), [
    { html: 'new objects in the loop', select: () => (scratch = false) },
    { html: 'scratch objects made once', select: () => (scratch = true) },
  ]);

  const readout = overlay(container, 'readout');
  onFrame((_, elapsed) => {
    target.position.set(Math.cos(elapsed * 0.6) * 1.6, 0.9, Math.sin(elapsed * 0.6) * 1.6);
    created = 0;
    spots.forEach((spot, i) => {
      if (scratch) {
        _dir.subVectors(target.position, spot).normalize();
        _turn.setFromUnitVectors(UP, _dir);
        markers.setMatrixAt(i, _matrix.compose(spot, _turn, ONE));
      } else {
        const dir = target.position.clone().sub(spot).normalize();
        const turn = new THREE.Quaternion().setFromUnitVectors(UP, dir);
        markers.setMatrixAt(i, new THREE.Matrix4().compose(spot, turn, ONE));
        created += 3;
      }
    });
    markers.instanceMatrix.needsUpdate = true;
    total += created;
    readout.textContent = [
      scratch
        ? '_dir.subVectors(target.position, spot) // _dir, _turn, _matrix made once'
        : 'const dir = target.position.clone().sub(spot) // + new Quaternion(), new Matrix4()',
      `objects created this frame: ${created ? `${n(created)}, 3 for each of ${count} markers` : 'none'}`,
      `created since the scene started: ${n(total)}, all garbage now`,
      'the picture is the same either way',
    ].join('\n');
  });
};

// A small shelving unit: two posts and three planks.
function shelving(color: string) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color });
  for (const x of [-0.5, 0.5]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.3, 0.05), material);
    post.position.set(x, 0.65, 0);
    group.add(post);
  }
  for (const y of [0.25, 0.7, 1.15]) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.04, 0.4), material);
    plank.position.y = y;
    group.add(plank);
  }
  return group;
}

export const shared: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0.2, 1.7, 3.7);
  controls.target.set(0.2, 0.72, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 5, 4), 0.8, 2);

  const shelfA = shelving(COLORS.blue);
  shelfA.position.x = -1.3;
  const shelfB = shelving(COLORS.orange);
  shelfB.position.x = 1.4;
  scene.add(shelfA, shelfB);

  const markerA = ball(COLORS.blue, 1, 0.1);
  const markerB = ball(COLORS.orange, 1, 0.1);
  const tagA = label('a', COLORS.blue);
  const tagB = label('b', COLORS.orange);
  const gap = line(COLORS.white);
  scene.add(markerA, markerB, tagA, tagB, gap);

  // The two versions of centerOf: one returns its scratch vector, one writes into the caller's.
  const _box = new THREE.Box3();
  const _center = new THREE.Vector3();
  const centerOfShared = (part: THREE.Object3D) => _box.setFromObject(part).getCenter(_center);
  const centerOfInto = (part: THREE.Object3D, target: THREE.Vector3) => _box.setFromObject(part).getCenter(target);
  const centerA = new THREE.Vector3();
  const centerB = new THREE.Vector3();
  const liftA = new THREE.Vector3(-0.14, 0.28, 0);
  const liftB = new THREE.Vector3(0.14, 0.28, 0);

  let fixed = false;
  const bar = overlay(container, 'controls');
  choiceButtons(bar, [
    { html: 'return the scratch vector', select: () => (fixed = false) },
    { html: 'write into a target', select: () => (fixed = true) },
  ]);
  slider(bar, 'Move shelf B', { min: 0.2, max: 2.2, step: 0.1, value: shelfB.position.x }, (x) => (shelfB.position.x = x));

  const readout = overlay(container, 'readout');
  onFrame(() => {
    let a: THREE.Vector3;
    let b: THREE.Vector3;
    if (fixed) {
      a = centerOfInto(shelfA, centerA);
      b = centerOfInto(shelfB, centerB);
    } else {
      a = centerOfShared(shelfA);
      b = centerOfShared(shelfB); // writes into the same vector a is
    }
    markerA.position.copy(a);
    markerB.position.copy(b);
    tagA.position.copy(a).add(liftA);
    tagB.position.copy(b).add(liftB);
    setLine(gap, a, b);
    readout.textContent = [
      fixed ? 'const a = centerOf(shelfA, centerA); const b = centerOf(shelfB, centerB);' : 'const a = centerOf(shelfA); const b = centerOf(shelfB);',
      `a === b: ${a === b}${a === b ? ", so both hold shelf B's center" : ''}`,
      `a.distanceTo(b): ${formatNumber(a.distanceTo(b))}${a === b ? ', though the shelves are apart' : ''}`,
    ].join('\n');
  });
};
