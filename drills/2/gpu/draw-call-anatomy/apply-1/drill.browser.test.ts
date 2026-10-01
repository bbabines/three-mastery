import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it } from 'vitest';
import { renderCallCount } from './drill';

it('reports real draw submissions from a WebGL render', () => {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(32, 32);
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
  camera.position.z = 3;
  const calls = answered(renderCallCount(renderer, scene, camera));
  expect(calls).toBeGreaterThanOrEqual(1);
  geometry.dispose();
  material.dispose();
  renderer.dispose();
});
