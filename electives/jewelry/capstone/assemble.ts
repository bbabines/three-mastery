// The whole look, assembled from the units' own code: each part of a loaded piece gets the material
// the playground gives it, lit the way the playground lights it. `apply` switches any one piece back
// to the common shortcut, so a page can show what each piece adds. Spring's parts are found by their
// iJewel tags and material names; another model's by sensible guesses (see `roleOf`).
import * as THREE from 'three';
import { ceramicMaterial, CERAMICS, pearlMaterial } from '../ceramic-pearl/materials';
import { GEMS, gemMaterial } from '../gem-shader/gem-material';
import { metalMaterial, type MetalName } from '../polished-metal/metal';
import { environmentImage, isGem, METALS, mirrorStandIn } from '../shared';
import { loadWoodTextures, triplanarMaterial, WOOD } from '../small-textures/triplanar';
import { prefilter } from '../two-environments/environments';

export interface Recipe {
  gems: 'traced' | 'glass' | 'mirror'; // the gem shader, three.js transmission, or a plain mirror
  lighting: 'split' | 'one'; // each its own environment, or the metal's studio for everything
  toneMapping: 'aces' | 'none';
  metal: MetalName;
  wood: 'triplanar' | 'uv';
}

export const PLAYGROUND: Recipe = { gems: 'traced', lighting: 'split', toneMapping: 'aces', metal: 'rose gold', wood: 'triplanar' };

type Role = 'gem' | 'metal' | 'ceramic' | 'red ceramic' | 'pearl' | 'wood' | 'other';

// What a part is. Spring's files name a material's source file and tag its gems; for another model
// a gem is a part whose material or name says so, and metal is anything fully metallic.
export function roleOf(mesh: THREE.Mesh): Role {
  const material = mesh.material as THREE.MeshStandardMaterial;
  const names = `${material.name} ${mesh.name}`.toLowerCase();
  if (isGem(mesh) || /diamond|gem|stone|ruby|sapphire|emerald|crystal|cz\b/.test(names)) return 'gem';
  const source = String(material.userData.rootPath ?? '');
  if (source.includes('wood')) return 'wood';
  if (source.includes('ceramic_red')) return 'red ceramic';
  if (source.includes('ceramic')) return 'ceramic';
  if (source.includes('pearl') || /pearl/.test(names)) return 'pearl';
  if (material.metalness >= 0.9) return 'metal';
  return 'other';
}

// Which of iJewel's gem settings a stone gets, from its material's source file or its name.
function gemKind(mesh: THREE.Mesh) {
  const text = `${(mesh.material as THREE.Material).userData.rootPath ?? ''} ${(mesh.material as THREE.Material).name} ${mesh.name}`.toLowerCase();
  if (text.includes('ruby')) return 'ruby';
  if (text.includes('sapphire')) return 'yellow sapphire';
  if (text.includes('emerald')) return 'emerald';
  return 'diamond';
}

export interface Assembled {
  model: THREE.Object3D;
  counts: Record<Role, number>;
  apply(recipe: Recipe): void;
  dispose(): void;
}

