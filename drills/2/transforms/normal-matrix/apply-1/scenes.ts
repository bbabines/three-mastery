// An unevenly stretched panel turns toward and away from the yellow viewer arrow.
import { arrow, COLORS, setArrow } from '@harness/lesson';
import * as THREE from 'three';
import { flagView } from '../../scene-view';
import { faceToward } from './drill';

const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.3), new THREE.MeshStandardMaterial({ color: COLORS.orange, side: THREE.DoubleSide }));
panel.position.y = 1;
panel.scale.set(2, 0.7, 1);
const normal = new THREE.Vector3(0.5, 0, 1).normalize();
const view = new THREE.Vector3(1, 0.2, 0.5).normalize();
const viewer = arrow(COLORS.yellow);
setArrow(viewer, new THREE.Vector3(0, 1, 0), view.clone().multiplyScalar(1.7));
const expected = (degrees: number) => {
  const world = new THREE.Matrix4().compose(panel.position,
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees)), panel.scale);
  const worldNormal = normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(world)).normalize();
  return worldNormal.dot(view) > 0;
};
export const demo = flagView('faceToward', { label: 'panel turn', min: -180, max: 180, step: 5, value: 40 },
  (degrees) => { panel.rotation.y = THREE.MathUtils.degToRad(degrees); return faceToward(panel, normal.clone(), view.clone()); }, expected,
  (scene, degrees) => { if (!panel.parent) scene.add(panel, viewer); panel.rotation.y = THREE.MathUtils.degToRad(degrees); });
