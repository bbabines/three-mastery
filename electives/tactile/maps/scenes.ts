import { overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import {
  choices,
  createBench,
  faultChecklist,
  keyControls,
  keyLine,
  mapToggles,
  materialButtons,
  panel,
  row,
  whenBenchReady,
  type Bench,
  type BenchOptions,
} from '../bench';
import { MATERIALS } from '../catalog';
import { bakedLightColorMap, directXNormalMap, inspector, type View } from './downloads';

// Each scan's roughness map, 5th to 95th percentile, measured by tools/vet.ts (the folder's README).
const ROUGHNESS_RANGE: Record<string, [number, number]> = {
  leather_red_02: [0.41, 0.58],
  Leather039: [0.53, 0.67],
  scuba_suede: [0.64, 0.8],
  velour_velvet: [0.62, 0.85],
  denim_fabric_06: [0.74, 0.85],
  wood_table_001: [0.15, 0.35],
  Concrete034: [0.5, 0.56],
  blue_metal_plate: [0.21, 0.37],
  marble_01: [0.49, 0.54],
  brown_leather: [0.41, 0.9],
};

// The materials whose packed map has a metalness channel (Poly Haven's); ambientCG's have none.
const PACKED = MATERIALS.filter((entry) => entry.layout === 'packed' && entry.id !== 'brown_leather').map((entry) => entry.id);

const fixed2 = (v: number) => v.toFixed(2);

function start(harness: Parameters<SceneSetup>[0], options: BenchOptions, ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement) => void) {
  const bench = createBench(harness, options);
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenBenchReady(bench, readout, options, () => ready(bench, readout, controls));
}

// The camera close to the swatch, for judging single bumps: about 20 cm across the view.
function closeUp(bench: Bench) {
  const { camera, controls } = bench.harness;
  camera.position.set(0.02, 0.16, 0.26);
  controls.target.copy(bench.swatch.position);
  controls.update();
}

// A checkbox in a row; `set` runs on change, `on` keeps it in step after other controls.
function checkbox(bench: Bench, parent: HTMLElement, text: string, on: () => boolean, set: (on: boolean) => void) {
  const label = document.createElement('label');
  label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  label.innerHTML = `<input type="checkbox"> ${text}`;
  const input = label.querySelector('input')!;
  input.checked = on();
  input.addEventListener('change', () => set(input.checked));
  bench.onChange(() => (input.checked = on()));
  parent.append(label);
}

// ---------------------------------------------------------------------------------------------
// Each map's job

const MAP_JOBS: { label: string; on: (m: THREE.MeshPhysicalMaterial) => boolean; missing: string }[] = [
  { label: 'map', on: (m) => !!m.map, missing: 'no color map: material.color alone (white), so only the shading is left' },
  { label: 'roughnessMap', on: (m) => !!m.roughnessMap, missing: 'no roughness map: one gloss everywhere, so worn and smooth spots shine alike' },
  { label: 'normalMap', on: (m) => !!m.normalMap, missing: 'no normal map: a flat surface with the grain printed on; the key light has nothing to catch' },
  { label: 'aoMap', on: (m) => !!m.aoMap, missing: 'no AO map: the creases get as much of the HDRI\'s light as the tops' },
];

