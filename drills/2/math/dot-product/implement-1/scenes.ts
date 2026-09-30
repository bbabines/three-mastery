// Runs drill.ts live: each shopper turns red when canSee says the camera sees it. The yellow fan is
// the cone and range the sliders set.
import { attempt, ball, COLORS, overlay, pointer, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { canSee } from './drill';

const EYE = new THREE.Vector3(0, 0.3, 0);
const SHOPPERS = 9;

export const cone: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(0, 6, 5);
  controls.target.set(0, 0, 0.3);

  const securityCamera = pointer(COLORS.white, 0.8);
  securityCamera.position.copy(EYE);
  const fan = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({ color: COLORS.yellow, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }),
  );
  fan.position.y = 0.05; // just above the floor grid
  scene.add(securityCamera, fan);

  const shoppers = Array.from({ length: SHOPPERS }, (_, i) => {
    const mesh = ball(COLORS.gray, 1, 0.14);
    scene.add(mesh);
    return { mesh, radius: 0.8 + i * 0.35, speed: (i % 2 ? 1 : -1) * (0.12 + 0.04 * i), phase: i * 1.7 };
  });

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { turn: 20, half: 35, range: 2.6 };
  const facing = new THREE.Vector3();

  const reshape = () => {
    const turn = THREE.MathUtils.degToRad(values.turn);
    // The fan is built around +X, then turned to face the same way as `facing`.
    facing.set(Math.cos(turn), 0, -Math.sin(turn));
    const half = THREE.MathUtils.degToRad(values.half);
    fan.geometry.dispose();
    fan.geometry = new THREE.CircleGeometry(values.range, 64, -half, 2 * half).rotateX(-Math.PI / 2);
    fan.rotation.y = turn;
    securityCamera.lookAt(EYE.clone().add(facing));
  };

  onFrame((_, elapsed) => {
    let seen = 0;
    let note = '';
    for (const shopper of shoppers) {
      const angle = shopper.phase + elapsed * shopper.speed;
      shopper.mesh.position.set(Math.cos(angle) * shopper.radius, 0.3, Math.sin(angle) * shopper.radius);
      const result = attempt('canSee', () =>
        canSee(EYE.clone(), facing.clone(), shopper.mesh.position.clone(), values.half, values.range),
      );
      if (!result.ok) note = result.note;
      if (result.ok && result.value) seen += 1;
      (shopper.mesh.material as THREE.MeshStandardMaterial).color.set(result.ok && result.value ? COLORS.red : COLORS.gray);
    }
    readout.textContent = [
      `canSee(eye, facing, shopper, ${values.half}, ${values.range})`,
      note || `sees ${seen} of ${SHOPPERS} shoppers`,
    ].join('\n');
  });

  slider(bar, 'turn', { min: 0, max: 360, step: 5, value: values.turn }, (value) => {
    values.turn = value;
    reshape();
  });
  slider(bar, 'half angle', { min: 5, max: 180, step: 5, value: values.half }, (value) => {
    values.half = value;
    reshape();
  });
  slider(bar, 'range', { min: 0.5, max: 4, step: 0.1, value: values.range }, (value) => {
    values.range = value;
    reshape();
  });
  reshape();
};
