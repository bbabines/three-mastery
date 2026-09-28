// Scenes for the floating-point tolerance page. The README places each one with <div data-scene="name">.
import { overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const DISTANCES = [0, 1_000, 10_000, 100_000, 1_000_000, 3_000_000, 10_000_000];

// The gap to the next storable float32 value above `value`, found by stepping its bit pattern.
function float32Gap(value: number) {
  const bits = new Float32Array([value]);
  new Int32Array(bits.buffer)[0] += 1;
  return bits[0] - value;
}

const formatGap = (gap: number) => (gap >= 0.001 ? String(+gap.toPrecision(2)) : gap.toExponential(1));

export const precision: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.6, 3.4);
  controls.target.set(0, 1, 0);

  const template = new THREE.SphereGeometry(1, 48, 24);
  template.translate(0, 1, 0);
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshNormalMaterial({ flatShading: true }));
  scene.add(mesh);

  const readout = overlay(container, 'readout');

  // The vertices are stored far out along X, then the mesh is moved back into view.
  // Storing them in a Float32Array rounds each one to the nearest value float32 can hold.
  const update = (step: number) => {
    const distance = DISTANCES[step];
    const source = template.getAttribute('position');
    const stored = new Float32Array(source.count * 3);
    for (let i = 0; i < source.count; i++) {
      stored[i * 3] = source.getX(i) + distance;
      stored[i * 3 + 1] = source.getY(i);
      stored[i * 3 + 2] = source.getZ(i);
    }
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BufferGeometry();
    mesh.geometry.setAttribute('position', new THREE.BufferAttribute(stored, 3));
    mesh.geometry.setIndex(template.getIndex());
    mesh.position.x = -distance;

    readout.textContent = [
      `points stored ${distance.toLocaleString()} units from the origin`,
      `gap between float32 values there: ${formatGap(float32Gap(Math.max(distance, 1)))}`,
    ].join('\n');
  };
  slider(overlay(container, 'controls'), 'distance', { min: 0, max: DISTANCES.length - 1, step: 1, value: 0 }, update);
  update(0);
};
