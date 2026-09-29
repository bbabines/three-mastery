// Scenes for the leak detection page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, formatBytes, geometryBytes, hideFloorHelpers, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const PALETTE = ['#1e3a8a', '#b91c1c', '#15803d', '#a16207', '#6b21a8', '#0f766e', '#be185d', '#c2410c'];

function canvasTexture(size: number, draw: (context: CanvasRenderingContext2D) => void, color = true) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  draw(canvas.getContext('2d')!);
  const texture = new THREE.CanvasTexture(canvas);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// A product variant: a body, a lid, and a label. Each part has its own geometry and a color map,
// and the label also has a normal map: 3 geometries and 4 textures a variant.
function makeVariant(index: number) {
  const color = PALETTE[index % PALETTE.length];
  const paint = () =>
    canvasTexture(256, (context) => {
      context.fillStyle = color;
      context.fillRect(0, 0, 256, 256);
      context.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let y = 0; y < 256; y += 32) context.fillRect(0, y, 256, 10);
    });
  const bumps = canvasTexture(
    256,
    (context) => {
      context.fillStyle = 'rgb(128, 128, 255)'; // a flat normal
      context.fillRect(0, 0, 256, 256);
      context.fillStyle = 'rgb(170, 128, 230)';
      for (let x = 16; x < 256; x += 48) context.fillRect(x, 0, 12, 256);
    },
    false,
  );
  const variant = new THREE.Group();
  variant.name = `variant ${index + 1}`;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.55), new THREE.MeshStandardMaterial({ map: paint() }));
  body.position.y = 0.33;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32), new THREE.MeshStandardMaterial({ map: paint() }));
  lid.position.y = 0.66;
  const print = canvasTexture(256, (context) => {
    context.fillStyle = '#f3f4f6';
    context.fillRect(0, 0, 256, 256);
    context.fillStyle = color;
    for (let y = 40; y < 230; y += 44) context.fillRect(24, y, 150 + ((y * 7) % 60), 18);
  });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.26), new THREE.MeshStandardMaterial({ map: print, normalMap: bumps }));
  label.position.set(0, 0.33, 0.285);
  variant.add(body, lid, label);
  return variant;
}

const meshesOf = (variant: THREE.Object3D) => variant.children as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>[];
const texturesOf = (material: THREE.Material) => Object.values(material).filter((value): value is THREE.Texture => value instanceof THREE.Texture);

// Frees everything a variant owns, whatever the unload code under test did.
function disposeAll(variant: THREE.Object3D) {
  for (const mesh of meshesOf(variant)) {
    mesh.geometry.dispose();
    for (const texture of texturesOf(mesh.material)) texture.dispose();
    mesh.material.dispose();
  }
}

// A plain button in a controls bar, for actions rather than choices.
function actionButton(bar: HTMLElement, text: string, onClick: () => void) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  bar.append(button);
  return button;
}

const SWAP_EVERY = 4; // frames each variant stays on screen, so every one is drawn, and uploaded

