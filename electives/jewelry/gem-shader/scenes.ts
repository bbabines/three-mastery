import { buttonGroup, choiceButtons, COLORS, fitModel, formatNumber, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { environmentImage, isGem, jewelryStage, loadSpring, MISSING_REFERENCE } from '../shared';
import { GEMS, gemMaterial, type GemSettings, gemTint } from './gem-material';

// Calls `ready` once the page's assets have loaded, unless the page was left first. Shows the
// missing-files note in the readout when the reference files aren't on this machine.
function whenLoaded<T>(container: HTMLElement, readout: HTMLElement, load: Promise<T>, ready: (value: T) => void) {
  let left = false;
  onLeave(container, () => {
    left = true;
  });
  readout.textContent = 'Loading…';
  load.then(
    (value) => {
      if (!left) ready(value);
    },
    (error) => {
      readout.textContent = MISSING_REFERENCE;
      console.warn(error);
    },
  );
}

// One of Spring's stones by mesh name, centered, 0.8 across, standing table-up (iJewel's gem
// library stores stones with the table facing +Z).
function stoneGeometry(root: THREE.Object3D, name: string) {
  let source: THREE.BufferGeometry | undefined;
  root.traverse((child) => {
    if (child instanceof THREE.Mesh && child.name === name) source = child.geometry;
  });
  const geometry = source!.clone().center();
  geometry.computeBoundingSphere();
  const scale = 0.8 / geometry.boundingSphere!.radius;
  geometry.scale(scale, scale, scale);
  geometry.rotateX(-Math.PI / 2);
  geometry.computeBoundingSphere();
  return geometry;
}

// Which of iJewel's gem materials a Spring stone uses, from the .dmat file its material points to.
function gemKind(mesh: THREE.Mesh) {
  const path = String((mesh.material as THREE.Material).userData.rootPath ?? '');
  if (path.includes('ruby')) return 'ruby';
  if (path.includes('sapphire')) return 'yellow sapphire';
  if (path.includes('emerald')) return 'emerald';
  return 'diamond';
}

const turn = (stones: THREE.Object3D[], onFrame: (callback: (delta: number) => void) => void) =>
  onFrame((delta) => {
    for (const stone of stones) stone.rotation.y += delta * 0.3;
  });

// Evidence: Spring's 28 stones on their own, each with its own iJewel settings, traced.
export const stones: SceneSetup = (harness) => {
  const { scene, camera, controls, container, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(-0.4, 3.5, -1.25);
  controls.target.set(0, 2.25, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environmentImage('gem')]), ([gltf, env]) => {
    const model = gltf.scene.clone(true);
    const byKind = new Map<string, THREE.Mesh[]>();
    const materials = new Map<string, THREE.ShaderMaterial>(); // one per cut and kind, shared by copies
    const rest: THREE.Object3D[] = [];
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!isGem(child)) return rest.push(child);
      const kind = gemKind(child);
      const key = `${child.geometry.uuid} ${kind}`;
      if (!materials.has(key)) materials.set(key, gemMaterial(child.geometry, env, GEMS[kind]));
      child.material = materials.get(key)!;
      byKind.set(kind, [...(byKind.get(kind) ?? []), child]);
    });
    for (const part of rest) part.visible = false;
    scene.add(fitModel(model, 3));
    onLeave(container, () => materials.forEach((material) => material.dispose()));

    const all = [...byKind.values()].flat();
    const show = (kind: string | null) => {
      for (const stone of all) stone.visible = kind === null || gemKind(stone) === kind;
      const settings = kind ? GEMS[kind] : undefined;
      readout.innerHTML = kind
        ? [
          `${kind}: ${byKind.get(kind)!.length} stones`,
          `refraction ${settings!.ior}, ${settings!.bounces} bounces, absorption ${settings!.absorption}`,
          `color #${new THREE.Color(settings!.color).getHexString()}, boost (${settings!.boost.x}, ${settings!.boost.y}, ${settings!.boost.z})`,
        ].join('<br>')
        : `all ${all.length} stones, metal and the rest hidden<br>each traced with its own iJewel settings`;
    };
    choiceButtons(buttonGroup(bar, 'show'), [
      { html: 'all stones', select: () => show(null) },
      ...[...byKind.keys()].map((kind) => ({ html: kind, select: () => show(kind) })),
    ]);
  });
};

