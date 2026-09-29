// Scenes for the preload vs lazy load page. The README places each one with <div data-scene="name">.
import { choiceButtons, collectResources, fitModel, overlay } from '@harness/lesson';
import { gltfLoader, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

const VARIANTS = [
  { name: 'rack parts', url: MODELS.rackParts, size: 1.9 },
  { name: 'J-cups', url: MODELS.jcups, size: 1.5 },
];

type Strategy = 'preload' | 'lazy' | 'next';
const STRATEGY_CODE: Record<Strategy, string> = {
  preload: 'await Promise.all([load(rack), load(jcups)]); then show the rack',
  lazy: 'await load(rack); show it; load each other variant on first click',
  next: 'await load(rack); show it; then load(jcups) with no await',
};

export const strategies: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.6, 1.8, 4.7);
  controls.target.set(0, 1.1, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the models

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');

  // One entry per variant: its load (a promise, as on the reuse and caching page) and, once it has
  // arrived, the model ready to add to the scene.
  let loads = new Map<string, { promise: Promise<GLTF>; model?: THREE.Object3D; gltf?: GLTF }>();
  let strategy: Strategy = 'preload';
  let showing = 0;
  let lastSwitch = '';
  let attempt = 0;

  const load = (i: number) => {
    const { url, size } = VARIANTS[i];
    let entry = loads.get(url);
    if (!entry) {
      const created: { promise: Promise<GLTF>; model?: THREE.Object3D; gltf?: GLTF } = { promise: gltfLoader().loadAsync(url) };
      created.promise.then((gltf) => {
        // The four J-cups sit far apart in the file; stand them side by side so they're big enough to see.
        if (url === MODELS.jcups) gltf.scene.children.forEach((cup, n) => (cup.position.x = n * 0.16));
        created.gltf = gltf;
        created.model = fitModel(gltf.scene, size, new THREE.Vector3(0, 0.05, 0));
        report();
      });
      loads.set(url, created);
      entry = created;
    }
    return entry;
  };

  const report = () => {
    const held = VARIANTS.map(({ name, url }) => `${name} ${loads.get(url)?.model ? '✓' : loads.has(url) ? '(loading)' : '–'}`);
    readout.textContent = [
      STRATEGY_CODE[strategy],
      `loaded and kept in memory: ${held.join(',  ')}`,
      `showing ${VARIANTS[showing].name}: ${lastSwitch}`,
    ].join('\n');
  };

  const show = async (i: number) => {
    const mine = ++attempt;
    showing = i;
    const entry = load(i);
    const ready = entry.model !== undefined;
    lastSwitch = ready ? 'it was ready, so it appeared at once' : 'waiting for its download and decode…';
    report();
    await entry.promise;
    if (mine !== attempt) return;
    for (const other of loads.values()) if (other.model) scene.remove(other.model);
    scene.add(entry.model!);
    if (!ready) lastSwitch = 'not loaded yet, so it appeared only after its download and decode';
    report();
  };

  // Each strategy starts from nothing: every earlier load is disposed.
  const start = async (picked: Strategy) => {
    strategy = picked;
    for (const entry of loads.values()) {
      if (entry.model) scene.remove(entry.model);
      if (entry.gltf) {
        const { geometries, materials, textures } = collectResources(entry.gltf.scene);
        for (const resource of [...geometries, ...materials, ...textures]) resource.dispose();
      }
    }
    loads = new Map();
    if (picked === 'preload') await Promise.all(VARIANTS.map((_, i) => load(i).promise));
    variantButtons[0].click(); // show the rack first
    if (picked === 'next') {
      await load(0).promise;
      load(1); // no await: the J-cups load while the rack is on screen
    }
  };

  choiceButtons(controlsBar, [
    { html: 'preload both', select: () => start('preload') },
    { html: 'lazy', select: () => start('lazy') },
    { html: 'first, then likely next', select: () => start('next') },
  ]);
  const divider = document.createElement('span');
  divider.textContent = 'show:';
  controlsBar.append(divider);
  const variantRow = document.createElement('span');
  variantRow.style.display = 'contents';
  controlsBar.append(variantRow);
  choiceButtons(
    variantRow,
    VARIANTS.map((variant, i) => ({ html: variant.name, select: () => show(i) })),
  );
  const variantButtons = [...variantRow.querySelectorAll('button')];
};
