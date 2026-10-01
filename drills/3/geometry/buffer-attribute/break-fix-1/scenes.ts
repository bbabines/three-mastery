import { attempt, choiceButtons, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { vertexAt } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.5, 2.5, 5);
  controls.target.set(0, 1.4, 0);
  const positions = new THREE.Float32BufferAttribute([-1, 1, 0, 0, 2, 0, 1, 1, 0], 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', positions);
  geometry.computeVertexNormals();
  scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.gray, side: THREE.DoubleSide })));
  const marker = (color: string) => new THREE.Mesh(new THREE.SphereGeometry(0.16), new THREE.MeshBasicMaterial({ color, depthTest: false }));
  const yours = marker(COLORS.blue);
  const reference = marker(COLORS.yellow);
  scene.add(yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  const update = (index: number) => {
    const expected = new THREE.Vector3(positions.getX(index), positions.getY(index), positions.getZ(index));
    const result = attempt('vertexAt', () => vertexAt(positions, index));
    reference.position.copy(expected);
    yours.visible = result.ok;
    if (!result.ok) { readout.textContent = result.note; return; }
    yours.position.copy(result.value);
    readout.textContent = `vertex ${index} · blue: your marker · yellow: reference\nyour XYZ ${result.value.toArray().map(n => n.toFixed(1)).join(', ')}`;
  };
  choiceButtons(controlsBar, [
    { html: 'vertex 2', select: () => update(2) },
    { html: 'vertex 1', select: () => update(1) },
  ]);
};
