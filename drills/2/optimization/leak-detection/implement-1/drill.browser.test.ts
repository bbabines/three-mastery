import { answered } from '@harness/check';
import * as THREE from 'three';
import { expect, it } from 'vitest';
import { swapMemoryDelta } from './drill';

it('returns GPU geometry and texture counts to baseline after 20 swaps', () => {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(16, 16);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10);
  camera.position.z = 3;
  const scene = new THREE.Scene();
  function makeVariant() {
    const geometry = new THREE.BoxGeometry();
    const texture = new THREE.DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1);
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    return { mesh: new THREE.Mesh(geometry, material), geometry, material, texture };
  }
  let current = makeVariant();
  scene.add(current.mesh);
  const delta = answered(swapMemoryDelta(renderer, scene, camera, () => {
    scene.remove(current.mesh);
    current.geometry.dispose();
    current.material.dispose();
    current.texture.dispose();
    current = makeVariant();
    scene.add(current.mesh);
  }, 20));
  expect(delta).toEqual({ geometries: 0, textures: 0 });
  scene.remove(current.mesh);
  current.geometry.dispose();
  current.material.dispose();
  current.texture.dispose();
  renderer.dispose();
});
