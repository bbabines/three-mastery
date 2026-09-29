// Scenes for the render on demand page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A mug on a turntable-style base: the product a shopper looks at, then leaves still.
function mug(finish: THREE.Material) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.44, 1.05, 48), finish);
  body.position.y = 0.6;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.07, 16, 40, Math.PI), finish);
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(0.5, 0.62, 0);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.06, 48), new THREE.MeshStandardMaterial({ color: '#3a3f4a' }));
  base.position.y = 0.05;
  group.add(body, handle, base);
  return group;
}

const n = (value: number) => value.toLocaleString('en-US');

export const demand: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.6, 1.6, 2.6);
  controls.target.set(0.15, 0.6, 0);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.6, 2.4);

  const finish = new THREE.MeshStandardMaterial({ color: COLORS.blue, roughness: 0.35 });
  scene.add(mug(finish));

  // What an on-demand viewer would draw: a frame after each 'change', or after a button changes the picture.
  let changed = false;
  controls.addEventListener('change', () => (changed = true));
  let drawn = 0;
  let onDemand = 0;
  let stillFor = 0;

  const bar = overlay(container, 'controls');
  choiceButtons(
    buttonGroup(bar, 'Finish:'),
    [
      ['blue', COLORS.blue],
      ['orange', COLORS.orange],
      ['green', COLORS.green],
    ].map(([name, color]) => ({ html: name, select: () => (finish.color.set(color), (changed = true)) })),
  );
  choiceButtons(buttonGroup(bar), [
    { html: 'damping on', select: () => (controls.enableDamping = true) },
    { html: 'damping off', select: () => (controls.enableDamping = false) },
  ]);

  const readout = overlay(container, 'readout');
  // Runs before each render. A 'change' from the last frame's controls.update(), or from pointer
  // moves since, means the frame about to be drawn shows something new.
  onFrame(() => {
    drawn += 1;
    if (changed) {
      onDemand += 1;
      stillFor = 0;
    } else {
      stillFor += 1;
    }
    changed = false;
    readout.textContent = [
      `frames drawn, one every frame:    ${n(drawn).padStart(7)}`,
      `frames an on-demand viewer draws: ${n(onDemand).padStart(7)}`,
      stillFor === 0 ? 'now: something changed, so this frame is drawn either way' : `now: still for ${n(stillFor)} frames, all the same picture`,
      `controls.enableDamping = ${controls.enableDamping}`,
    ].join('\n');
  });
};
