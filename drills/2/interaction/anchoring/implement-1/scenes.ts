import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { labelPosition } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const tag = document.createElement('span'); tag.textContent = 'price'; tag.style.cssText = 'position:absolute;z-index:2;background:#facc15;color:#15171c;padding:2px 5px;border-radius:4px'; container.append(tag);
  const rect = {left:0,top:0,width:600,height:300}; const world = new THREE.Vector3(0,0,0); camera.position.set(0,0,5); camera.lookAt(0,0,0); camera.updateMatrixWorld();
  {
    const result = attempt('labelPosition', () => labelPosition(world,camera,rect));
    tag.hidden = !result.ok || !result.value.visible;
    if (result.ok) { tag.style.left = `${result.value.x / rect.width * 100}%`; tag.style.top = `${result.value.y / rect.height * 100}%`; }
    readout.textContent = result.ok ? `label: ${result.value.x.toFixed(0)}, ${result.value.y.toFixed(0)}; visible: ${result.value.visible}` : result.note;
  }
};
