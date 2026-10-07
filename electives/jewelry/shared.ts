// Shared by the Jewelry look-dev pages: iJewel's reference files (see this folder's README) and the
// setup every jewelry scene uses.
import { loadModel } from '@harness/models';
import { hideFloorHelpers } from '@harness/lesson';
import type { Harness } from '@harness/scene';
import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

const REFERENCE = '/assets/reference/ijewel';
export const SPRING_URL = `${REFERENCE}/Spring.glb`;
const ENVIRONMENTS = {
  metal: `${REFERENCE}/hdr/env_metal_011_172e446a13.exr`,
  gem: `${REFERENCE}/hdr/env_gem_001_b9c4533e70.exr`,
};

export const MISSING_REFERENCE =
  "iJewel's reference files aren't on this machine. electives/jewelry/README.md says where to get them.";

// Loaded once per page and shared. Scenes clone the model, which shares its geometry and materials.
let spring: Promise<GLTF> | undefined;
export function loadSpring() {
  spring ??= loadModel(SPRING_URL);
  return spring;
}

export type EnvironmentName = keyof typeof ENVIRONMENTS;

const exrs = new Map<string, Promise<THREE.DataTexture>>();
// One of iJewel's two environments as the panorama itself (half-float, values far above 1), for a
// background or for a shader that samples it directly, like the gem shader. Loaded once per page.
export async function environmentImage(which: EnvironmentName) {
  if (!exrs.has(which)) exrs.set(which, new EXRLoader().loadAsync(ENVIRONMENTS[which]));
  const equirect = await exrs.get(which)!;
  equirect.mapping = THREE.EquirectangularReflectionMapping;
  return equirect;
}

// One of iJewel's two environments, prefiltered for this renderer, ready for scene.environment or a
// material's envMap.
export async function environment(renderer: THREE.WebGLRenderer, which: EnvironmentName) {
  const equirect = await environmentImage(which);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromEquirectangular(equirect).texture;
  pmrem.dispose();
  return texture;
}

// iJewel marks a gem by giving its material a WEBGI_materials_diamond extension. GLTFLoader keeps
// extensions it doesn't know in material.userData.gltfExtensions.
export function isGem(mesh: THREE.Mesh) {
  const material = mesh.material as THREE.Material;
  return Boolean(material.userData.gltfExtensions?.WEBGI_materials_diamond);
}

// A stand-in for the gem shader, which comes in its own unit: a perfect mirror, so each facet
// shows exactly what its normal points at.
export const mirrorStandIn = () => new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0 });

// iJewel's five polished metal presets (assets/reference/ijewel/materials/metals), as stored: the
// color is sRGB hex, the way the .pmat files hold it.
export const METALS = {
  'rose gold': { color: 0xf2af83, metalness: 1, roughness: 0 },
  'yellow gold': { color: 0xfec07a, metalness: 1, roughness: 0 },
  'white gold': { color: 0xc2c2c3, metalness: 1, roughness: 0 },
  platinum: { color: 0xb6b6b6, metalness: 0.88, roughness: 0 },
  silver: { color: 0xfcfcfc, metalness: 0.88, roughness: 0.065 },
};

// Jewelry scenes are lit only by the environment: no grid, axes, or sky light. Tone mapping is the
// playground's (ACES Filmic, exposure 1), since the environments hold values far brighter than 1.
export function jewelryStage(harness: Harness) {
  const { scene, renderer } = harness;
  hideFloorHelpers(scene);
  const sky = scene.children.find((child) => child instanceof THREE.HemisphereLight);
  if (sky) sky.visible = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  scene.background = new THREE.Color(0x202228);
}
