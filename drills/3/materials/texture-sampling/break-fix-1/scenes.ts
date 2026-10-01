import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { distantTile } from './drill';

export const preview: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 0.7, 3);
  controls.target.set(0, 0, -2);
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    ctx.fillStyle = (x + y) % 2 ? '#e8e8e8' : '#262626';
    ctx.fillRect(x * 8, y * 8, 8, 8);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 20);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 12), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -2;
  scene.add(floor);
  const result = attempt('distantTile', () => distantTile(tex));
  overlay(container, 'readout').textContent = result.ok
    ? `Mipmap chain: ${result.value.generateMipmaps ? 'on' : 'off'}\nOrbit low over the floor and watch whether the distant checks shimmer.`
    : result.note;
};
