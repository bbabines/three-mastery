// Scenes for the interpolation toolbox page. The README places each one with <div data-scene="name">.
import { ball, buttonGroup, choiceButtons, COLORS, formatNumber, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const CURVES = [
  { name: 'Linear', code: 't', ease: (t: number) => t, note: 'Evenly spaced: one speed, with an abrupt start and stop.' },
  {
    name: 'smoothstep',
    code: 'MathUtils.smoothstep(t, 0, 1)',
    ease: (t: number) => THREE.MathUtils.smoothstep(t, 0, 1),
    note: 'Bunched at both ends: a gentle start and a gentle stop.',
  },
  {
    name: 'smootherstep',
    code: 'MathUtils.smootherstep(t, 0, 1)',
    ease: (t: number) => THREE.MathUtils.smootherstep(t, 0, 1),
    note: 'Bunched even more at the ends: gentler still.',
  },
  {
    name: 'Ease out',
    code: '1 - (1 - t) ** 3',
    ease: (t: number) => 1 - (1 - t) ** 3,
    note: 'Spread out first, bunched at the end: a quick start, a gentle stop.',
  },
];

export const ease: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.5, 3.1);
  controls.target.set(0, 0.35, 0);

  const FROM = -2;
  const TO = 2;
  const track = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.04, 0.2), new THREE.MeshStandardMaterial({ color: '#374151' }));
  track.position.set(0, 0.05, 0);
  const mover = ball(COLORS.orange, 1, 0.2);
  scene.add(track, mover);
  // Ghosts at t = 0, 0.1, … 1: where the ball is at equal steps of time.
  const ghosts = Array.from({ length: 11 }, () => {
    const ghost = ball(COLORS.white, 0.5, 0.09);
    scene.add(ghost);
    return ghost;
  });

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  let curve = CURVES[0];
  let t = 0.3;

  const update = () => {
    ghosts.forEach((ghost, i) => ghost.position.set(THREE.MathUtils.lerp(FROM, TO, curve.ease(i / 10)), 0.5, 0));
    const eased = curve.ease(t);
    mover.position.set(THREE.MathUtils.lerp(FROM, TO, eased), 0.25, 0);
    readout.textContent = [
      `x = MathUtils.lerp(${FROM}, ${TO}, ${curve.code})`,
      `t ${formatNumber(t)}   eased ${formatNumber(eased)}   x ${formatNumber(mover.position.x)}`,
      curve.note,
    ].join('\n');
  };

  choiceButtons(
    buttonGroup(bar),
    CURVES.map((each) => ({
      html: each.name === 'Linear' || each.name === 'Ease out' ? each.name : `<code>${each.name}</code>`,
      select: () => {
        curve = each;
        update();
      },
    })),
  );
  slider(bar, 't', { min: 0, max: 1, step: 0.05, value: t }, (value) => {
    t = value;
    update();
  });
};
