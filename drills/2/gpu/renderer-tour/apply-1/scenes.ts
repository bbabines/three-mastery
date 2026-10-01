import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { capRendererDpr, putOverlayLast } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const overlayObject = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); scene.add(overlayObject); const pixelRenderer = {setPixelRatio: (_n: number) => {}} as Pick<THREE.WebGLRenderer, "setPixelRatio">;
  {
    const dpr = attempt('capRendererDpr', () => capRendererDpr(pixelRenderer,3,2)); const order = attempt('putOverlayLast', () => putOverlayLast(overlayObject,9));
    readout.textContent = [dpr.ok ? `pixel ratio: ${dpr.value}` : dpr.note, order.ok ? `overlay order: ${order.value}` : order.note].join('\n');
  }
};
