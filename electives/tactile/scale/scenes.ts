import { overlay } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import { choices, createBench, faultChecklist, materialButtons, panel, row, whenBenchReady, type Bench, type BenchOptions } from '../bench';
import {
  addFloor,
  addRuler,
  filteringOf,
  floorShader,
  loadedWidth,
  MACRO_SIZE,
  mapBytes,
  NO_FADE,
  scanDensity,
  screenDensity,
  setFiltering,
  setResolution,
  setTileScale,
  type Filtering,
  type FloorShader,
} from './floor';

function start(harness: Harness, options: BenchOptions, ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement) => void) {
  const bench = createBench(harness, options);
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenBenchReady(bench, readout, options, () => ready(bench, readout, controls));
}

const cm = (meters: number) => `${+(meters * 100).toFixed(1)} cm`;
const mb = (bytes: number) => `${Math.round(bytes / 1048576)} MB`;

// ---------------------------------------------------------------------------------------------
// Real size

const SIZE_NOTES: Record<number, string> = {
  0.5: 'half size: still sharp, and wrong. The grain reads as a finer material,\nor the sample as a giant one',
  1: 'its real size: the grain matches the ruler',
  2: 'twice the size: just as sharp, and wrong. The grain reads as a coarser\nmaterial, or the sample as a toy',
};