// Why it works: the same diamond as glass (three.js's transmission) and traced.
export const glassVsTraced: SceneSetup = (harness) => {
  const { scene, camera, controls, container, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0, 2.1, 3.2);
  controls.target.set(0, 1, 0);
  const readout = overlay(container, 'readout');

  whenLoaded(container, readout, Promise.all([loadSpring(), environmentImage('gem')]), ([gltf, env]) => {
    // The room behind both stones is the gem lighting file, so the glass one has something to show
    // through it.
    scene.background = env;
    scene.environment = env;
    const geometry = stoneGeometry(gltf.scene, 'Brillant_1');
    const glass = new THREE.MeshPhysicalMaterial({ transmission: 1, ior: 2.42, thickness: 0.8, roughness: 0, dispersion: 0 });
    const traced = gemMaterial(geometry, env, { ...GEMS.diamond, ior: 2.42 });
    const pair = [glass, traced].map((material, index) => {
      const stone = new THREE.Mesh(geometry, material);
      stone.position.set(index === 0 ? -0.95 : 0.95, 1, 0);
      stone.rotation.x = 0.5;
      const tag = label(index === 0 ? 'glass (transmission)' : 'traced', index === 0 ? COLORS.orange : COLORS.green);
      (tag.material as THREE.SpriteMaterial).toneMapped = false;
      tag.position.set(stone.position.x, 0.3, 0);
      scene.add(stone, tag);
      return stone;
    });
    turn(pair, onFrame);
    onLeave(container, () => {
      glass.dispose();
      traced.dispose();
      geometry.dispose();
    });
    readout.innerHTML = [
      'both: Spring\'s center diamond, refraction 2.42, the gem lighting file',
      'glass: light bends once going in, and you see the room straight through',
      'traced: light bounces inside until it can leave, mostly back toward you',
    ].join('<br>');
  });
};

// Why it works: one diamond with the tracer's settings on sliders.
export const settings: SceneSetup = (harness) => {
  const { scene, camera, controls, container, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0, 2.2, 2.4);
  controls.target.set(0, 1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environmentImage('gem')]), ([gltf, env]) => {
    const geometry = stoneGeometry(gltf.scene, 'Brillant_1');
    const material = gemMaterial(geometry, env, GEMS.diamond);
    const stone = new THREE.Mesh(geometry, material);
    stone.position.y = 1;
    stone.rotation.x = 0.5;
    scene.add(stone);
    turn([stone], onFrame);
    onLeave(container, () => {
      material.dispose();
      geometry.dispose();
    });

    const u = material.uniforms;
    const show = () => {
      readout.innerHTML = [
        `bounces: ${u.bounces.value}, refraction: ${formatNumber(u.ior.value)}, dispersion: ${formatNumber(u.dispersion.value, 3)}`,
        u.bounces.value === 0
          ? 'no bounces: light leaves through the back, so the stone looks see-through'
          : u.ior.value < 1.8
            ? 'weak bending: most light slips out the back, like glass'
            : 'strong bending: light is trapped and comes back up the top',
        u.dispersion.value > 0 ? 'red, green, and blue bend apart: rainbow fire at the facet edges' : '',
      ].filter(Boolean).join('<br>');
    };
    slider(bar, 'bounces', { min: 0, max: 8, step: 1, value: 5 }, (value) => ((u.bounces.value = value), show()));
    slider(bar, 'refraction', { min: 1.3, max: 2.6, step: 0.01, value: 2.6 }, (value) => ((u.ior.value = value), show()));
    slider(bar, 'dispersion', { min: 0, max: 0.08, step: 0.005, value: 0 }, (value) => ((u.dispersion.value = value), show()));
    show();
  });
};

// Why it works: color from distance traveled, on one of Spring's ruby wings.
export const color: SceneSetup = (harness) => {
  const { scene, camera, controls, container, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0, 2.2, 2.4);
  controls.target.set(0, 1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environmentImage('gem')]), ([gltf, env]) => {
    const geometry = stoneGeometry(gltf.scene, 'Diamond_Pear002');
    let kind = 'ruby';
    const material = gemMaterial(geometry, env, GEMS[kind]);
    const stone = new THREE.Mesh(geometry, material);
    stone.position.y = 1;
    stone.rotation.x = 0.5;
    scene.add(stone);
    turn([stone], onFrame);
    onLeave(container, () => {
      material.dispose();
      geometry.dispose();
    });

    let absorption = GEMS[kind].absorption;
    let boost = true;
    const u = material.uniforms;
    const rebuild = () => {
      const settings: GemSettings = GEMS[kind];
      u.color.value.copy(gemTint(settings.color));
      u.ior.value = settings.ior;
      u.envIntensity.value = settings.envIntensity;
      u.absorption.value = absorption;
      u.boost.value.copy(boost ? settings.boost : { x: 1, y: 1, z: 1 });
      readout.innerHTML = [
        `${kind}: color #${new THREE.Color(settings.color).getHexString()}, absorption ${formatNumber(absorption)} (iJewel: ${settings.absorption})`,
        `boost: ${boost ? `(${settings.boost.x}, ${settings.boost.y}, ${settings.boost.z})` : 'off'}`,
        absorption === 0 ? 'no absorption: the stone is as clear as a diamond' : 'longer paths inside come out deeper in color',
      ].join('<br>');
    };
    choiceButtons(buttonGroup(bar), [
      { html: 'ruby', select: () => ((kind = 'ruby'), rebuild()) },
      { html: 'emerald', select: () => ((kind = 'emerald'), rebuild()) },
      { html: 'yellow sapphire', select: () => ((kind = 'yellow sapphire'), rebuild()) },
    ]);
    slider(bar, 'absorption', { min: 0, max: 4, step: 0.1, value: absorption }, (value) => ((absorption = value), rebuild()));
    choiceButtons(buttonGroup(bar, 'boost'), [
      { html: 'on', select: () => ((boost = true), rebuild()) },
      { html: 'off', select: () => ((boost = false), rebuild()) },
    ]);
  });
};
