// Scenes for the isolation page. The README places each one with <div data-scene="name">.
import { COLORS, label, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A button that turns something on and off, marked pressed while it's on.
function toggle(bar: HTMLElement, html: string, on: boolean, onChange: (on: boolean) => void) {
  const button = document.createElement('button');
  button.innerHTML = html;
  button.setAttribute('aria-pressed', String(on));
  button.addEventListener('click', () => {
    on = !on;
    button.setAttribute('aria-pressed', String(on));
    onChange(on);
  });
  bar.append(button);
}

const CRATES = 8;
const CULPRIT = 5; // the sixth crate, whose label sits exactly on its front face

export const zFight: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0.9, 1.3, 3.3);
  controls.target.set(0.25, 0.35, 0);
  sunlight(scene, new THREE.Vector3(1, 3, 4), 1, 2);
  const axes = scene.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false; // its lines would cross the shelf

  const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.06, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  shelf.position.y = 0.05;
  scene.add(shelf);

  const crateGeometry = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  const labelGeometry = new THREE.PlaneGeometry(0.32, 0.2);
  const crates: THREE.Group[] = [];
  const meshes: THREE.Mesh[] = [];
  for (let i = 0; i < CRATES; i++) {
    const crate = new THREE.Group();
    crate.position.set(-2.1 + i * 0.6, 0.31, 0);
    const box = new THREE.Mesh(crateGeometry, new THREE.MeshStandardMaterial({ color: i % 2 ? COLORS.blue : '#2f6fd6' }));
    crate.add(box);
    meshes.push(box);
    if (i === CULPRIT) {
      // A label placed exactly on the front face: two surfaces at the same depth.
      const sticker = new THREE.Mesh(labelGeometry, new THREE.MeshStandardMaterial({ color: COLORS.white }));
      sticker.position.z = 0.225;
      crate.add(sticker);
      meshes.push(sticker);
    }
    const number = label(String(i + 1), COLORS.gray);
    number.position.set(0, 0.42, 0);
    crate.add(number);
    crates.push(crate);
    scene.add(crate);
  }

  const originals = new Map(meshes.map((mesh) => [mesh, mesh.material]));
  const colors = [COLORS.red, COLORS.green, COLORS.yellow, COLORS.purple, COLORS.orange];
  const flat = meshes.map((_, i) => new THREE.MeshBasicMaterial({ color: colors[i % colors.length] }));

  let from = 1;
  let to = CRATES;
  let colorEach = false;
  const bar = overlay(container, 'controls');
  slider(bar, 'show from', { min: 1, max: CRATES, step: 1, value: from }, (value) => (from = value));
  slider(bar, 'to', { min: 1, max: CRATES, step: 1, value: to }, (value) => (to = value));
  toggle(bar, 'one color per mesh', colorEach, (on) => (colorEach = on));

  const readout = overlay(container, 'readout');
  onFrame(() => {
    const low = Math.min(from, to);
    const high = Math.max(from, to);
    crates.forEach((crate, i) => (crate.visible = i + 1 >= low && i + 1 <= high));
    meshes.forEach((mesh, i) => (mesh.material = colorEach ? flat[i] : originals.get(mesh)!));

    const shown = high - low + 1;
    const stripes = CULPRIT + 1 >= low && CULPRIT + 1 <= high;
    const meshCount = crates.slice(low - 1, high).reduce((sum, crate) => sum + crate.children.filter((c) => c instanceof THREE.Mesh).length, 0);
    readout.textContent = [
      `crates.forEach((crate, i) => (crate.visible = i >= ${low - 1} && i <= ${high - 1}))`,
      `showing crates ${low} to ${high}: ${shown} crate${shown === 1 ? '' : 's'}, ${meshCount} mesh${meshCount === 1 ? '' : 'es'}`,
      stripes
        ? shown === 1
          ? `stripes: still there, so it's crate ${low}${colorEach ? ': two meshes fight over one face' : ''}`
          : 'stripes: still there, so the cause is in this range'
        : 'stripes: gone, so the cause is in the crates hidden now',
    ].join('\n');
  });
};

export const hotspot: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(1.6, 2, 3.6);
  controls.target.set(0, 0.9, 0);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 1, 2);
  // The floor grid and axes are lines; each would add to every count.
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  // A rack frame of many thin parts.
  const frame = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  for (const x of [-1.2, 1.2]) {
    for (const z of [-0.35, 0.35]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.8, 0.05), steel);
      post.position.set(x, 0.9, z);
      frame.add(post);
    }
  }
  for (const y of [0.3, 0.9, 1.5]) {
    for (const z of [-0.35, 0.35]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.04), steel);
      rail.position.set(0, y, z);
      frame.add(rail);
    }
    for (let i = 0; i < 7; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.7), steel);
      slat.position.set(-1.05 + i * 0.35, y, 0);
      frame.add(slat);
    }
  }

  // Bins on the shelves, and a label on each.
  const bins = new THREE.Group();
  const labels = new THREE.Group();
  const binMaterial = new THREE.MeshStandardMaterial({ color: COLORS.blue });
  const binGeometry = new THREE.BoxGeometry(0.4, 0.25, 0.5);
  for (const y of [0.3, 0.9, 1.5]) {
    for (let i = 0; i < 4; i++) {
      const bin = new THREE.Mesh(binGeometry, binMaterial);
      bin.position.set(-0.9 + i * 0.6, y + 0.14, 0);
      bins.add(bin);
      const tag = label(`B${bins.children.length}`, COLORS.white);
      tag.position.set(bin.position.x, bin.position.y + 0.25, 0.3);
      tag.scale.multiplyScalar(0.6);
      labels.add(tag);
    }
  }

  // One cable, far more finely made than it looks.
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.3, 1.75, 0.4),
    new THREE.Vector3(-0.4, 1.95, 0.45),
    new THREE.Vector3(0.5, 1.7, 0.45),
    new THREE.Vector3(1.3, 1.9, 0.4),
  ]);
  const cable = new THREE.Mesh(new THREE.TubeGeometry(path, 3000, 0.025, 64), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  scene.add(frame, bins, labels, cable);

  const groups = [
    { name: 'frame', object: frame as THREE.Object3D },
    { name: 'bins', object: bins as THREE.Object3D },
    { name: 'labels', object: labels as THREE.Object3D },
    { name: 'cable', object: cable as THREE.Object3D },
  ];
  const bar = overlay(container, 'controls');
  bar.append('Show:');
  for (const group of groups) toggle(bar, group.name, true, (on) => (group.object.visible = on));

  const readout = overlay(container, 'readout');
  const n = (value: number) => value.toLocaleString('en-US');
  // Runs before each render, so these are the last render's counts.
  onFrame(() => {
    const { calls, triangles } = renderer.info.render;
    const shown = groups.filter((group) => group.object.visible).map((group) => group.name);
    readout.textContent = [
      `visible: ${shown.join(', ') || 'nothing'}`,
      `renderer.info.render.calls      ${n(calls)}`,
      `renderer.info.render.triangles  ${n(triangles)}`,
    ].join('\n');
  });
};
