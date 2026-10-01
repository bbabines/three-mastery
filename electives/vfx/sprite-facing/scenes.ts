import { overlay } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import * as THREE from 'three/webgpu';

export const preview: TslSceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 2.4, 4); controls.target.set(0, 1.2, 0);
  const makeCard = (x: number, color: number) => {
    const material = new THREE.MeshBasicNodeMaterial({ color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.8), material);
    mesh.position.set(x, 1.2, 0); scene.add(mesh); return mesh;
  };
  const pointFacing = makeCard(-0.9, 0x38bdf8);
  const axisLocked = makeCard(0.9, 0xffb561);
  const readout = overlay(container, 'readout');
  readout.textContent = 'Orbit the camera. Blue faces its position; orange turns around Y but stays upright.';
  onFrame(() => {
    pointFacing.lookAt(camera.position);
    axisLocked.lookAt(new THREE.Vector3(camera.position.x, axisLocked.position.y, camera.position.z));
  });
};
