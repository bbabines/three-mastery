import * as THREE from 'three';

// Draw a shader on a full-screen plane and read one real WebGL pixel.
export function shaderPixel(material: THREE.Material, x: number, y: number, size = 64): [number, number, number, number] {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(size, size, false);
  const target = new THREE.WebGLRenderTarget(size, size);
  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 2;
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
  const pixel = new Uint8Array(4);
  renderer.readRenderTargetPixels(target, x, y, 1, 1, pixel);
  target.dispose();
  geometry.dispose();
  renderer.dispose();
  return [pixel[0], pixel[1], pixel[2], pixel[3]];
}
