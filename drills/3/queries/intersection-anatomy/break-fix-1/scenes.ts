import { arrow, attempt, COLORS, overlay, setArrow } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { hitNormalWorld } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 6);
  controls.target.set(0, 1, 0);
  const localNormal = new THREE.Vector3(1, 1, 1).normalize();
  const geometry = new THREE.PlaneGeometry(2, 2);
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), localNormal));
  const panel = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: COLORS.blue, side: THREE.DoubleSide }));
  panel.position.y = 1.2;
  panel.rotation.y = 0.5;
  panel.scale.set(3, 1, 0.5);
  scene.add(panel);
  panel.updateWorldMatrix(true, false);
  const expected = localNormal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(panel.matrixWorld)).normalize();
  const got = attempt('hitNormalWorld', () => hitNormalWorld({ object: panel, face: { normal: localNormal.clone() } }));
  const base = panel.position.clone().addScaledVector(expected, 0.12);
  const reference = arrow(COLORS.yellow);
  setArrow(reference, base.clone().add(new THREE.Vector3(-0.5, 0, 0)), expected.clone().multiplyScalar(1.5));
  scene.add(reference);
  if (got.ok) { const yours = arrow(COLORS.red); setArrow(yours, base.clone().add(new THREE.Vector3(0.5, 0, 0)), got.value.clone().multiplyScalar(1.5)); scene.add(yours); }
  const readout = overlay(container, 'readout');
  readout.textContent = got.ok
    ? `yellow: surface normal | red: your normal\nnonuniform scale changes its direction\nangle apart: ${(expected.angleTo(got.value) * 180 / Math.PI).toFixed(1)}°`
    : got.note;
};
