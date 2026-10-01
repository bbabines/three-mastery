// The blue normal must match the yellow perpendicular to a stretched panel.
import { COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { vectorView } from '../../scene-view';
import { normalInWorld } from './drill';

const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.1), new THREE.MeshStandardMaterial({ color: COLORS.orange, side: THREE.DoubleSide }));
panel.position.y = 1;
panel.scale.set(2.2, 0.65, 1.1);
const local = new THREE.Vector3(0.4, 0.3, 1).normalize();
const expected = (degrees: number) => {
  const world = new THREE.Matrix4().compose(panel.position,
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees)), panel.scale);
  return local.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(world)).normalize();
};
export const demo = vectorView('normalInWorld', { label: 'panel turn', min: -160, max: 160, step: 5, value: 45 },
  (degrees) => { panel.rotation.y = THREE.MathUtils.degToRad(degrees); return normalInWorld(panel, local.clone()); }, expected,
  (scene, degrees) => { if (!panel.parent) scene.add(panel); panel.rotation.y = THREE.MathUtils.degToRad(degrees); });
