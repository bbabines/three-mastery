// iJewel's polished metals as three.js materials, for any jewelry scene (the capstone unit builds
// Spring's metal with it). A preset is the whole material: a color, metalness, and roughness, with
// no textures. It needs scene.environment (or envMap) to show anything, and tone mapping
// (jewelryStage in ../shared sets the playground's ACES Filmic, exposure 1) to show it right.
import * as THREE from 'three';
import { METALS } from '../shared';

export type MetalName = keyof typeof METALS;
export const METAL_NAMES = Object.keys(METALS) as MetalName[];

// The preset's hex is sRGB, the way a color picker shows it. Passing it as `color` runs
// color.set(hex), which converts it to linear for the shader. The .pmat files' other settings
// (sheen, clearcoat, transmission 0; reflectivity 0.5, the same 4% reflection MeshStandardMaterial
// uses; side: DoubleSide, which a closed ring doesn't need) change nothing here.
export function metalMaterial(name: MetalName) {
  const { color, metalness, roughness } = METALS[name];
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}

// Spring's own metal ("Metal 01" in Spring.glb), as the file stores it: glTF's baseColorFactor is
// linear, so it goes to setRGB, whose default is linear. It's #e5b377 in sRGB, a yellower gold than
// the rose gold preset its material file names as its source.
export const SPRING_METAL_LINEAR: [number, number, number] = [0.783537791521566, 0.450785782828426, 0.1844749944900301];

export function springMetalMaterial() {
  const material = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0 });
  material.color.setRGB(...SPRING_METAL_LINEAR);
  return material;
}
