import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { faceNormalWorld } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5); controls.target.set(0, 0.7, 0);
  const a = new THREE.Vector3(-1, 0.4, 0), b = new THREE.Vector3(1, 0.4, 0), c = new THREE.Vector3(0, 1.5, 0.6);
  const surface = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([a, b, c]), new THREE.MeshBasicMaterial({ color: COLORS.yellow, side: THREE.DoubleSide, wireframe: true }));
  const yours = arrow(COLORS.blue), reference = arrow(COLORS.green);
  scene.add(surface, yours, reference);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Face normal after uneven stretch');
  let scaleX = 2;
  const update = () => {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.4), new THREE.Vector3(scaleX, 1, 0.6));
    surface.matrixAutoUpdate = false; surface.matrix.copy(matrix);
    const expected = THREE.Triangle.getNormal(a.clone().applyMatrix4(matrix), b.clone().applyMatrix4(matrix), c.clone().applyMatrix4(matrix), new THREE.Vector3());
    const center = a.clone().add(b).add(c).multiplyScalar(1 / 3).applyMatrix4(matrix);
    const result = attempt('faceNormalWorld', () => faceNormalWorld(a.clone(), b.clone(), c.clone(), matrix.clone()));
    setArrow(reference, center, expected);
    yours.visible = result.ok;
    if (result.ok) setArrow(yours, center, result.value);
    show(`X stretch ×${scaleX.toFixed(1)} · Z stretch ×0.6`,
      result.ok ? `normal (${result.value.x.toFixed(2)}, ${result.value.y.toFixed(2)}, ${result.value.z.toFixed(2)})` : result.note,
      `normal (${expected.x.toFixed(2)}, ${expected.y.toFixed(2)}, ${expected.z.toFixed(2)})`);
  };
  slider(controlsBar, 'x stretch', { min: 1, max: 3, step: 0.5, value: scaleX }, value => { scaleX = value; update(); });
  update();
};
