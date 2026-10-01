import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it } from 'vitest';
import { targetRedByte } from './drill';

it('reads a rendered target pixel instead of inferring from scene objects', () => {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(8, 8);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff0000);
  const target = new THREE.WebGLRenderTarget(8, 8);
  const camera = new THREE.PerspectiveCamera();
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  expect(answered(targetRedByte(renderer, target, 4, 4))).toBeGreaterThan(200);
  target.dispose();
  renderer.dispose();
});
