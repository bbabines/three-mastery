import { arrow, attempt, COLORS, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { normalFromMap } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 2.5, 6);
  controls.target.set(0, 1.4, 0);
  const plane = new THREE.PlaneGeometry(1.8, 1.8);
  const surface = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: '#3b5268', side: THREE.DoubleSide, transparent: true, opacity: 0.7 }));
  surface.add(new THREE.LineSegments(new THREE.EdgesGeometry(plane), new THREE.LineBasicMaterial({ color: COLORS.yellow })));
  surface.position.y = 1.4;
  const yours = arrow(COLORS.blue);
  const reference = arrow(COLORS.green);
  scene.add(surface, yours, reference);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const sample = new THREE.Vector3(0.75, 0.25, 0.7);

  const update = (turn: number) => {
    surface.rotation.y = THREE.MathUtils.degToRad(turn);
    const basis = surface.quaternion;
    const tangent = new THREE.Vector3(1, 0, 0).applyQuaternion(basis);
    const bitangent = new THREE.Vector3(0, 1, 0).applyQuaternion(basis);
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(basis);
    const value = sample.clone().multiplyScalar(2).subScalar(1);
    const expected = tangent.clone().multiplyScalar(value.x).addScaledVector(bitangent, value.y).addScaledVector(normal, value.z).normalize();
    const result = attempt('normalFromMap', () => normalFromMap(sample.clone(), tangent.clone(), bitangent.clone(), normal.clone()));
    setArrow(reference, new THREE.Vector3(0.25, 1.4, 0.2), expected.clone().multiplyScalar(1.6));
    yours.visible = result.ok;
    if (!result.ok) { readout.textContent = result.note; return; }
    setArrow(yours, new THREE.Vector3(-0.25, 1.4, 0.2), result.value.clone().multiplyScalar(1.6));
    readout.textContent = `surface turn ${turn}° · blue: yours · green: reference\nangle between normals ${THREE.MathUtils.radToDeg(result.value.angleTo(expected)).toFixed(1)}°`;
  };
  slider(controlsBar, 'turn', { min: 0, max: 90, step: 10, value: 60 }, update);
  update(60);
};
