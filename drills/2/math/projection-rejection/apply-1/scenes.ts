// Runs drill.ts live: the grey ghost is where the sliders put the part, and the yellow ball is where
// keepClear lets it sit. The faint tube around the pipe is the clearance.
import { attempt, ball, COLORS, formatNumber, line, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { keepClear } from './drill';

const START = new THREE.Vector3(-2.2, 0.6, -0.8);
const END = new THREE.Vector3(2.2, 1.4, 0.6);
const CLEARANCE = 0.5;

// A cylinder of `radius` running from `start` to `end`.
function tube(start: THREE.Vector3, end: THREE.Vector3, radius: number, material: THREE.Material) {
  const along = end.clone().sub(start);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, along.length(), 32), material);
  mesh.position.lerpVectors(start, end, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), along.normalize());
  return mesh;
}

export const pipe: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.2, 3.4, 3.9);
  controls.target.set(0, 1, 0);

  const faint = new THREE.MeshStandardMaterial({ color: COLORS.blue, transparent: true, opacity: 0.12, depthWrite: false });
  const caps = [START, END].map((end) => {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(CLEARANCE, 32, 16), faint);
    cap.position.copy(end);
    return cap;
  });
  scene.add(tube(START, END, 0.07, new THREE.MeshStandardMaterial({ color: COLORS.white })), tube(START, END, CLEARANCE, faint), ...caps);

  const ghost = ball(COLORS.gray, 0.45, 0.12);
  const part = ball(COLORS.yellow, 1, 0.12);
  const push = line(COLORS.yellow, 0.6);
  scene.add(ghost, part, push);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const point = new THREE.Vector3(0.4, 1.3, 0.35);
  const pipeLine = new THREE.Line3(START, END);

  const update = () => {
    ghost.position.copy(point);
    const result = attempt('keepClear', () => keepClear(point.clone(), START.clone(), END.clone(), CLEARANCE));
    part.visible = push.visible = result.ok;
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    part.position.copy(result.value);
    const nearest = pipeLine.closestPointToPoint(result.value, true, new THREE.Vector3());
    setLine(push, nearest, result.value);
    const distance = result.value.distanceTo(nearest);
    readout.textContent = [
      `keepClear(point, pipeStart, pipeEnd, ${CLEARANCE})`,
      `distance from the pipe  ${formatNumber(distance)}`,
      distance >= CLEARANCE - 1e-6 ? 'clear of the pipe' : 'too close to the pipe',
    ].join('\n');
  };

  const axes = [
    ['across', 'x', -3, 3],
    ['height', 'y', 0.1, 2.4],
    ['deep', 'z', -1.8, 1.8],
  ] as const;
  for (const [text, axis, min, max] of axes) {
    slider(bar, text, { min, max, step: 0.05, value: point[axis] }, (value) => {
      point[axis] = value;
      update();
    });
  }
  update();
};
