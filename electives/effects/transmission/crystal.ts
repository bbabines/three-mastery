// The watch's crystal, as GLTFLoader builds it: MeshPhysicalMaterial with transmission 1,
// roughness 0, transparent, double-sided. Drawn double-sided, its back faces go into its own
// transmission and wash the dial out to a hazy blue-gray, on WebGPURenderer as on WebGLRenderer,
// and on this bench they also hid the see-through floor shadow. One side keeps real transmission.
import * as THREE from 'three/webgpu';

export function crystalOf(watch: THREE.Object3D) {
  let crystal: THREE.Mesh | undefined;
  watch.traverse((object) => {
    if (object instanceof THREE.Mesh && (object.material as THREE.Material).name === 'glass') crystal = object;
  });
  if (!crystal) throw new Error('The watch has no glass material');
  return crystal as THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
}

export function frontSideCrystal(watch: THREE.Object3D) {
  const crystal = crystalOf(watch);
  crystal.material.side = THREE.FrontSide;
  crystal.material.needsUpdate = true;
  return crystal;
}
