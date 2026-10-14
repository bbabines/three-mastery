import { overlay } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { choices, createBench, faultChecklist, materialButtons, panel, row, whenBenchReady, type Bench, type BenchOptions } from '../bench';
import { addCandle, type Wax } from './wax';

function start(harness: Harness, options: BenchOptions, ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement) => void) {
  const bench = createBench(harness, { height: 420, ...options });
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenBenchReady(bench, readout, options, () => ready(bench, readout, controls));
}

// A slider that shows a material setting and follows it when something else changes it (a new
// material resets them all).
function setting(bench: Bench, parent: HTMLElement, text: string, range: [number, number, number], get: () => number, set: (v: number) => void) {
  const label = document.createElement('label');
  label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  label.innerHTML = `${text} <input type="range" min="${range[0]}" max="${range[1]}" step="${range[2]}" style="width: 120px">`;
  const input = label.querySelector('input')!;
  input.value = String(get());
  input.addEventListener('input', () => {
    set(Number(input.value));
    bench.refresh();
  });
  bench.onChange(() => (input.value = String(get())));
  parent.append(label);
}

const f2 = (v: number) => v.toFixed(2);
const hex = (color: THREE.Color) => `#${color.getHexString()}`;

// ---------------------------------------------------------------------------------------------
// Sheen

type SheenColor = 'black' | 'own' | 'white';

function applySheenColor(bench: Bench, which: SheenColor) {
  const own = bench.entry.sheen?.color ?? 0xffffff;
  bench.material.sheenColor.set(which === 'black' ? 0x000000 : which === 'white' ? 0xffffff : own);
}

function sheenState(bench: Bench): SheenColor {
  const c = bench.material.sheenColor;
  if (c.r + c.g + c.b === 0) return 'black';
  return c.getHex() === 0xffffff && bench.entry.sheen?.color !== 0xffffff ? 'white' : 'own';
}

const SHEEN_COLOR_NOTES: Record<SheenColor, string> = {
  black: 'sheenColor is black, its default, and the sheen is multiplied by it: nothing shows',
  own: "a lighter tint of the fabric's color: a soft glow where the surface turns away,\nas the fibers catch the light",
  white: 'white: the glow turns gray and chalky, like dust on the fabric',
};

function sheenLines(bench: Bench) {
  const m = bench.material;
  const color = sheenState(bench);
  const lines = [`material.sheen = ${f2(m.sheen)}; sheenColor = ${hex(m.sheenColor)}; sheenRoughness = ${f2(m.sheenRoughness)};`];
  if (m.sheen === 0) lines.push('sheen 0: no fuzz layer at all, so the fabric reads as smooth paper or plastic');
  else lines.push(SHEEN_COLOR_NOTES[color]);
  if (m.sheen > 0 && color !== 'black') lines.push(m.sheenRoughness < 0.35 ? 'low sheenRoughness: a narrow, bright line right at the edges' : 'higher sheenRoughness: the glow spreads further across the curve');
  return lines.join('\n');
}

const SHEEN_FABRICS = ['velour_velvet', 'Leather039', 'scuba_suede'];

