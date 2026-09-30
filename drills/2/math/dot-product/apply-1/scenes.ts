// Runs drill.ts live: every frame, each hotspot asks facesCamera about the viewer's own camera, and
// turns yellow (shown) or grey (hidden). The box is see-through so the hidden ones stay visible.
import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { facesCamera } from './drill';

const SIZE = new THREE.Vector3(1.6, 1, 1);
const CENTER = new THREE.Vector3(0, 0.8, 0);

// Two hotspots on each face of the box: where each sits, and the way its face faces.
const HOTSPOTS = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
].flatMap((normal) => {
  const across = Math.abs(normal.y) === 1 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  return [-0.25, 0.25].map((offset) => ({
    spot: normal
      .clone()
      .multiply(SIZE)
      .multiplyScalar(0.5)
      .addScaledVector(across.clone().multiply(SIZE), offset)
      .add(CENTER),
    normal,
  }));
});

export const hotspots: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(2, 1.9, 2.5);
  controls.target.copy(CENTER);

  const product = new THREE.Mesh(
    new THREE.BoxGeometry(SIZE.x, SIZE.y, SIZE.z),
    new THREE.MeshStandardMaterial({ color: COLORS.blue, transparent: true, opacity: 0.45, depthWrite: false }),
  );
  product.position.copy(CENTER);
  scene.add(product);

  const dots = HOTSPOTS.map(({ spot, normal }) => {
    const dot = ball(COLORS.gray, 1, 0.07);
    dot.position.copy(spot).addScaledVector(normal, 0.02);
    scene.add(dot);
    return dot;
  });

  const readout = overlay(container, 'readout');
  onFrame(() => {
    let shown = 0;
    let note = '';
    HOTSPOTS.forEach(({ spot, normal }, i) => {
      const result = attempt('facesCamera', () => facesCamera(spot.clone(), normal.clone(), camera.position.clone()));
      if (!result.ok) note = result.note;
      if (result.ok && result.value) shown += 1;
      (dots[i].material as THREE.MeshStandardMaterial).color.set(result.ok && result.value ? COLORS.yellow : '#4b5563');
    });
    readout.textContent = ['facesCamera(spot, normal, camera.position)', note || `showing ${shown} of ${HOTSPOTS.length} hotspots`].join('\n');
  });
};
