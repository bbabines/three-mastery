import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { stencilWriter, msaaTarget } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const material = new THREE.MeshBasicMaterial({color: COLORS.blue}); const mesh = new THREE.Mesh(new THREE.BoxGeometry(),material); scene.add(mesh);
  {
    const stencil = attempt('stencilWriter', () => stencilWriter(material,3)); const target = attempt('msaaTarget', () => msaaTarget(320,180,4)); if (target.ok) target.value.dispose();
    readout.textContent = [stencil.ok ? `stencil ref: ${stencil.value.stencilRef}` : stencil.note, target.ok ? `target samples: ${target.value.samples}` : target.note].join('\n');
  }
};
