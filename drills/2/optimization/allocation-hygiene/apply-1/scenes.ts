import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { boundsInto } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const frameSamples: number[] = [];
  const root=new THREE.Group(); const mesh=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({color: COLORS.blue})); root.add(mesh); scene.add(root); const scratch=new THREE.Box3();
  onFrame((delta, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    if (delta > 0 && delta < 0.2) { frameSamples.push(delta * 1000); if (frameSamples.length > 60) frameSamples.shift(); }
    const result=attempt('boundsInto',()=>boundsInto(root,scratch));
    readout.textContent = (result.ok ? `box reused: ${result.value===scratch}` : result.note) + `\nframe: ${frameSamples.length ? (frameSamples.reduce((a,b)=>a+b,0)/frameSamples.length).toFixed(2) : '—'} ms; draws: ${renderer.info.render.calls}`;
  });
};
