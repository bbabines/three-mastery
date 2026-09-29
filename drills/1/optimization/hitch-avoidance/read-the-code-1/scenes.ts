// Scenes for the hitch avoidance page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, hideFloorHelpers, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A finish's texture: diagonal stripes in its own color, so every finish uploads its own picture.
function stripes(color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const context = canvas.getContext('2d')!;
  context.fillStyle = color;
  context.fillRect(0, 0, 512, 512);
  context.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  context.lineWidth = 18;
  for (let x = -512; x < 1024; x += 64) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 512, 512);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Twelve materials that each need a shader program of their own.
function finishMaterials(maps: THREE.Texture[]): THREE.Material[] {
  return [
    new THREE.MeshStandardMaterial({ map: maps[0] }),
    new THREE.MeshStandardMaterial({ map: maps[1], flatShading: true }),
    new THREE.MeshStandardMaterial({ map: maps[2], roughnessMap: maps[2] }),
    new THREE.MeshPhysicalMaterial({ map: maps[3], clearcoat: 1 }),
    new THREE.MeshPhysicalMaterial({ map: maps[4], sheen: 1 }),
    new THREE.MeshPhysicalMaterial({ map: maps[5], iridescence: 1 }),
    new THREE.MeshPhysicalMaterial({ map: maps[6], anisotropy: 1 }),
    new THREE.MeshLambertMaterial({ map: maps[7] }),
    new THREE.MeshPhongMaterial({ map: maps[8] }),
    new THREE.MeshPhongMaterial({ map: maps[9], flatShading: true }),
    new THREE.MeshToonMaterial({ map: maps[10] }),
    new THREE.MeshBasicMaterial({ map: maps[11] }),
  ];
}

const FINISH_COLORS = ['#1e3a8a', '#b91c1c', '#15803d', '#a16207', '#6b21a8', '#0f766e', '#be185d', '#374151', '#c2410c', '#4d7c0f', '#0369a1', '#78350f'];
const BARS = '·▁▂▃▄▅▆▇█';
const HISTORY = 48;

export const reveal: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.7, 3.9);
  controls.target.set(0, 0.6, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 5, 4), 0.6, 2.2);

  // One ball geometry for everything, already uploaded by the ball at the front.
  const ballGeometry = new THREE.SphereGeometry(0.22, 48, 24);
  const current = new THREE.Mesh(ballGeometry, new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  current.scale.setScalar(1.5);
  current.position.set(0, 0.34, 1.0);
  scene.add(current);

  let uploads = 0;
  const maps = FINISH_COLORS.map((color) => {
    const texture = stripes(color);
    texture.onUpdate = () => void (uploads += 1); // three.js calls it after each upload
    return texture;
  });
  const materials = finishMaterials(maps);
  const finishes = new THREE.Group();
  const balls = materials.map((material, i) => {
    const ball = new THREE.Mesh(ballGeometry, material);
    ball.position.set(-1.65 + (i % 6) * 0.66, 0.3 + Math.floor(i / 6) * 0.58, -0.3);
    ball.visible = false;
    finishes.add(ball);
    return ball;
  });
  scene.add(finishes);

  const CODE = [
    'finishes.children.forEach((ball) => (ball.visible = true))',
    'renderer.compileAsync(finishes, …) and initTexture while hidden; then show all',
    'one ball a frame: queue.shift().visible = true',
  ];
  let mode = 0;
  let shown = false;
  let queue: THREE.Mesh[] = [];
  const whileHidden = { compiled: 0, uploaded: 0 };
  const busiest = { compiled: 0, uploaded: 0 };

  // Hides the finishes and frees their shaders and textures, so showing them again starts cold.
  const hide = () => {
    shown = false;
    queue = [];
    for (const ball of balls) ball.visible = false;
    for (const material of materials) material.dispose();
    for (const texture of maps) texture.dispose();
    whileHidden.compiled = whileHidden.uploaded = 0;
    if (mode === 1) {
      renderer.compileAsync(finishes, camera, scene).then(() => {
        for (const texture of maps) renderer.initTexture(texture);
      });
    }
  };
  const show = () => {
    shown = true;
    busiest.compiled = busiest.uploaded = 0;
    if (mode === 2) queue = [...balls];
    else for (const ball of balls) ball.visible = true;
  };

  const bar = overlay(container, 'controls');
  let hiddenButton: HTMLButtonElement | undefined;
  choiceButtons(
    buttonGroup(bar, 'Code:'),
    ['all at once', 'warm up first', 'one per frame'].map((html, i) => ({
      html,
      select: () => {
        mode = i;
        hiddenButton?.click(); // start each version hidden and cold
      },
    })),
  );
  const finishesGroup = buttonGroup(bar, 'Finishes:');
  choiceButtons(finishesGroup, [
    { html: 'hidden', select: hide },
    { html: 'shown', select: show },
  ]);
  hiddenButton = finishesGroup.querySelector('button')!;

  // Work per frame: programs that weren't in the renderer's list last frame, and texture uploads.
  // The ball at the front is compiled now, so its shader doesn't count as the finishes' work.
  renderer.compile(current, camera, scene);
  let known = new Set(renderer.info.programs ?? []);
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const history: number[] = [];
  const readout = overlay(container, 'readout');
  onFrame(() => {
    const next = queue.shift();
    if (next) next.visible = true;

    const programs = renderer.info.programs ?? [];
    const compiled = programs.filter((program) => !known.has(program)).length;
    known = new Set(programs);
    const uploaded = uploads;
    uploads = 0;
    if (shown) {
      if (compiled + uploaded > busiest.compiled + busiest.uploaded) Object.assign(busiest, { compiled, uploaded });
    } else {
      whileHidden.compiled += compiled;
      whileHidden.uploaded += uploaded;
    }
    history.push(compiled + uploaded);
    if (history.length > HISTORY) history.shift();

    const count = balls.filter((ball) => ball.visible).length;
    readout.textContent = [
      CODE[mode],
      shown
        ? `shown: ${count} of ${balls.length} · busiest frame: ${plural(busiest.compiled, 'shader')} compiled, ${plural(busiest.uploaded, 'texture')} uploaded`
        : `hidden · done while hidden: ${plural(whileHidden.compiled, 'shader')} compiled, ${plural(whileHidden.uploaded, 'texture')} uploaded`,
      `shaders and uploads per frame, newest on the right:`,
      history.map((jobs) => BARS[Math.min(BARS.length - 1, Math.ceil(jobs / 3))]).join(''),
    ].join('\n');
  });
};
