// An offset pivot anchors the scaled orbit; blue should meet the yellow point.
import { ball, COLORS } from '@harness/lesson';
import * as THREE from 'three';
import { pointView } from '../../scene-view';
import { orbitWithScale } from './drill';

const point = new THREE.Vector3(1.2, 1, 0.4);
const pivot = new THREE.Vector3(-0.5, 0.7, -0.3);
const scale = new THREE.Vector3(1.5, 0.7, 1.1);
const turn = (degrees: number) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(degrees));
const pin = ball(COLORS.orange); pin.position.copy(pivot);
const expected = (degrees: number) => point.clone().sub(pivot).multiply(scale).applyQuaternion(turn(degrees)).add(pivot);
export const demo = pointView('orbitWithScale', { label: 'turn', min: -160, max: 160, step: 5, value: 55 },
  point, (degrees) => orbitWithScale(point.clone(), pivot.clone(), turn(degrees), scale.clone()), expected,
  (scene) => { if (!pin.parent) scene.add(pin); });
