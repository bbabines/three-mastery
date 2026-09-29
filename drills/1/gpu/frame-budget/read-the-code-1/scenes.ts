// Scenes for the frame budget page. The README places each one with <div data-scene="name">.
// The timeline is a model of how frames overlap, drawn from the sliders' numbers, not a measurement.
import { buttonGroup, choiceButtons, COLORS, formatNumber, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const WINDOW_MS = 72; // the timeline shows this much time
const SCALE = 0.1; // world units per millisecond
const LEFT = -(WINDOW_MS * SCALE) / 2;
const LANES = { cpu: 2.1, gpu: 1.4, screen: 0.7 };
const FRAME_COLORS = [COLORS.orange, COLORS.blue, COLORS.green, COLORS.purple, COLORS.red, COLORS.yellow];

// Where frame k's work runs and when it reaches the screen, in this model: the CPU starts a frame
// at a refresh, the GPU starts it once the CPU is done and the GPU has finished the frame before,
// and a finished frame appears at the next refresh. A frame whose work runs past its slot makes
// the next one start a refresh later.
function schedule(cpu: number, gpu: number, budget: number) {
  const interval = Math.max(1, Math.ceil(Math.max(cpu, gpu) / budget - 1e-9)) * budget;
  const frames: { cpu: [number, number]; gpu: [number, number]; shown: number }[] = [];
  let gpuFree = 0;
  for (let k = 0; k * interval < WINDOW_MS; k++) {
    const cpuStart = k * interval;
    const gpuStart = Math.max(cpuStart + cpu, gpuFree);
    gpuFree = gpuStart + gpu;
    frames.push({ cpu: [cpuStart, cpuStart + cpu], gpu: [gpuStart, gpuFree], shown: Math.ceil(gpuFree / budget - 1e-9) * budget });
  }
  return { interval, frames };
}

export const budget: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.45, 6.2);
  controls.target.set(0, 1.45, 0);
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }
  for (const [name, y] of Object.entries(LANES)) {
    const tag = label(name === 'screen' ? 'screen' : name.toUpperCase(), COLORS.white);
    tag.position.set(LEFT - 0.55, y, 0);
    scene.add(tag);
  }
  const drawing = new THREE.Group();
  scene.add(drawing);

  const bar = (start: number, end: number, y: number, color: string, height = 0.42) => {
    const from = Math.max(0, start);
    const to = Math.min(WINDOW_MS, end);
    if (to <= from) return;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry((to - from) * SCALE - 0.02, height), new THREE.MeshBasicMaterial({ color }));
    mesh.position.set(LEFT + ((from + to) / 2) * SCALE, y, 0);
    drawing.add(mesh);
  };

  let cpu = 6;
  let gpu = 12;
  let hz = 60;
  const readout = overlay(container, 'readout');

  const update = () => {
    for (const child of drawing.children) (child as THREE.Mesh).geometry.dispose();
    drawing.clear();
    const frameBudget = 1000 / hz;

    // The screen's refreshes, as gray lines across all three lanes.
    const ticks: THREE.Vector3[] = [];
    for (let t = 0; t <= WINDOW_MS; t += frameBudget) {
      ticks.push(new THREE.Vector3(LEFT + t * SCALE, LANES.screen - 0.35, 0.01), new THREE.Vector3(LEFT + t * SCALE, LANES.cpu + 0.35, 0.01));
    }
    drawing.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ticks), new THREE.LineBasicMaterial({ color: COLORS.gray })));

    const { interval, frames } = schedule(cpu, gpu, frameBudget);
    frames.forEach((frame, k) => {
      const color = FRAME_COLORS[k % FRAME_COLORS.length];
      bar(frame.cpu[0], frame.cpu[1], LANES.cpu, color);
      bar(frame.gpu[0], frame.gpu[1], LANES.gpu, color);
      const next = frames[k + 1]?.shown ?? Infinity;
      bar(frame.shown, next, LANES.screen, color); // on screen until the next frame replaces it
    });

    const frameTime = Math.max(cpu, gpu);
    const fps = 1000 / interval;
    const slower = cpu === gpu ? 'both sides equally' : cpu > gpu ? 'the CPU' : 'the GPU';
    readout.textContent = [
      `budget at ${hz} Hz: 1000 / ${hz} = ${formatNumber(frameBudget)} ms per frame`,
      `CPU ${cpu} ms and GPU ${gpu} ms, side by side: frame time ${frameTime} ms, set by ${slower}`,
      frameTime <= frameBudget + 1e-9
        ? `FPS counter: ${hz}, the most this screen shows, with ${formatNumber(frameBudget - frameTime)} ms of the budget unused`
        : `over budget: each frame misses a refresh, and the FPS counter drops to ${formatNumber(fps, 0)} in this model`,
    ].join('\n');
  };

  const controlsBar = overlay(container, 'controls');
  slider(controlsBar, 'CPU ms', { min: 1, max: 30, step: 1, value: cpu }, (value) => ((cpu = value), update()));
  slider(controlsBar, 'GPU ms', { min: 1, max: 30, step: 1, value: gpu }, (value) => ((gpu = value), update()));
  choiceButtons(buttonGroup(controlsBar), [
    { html: '60 Hz', select: () => ((hz = 60), update()) },
    { html: '120 Hz', select: () => ((hz = 120), update()) },
  ]);
};
