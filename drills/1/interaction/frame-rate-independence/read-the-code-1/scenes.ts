// Scenes for the frame-rate-independent motion page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, label, LABEL_LIFT, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const RATES = [60, 120];

// Two lanes, one per frame rate, each with a ball and a label.
function lanes(scene: THREE.Scene) {
  return RATES.map((hz, i) => {
    const z = i === 0 ? 0.6 : -0.6;
    const track = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.04, 0.3), new THREE.MeshStandardMaterial({ color: '#374151' }));
    track.position.set(0, 0.05, z);
    const mark = ball(i === 0 ? COLORS.yellow : COLORS.orange, 1, 0.18);
    mark.position.set(-2, 0.25, z);
    const tag = label(`${hz} Hz`, i === 0 ? COLORS.yellow : COLORS.orange);
    tag.position.set(-2.8, 0.1, z);
    scene.add(track, mark, tag);
    return { hz, mark, z, x: -2, carry: 0 };
  });
}

// Steps each lane with fixed frame lengths, as many whole frames as the real time since the last
// call allows. Its own Timer, so it keeps running even while the page is in a hidden tab.
function stepper(onStep: (lane: ReturnType<typeof lanes>[number], dt: number) => void, list: ReturnType<typeof lanes>) {
  const timer = new THREE.Timer();
  return () => {
    const real = Math.min(timer.update().getDelta(), 0.1);
    for (const lane of list) {
      lane.carry += real;
      const dt = 1 / lane.hz;
      while (lane.carry >= dt) {
        lane.carry -= dt;
        onStep(lane, dt);
      }
    }
    return real;
  };
}

export const steady: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 3, 4.2);
  controls.target.set(0, 0, 0);
  const list = lanes(scene);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const LOOP = 2.5; // seconds, then both start again
  let perFrame = true;
  let elapsed = 0;

  const restart = () => {
    elapsed = 0;
    for (const lane of list) {
      lane.x = -2;
      lane.carry = 0;
    }
  };
  const step = stepper((lane, dt) => {
    lane.x += perFrame ? 0.012 : 0.72 * dt;
  }, list);

  onFrame(() => {
    elapsed += step();
    if (elapsed > LOOP) restart();
    for (const lane of list) lane.mark.position.x = lane.x;
    const [slow, fast] = list.map((lane) => lane.x + 2);
    const ratio = slow > 0.05 ? fast / slow : 1;
    readout.textContent = [
      perFrame ? 'ball.position.x += 0.012;          // every frame' : 'ball.position.x += 0.72 * delta;   // 0.72 units a second',
      `after ${formatNumber(elapsed, 1)} s   60 Hz ball: ${formatNumber(slow)} along   120 Hz ball: ${formatNumber(fast)} along`,
      Math.abs(ratio - 1) < 0.05 ? 'Both have come the same distance.' : `The 120 Hz ball has come ${formatNumber(ratio, 1)} times as far.`,
    ].join('\n');
  });

  choiceButtons(bar, [
    { html: '<code>x += 0.012</code> every frame', select: () => ((perFrame = true), restart()) },
    { html: '<code>x += 0.72 * delta</code>', select: () => ((perFrame = false), restart()) },
  ]);
};

export const damping: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 3, 4.2);
  controls.target.set(0, 0, 0);
  const list = lanes(scene);
  const goals = RATES.map((_, i) => {
    const goal = ball(COLORS.green, 0.35, 0.22);
    goal.position.set(1.5, 0.25, i === 0 ? 0.6 : -0.6);
    scene.add(goal);
    return goal;
  });
  const goalTag = label('target', COLORS.green);
  scene.add(goalTag);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const HOLD = 1.5; // seconds before the target jumps to the other side
  let useDamp = false;
  let target = 1.5;
  let from = -1.5;
  let sinceJump = 0;
  let sample: number[] | null = null; // how much of the gap each ball had closed 0.25 s after the last jump
  let sampled = false;

  const restart = () => {
    target = 1.5;
    from = -1.5;
    sinceJump = 0;
    sample = null;
    sampled = false;
    for (const lane of list) {
      lane.x = from;
      lane.carry = 0;
    }
  };
  const step = stepper((lane, dt) => {
    lane.x = useDamp ? THREE.MathUtils.damp(lane.x, target, 6, dt) : THREE.MathUtils.lerp(lane.x, target, 0.1);
  }, list);

  onFrame(() => {
    sinceJump += step();
    if (!sampled && sinceJump >= 0.25) {
      sample = list.map((lane) => (lane.x - from) / (target - from));
      sampled = true;
    }
    if (sinceJump > HOLD) {
      from = target;
      target = -target;
      sinceJump = 0;
      sampled = false;
    }
    for (const lane of list) lane.mark.position.x = lane.x;
    for (const goal of goals) goal.position.x = target;
    goalTag.position.set(target, 0.25, 0).add(LABEL_LIFT);
    const pct = (share: number) => `${formatNumber(share * 100, 0)}%`;
    readout.textContent = [
      useDamp ? 'x = MathUtils.damp(x, target, 6, delta);' : 'x = MathUtils.lerp(x, target, 0.1);   // every frame',
      sample
        ? `0.25 s after the jump:   60 Hz ball closed ${pct(sample[0])} of the gap   120 Hz ball ${pct(sample[1])}`
        : 'Waiting for the first jump…',
      !sample ? '' : Math.abs(sample[0] - sample[1]) < 0.02 ? 'The same at both frame rates.' : 'The 120 Hz ball gets there much sooner.',
    ]
      .filter(Boolean)
      .join('\n');
  });

  choiceButtons(bar, [
    { html: '<code>lerp(x, target, 0.1)</code> every frame', select: () => ((useDamp = false), restart()) },
    { html: '<code>MathUtils.damp(x, target, 6, delta)</code>', select: () => ((useDamp = true), restart()) },
  ]);
};
