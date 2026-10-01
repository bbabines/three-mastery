import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { gizmoMode } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 6);
  controls.target.set(0, 0.5, 0);
  const part = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  part.position.y = 0.5;
  const unwantedOrbit = ball(COLORS.red, 1, 0.18);
  unwantedOrbit.position.set(1.4, 1.5, 0);
  scene.add(part, unwantedOrbit);
  const readout = overlay(container, 'readout');
  const buttons = overlay(container, 'controls');
  const orbit = { enabled: true, updates: 0, update() { this.updates++; } };
  const show = (dragging: boolean) => {
    const result = attempt('gizmoMode', () => gizmoMode(orbit, dragging));
    unwantedOrbit.visible = dragging && orbit.enabled;
    readout.textContent = result.ok
      ? `gizmo ${dragging ? 'dragging' : 'released'}; orbit ${orbit.enabled ? 'on' : 'off'}
red camera motion during drag: ${unwantedOrbit.visible ? 'unwanted' : 'stopped'}
damping updates after release: ${orbit.updates}`
      : result.note;
  };
  for (const [label, dragging] of [['drag gizmo', true], ['release gizmo', false]] as const) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', () => show(dragging));
    buttons.append(button);
  }
  show(true);
};
