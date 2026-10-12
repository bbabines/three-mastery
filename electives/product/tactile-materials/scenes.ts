import * as THREE from 'three';
import type { SceneSetup } from '@harness/scene';
import { watchLab } from '../lab';

function roughnessStudy(): THREE.DataTexture {
  const pixels = new Uint8Array(64 * 64 * 4);
  let seed = 73;
  for (let i = 0; i < 64 * 64; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const grain = 120 + Math.floor(seed / 0x100000000 * 135);
    pixels.set([grain, grain, grain, 255], i * 4);
  }
  const texture = new THREE.DataTexture(pixels, 64, 64);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3); texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter; texture.generateMipmaps = true;
  texture.colorSpace = THREE.NoColorSpace; texture.needsUpdate = true;
  return texture;
}

export const leatherLab: SceneSetup = harness => watchLab(harness, lab => {
  harness.camera.position.set(3, 3.3, 6.5);
  harness.controls.target.set(0, 1.8, 0);
  const texture = lab.normalTexture.clone(); texture.needsUpdate = true;
  const variation = roughnessStudy();
  const strap = lab.strap;
  strap.normalMap = texture;
  let strength = 0.3, repeat = 3, roughness = strap.roughness, metalness = strap.metalness;
  let maps = 'reference normal', lighting = 'reference';
  const report = () => lab.setReadout(`normal ${strength.toFixed(2)} · repeat ${repeat.toFixed(1)} · roughness ${roughness.toFixed(2)}\nmetalness ${metalness.toFixed(3)} · ${maps}\nlighting ${lighting} · optional roughness is synthetic study data`);
  lab.addSelect('map isolation', {
    'reference normal': () => { maps = 'reference normal'; strap.normalMap = texture; strap.roughnessMap = null; strap.needsUpdate = true; report(); },
    none: () => { maps = 'none'; strap.normalMap = null; strap.roughnessMap = null; strap.needsUpdate = true; report(); },
    'synthetic roughness only': () => { maps = 'synthetic roughness only'; strap.normalMap = null; strap.roughnessMap = variation; strap.needsUpdate = true; report(); },
    'normal + synthetic roughness': () => { maps = 'normal + synthetic roughness'; strap.normalMap = texture; strap.roughnessMap = variation; strap.needsUpdate = true; report(); },
  });
  lab.addSelect('illumination', {
    reference: () => { lighting = 'reference'; lab.setEnvironment('reference'); report(); },
    uniform: () => { lighting = 'uniform'; lab.setEnvironment('uniform'); report(); },
    'graduated panels': () => { lighting = 'graduated panels'; lab.setEnvironment('panels'); report(); },
  });
  lab.addSlider('normal strength', 0, 1.5, 0.05, strength, value => { strength = value; strap.normalScale.set(value, -value); report(); });
  lab.addSlider('grain repetition', 1, 12, 0.5, repeat, value => { repeat = value; texture.repeat.set(value, value); variation.repeat.set(value, value); report(); });
  lab.addSlider('roughness', 0.15, 1, 0.025, roughness, value => { roughness = value; strap.roughness = value; report(); });
  lab.addSelect('leather interpretation', {
    'reference artistic metalness': () => { metalness = 0.3256803474869249; strap.metalness = metalness; report(); },
    'dielectric leather': () => { metalness = 0; strap.metalness = 0; report(); },
  });
  lab.registerEvidence(() => ({ strength, repeat, roughness, metalness, maps, lighting, roughnessSource: 'synthetic study, not extracted reference' }));
  lab.onLeave(() => { strap.normalMap = lab.normalTexture; strap.roughnessMap = null; texture.dispose(); variation.dispose(); });
  report();
});

export const finishLayers: SceneSetup = harness => watchLab(harness, lab => {
  const originalStrap = lab.strap;
  const originalCover = lab.materials.get('metal_cover')!;
  const strap = new THREE.MeshPhysicalMaterial();
  const cover = new THREE.MeshPhysicalMaterial();
  // MeshPhysicalMaterial.copy expects another physical material. Build via the standard copy,
  // then keep the freshly constructed physical layer defaults intact.
  THREE.MeshStandardMaterial.prototype.copy.call(strap, originalStrap);
  THREE.MeshStandardMaterial.prototype.copy.call(cover, originalCover);
  strap.defines = { STANDARD: '', PHYSICAL: '' };
  cover.defines = { STANDARD: '', PHYSICAL: '' };
  strap.sheen = 0; strap.sheenColor = new THREE.Color(0xb3c2d5); strap.sheenRoughness = 0.65;
  cover.anisotropy = 0; cover.anisotropyRotation = 0;
  const originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  lab.model.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    originals.set(object, object.material);
    const replace = (material: THREE.Material) => material === originalStrap ? strap : material === originalCover ? cover : material;
    object.material = Array.isArray(object.material) ? object.material.map(replace) : replace(object.material);
  });
  let sheen = 0, anisotropy = 0, angle = 0, finish = 'reference leather';
  const report = () => lab.setReadout(`strap sheen ${sheen.toFixed(2)} · cover anisotropy ${anisotropy.toFixed(2)}\nanisotropy rotation ${angle}° · UV-aligned adaptation\nthese extra layers are demonstrations, not restored WebGi shaders`);
  lab.addSlider('cloth sheen on strap', 0, 1, 0.05, 0, value => { sheen = value; strap.sheen = value; report(); });
  lab.addSlider('brushed cover anisotropy', 0, 1, 0.05, 0, value => { anisotropy = value; cover.anisotropy = value; report(); });
  lab.addSlider('brush direction', -180, 180, 5, 0, value => { angle = value; cover.anisotropyRotation = THREE.MathUtils.degToRad(value); report(); });
  lab.addSelect('strap finish', {
    'reference leather': () => { finish = 'reference leather'; strap.metalness = originalStrap.metalness; strap.roughness = originalStrap.roughness; strap.clearcoat = 0; report(); },
    'dielectric matte rubber study': () => { finish = 'dielectric matte rubber study'; strap.metalness = 0; strap.roughness = 0.85; strap.sheen = 0; sheen = 0; strap.clearcoat = 0; report(); },
    'coated leather study': () => { finish = 'coated leather study'; strap.metalness = 0; strap.roughness = 0.6; strap.clearcoat = 0.65; strap.clearcoatRoughness = 0.2; report(); },
  });
  lab.registerEvidence(() => ({ finish, sheen, anisotropy, angle, clearcoat: strap.clearcoat, strapMetalness: strap.metalness, strapRoughness: strap.roughness, adaptation: true }));
  lab.onLeave(() => { originals.forEach((material, mesh) => { mesh.material = material; }); strap.dispose(); cover.dispose(); });
  report();
});
