import { expect, it } from 'vitest';
import { Color, DataTexture, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, RGBAFormat, Scene, WebGLRenderer } from 'three';
import { updateVariant } from './drill';

it('keeps GPU texture count stable across 20 variant changes', () => {
  const renderer = new WebGLRenderer({ antialias: false });
  renderer.setSize(16, 16);
  const camera = new PerspectiveCamera(60, 1, 0.1, 10);
  camera.position.z = 3;
  const scene = new Scene();
  const geometry = new PlaneGeometry();
  const firstMap = new DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1, RGBAFormat);
  firstMap.needsUpdate = true;
  const material = new MeshBasicMaterial({ map: firstMap });
  scene.add(new Mesh(geometry, material));
  renderer.render(scene, camera);
  const baseline = renderer.info.memory.textures;
  const scratch = new Uint8Array(4);

  for (let i = 0; i < 20; i++) {
    updateVariant(material, new Color(i / 20, 0.5, 1 - i / 20), scratch);
    renderer.render(scene, camera);
  }

  expect(renderer.info.memory.textures).toBe(baseline);
  expect(material.map).toBe(firstMap);
  firstMap.dispose();
  material.dispose();
  geometry.dispose();
  renderer.dispose();
});
