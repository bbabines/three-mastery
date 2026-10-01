import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { thumbnailTarget } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const width = 256, height = 144;
  {
    const result = attempt('thumbnailTarget', () => thumbnailTarget(width,height)); if (result.ok) {
      const thumbnail = new THREE.Scene(); thumbnail.background = new THREE.Color(COLORS.blue);
      renderer.setRenderTarget(result.value); renderer.render(thumbnail,camera); renderer.setRenderTarget(null);
      const preview = new THREE.Mesh(new THREE.PlaneGeometry(1.6,0.9),new THREE.MeshBasicMaterial({map:result.value.texture})); preview.position.set(0,1,0); scene.add(preview);
    }
    readout.textContent = result.ok ? `offscreen target: ${result.value.width} × ${result.value.height}` : result.note;
  }
};
