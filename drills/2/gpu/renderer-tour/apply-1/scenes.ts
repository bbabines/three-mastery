import { attempt, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { capRendererDpr, putOverlayLast } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1, 5);
  controls.target.set(0, 0.5, 0);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.5), new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.75, depthWrite: false }));
  back.position.y = 0.9;
  back.renderOrder = 1;
  const overlayObject = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.9), new THREE.MeshBasicMaterial({ color: COLORS.yellow, transparent: true, opacity: 0.75, depthWrite: false }));
  overlayObject.position.set(0, 0.9, 0.05);
  scene.add(back, overlayObject);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const show = (deviceDpr: number) => {
    const dpr = attempt('capRendererDpr', () => capRendererDpr(renderer, deviceDpr, 2));
    const order = attempt('putOverlayLast', () => putOverlayLast(overlayObject, 9));
    readout.textContent = [
      dpr.ok ? `device DPR ${deviceDpr}; canvas DPR ${renderer.getPixelRatio()}` : dpr.note,
      order.ok ? `yellow overlay order ${overlayObject.renderOrder}; blue panel order 1` : order.note,
      'yellow overlay should draw after the blue panel',
    ].join('\n');
  };
  for (const deviceDpr of [1, 3]) {
    const button = document.createElement('button');
    button.textContent = `device DPR ${deviceDpr}`;
    button.addEventListener('click', () => show(deviceDpr));
    bar.append(button);
  }
  show(3);
};
