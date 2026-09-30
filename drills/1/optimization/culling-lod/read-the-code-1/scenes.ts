// Scenes for the culling and LOD page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, hideFloorHelpers, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const STEEL = new THREE.Color(COLORS.gray);
const BIN = new THREE.Color(COLORS.blue);

// One piece of a rack, moved into place and painted with a vertex color, ready to merge.
function piece(geometry: THREE.BufferGeometry, x: number, y: number, z: number, color: THREE.Color) {
  geometry.translate(x, y, z);
  const colors = new Float32Array(geometry.attributes.position.count * 3);
  for (let i = 0; i < colors.length; i += 3) color.toArray(colors, i);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

// Three versions of the same rack, each one geometry: every bin and rounded post; flat posts and a
// block per shelf of bins; and a single box.
function rackVersions() {
  const detailed: THREE.BufferGeometry[] = [];
  const simple: THREE.BufferGeometry[] = [];
  for (const x of [-1.6, 1.6]) {
    for (const z of [-0.3, 0.3]) {
      detailed.push(piece(new THREE.CylinderGeometry(0.035, 0.035, 2, 16, 6), x, 1, z, STEEL));
      simple.push(piece(new THREE.BoxGeometry(0.07, 2, 0.07), x, 1, z, STEEL));
    }
  }
  for (const y of [0.3, 0.8, 1.3, 1.8]) {
    detailed.push(piece(new THREE.BoxGeometry(3.2, 0.04, 0.6), 0, y, 0, STEEL));
    simple.push(piece(new THREE.BoxGeometry(3.2, 0.04, 0.6), 0, y, 0, STEEL));
  }
  for (const y of [0.3, 0.8, 1.3]) {
    for (let i = 0; i < 12; i++) detailed.push(piece(new THREE.BoxGeometry(0.22, 0.18, 0.4, 2, 2, 2), -1.43 + i * 0.26, y + 0.11, 0, BIN));
    simple.push(piece(new THREE.BoxGeometry(3.1, 0.18, 0.4), 0, y + 0.11, 0, BIN));
  }
  const box = piece(new THREE.BoxGeometry(3.2, 2, 0.6), 0, 1, 0, STEEL);
  return { detailed: mergeGeometries(detailed), simple: mergeGeometries(simple), box };
}

const triangles = (geometry: THREE.BufferGeometry) => geometry.index!.count / 3;
const n = (value: number) => value.toLocaleString('en-US');
const LEVEL_NAMES = ['detailed', 'simple', 'box'];

export const aisle: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(3, 8, 2), 0.9, 1.6);
  const steel = new THREE.MeshStandardMaterial({ vertexColors: true });
  const versions = rackVersions();

  // 16 racks, 8 on each side of the aisle, long sides facing it.
  const spots: THREE.Matrix4[] = [];
  for (const x of [-1.4, 1.4]) {
    for (let k = 0; k < 8; k++) spots.push(new THREE.Matrix4().compose(new THREE.Vector3(x, 0, -1 - 4 * k), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2), new THREE.Vector3(1, 1, 1)));
  }

  let drawnLevels = [0, 0, 0];
  let lastLevels = [0, 0, 0];
  const counted = (mesh: THREE.Mesh, level: number) => {
    mesh.onBeforeRender = () => void (drawnLevels[level] += 1);
    return mesh;
  };

  const full = new THREE.Group();
  const lods = new THREE.Group();
  for (const matrix of spots) {
    const rack = counted(new THREE.Mesh(versions.detailed, steel), 0);
    rack.applyMatrix4(matrix);
    full.add(rack);

    const lod = new THREE.LOD();
    lod.addLevel(counted(new THREE.Mesh(versions.detailed, steel), 0), 0);
    lod.addLevel(counted(new THREE.Mesh(versions.simple, steel), 1), 8);
    lod.addLevel(counted(new THREE.Mesh(versions.box, steel), 2), 20);
    lod.applyMatrix4(matrix);
    lods.add(lod);
  }
  const merged = new THREE.Mesh(mergeGeometries(spots.map((matrix) => versions.detailed.clone().applyMatrix4(matrix))), steel);
  let mergedDrawn = 0;
  merged.onBeforeRender = () => void (mergedDrawn += 1);
  let lastMerged = 0;

  const modes = [full, lods, merged];
  let mode = 0;
  scene.add(...modes);

  // Walking and turning move the camera and the point it looks at together.
  const view = { walk: 0, turn: 0 };
  const place = () => {
    const yaw = THREE.MathUtils.degToRad(view.turn);
    camera.position.set(0, 1.6, 4 - view.walk);
    controls.target.set(Math.sin(yaw) * 5, 1.2, camera.position.z - Math.cos(yaw) * 5);
  };
  place();

  const bar = overlay(container, 'controls');
  choiceButtons(
    bar,
    ['full detail', 'LOD', 'one merged mesh'].map((html, i) => ({
      html,
      select: () => {
        mode = i;
        modes.forEach((object, j) => (object.visible = j === i));
      },
    })),
  );
  slider(bar, 'walk', { min: 0, max: 24, step: 0.5, value: 0 }, (value) => ((view.walk = value), place()));
  slider(bar, 'turn', { min: -80, max: 80, step: 1, value: 0 }, (value) => ((view.turn = value), place()));

  const readout = overlay(container, 'readout');
  // Runs before each render, so the counts are the last frame's.
  onFrame(() => {
    lastLevels = drawnLevels;
    drawnLevels = [0, 0, 0];
    lastMerged = mergedDrawn;
    mergedDrawn = 0;
    const racksDrawn = lastLevels[0] + lastLevels[1] + lastLevels[2];
    const { calls, triangles: drawn } = renderer.info.render;
    const lines = [
      [`${spots.length} × new Mesh(detailedRack, steel)`, 'lod.addLevel(detailed, 0); addLevel(simple, 8); addLevel(box, 20)', 'new Mesh(mergeGeometries(allRacks), steel)'][mode],
      mode === 2
        ? lastMerged
          ? `one mesh, drawn whole: all ${spots.length} racks, in view or not`
          : 'one mesh, and all of it is out of view: skipped'
        : `racks drawn: ${racksDrawn} of ${spots.length}${racksDrawn < spots.length ? `, the other ${spots.length - racksDrawn} culled` : ', none out of view'}`,
      mode === 1 ? `showing: ${LEVEL_NAMES.map((name, i) => `${lastLevels[i]} ${name}`).join(' · ')}` : `every rack drawn at full detail, ${n(triangles(versions.detailed))} triangles each`,
      `renderer.info.render.calls ${calls} · triangles ${n(drawn)}`,
    ];
    readout.textContent = lines.join('\n');
  });
};
