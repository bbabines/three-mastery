import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { pickingTarget } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const width = 640, height = 360;
  {
    const result = attempt('pickingTarget', () => pickingTarget(width,height)); if (result.ok) {
      const ids = new THREE.Scene(); ids.background = new THREE.Color(0x00ff00);
      renderer.setRenderTarget(result.value); renderer.render(ids,camera); renderer.setRenderTarget(null);
      const preview = new THREE.Mesh(new THREE.PlaneGeometry(1.6,0.9),new THREE.MeshBasicMaterial({map:result.value.texture})); preview.position.set(0,1,0); scene.add(preview);
    }
    readout.textContent = result.ok ? `pick target: ${result.value.width} × ${result.value.height}; samples: ${result.value.samples}` : result.note;
  }
};
