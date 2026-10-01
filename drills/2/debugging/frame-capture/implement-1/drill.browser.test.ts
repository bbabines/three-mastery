import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it } from 'vitest';
import { captureFrameCounts } from './drill';

it('captures actual WebGL draws and triangles', () => {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(16, 16);
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();
  scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
  camera.position.z = 3;
  const counts = answered(captureFrameCounts(renderer, scene, camera));
  expect(counts.calls).toBeGreaterThanOrEqual(1);
  expect(counts.triangles).toBeGreaterThanOrEqual(12);
  geometry.dispose();
  material.dispose();
  renderer.dispose();
});
