import { overlay } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import * as THREE from 'three/webgpu';

export const preview: TslSceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.3, 3.6); controls.target.set(0, 1.3, 0);
  for (const child of scene.children) if (child instanceof THREE.AxesHelper) child.visible = false;
  const square = new THREE.PlaneGeometry(1.4, 1.4);
  for (const [i, blend] of [THREE.NormalBlending, THREE.AdditiveBlending].entries()) {
    const x = i === 0 ? -0.85 : 0.85;
    const background = new THREE.Mesh(square, new THREE.MeshBasicNodeMaterial({ color: 0x2563eb }));
    background.position.set(x, 1.3, -0.02);
    const foreground = new THREE.Mesh(new THREE.CircleGeometry(0.48, 48), new THREE.MeshBasicNodeMaterial({ color: 0xf97316, transparent: true, opacity: 0.55, blending: blend, depthWrite: false }));
    foreground.position.set(x + 0.12, 1.3, 0.02);
    scene.add(background, foreground);
  }
  overlay(container, 'readout').textContent = 'Left: alpha replaces part of blue. Right: additive light brightens blue; both overlays keep depthWrite off.';
};
