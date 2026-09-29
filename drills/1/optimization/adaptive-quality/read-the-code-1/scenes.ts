// Scenes for the adaptive quality page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatNumber, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const RATIOS = [0.75, 1, 1.25, 1.5, 2];
const BARS = ['▂', '▃', '▄', '▅', '▇'];
const BUDGET = 1000 / 60; // a 60 Hz screen
const HISTORY = 64;

// The model: a frame's work is some CPU time plus pixel work that grows with the ratio squared,
// scaled by the load slider, with a little noise. A frame that finishes early still waits for the
// next refresh, so the frame time the app sees never drops below the budget.
function simulatedWork(ratio: number, load: number) {
  return 3 + load * 10 * ratio * ratio + (Math.random() - 0.5) * 1.6;
}
const frameTime = (work: number) => Math.ceil(work / BUDGET - 1e-6) * BUDGET;

export const controller: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.2, 1.35, 3.9);
  controls.target.set(0, 0.95, 0);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.6, 2.2);

  // Fine detail, so the pixel ratio shows: a many-sided knot and thin lines around it.
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.14, 200, 24), new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.35 }));
  knot.position.y = 1;
  const cage = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.95, 2)),
    new THREE.LineBasicMaterial({ color: COLORS.gray }),
  );
  cage.position.y = 1;
  scene.add(knot, cage);

  let hysteresis = false;
  let load = 1;
  let level = RATIOS.length - 1;
  let average = BUDGET;
  let slowFrames = 0;
  let goodFrames = 0;
  let wait = 120;
  let justRaised = false;
  let changes = 0;
  const history: number[] = [];
  const setLevel = (next: number) => {
    if (next === level) return;
    justRaised = next > level;
    level = next;
    renderer.setPixelRatio(RATIOS[level]);
    changes += 1;
  };
  const restart = () => {
    level = RATIOS.length - 1;
    renderer.setPixelRatio(RATIOS[level]);
    average = BUDGET;
    slowFrames = goodFrames = changes = 0;
    wait = 120;
    history.length = 0;
  };

  const bar = overlay(container, 'controls');
  choiceButtons(buttonGroup(bar), [
    { html: 'one threshold', select: () => ((hysteresis = false), restart()) },
    { html: 'hysteresis', select: () => ((hysteresis = true), restart()) },
  ]);
  slider(bar, 'Load', { min: 0.4, max: 2, step: 0.1, value: load }, (value) => (load = value));

  const readout = overlay(container, 'readout');
  onFrame((delta) => {
    knot.rotation.y += delta * 0.4;
    const drawn = level; // the ratio the frame being judged was drawn at
    const work = simulatedWork(RATIOS[level], load);
    const measured = frameTime(work);
    average += (measured - average) * 0.2;

    if (!hysteresis) {
      // One threshold: late lowers the ratio, on time raises it, every frame.
      if (measured > BUDGET + 0.01) setLevel(Math.max(0, level - 1));
      else setLevel(Math.min(RATIOS.length - 1, level + 1));
    } else {
      slowFrames = average > BUDGET * 1.25 ? slowFrames + 1 : 0;
      goodFrames = average < BUDGET * 1.05 ? goodFrames + 1 : 0;
      if (slowFrames > 30 && level > 0) {
        if (justRaised) wait *= 2; // that step up didn't hold: wait longer before the next try
        setLevel(level - 1);
        justRaised = false;
        slowFrames = 0;
      } else if (goodFrames > wait && level < RATIOS.length - 1) {
        setLevel(level + 1);
        goodFrames = 0;
      }
    }

    history.push(level);
    if (history.length > HISTORY) history.shift();
    const recent = history.reduce((sum, value, i) => sum + (i > 0 && value !== history[i - 1] ? 1 : 0), 0);
    readout.textContent = [
      hysteresis
        ? `down after 30 late frames, up after ${wait} on time (doubling after a failed try)`
        : 'one threshold: a late frame lowers the ratio, an on-time frame raises it',
      `at pixel ratio ${RATIOS[drawn]}: simulated work ${formatNumber(work, 1)} ms, frame time ${formatNumber(measured, 1)} ms`,
      `pixel ratio, last ${HISTORY} frames: ${history.map((value) => BARS[value]).join('')}`,
      `changes in those frames: ${recent} · in all: ${changes}`,
    ].join('\n');
  });
};