export const sheen: SceneSetup = (harness) => {
  start(harness, { material: 'velour_velvet', key: { around: -60, above: 25 } }, (bench, readout, controls) => {
    let color: SheenColor = 'own';
    materialButtons(bench, controls, SHEEN_FABRICS);
    const sliders = row(controls, '');
    setting(bench, sliders, 'sheen', [0, 1, 0.05], () => bench.material.sheen, (v) => (bench.material.sheen = v));
    setting(bench, sliders, 'sheenRoughness', [0, 1, 0.05], () => bench.material.sheenRoughness, (v) => (bench.material.sheenRoughness = v));
    choices(controls, 'sheenColor', [
      { label: "the fabric's own, lighter", select: () => ((color = 'own'), bench.refresh()) },
      { label: 'black (the default)', select: () => ((color = 'black'), bench.refresh()) },
      { label: 'white', select: () => ((color = 'white'), bench.refresh()) },
    ]);
    bench.onChange(() => {
      applySheenColor(bench, color); // a new material arrives with its own
      readout.textContent = sheenLines(bench);
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// Clearcoat

function coatVerdict(bench: Bench) {
  const m = bench.material;
  if (m.clearcoat === 0) return 'no coat: one reflection, from the material itself';
  const base = m.roughness / (bench.entry.roughnessScale ?? 1);
  switch (bench.entry.kind) {
    case 'wood':
      return base > 1.5
        ? m.clearcoatRoughness < 0.07
          ? 'a coat this smooth mirrors the room like glass; at about 0.1\nit reads as varnish'
          : 'varnish over grain: a smooth, glossy reflection on top, the satin wood\nunder it. This is what clearcoat is for'
        : "this scan was varnished when it was photographed: its gloss is already\nin the roughness map, so a coat doubles it";
    case 'leather':
      return 'a clear coat over leather is patent leather: a different material,\nnot a more realistic one';
    case 'painted metal':
      return 'a clear coat over paint is car paint; this semi-gloss paint has none';
    default:
      return 'fabric has no coat: it looks wet, or wrapped in plastic';
  }
}

export const clearcoat: SceneSetup = (harness) => {
  // 2K maps: the lesson is the coat's reflection, and the 4K scans would take 190 MB more GPU memory.
  start(harness, { material: 'wood_table_001', key: { around: -55, above: 30 }, maxTextureSize: 2048 }, (bench, readout, controls) => {
    let follow = false;
    // A low view from the right, and the studio turned so its softbox reflects in the samples: a
    // coat shows in reflections.
    const { camera, controls: orbit, scene } = harness;
    camera.position.set(0.25, 0.1, 0.4);
    orbit.target.set(0, 0.03, 0.1);
    orbit.update();
    scene.environmentRotation.y = scene.backgroundRotation.y = THREE.MathUtils.degToRad(270);
    materialButtons(bench, controls, ['wood_table_001', 'leather_red_02', 'blue_metal_plate', 'Leather039', 'velour_velvet']);
    const sliders = row(controls, '');
    setting(bench, sliders, 'clearcoat', [0, 1, 0.05], () => bench.material.clearcoat, (v) => (bench.material.clearcoat = v));
    setting(bench, sliders, 'clearcoatRoughness', [0, 0.5, 0.01], () => bench.material.clearcoatRoughness, (v) => (bench.material.clearcoatRoughness = v));
    const base = row(controls, '');
    setting(bench, base, 'roughness under the coat (× the map)', [1, 3, 0.1], () => bench.material.roughness / (bench.entry.roughnessScale ?? 1), (v) => (bench.material.roughness = v * (bench.entry.roughnessScale ?? 1)));
    const label = document.createElement('label');
    label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
    label.innerHTML = '<input type="checkbox"> the coat follows the grain (clearcoatNormalMap)';
    const box = label.querySelector('input')!;
    box.addEventListener('change', () => {
      follow = box.checked;
      bench.refresh();
    });
    base.append(label);
    // Picked by eye: at 0.05 the coat mirrors the studio's ceiling grid like glass; at 0.1 it's a
    // glossy varnish with the grain showing through.
    bench.material.clearcoatRoughness = 0.1;
    bench.onChange(() => {
      const m = bench.material;
      const want = follow ? m.normalMap : null;
      if (m.clearcoatNormalMap !== want) {
        m.clearcoatNormalMap = want;
        m.needsUpdate = true; // adding or removing a map builds a different shader
      }
      const roughness = m.roughness / (bench.entry.roughnessScale ?? 1);
      readout.textContent = [
        `material.clearcoat = ${f2(m.clearcoat)}; clearcoatRoughness = ${f2(m.clearcoatRoughness)}; roughness = ${f2(roughness)};`,
        coatVerdict(bench),
        m.clearcoat > 0 ? (follow ? "the coat's reflection ripples with the grain: a thin coat" : 'the coat uses the shape\'s own normals, so its reflection stays smooth: a thick coat') : '',
      ]
        .filter(Boolean)
        .join('\n');
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// Wax: what three.js can't do

const WAX_NOTES: Record<Wax, string> = {
  plain: 'MeshPhysicalMaterial: light stops at the surface. Lit from behind,\nthe candle goes dark, like stone',
  transmission: "transmission: light passes through as through frosted glass, showing\nthe blurred scene behind. It doesn't spread inside: amber glass, not wax",
  glow: 'a back-light glow added in GLSL: thin edges brighten when the light is\nbehind. An approximation: nothing travels inside the wax',
};

export const wax: SceneSetup = (harness) => {
  start(harness, { material: null, key: { around: 165, above: 20, intensity: 3 } }, (bench, readout, controls) => {
    const setWax = addCandle(bench);
    let current: Wax = 'plain';
    const { camera, controls: orbit, scene } = harness;
    scene.environmentIntensity = 0.3; // a dim room, so the light behind does the work
    camera.position.set(0.06, 0.13, 0.36);
    orbit.target.set(0, 0.05, -0.03);
    orbit.update();
    choices(controls, 'wax', [
      { label: 'MeshPhysicalMaterial', select: () => ((current = 'plain'), setWax('plain'), bench.refresh()) },
      { label: '+ transmission', select: () => ((current = 'transmission'), setWax('transmission'), bench.refresh()) },
      { label: '+ a back-light glow (GLSL)', select: () => ((current = 'glow'), setWax('glow'), bench.refresh()) },
    ]);
    choices(controls, 'key light', [
      { label: 'behind the candle', select: () => bench.setKey(165, 20) },
      { label: 'in front', select: () => bench.setKey(-55, 25) },
    ]);
    bench.onChange(() => (readout.textContent = WAX_NOTES[current]));
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// What's off?

// 1: velvet that someone gave sheen: 1 and a clear coat "for realism".
export const offVelvet: SceneSetup = (harness) => {
  start(harness, { material: 'velour_velvet', key: { around: -60, above: 25 } }, (bench, readout, controls) => {
    // Broken: sheen 1 with sheenColor left at its default black, and a glossy clear coat.
    let color: SheenColor = 'black';
    bench.material.clearcoat = 1;
    bench.material.clearcoatRoughness = 0.08;
    choices(
      controls,
      'sheenColor',
      [
        { label: "the fabric's own, lighter", select: () => ((color = 'own'), bench.refresh()) },
        { label: 'black (the default)', select: () => ((color = 'black'), bench.refresh()) },
        { label: 'white', select: () => ((color = 'white'), bench.refresh()) },
      ],
      1,
    );
    setting(bench, row(controls, ''), 'clearcoat', [0, 1, 0.05], () => bench.material.clearcoat, (v) => (bench.material.clearcoat = v));
    bench.onChange(() => applySheenColor(bench, color));
    faultChecklist(bench, controls, [
      {
        fixed: () => sheenState(bench) === 'own',
        cause: 'sheen was 1 but sheenColor was left black, its default. three.js multiplies the sheen by its color, so there was no fuzz at all.',
        fix: 'material.sheenColor.set(0xff6f8a); // a lighter tint of the velvet',
      },
      {
        fixed: () => bench.material.clearcoat === 0,
        cause: "A clear coat was added for realism. Velvet has no coat; it made the pile look wet and plastic.",
        fix: 'material.clearcoat = 0;',
      },
    ]);
    bench.refresh();
    readout.textContent = 'The velvet looks like shiny pink plastic: hard white highlights\nat its edges instead of a soft glow. Its sheen is already 1.';
  });
};

// 2: a leather sofa sample with every finish turned on.
export const offLeather: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -60, above: 25 } }, (bench, readout, controls) => {
    // Broken: a glossy clear coat, and a white sheen.
    bench.material.clearcoat = 1;
    bench.material.clearcoatRoughness = 0.04;
    bench.material.sheen = 1;
    bench.material.sheenColor.set(0xffffff);
    bench.material.sheenRoughness = 0.5;
    const sliders = row(controls, '');
    setting(bench, sliders, 'clearcoat', [0, 1, 0.05], () => bench.material.clearcoat, (v) => (bench.material.clearcoat = v));
    setting(bench, sliders, 'sheen', [0, 1, 0.05], () => bench.material.sheen, (v) => (bench.material.sheen = v));
    faultChecklist(bench, controls, [
      {
        fixed: () => bench.material.clearcoat === 0,
        cause: 'A clear coat turned the leather into patent leather: a sharp, plastic reflection over the grain.',
        fix: 'material.clearcoat = 0;',
      },
      {
        fixed: () => bench.material.sheen === 0,
        cause: 'A white sheen added a dusty glow at the edges. Smooth leather has no fuzz for sheen to imitate.',
        fix: 'material.sheen = 0;',
      },
    ]);
    bench.refresh();
    readout.textContent = 'The leather sample looks plastic-wrapped,\nand its edges look dusty.';
  });
};
