import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { worldFaceNormal } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4, 3, 5);
  controls.target.set(0, 1.5, 0);
  const a = new THREE.Vector3(0, 0, 0);
  const b = new THREE.Vector3(1, 0, 1);
  const c = new THREE.Vector3(0, 1, 2);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([...a.toArray(), ...b.toArray(), ...c.toArray()], 3));
  geometry.computeVertexNormals();
  const face = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: COLORS.gray, side: THREE.DoubleSide }));
  face.matrixAutoUpdate = false;
  const yours = arrow(COLORS.blue);
  const reference = arrow(COLORS.green);
  scene.add(face, yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  const update = (stretch: number) => {
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(-0.7, 1.1, -0.4),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.35),
      new THREE.Vector3(stretch, 1, 0.5),
    );
    face.matrix.copy(matrix);
    face.matrixWorldNeedsUpdate = true;
    const center = a.clone().add(b).add(c).multiplyScalar(1 / 3).applyMatrix4(matrix);
    const expected = THREE.Triangle.getNormal(
      a.clone().applyMatrix4(matrix), b.clone().applyMatrix4(matrix), c.clone().applyMatrix4(matrix), new THREE.Vector3(),
    );
    const result = attempt('worldFaceNormal', () => worldFaceNormal(a.clone(), b.clone(), c.clone(), matrix.clone()));
    setArrow(reference, center.clone().add(new THREE.Vector3(0.25, 0, 0)), expected.clone().multiplyScalar(1.1));
    yours.visible = result.ok;
    if (!result.ok) { readout.textContent = result.note; return; }
    setArrow(yours, center.clone().add(new THREE.Vector3(-0.25, 0, 0)), result.value.clone().multiplyScalar(1.1));
    readout.textContent = `stretch x ${stretch.toFixed(1)} · blue: yours · green: reference\nangle between normals ${THREE.MathUtils.radToDeg(result.value.angleTo(expected)).toFixed(1)}°`;
  };
  slider(controlsBar, 'stretch x', { min: 1, max: 3, step: 0.25, value: 3 }, update);
  update(3);
};