export const realSize: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -75, above: 20 }, height: 420 }, (bench, readout, controls) => {
    const placeRuler = addRuler(bench);
    let factor = 1;
    const { camera, controls: orbit } = harness;
    camera.position.set(0.03, 0.2, 0.45);
    orbit.target.set(0, 0.09, -0.03);
    orbit.update();
    materialButtons(bench, controls);
    choices(
      controls,
      'tile size',
      [0.5, 1, 2].map((f) => ({ label: f === 1 ? 'real size' : f === 2 ? 'twice' : 'half', select: () => ((factor = f), bench.refresh()) })),
      1,
    );
    bench.onChange(() => {
      setTileScale(bench, factor);
      placeRuler();
      const [w, h] = bench.entry.size.map((s) => s * factor);
      const leather = bench.entry.id === 'leather_red_02' && factor === 2 ? '\nthe source also lists 60 cm: its pebbles say 30' : '';
      readout.textContent = [`texture.repeat.set(1 / ${+w.toFixed(3)}, 1 / ${+h.toFixed(3)}); // one tile: ${cm(w)}`, SIZE_NOTES[factor] + leather].join('\n');
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// Texel density: the scan's and the screen's

const RESOLUTIONS = [512, 1024, 2048, 4096];

function densityVerdict(ratio: number) {
  if (ratio >= 2) return `the scan has ${ratio.toFixed(1)}× what the screen shows: sharp. The GPU reads\na smaller mipmap, so the extra pixels cost memory and add nothing here`;
  if (ratio >= 1) return 'about one scan pixel per screen pixel or more: sharp, nothing wasted';
  if (ratio >= 0.5) return 'a little soft: the screen shows more pixels than the scan has';
  return `soft: each scan pixel is stretched over ${(1 / ratio).toFixed(1)} screen pixels`;
}

export const texel: SceneSetup = (harness) => {
  const options: BenchOptions = { material: 'leather_red_02', key: { around: -70, above: 20 }, height: 420 };
  start(harness, options, (bench, readout, controls) => {
    materialButtons(bench, controls, ['leather_red_02', 'Leather039', 'denim_fabric_06', 'Concrete034', 'marble_01', 'blue_metal_plate']);
    choices(
      controls,
      'load at',
      RESOLUTIONS.map((size) => ({ label: `${size / 1024 >= 1 ? `${size / 1024}K` : size} px`, select: () => void setResolution(bench, options, size) })),
      3, // never enlarged, so 4K is each file's own size
    );
    let shown = '';
    const update = () => {
      if (!bench.maps) return;
      const scan = scanDensity(bench);
      const screen = screenDensity(bench);
      const text = [
        `loaded at ${loadedWidth(bench)} px over ${cm(bench.entry.size[0])}: ${Math.round(scan)} px/cm`,
        `the screen shows the swatch at ${Math.round(screen)} px/cm from here`,
        densityVerdict(scan / screen),
        `GPU memory: 3 maps × ${mb(mapBytes(bench))}`,
      ].join('\n');
      if (text !== shown) readout.textContent = shown = text;
    };
    bench.onChange(update);
    harness.onFrame(update); // the camera moves without telling the bench
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// Far away: repeats

// Wide enough that its sides stay out of view; the fog hides its far end.
const FLOOR_WIDTH = 60;

function floorStart(harness: Harness, options: BenchOptions, depth: number, ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement, shader: FloorShader) => void) {
  options.height = 420;
  start(harness, options, (bench, readout, controls) => {
    addFloor(bench, FLOOR_WIDTH, depth);
    const shader = floorShader(bench);
    ready(bench, readout, controls, shader);
  });
}

export const repeats: SceneSetup = (harness) => {
  // 1K maps: from this far the floor never shows more (the texel scene above), and the 4K scans
  // would take 250 MB more GPU memory.
  floorStart(harness, { material: 'marble_01', key: { around: -60, above: 40 }, maxTextureSize: 1024 }, 12, (bench, readout, controls, shader) => {
    const { camera, controls: orbit } = harness;
    camera.position.set(0, 3.2, 3.4);
    orbit.target.set(0, 0, -1.2);
    orbit.update();
    materialButtons(bench, controls, ['marble_01', 'Concrete034', 'wood_table_001', 'velour_velvet', 'leather_red_02']);
    choices(controls, 'large-scale variation', [
      { label: 'off', select: () => ((shader.macroAmount.value = 0), bench.refresh()) },
      { label: 'on', select: () => ((shader.macroAmount.value = 0.2), bench.refresh()) },
    ]);
    bench.onChange(() => {
      const [w, h] = bench.entry.size;
      const on = shader.macroAmount.value > 0;
      readout.textContent = [
        `one ${cm(w)} × ${cm(h)} tile, repeated about ${Math.round(8 / w)} × ${Math.round(12 / h)} times in this 8 × 12 m view`,
        on
          ? `macro variation on: a ${MACRO_SIZE} m pattern lightens and darkens each copy differently,\nso the grid is harder to find`
          : 'every copy is identical: the same light patches and marks line up in a grid',
      ].join('\n');
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// Far away: shimmer

type FilterChoice = 'best' | 'noAnisotropy' | 'noMipmaps';

const FILTERS: Record<FilterChoice, Filtering> = {
  best: { mipmaps: true, anisotropic: true },
  noAnisotropy: { mipmaps: true, anisotropic: false },
  noMipmaps: { mipmaps: false, anisotropic: false },
};

const FILTER_LINES: Record<FilterChoice, string> = {
  best: 'mipmaps on, anisotropy 16: steady, and sharp toward the back',
  noAnisotropy: 'mipmaps on, anisotropy 1: steady, but the floor smears toward the back',
  noMipmaps: 'mipmaps off: each pixel samples one texel out of many, so far texture crawls and sparkles',
};

function fadeOn(shader: FloorShader, on: boolean) {
  shader.fadeNear.value = on ? 2 : NO_FADE;
  shader.fadeFar.value = on ? 8 : 2 * NO_FADE;
}

function moveToggle(harness: Harness, parent: HTMLElement, onChange?: () => void) {
  const label = document.createElement('label');
  label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  label.innerHTML = '<input type="checkbox"> move the camera slowly';
  const input = label.querySelector('input')!;
  input.addEventListener('change', () => {
    harness.controls.autoRotate = input.checked;
    harness.controls.autoRotateSpeed = 0.4;
    onChange?.();
  });
  parent.append(label);
}

function standingView(harness: Harness) {
  const { camera, controls } = harness;
  camera.position.set(0.4, 1.6, 1.2); // eye height, at the floor's near end
  controls.target.set(0, 0, -6);
  controls.update();
}

function normalLine(filtering: FilterChoice, fade: boolean) {
  if (filtering === 'noMipmaps') {
    return fade
      ? 'normal map faded with distance: far bumps are gone, and so is much of the glitter'
      : 'normal map at full strength: far bumps glitter where the light glints off the floor';
  }
  return fade
    ? 'normal map faded with distance: a small extra; mipmaps had already smoothed far bumps'
    : 'normal map at full strength: mipmaps smooth far bumps toward flat, so it barely flickers';
}

export const shimmer: SceneSetup = (harness) => {
  // The key low and ahead, so the floor shows a glint the way a floor under a window does.
  floorStart(harness, { material: 'leather_red_02', key: { around: 150, above: 18, intensity: 3 } }, 40, (bench, readout, controls, shader) => {
    standingView(harness);
    let filtering: FilterChoice = 'best';
    let fade = false;
    materialButtons(bench, controls, ['leather_red_02', 'blue_metal_plate', 'Concrete034', 'denim_fabric_06']);
    choices(controls, 'filtering', [
      { label: 'mipmaps + anisotropy', select: () => ((filtering = 'best'), bench.refresh()) },
      { label: 'anisotropy 1', select: () => ((filtering = 'noAnisotropy'), bench.refresh()) },
      { label: 'no mipmaps', select: () => ((filtering = 'noMipmaps'), bench.refresh()) },
    ]);
    choices(controls, 'normal map', [
      { label: 'full strength everywhere', select: () => ((fade = false), bench.refresh()) },
      { label: 'fades out from 2 m to 8 m', select: () => ((fade = true), bench.refresh()) },
    ]);
    moveToggle(harness, row(controls, ''));
    bench.onChange(() => {
      setFiltering(bench, FILTERS[filtering]); // a new material arrives with the best filtering
      fadeOn(shader, fade);
      readout.textContent = [FILTER_LINES[filtering], normalLine(filtering, fade)].join('\n');
    });
    bench.refresh();
  });
};

// ---------------------------------------------------------------------------------------------
// What's off?

// 1: a leather sample close up: coarse and soft.
export const offGiant: SceneSetup = (harness) => {
  const options: BenchOptions = { material: 'leather_red_02', key: { around: -70, above: 18 }, maxTextureSize: 512, height: 420 };
  start(harness, options, (bench, readout, controls) => {
    const placeRuler = addRuler(bench);
    let factor = 2; // Broken: the source's other stated size, 60 cm, and the maps loaded at 512 px.
    const { camera, controls: orbit } = harness;
    camera.position.set(0.02, 0.15, 0.3);
    orbit.target.set(0, 0.11, -0.03);
    orbit.update();
    choices(
      controls,
      'tile size',
      [
        { label: '30 cm', select: () => ((factor = 1), bench.refresh()) },
        { label: '60 cm', select: () => ((factor = 2), bench.refresh()) },
      ],
      1,
    );
    choices(
      controls,
      'load at',
      [512, 1024, 2048].map((size) => ({ label: `${size} px`, select: () => void setResolution(bench, options, size) })),
      0,
    );
    // How many pixels per centimeter this display shows the swatch at from this view (twice as many
    // on a high-density screen), and the smallest load that matches it.
    const screen = screenDensity(bench);
    const needed = [1024, 2048].find((size) => size / (bench.entry.size[0] * 100) >= screen) ?? 2048;
    const perCm = (size: number) => Math.round(size / (bench.entry.size[0] * 100));
    faultChecklist(bench, controls, [
      {
        fixed: () => factor === 1,
        cause: "The tile was set to 60 cm, one of the source's two stated sizes. Its pebbles, counted against the ruler, say 30 cm.",
        fix: 'texture.repeat.set(1 / 0.3, 1 / 0.3);',
      },
      {
        fixed: () => !!bench.maps && loadedWidth(bench) >= needed,
        cause: `The maps were loaded at 512 px, about ${perCm(512)} px/cm at 30 cm, while your screen shows this close view at about ${Math.round(screen)} px/cm. At ${needed} px (${perCm(needed)} px/cm) the scan has what the screen needs.`,
        fix: `loader.load('leather/color_${needed / 1024}k.jpg');`,
      },
    ]);
    bench.onChange(() => {
      setTileScale(bench, factor);
      placeRuler();
    });
    bench.refresh();
    readout.textContent = 'Up close, the leather sample looks coarse, like elephant hide,\nand blurry.';
  });
};

// 2: a concrete floor seen from standing height: it crawls, smears, and eats memory.
export const offFloor: SceneSetup = (harness) => {
  const options: BenchOptions = { material: 'Concrete034', key: { around: -50, above: 30 } };
  floorStart(harness, options, 40, (bench, readout, controls) => {
    standingView(harness);
    // Broken: mipmaps off, anisotropy 1, and the maps loaded at their full 4K.
    const filtering: Filtering = { mipmaps: false, anisotropic: false };
    setFiltering(bench, filtering);
    const group = row(controls, 'texture');
    for (const [text, on, set] of [
      ['generateMipmaps', () => filtering.mipmaps, (v: boolean) => (filtering.mipmaps = v)],
      ['anisotropy 16', () => filtering.anisotropic, (v: boolean) => (filtering.anisotropic = v)],
    ] as [string, () => boolean, (v: boolean) => void][]) {
      const label = document.createElement('label');
      label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
      label.innerHTML = `<input type="checkbox"> ${text}`;
      const input = label.querySelector('input')!;
      input.addEventListener('change', () => {
        set(input.checked);
        bench.refresh();
      });
      bench.onChange(() => (input.checked = on()));
      group.append(label);
    }
    choices(
      controls,
      'load at',
      [4096, 1024, 512].map((size) => ({ label: `${size} px`, select: () => void setResolution(bench, options, size) })),
    );
    moveToggle(harness, row(controls, ''));
    bench.onChange(() => {
      setFiltering(bench, filtering); // new maps arrive with the best filtering
      readout.textContent = [
        "Tick 'move the camera slowly': the floor crawls, and toward the back",
        'its trowel marks smear away. Its maps also take a lot of GPU memory:',
        `3 maps × ${mb(mapBytes(bench))}`,
      ].join('\n');
    });
    faultChecklist(bench, controls, [
      {
        fixed: () => filteringOf(bench).mipmaps,
        cause: 'Mipmaps were off, so each far pixel picked one texel out of dozens, a different one every time the camera moved: crawling and moiré.',
        fix: 'texture.generateMipmaps = true; texture.minFilter = THREE.LinearMipmapLinearFilter;',
      },
      {
        fixed: () => filteringOf(bench).anisotropic,
        cause: 'Anisotropy was 1, so mipmaps blurred the floor in both directions where it is only squashed in one: a smear toward the back.',
        fix: 'texture.anisotropy = renderer.capabilities.getMaxAnisotropy();',
      },
      {
        fixed: () => !!bench.maps && loadedWidth(bench) <= 1024,
        cause: 'The maps were loaded at 4096 px: 37 px/cm, for a floor the screen never shows at more than about 4 px/cm from standing height. At 512 px (5 px/cm) it looks the same and takes a sixty-fourth of the memory.',
        fix: "loader.load('concrete/color_512.jpg');",
      },
    ]);
    bench.refresh();
  });
};
