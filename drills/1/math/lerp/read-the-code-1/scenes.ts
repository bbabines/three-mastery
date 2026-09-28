// Scenes for the lerp page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatNumber, formatVector, label, LABEL_LIFT, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const blend: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 3.5, 5.5);
  controls.target.set(0, 0.3, 0);

  const a = new THREE.Vector3(-2, 0.3, 0.5);
  const b = new THREE.Vector3(2, 0.3, -0.5);
  const aColor = new THREE.Color(COLORS.blue);
  const bColor = new THREE.Color(COLORS.orange);

  const aBall = ball(COLORS.blue, 0.5);
  aBall.position.copy(a);
  const aTag = label('A  t = 0', COLORS.blue);
  aTag.position.copy(a).add(LABEL_LIFT);
  const bBall = ball(COLORS.orange, 0.5);
  bBall.position.copy(b);
  const bTag = label('B  t = 1', COLORS.orange);
  bTag.position.copy(b).add(LABEL_LIFT);

  // The line runs past both ends, where t goes below 0 or above 1.
  const track = line(COLORS.gray, 0.5);
  setLine(track, a.clone().lerp(b, -0.6), a.clone().lerp(b, 1.6));
  const blended = ball(COLORS.white, 1, 0.2);
  const material = blended.material as THREE.MeshStandardMaterial;
  scene.add(aBall, aTag, bBall, bTag, track, blended);

  const readout = overlay(container, 'readout');
  const update = (t: number) => {
    blended.position.lerpVectors(a, b, t);
    material.color.lerpColors(aColor, bColor, THREE.MathUtils.clamp(t, 0, 1));
    const past = t < 0 ? 'past A: lerp keeps going' : t > 1 ? 'past B: lerp keeps going' : '';
    readout.textContent = [`a.clone().lerp(b, ${formatNumber(t)})`, `= ${formatVector(blended.position)}   ${past}`].join('\n');
  };
  slider(overlay(container, 'controls'), 't', { min: -0.5, max: 1.5, step: 0.05, value: 0.5 }, update);
  update(0.5);
};