export const eachMap: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -80, above: 12 }, height: 420 }, (bench, readout, controls) => {
    materialButtons(bench, controls);
    mapToggles(bench, controls);
    keyControls(bench, controls);
    bench.onChange(() => {
      const m = bench.material;
      const off = MAP_JOBS.filter((job) => !job.on(m) && !(job.label === 'aoMap' && bench.entry.layout !== 'packed'));
      readout.textContent = [
        MAP_JOBS.map((job) => `${job.label} ${job.on(m) ? '✓' : '✗'}`).join('   '),
        off.length ? off[0].missing : 'all on: the scan as it was measured',
        keyLine(bench),
      ].join('\n');
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// Roughness and metalness multiply their maps

type Metal = 'zero' | 'map' | 'one';

function setMetal(bench: Bench, which: Metal) {
  const m = bench.material;
  const hadMap = !!m.metalnessMap;
  m.metalness = which === 'zero' ? 0 : 1;
  m.metalnessMap = which === 'map' ? bench.maps!.arm : null; // reads blue
  if (hadMap !== !!m.metalnessMap) m.needsUpdate = true;
}

function metalState(bench: Bench): Metal {
  return bench.material.metalness === 0 ? 'zero' : bench.material.metalnessMap ? 'map' : 'one';
}

function roughnessLine(bench: Bench) {
  const m = bench.material;
  if (!m.roughnessMap) return `material.roughness = ${fixed2(m.roughness)}; // no map: the same everywhere`;
  const [low, high] = ROUGHNESS_RANGE[bench.entry.id];
  const clamp = (v: number) => fixed2(Math.min(1, Math.max(0.0525, v * m.roughness)));
  return `material.roughness = ${fixed2(m.roughness)}; // × the map's ${fixed2(low)}–${fixed2(high)} → ${clamp(low)}–${clamp(high)}`;
}

function roughnessVerdict(bench: Bench) {
  const r = bench.material.roughness;
  if (!bench.material.roughnessMap) return 'the variation is gone: worn spots and creases shine like the rest';
  if (Math.abs(r - 1) < 0.03) return 'roughness 1 leaves the map as scanned: the right start';
  return r < 1 ? 'glossier than the scan everywhere: the map already held the real values' : 'duller than the scan: three.js caps the result at 1';
}

const METAL_LINES: Record<Metal, string> = {
  zero: 'material.metalness = 0; // not metal: the color is diffuse light, under a clear reflection',
  map: 'material.metalness = 1; material.metalnessMap = arm; // 1 × the map\'s blue',
  one: 'material.metalness = 1; // pure metal: the color becomes a tinted mirror, and diffuse light goes',
};

export const values: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -60, above: 30 }, height: 420 }, (bench, readout, controls) => {
    let metal: Metal = 'zero';
    materialButtons(bench, controls, PACKED);
    const sliders = row(controls, '');
    slider(sliders, 'roughness', { min: 0, max: 2, step: 0.05, value: 1 }, (v) => {
      bench.material.roughness = v;
      bench.refresh();
    });
    checkbox(bench, sliders, 'roughness map', () => !!bench.material.roughnessMap, (on) => {
      bench.material.roughnessMap = on ? bench.maps!.arm : null;
      bench.material.needsUpdate = true;
      bench.refresh();
    });
    choices(controls, 'metalness', [
      { label: '0', select: () => ((metal = 'zero'), bench.refresh()) },
      { label: '1 × the packed map\'s blue', select: () => ((metal = 'map'), bench.refresh()) },
      { label: '1, no map', select: () => ((metal = 'one'), bench.refresh()) },
    ]);
    bench.onChange(() => {
      if (metalState(bench) !== metal) setMetal(bench, metal); // a new material resets it
      const blue = bench.entry.trustMetal ? 'its blue is 0, so the map keeps it at 0' : 'its blue says 0.5–0.8: dull metal, which suede isn\'t';
      readout.textContent = [
        roughnessLine(bench),
        roughnessVerdict(bench),
        METAL_LINES[metal] + (metal === 'map' ? `\n${blue}` : ''),
      ].join('\n');
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// Normal maps have a direction

type Variant = 'leather' | 'directx' | 'baked' | 'flawed' | 'scuba' | 'velvet' | 'denim';

const VARIANTS: Record<Variant, { name: string; id: string }> = {
  leather: { name: 'Leather', id: 'leather_red_02' },
  directx: { name: 'Leather, DirectX normal map', id: 'leather_red_02' },
  baked: { name: 'Leather, light baked in', id: 'leather_red_02' },
  flawed: { name: 'Brown leather (flawed)', id: 'brown_leather' },
  scuba: { name: 'Scuba suede', id: 'scuba_suede' },
  velvet: { name: 'Velvet', id: 'velour_velvet' },
  denim: { name: 'Denim', id: 'denim_fabric_06' },
};

// Loads a variant: the scan itself, or one of the two broken downloads made from the leather.
function variantLoader(bench: Bench) {
  let directX: THREE.Texture | null = null;
  let baked: THREE.Texture | null = null;
  onLeave(bench.harness.container, () => {
    directX?.dispose();
    baked?.dispose();
  });
  let current: Variant = 'leather';
  const load = async (variant: Variant) => {
    current = variant;
    await bench.setMaterial(VARIANTS[variant].id);
    if (current !== variant) return;
    const maps = bench.maps!;
    if (variant === 'directx') directX ??= directXNormalMap(maps.normalMap);
    if (variant === 'baked') baked ??= bakedLightColorMap(maps.map, maps.normalMap);
    bench.material.normalMap = variant === 'directx' ? directX : maps.normalMap;
    bench.material.map = variant === 'baked' ? baked : maps.map;
    bench.refresh();
  };
  return { load, current: () => current };
}

function variantButtons(bench: Bench, parent: HTMLElement, loader: ReturnType<typeof variantLoader>, list: Variant[]) {
  choices(parent, 'material', list.map((variant) => ({ label: VARIANTS[variant].name, select: () => void loader.load(variant) })));
}

function normalVerdict(variant: Variant, flipped: boolean) {
  if (variant === 'flawed') return "neither setting fixes it: its green follows nothing, so it's crisp\nlit from the side and mushy from above. Replace the download";
  const directX = variant === 'directx';
  if (directX === flipped) return directX ? 'a DirectX map, flipped back: pebbles bulge from every side' : 'an OpenGL map read as OpenGL: pebbles bulge from every side';
  return 'green read upside down: lit from above, the creases turn into\nbright ridges and the pebbles sink; lit from the side, nothing looks wrong';
}

export const normalStyle: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: 0, above: 89, intensity: 4 }, height: 420 }, (bench, readout, controls) => {
    const loader = variantLoader(bench);
    closeUp(bench);
    variantButtons(bench, controls, loader, ['leather', 'directx', 'flawed']);
    choices(controls, 'normalScale.y', [
      { label: '1 (OpenGL, as three.js expects)', select: () => (bench.material.normalScale.y = 1, bench.refresh()) },
      { label: '−1 (flips green, for a DirectX map)', select: () => (bench.material.normalScale.y = -1, bench.refresh()) },
    ]);
    keyControls(bench, controls);
    bench.onChange(() => {
      const flipped = bench.material.normalScale.y < 0;
      readout.textContent = [`material.normalScale.set(1, ${flipped ? -1 : 1});`, normalVerdict(loader.current(), flipped), keyLine(bench)].join('\n');
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// Checking a download: one map or channel at a time

const VIEW_LINES: Record<View, string> = {
  lit: 'the material, lit',
  color: 'the color map, unlit: it should be even. Shading on one side of\nevery bump means a lamp was photographed into it',
  roughness: "roughness (the packed map's green, or the roughness map): dark is\nglossy, light is matte. It should follow wear, not the light",
  metalness: "metalness (the packed map's blue): black for anything that isn't bare metal",
  normalRed: "the normal map's red: the bumps, lit from one side.\nCompare the green: it should show the same bumps",
  normalGreen: "the normal map's green: the same bumps as the red, lit from above in the\nOpenGL style three.js expects. Lit from below is DirectX",
};

function inspectNote(variant: Variant, view: View) {
  if (view === 'metalness' && variant === 'scuba') return 'this one is gray: it claims metalness 0.5–0.8. Use metalness 0';
  if (view === 'color' && variant === 'baked') return 'every pebble is lit from the upper left: light baked in';
  if (view === 'normalGreen' && variant === 'directx') return 'every pebble is lit from below: a DirectX map';
  if (view === 'normalGreen' && variant === 'flawed') return "a fainter pattern that doesn't match the red's wrinkles: this green is broken";
  return '';
}

export const inspect: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: 60, above: 25 }, height: 420 }, (bench, readout, controls) => {
    const loader = variantLoader(bench);
    const show = inspector(bench);
    closeUp(bench);
    let view: View = 'lit';
    variantButtons(bench, controls, loader, ['leather', 'baked', 'directx', 'flawed', 'scuba', 'velvet', 'denim']);
    choices(controls, 'show', [
      { label: 'lit', select: () => ((view = 'lit'), bench.refresh()) },
      { label: 'color map', select: () => ((view = 'color'), bench.refresh()) },
      { label: 'roughness', select: () => ((view = 'roughness'), bench.refresh()) },
      { label: 'metalness', select: () => ((view = 'metalness'), bench.refresh()) },
      { label: "normal map's red", select: () => ((view = 'normalRed'), bench.refresh()) },
      { label: "normal map's green", select: () => ((view = 'normalGreen'), bench.refresh()) },
    ]);
    keyControls(bench, controls);
    bench.onChange(() => {
      show(view);
      const note = inspectNote(loader.current(), view);
      readout.textContent = [VIEW_LINES[view], note || (view === 'lit' ? keyLine(bench) : '')].filter(Boolean).join('\n');
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// What's off?

// 1: the scuba suede, taken as it downloaded and "tuned".
export const offSuede: SceneSetup = (harness) => {
  start(harness, { material: 'scuba_suede', key: { around: -60, above: 25 }, height: 420 }, (bench, readout, controls) => {
    // Broken: the packed map's blue trusted for metalness, and roughness set to 0.5 on top of the map.
    setMetal(bench, 'map');
    bench.material.roughness = 0.5;
    const sliders = row(controls, '');
    slider(sliders, 'roughness', { min: 0, max: 2, step: 0.05, value: 0.5 }, (v) => {
      bench.material.roughness = v;
      bench.refresh();
    });
    choices(
      controls,
      'metalness',
      [
        { label: '0', select: () => (setMetal(bench, 'zero'), bench.refresh()) },
        { label: '1 × the packed map\'s blue', select: () => (setMetal(bench, 'map'), bench.refresh()) },
      ],
      1,
    );
    faultChecklist(bench, controls, [
      {
        fixed: () => bench.material.metalness === 0,
        cause: "The packed map's blue channel says metalness 0.5 to 0.8, and it was trusted. Suede isn't metal, so its color went dark and its reflection took the teal tint.",
        fix: 'material.metalness = 0; material.metalnessMap = null;',
      },
      {
        fixed: () => Math.abs(bench.material.roughness - 1) < 0.03,
        cause: 'Roughness 0.5 multiplied the map, halving every value, so the matte suede turned glossy.',
        fix: 'material.roughness = 1;',
      },
    ]);
    readout.textContent = "The suede looks dark, like dull metal, and has a shine it shouldn't.";
    bench.refresh();
  });
};

// 2: a leather download with two problems the thumbnail didn't show.
export const offLeather: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: 0, above: 89, intensity: 4 }, height: 420 }, (bench, readout, controls) => {
    const maps = bench.maps!;
    closeUp(bench);
    const directX = directXNormalMap(maps.normalMap);
    const baked = bakedLightColorMap(maps.map, maps.normalMap);
    onLeave(harness.container, () => {
      directX.dispose();
      baked.dispose();
    });
    // Broken: a DirectX normal map read as OpenGL, and a color map with light baked in.
    bench.material.normalMap = directX;
    bench.material.map = baked;
    choices(
      controls,
      'normalScale.y',
      [
        { label: '1 (OpenGL)', select: () => ((bench.material.normalScale.y = 1), bench.refresh()) },
        { label: '−1 (flips green)', select: () => ((bench.material.normalScale.y = -1), bench.refresh()) },
      ],
    );
    choices(controls, 'color map', [
      { label: "this download's", select: () => ((bench.material.map = baked), bench.refresh()) },
      { label: 'a delit scan of the same leather', select: () => ((bench.material.map = maps.map), bench.refresh()) },
    ]);
    keyControls(bench, controls);
    faultChecklist(bench, controls, [
      {
        fixed: () => bench.material.normalScale.y < 0,
        cause: "The normal map is DirectX style, its green upside down for three.js, so lit from above the creases read as ridges and the pebbles sink.",
        fix: 'material.normalScale.y = -1; // or flip the green channel in the file',
      },
      {
        fixed: () => bench.material.map === maps.map,
        cause: 'The color map has a lamp photographed into it, so every pebble stays lit from the upper left wherever the key light goes. No setting removes it.',
        fix: 'material.map = delitColorMap; // a different download',
      },
    ]);
    readout.textContent = 'With the light above, the creases look like raised ridges.\nMove the light anywhere: the leather still looks lit from the upper left.';
  });
};
