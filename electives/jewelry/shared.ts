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

const exrs = new Map<string, Promise<THREE.DataTexture>>();
// One of iJewel's two environments, prefiltered for this renderer, ready for scene.environment.
export async function environment(renderer: THREE.WebGLRenderer, which: keyof typeof ENVIRONMENTS) {
  if (!exrs.has(which)) exrs.set(which, new EXRLoader().loadAsync(ENVIRONMENTS[which]));
  const equirect = await exrs.get(which)!;
  equirect.mapping = THREE.EquirectangularReflectionMapping;
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

// Jewelry scenes are lit only by the environment: no grid, axes, or sky light, and tone mapping
// on, since the environments hold values far brighter than 1.
export function jewelryStage(harness: Harness) {
  const { scene, renderer } = harness;
  hideFloorHelpers(scene);
  const sky = scene.children.find((child) => child instanceof THREE.HemisphereLight);
  if (sky) sky.visible = false;
  renderer.toneMapping = THREE.NeutralToneMapping;
  scene.background = new THREE.Color(0x202228);
}
