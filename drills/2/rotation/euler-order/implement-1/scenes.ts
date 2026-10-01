// Runs drill.ts live: the gray camera takes the rotation lookRotation returns, and the picture in the
// corner is what it sees. The yellow ball is placed by three.js where the camera should look.
import { attempt, ball, cameraView, COLORS, formatNumber, formatVector, overlay, showCamera, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { lookRotation } from './drill';

const EYE = new THREE.Vector3(0, 1.5, 0);
const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);

export const look: SceneSetup = (harness) => {
  const { scene, camera, controls, container } = harness;
  camera.position.set(3.4, 3.6, 4.6);
  controls.target.set(0, 1.3, 0);

  // The camera being turned, and a copy with a short reach that draws its body and outline.
  const eye = new THREE.PerspectiveCamera(60, 1.5, 0.1, 100);
  eye.position.copy(EYE);
  const outline = new THREE.PerspectiveCamera(60, 1.5, 0.3, 1.1);
  const helper = showCamera(outline);
  outline.position.copy(EYE);
  // A wide ground just under the grid: its far edge is the horizon in the camera's picture.
  const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#272b34' }));
  ground.position.y = -0.02;
  const goal = ball(COLORS.yellow, 1, 0.12);
  scene.add(eye, outline, helper, ground, goal);
  // Upright posts all around, so a tipped horizon shows in the picture.
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.2, 0.14), new THREE.MeshStandardMaterial({ color: i % 2 ? COLORS.orange : COLORS.blue }));
    post.position.set(Math.cos(angle) * 3.2, 1.1, Math.sin(angle) * 3.2);
    scene.add(post);
  }
  cameraView(harness, eye, [outline, helper]);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { yaw: 40, pitch: -30 };
  const looking = new THREE.Vector3();

  const update = () => {
    const yaw = THREE.MathUtils.degToRad(values.yaw);
    const pitch = THREE.MathUtils.degToRad(values.pitch);
    // Where the camera should look, worked out without Euler angles.
    const want = new THREE.Vector3(0, 0, -1).applyAxisAngle(X, pitch).applyAxisAngle(Y, yaw);
    goal.position.copy(EYE).addScaledVector(want, 2.2);

    const result = attempt('lookRotation', () => lookRotation(yaw, pitch));
    if (result.ok) eye.rotation.copy(result.value);
    else eye.rotation.set(0, 0, 0);
    outline.quaternion.copy(eye.quaternion);
    if (!result.ok) {
      readout.textContent = result.note;
      return;
    }
    const e = result.value;
    const side = X.clone().applyQuaternion(eye.quaternion);
    const tilt = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(side.y, -1, 1)));
    eye.getWorldDirection(looking);
    const off = THREE.MathUtils.radToDeg(looking.angleTo(want));
    const verdict = [
      Math.abs(tilt) < 0.5 ? 'horizon level' : `horizon tipped ${formatNumber(Math.abs(tilt), 0)}°`,
      off < 0.5 ? 'the ball is in the middle' : `looking ${formatNumber(off, 0)}° away from the ball`,
    ].join(', ');
    readout.textContent = [
      `lookRotation(${formatNumber(yaw)}, ${formatNumber(pitch)})`,
      `  (${formatNumber(e.x)}, ${formatNumber(e.y)}, ${formatNumber(e.z)}, '${e.order}')`,
      `own +X  ${formatVector(side, 2)}`,
      verdict,
    ].join('\n');
  };

  slider(bar, 'yaw', { min: -180, max: 180, step: 5, value: values.yaw }, (value) => {
    values.yaw = value;
    update();
  });
  slider(bar, 'pitch', { min: -80, max: 80, step: 5, value: values.pitch }, (value) => {
    values.pitch = value;
    update();
  });
  update();
};
