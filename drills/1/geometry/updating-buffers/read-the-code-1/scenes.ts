// Scenes for the updating buffers page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const WIDTH = 2.4;

export const wave: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.2, 1.7, 3.3);
  controls.target.set(0, 1.15, 0);
  sunlight(scene, new THREE.Vector3(2, 3, 4), 0.4);

  // A flag on a pole. Its left edge sits at the pole; the waves grow toward its free edge.
  const geometry = new THREE.PlaneGeometry(WIDTH, 1.3, 24, 12).translate(WIDTH / 2, 0, 0);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const flat = position.array.slice();
  const flag = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: COLORS.orange, side: THREE.DoubleSide }));
  flag.position.set(-1.2, 1.3, 0);
  flag.frustumCulled = false; // its vertices move, so its stored bounds go stale
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.1), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  pole.position.set(-1.2, 1.05, 0);
  scene.add(flag, pole);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const indexCount = geometry.index!.count;
  let mode = 0;
  let share = 1;

  const modes = [
    { html: 'edit the array only' },
    { html: '+ <code>position.needsUpdate = true</code>' },
    { html: '+ <code>computeVertexNormals()</code>' },
  ];
  const normal = geometry.attributes.normal as THREE.BufferAttribute;
  const flatNormals = normal.array.slice();
  choiceButtons(
    controlsBar,
    modes.map((item, i) => ({
      html: item.html,
      select: () => {
        mode = i;
        if (mode < 2) {
          normal.array.set(flatNormals); // back to the flat flag's normals
          normal.needsUpdate = true;
        }
      },
    })),
  );
  slider(controlsBar, 'draw range', { min: 0, max: 1, step: 0.1, value: share }, (value) => {
    share = value;
  });

  const probe = position.count - 1; // the free corner at the bottom
  onFrame((_, elapsed) => {
    for (let i = 0; i < position.count; i++) {
      const x = flat[i * 3];
      const reach = x / WIDTH; // 0 at the pole, 1 at the free edge
      position.setZ(i, 0.22 * reach * Math.sin(x * 3.2 - elapsed * 3.5));
    }
    if (mode >= 1) position.needsUpdate = true;
    if (mode >= 2) geometry.computeVertexNormals();
    const count = Math.round((share * indexCount) / 3) * 3;
    geometry.setDrawRange(0, count);

    readout.textContent = [
      `position.setZ(i, wave)   for all ${position.count} vertices   z of vertex ${probe}: ${formatNumber(position.getZ(probe))}`,
      mode >= 1
        ? `position.needsUpdate = true   version ${position.version}`
        : `(no needsUpdate)   version ${position.version}: the GPU copy stays as last sent`,
      mode >= 2 ? 'geometry.computeVertexNormals()   lighting follows the waves' : 'normals still those of the flat flag: lighting ignores the waves',
      `geometry.setDrawRange(0, ${count})   of ${indexCount} index numbers`,
    ].join('\n');
  });
};