export const cycles: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.9, 1.1, 2.1);
  controls.target.set(0, 0.4, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.7, 2);

  const UNLOADS = [
    'unload: scene.remove(variant)',
    'unload: remove it, then dispose each geometry, material, and material.map',
    'unload: remove it, then dispose each geometry, material, and every texture it holds',
  ];
  const unload = (variant: THREE.Object3D, mode: number) => {
    scene.remove(variant);
    if (mode === 0) return;
    for (const mesh of meshesOf(variant)) {
      mesh.geometry.dispose();
      if (mode === 1) mesh.material.map?.dispose();
      else for (const texture of texturesOf(mesh.material)) texture.dispose();
      mesh.material.dispose();
    }
  };

  let mode = 0;
  let count = 0;
  let current = makeVariant(count);
  scene.add(current);
  const everything: THREE.Object3D[] = [current]; // every variant made, to clean up between versions
  let pending = 0;
  let wait = 0;
  let history: string[] = [];

  const startOver = () => {
    pending = 0;
    scene.remove(current);
    for (const variant of everything) disposeAll(variant);
    everything.length = 0;
    current = makeVariant(0);
    everything.push(current);
    scene.add(current);
    count = 0;
    history = [];
  };

  const bar = overlay(container, 'controls');
  choiceButtons(
    buttonGroup(bar, 'Unload:'),
    ['remove only', 'dispose map', 'dispose every texture'].map((html, i) => ({ html, select: () => ((mode = i), startOver()) })),
  );
  actionButton(buttonGroup(bar), 'Run 5 cycles', () => (pending += 5));

  const readout = overlay(container, 'readout');
  onFrame(() => {
    // One cycle: unload the variant on screen, count what's left on the GPU, load the next.
    if (pending > 0 && ++wait >= SWAP_EVERY) {
      wait = 0;
      pending -= 1;
      unload(current, mode);
      const { geometries, textures } = renderer.info.memory;
      history.push(`${geometries}/${textures}`);
      if (history.length > 10) history.shift();
      count += 1;
      current = makeVariant(count);
      everything.push(current);
      scene.add(current);
    }
    const { geometries, textures } = renderer.info.memory;
    const first = history[0];
    const last = history[history.length - 1];
    readout.textContent = [
      UNLOADS[mode],
      `cycles run: ${count} · renderer.info.memory now: geometries ${geometries} · textures ${textures}`,
      `left after each cycle (geometries/textures): ${history.length ? history.join('  ') : 'run some cycles'}`,
      history.length < 2 ? '' : first === last && history.every((entry) => entry === first) ? 'back to the same counts every cycle: no leak' : 'climbing with every cycle: a leak',
    ]
      .filter(Boolean)
      .join('\n');
  });
};

export const history: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.9, 1.1, 2.1);
  controls.target.set(0, 0.4, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.7, 2);

  let keepModels = true;
  let count = 0;
  let current = makeVariant(count);
  scene.add(current);
  let undo: (THREE.Object3D | string)[] = [];
  let pending = 0;
  let wait = 0;

  const bar = overlay(container, 'controls');
  choiceButtons(buttonGroup(bar, 'Undo keeps:'), [
    { html: '<code>history.push(old)</code>', select: () => ((keepModels = true), (undo = [])) },
    { html: '<code>history.push(old.name)</code>', select: () => ((keepModels = false), (undo = [])) },
  ]);
  actionButton(buttonGroup(bar), 'Swap 5 times', () => (pending += 5));

  // What the kept variants still hold after dispose(): their vertex arrays, and their canvases.
  const heldBytes = () =>
    undo.reduce<number>((sum, item) => {
      if (typeof item === 'string') return sum;
      for (const mesh of meshesOf(item)) {
        sum += geometryBytes(mesh.geometry);
        for (const texture of texturesOf(mesh.material)) {
          const { width, height } = texture.image as HTMLCanvasElement;
          sum += width * height * 4;
        }
      }
      return sum;
    }, 0);

  const readout = overlay(container, 'readout');
  onFrame(() => {
    if (pending > 0 && ++wait >= SWAP_EVERY) {
      wait = 0;
      pending -= 1;
      const old = current;
      undo.push(keepModels ? old : old.name);
      scene.remove(old);
      disposeAll(old); // the GPU side is freed either way
      count += 1;
      current = makeVariant(count);
      scene.add(current);
    }
    const { geometries, textures } = renderer.info.memory;
    const models = undo.filter((item) => typeof item !== 'string').length;
    readout.textContent = [
      `swaps: ${count} · each one: history.push(${keepModels ? 'old' : 'old.name'}); scene.remove(old); dispose everything`,
      `renderer.info.memory: geometries ${geometries} · textures ${textures}, the same after every swap`,
      `old variants the history still refers to: ${models}`,
      `their arrays and canvases, still in memory: ${formatBytes(heldBytes())}`,
    ].join('\n');
  });
};