// Builds the look on `model` (a clone of a loaded glTF scene) for this renderer and scene. Loads the
// two environments and the wood textures, and keeps every material it makes so `apply` only swaps.
export async function assemble(model: THREE.Object3D, renderer: THREE.WebGLRenderer, scene: THREE.Scene): Promise<Assembled> {
  const [metalImage, gemImage, wood] = await Promise.all([environmentImage('metal'), environmentImage('gem'), loadWoodTextures()]);
  const metalEnv = prefilter(renderer, metalImage);
  const gemEnv = prefilter(renderer, gemImage);
  const made: THREE.Material[] = [];
  const make = <M extends THREE.Material>(material: M) => (made.push(material), material);

  const metal = make(metalMaterial('rose gold'));
  const ceramic = make(ceramicMaterial(CERAMICS.rosa));
  const redCeramic = make(ceramicMaterial(CERAMICS.red));
  const pearl = make(pearlMaterial());
  const woodProjected = make(triplanarMaterial({ ...wood, color: WOOD.color, roughness: WOOD.roughness, metalness: WOOD.metalness, blend: WOOD.blend }));
  const woodOnUVs = make(new THREE.MeshStandardMaterial({ ...wood, color: WOOD.color, roughness: WOOD.roughness, metalness: WOOD.metalness }));
  const mirror = make(mirrorStandIn());
  const glass = make(new THREE.MeshPhysicalMaterial({ transmission: 1, ior: 2.42, thickness: 0.2, roughness: 0 }));

  // The gem shader: one material per stored shape and kind, for each environment it might trace.
  const traced = new Map<string, THREE.ShaderMaterial>();
  const tracedFor = (mesh: THREE.Mesh, kind: string, panorama: THREE.Texture) => {
    const key = `${mesh.geometry.uuid} ${kind} ${panorama.uuid}`;
    if (!traced.has(key)) traced.set(key, make(gemMaterial(mesh.geometry, panorama, GEMS[kind])));
    return traced.get(key)!;
  };

  // A stone's kind is read once, from the material it was loaded with: after `apply`, its material
  // is one of ours, which no longer names a ruby or an emerald.
  const parts: { mesh: THREE.Mesh; role: Role; kind: string }[] = [];
  const counts: Record<Role, number> = { gem: 0, metal: 0, ceramic: 0, 'red ceramic': 0, pearl: 0, wood: 0, other: 0 };
  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const role = roleOf(child);
    counts[role]++;
    // Object-space projection stretches with the part's own scale, so bake a wood part's transform
    // into its geometry (Spring's band is stretched 1.43 along one axis).
    if (role === 'wood') {
      child.geometry = child.geometry.clone().applyMatrix4(child.matrix);
      child.position.set(0, 0, 0);
      child.quaternion.identity();
      child.scale.set(1, 1, 1);
    }
    parts.push({ mesh: child, role, kind: role === 'gem' ? gemKind(child) : '' });
  });
  // The wood's tiles per unit, in its parent's units: one tile per unit of the finished piece.
  const woodParent = parts.find((part) => part.role === 'wood')?.mesh.parent;
  if (woodParent) {
    model.updateMatrixWorld(true);
    woodProjected.userData.triplanar.scale.value = WOOD.scale * woodParent.getWorldScale(new THREE.Vector3()).x;
  }

  return {
    model,
    counts,
    apply(recipe) {
      renderer.toneMapping = recipe.toneMapping === 'aces' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
      renderer.toneMappingExposure = 1;
      scene.environment = metalEnv;
      const gemLighting = recipe.lighting === 'split' ? gemEnv : null; // null: the scene's (metal) one
      const preset = METALS[recipe.metal];
      metal.color.set(preset.color);
      metal.metalness = preset.metalness;
      metal.roughness = preset.roughness;
      mirror.envMap = glass.envMap = gemLighting;
      for (const { mesh, role, kind } of parts) {
        if (role === 'gem') {
          mesh.material =
            recipe.gems === 'traced' ? tracedFor(mesh, kind, recipe.lighting === 'split' ? gemImage : metalImage) : recipe.gems === 'glass' ? glass : mirror;
        } else if (role === 'metal') mesh.material = metal;
        else if (role === 'ceramic') mesh.material = ceramic;
        else if (role === 'red ceramic') mesh.material = redCeramic;
        else if (role === 'pearl') mesh.material = pearl;
        else if (role === 'wood') mesh.material = recipe.wood === 'triplanar' ? woodProjected : woodOnUVs;
      }
      for (const material of [mirror, glass]) material.needsUpdate = true; // envMap on or off is a shader change
    },
    dispose() {
      for (const material of made) material.dispose();
      metalEnv.dispose();
      gemEnv.dispose();
      wood.map.dispose();
      wood.roughnessMap.dispose();
    },
  };
}
