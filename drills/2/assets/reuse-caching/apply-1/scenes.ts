import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { cachedLoad, nextPreload } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const cache = new Map<string, Promise<string>>(); const load = (url: string) => Promise.resolve(url);
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const cached = attempt('cachedLoad', () => cachedLoad('/rack.glb', cache, load)); const next = attempt('nextPreload', () => nextPreload([{url:'/cup.glb',likely:true,bytes:80}],100));
    readout.textContent = [cached.ok ? `cache entries: ${cache.size}` : cached.note, next.ok ? `next preload: ${next.value}` : next.note].join('\n');
  });
};
