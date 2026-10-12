import { overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import {
  choices,
  createBench,
  exposureSlider,
  faultChecklist,
  keyControls,
  keyLine,
  materialButtons,
  panel,
  toneButtons,
  TONE_NAMES,
  whenBenchReady,
  type Bench,
  type BenchOptions,
} from '../bench';

// What each tone mapping does to a material, in a line.
const TONE_NOTES = new Map<THREE.ToneMapping, string>([
  [THREE.NoToneMapping, 'off: anything brighter than white clips flat, and exposure is ignored'],
  [THREE.ACESFilmicToneMapping, 'ACES Filmic: filmic contrast; lightens strong colors and drains some of their saturation'],
  [THREE.AgXToneMapping, 'AgX: gentle; fades strong colors toward white the most'],
  [THREE.NeutralToneMapping, 'Neutral: keeps a product\'s colors closest to its source; made for product viewers'],
]);

// The three maps' color spaces, as a row of buttons each. `start` is what the scene begins with.
type MapName = 'map' | 'normalMap' | 'arm';
const MAP_LABELS: Record<MapName, string> = { map: 'color map', normalMap: 'normal map', arm: 'packed or roughness map' };

function spaceButtons(bench: Bench, parent: HTMLElement, which: MapName) {
  const options = [
    { label: 'sRGB', select: () => bench.setColorSpace(which, THREE.SRGBColorSpace) },
    { label: 'none (NoColorSpace)', select: () => bench.setColorSpace(which, THREE.NoColorSpace) },
  ];
  choices(parent, MAP_LABELS[which], options, bench.colorSpaces[which] === THREE.SRGBColorSpace ? 0 : 1);
}

function spaceLines(bench: Bench) {
  const lines: string[] = [];
  const { map, normalMap, arm } = bench.maps!;
  lines.push(
    map.colorSpace === THREE.SRGBColorSpace
      ? 'map.colorSpace = SRGBColorSpace: its numbers become light correctly'
      : 'map left at NoColorSpace: the file\'s numbers used as light, so pale and washed out',
  );
  lines.push(
    normalMap.colorSpace === THREE.NoColorSpace
      ? 'normalMap at NoColorSpace: directions read as stored'
      : 'normalMap marked sRGB: every direction bent toward one corner, so the whole surface tilts',
  );
  const data = bench.entry.layout === 'packed' ? 'packed map' : 'roughness map';
  lines.push(
    arm.colorSpace === THREE.NoColorSpace
      ? `${data} at NoColorSpace: values read as stored`
      : `${data} marked sRGB: values decoded as color and pushed down, so glossier${bench.entry.layout === 'packed' ? ' and darker in the creases' : ''}`,
  );
  return lines;
}

const FILLS = {
  off: 'no fill: shading comes from the key light and the HDRI only',
  hemisphere: 'HemisphereLight, as the harness adds to every scene: the same light added everywhere, so shadows go gray and relief is a smaller part of the picture',
  ambient: 'AmbientLight: the same light on every surface whichever way it faces; lifts shadows the same way',
};

function setFill(bench: Bench, ambient: THREE.AmbientLight, which: keyof typeof FILLS) {
  bench.fill.visible = which === 'hemisphere';
  ambient.visible = which === 'ambient';
  bench.refresh();
}

function fillState(bench: Bench, ambient: THREE.AmbientLight): keyof typeof FILLS {
  return bench.fill.visible ? 'hemisphere' : ambient.visible ? 'ambient' : 'off';
}

// Starts the bench and calls `ready` once its files are in.
function start(harness: Parameters<SceneSetup>[0], options: BenchOptions, ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement) => void) {
  const bench = createBench(harness, options);
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenBenchReady(bench, readout, options, () => ready(bench, readout, controls));
}

// Tone mapping and exposure.
export const tone: SceneSetup = (harness) => {
  start(harness, { material: 'velour_velvet', key: { around: -55, above: 30 }, height: 420 }, (bench, readout, controls) => {
    const { renderer } = harness;
    materialButtons(bench, controls);
    toneButtons(bench, controls);
    exposureSlider(bench, controls);
    bench.onChange(() => {
      const off = renderer.toneMapping === THREE.NoToneMapping;
      readout.textContent = [
        `renderer.toneMapping = THREE.${TONE_NAMES.get(renderer.toneMapping)};`,
        `renderer.toneMappingExposure = ${renderer.toneMappingExposure.toFixed(2)};${off ? ' // ignored: tone mapping is off' : ''}`,
        TONE_NOTES.get(renderer.toneMapping)!,
      ].join('\n');
    });
    bench.refresh();
  });
};

// Each map's color space, right and wrong.
export const colorSpaces: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -70, above: 18 }, height: 420 }, (bench, readout, controls) => {
    materialButtons(bench, controls);
    spaceButtons(bench, controls, 'map');
    spaceButtons(bench, controls, 'normalMap');
    spaceButtons(bench, controls, 'arm');
    bench.onChange(() => (readout.textContent = spaceLines(bench).join('\n')));
    bench.refresh();
  });
};

// The hidden fill light.
export const fill: SceneSetup = (harness) => {
  start(harness, { material: 'Concrete034', key: { around: -75, above: 14 }, height: 420 }, (bench, readout, controls) => {
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    ambient.visible = false;
    harness.scene.add(ambient);
    materialButtons(bench, controls);
    choices(controls, 'fill light', [
      { label: 'off', select: () => setFill(bench, ambient, 'off') },
      { label: 'HemisphereLight', select: () => setFill(bench, ambient, 'hemisphere') },
      { label: 'AmbientLight', select: () => setFill(bench, ambient, 'ambient') },
    ]);
    keyControls(bench, controls);
    bench.onChange(() => (readout.textContent = [FILLS[fillState(bench, ambient)], keyLine(bench)].join('\n')));
    bench.refresh();
  });
};

// What's off? 1: washed out and flat, and raising exposure does nothing.
export const offWashed: SceneSetup = (harness) => {
  start(harness, { material: 'denim_fabric_06', key: { around: -70, above: 16 }, height: 420 }, (bench, readout, controls) => {
    const { renderer, scene } = harness;
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    ambient.visible = false;
    scene.add(ambient);
    // Broken: tone mapping off (so the exposure someone raised does nothing), the color map read as
    // plain numbers, and the harness's sky light left on.
    renderer.toneMapping = THREE.NoToneMapping;
    bench.setColorSpace('map', THREE.NoColorSpace);
    bench.fill.visible = true;
    materialButtons(bench, controls);
    toneButtons(bench, controls, THREE.NoToneMapping);
    exposureSlider(bench, controls, 1.6);
    spaceButtons(bench, controls, 'map');
    choices(
      controls,
      'fill light',
      [
        { label: 'off', select: () => setFill(bench, ambient, 'off') },
        { label: 'HemisphereLight', select: () => setFill(bench, ambient, 'hemisphere') },
      ],
      1,
    );
    faultChecklist(bench, controls, [
      {
        fixed: () => renderer.toneMapping !== THREE.NoToneMapping,
        cause: 'Tone mapping was off, so the exposure someone raised did nothing and the highlights clipped. Once it\'s on, that exposure of 1.6 works too: bring it back to 1.',
        fix: 'renderer.toneMapping = THREE.NeutralToneMapping;',
      },
      { fixed: () => bench.maps!.map.colorSpace === THREE.SRGBColorSpace, cause: 'The color map was read as plain numbers, so the denim came out pale.', fix: 'map.colorSpace = THREE.SRGBColorSpace;' },
      { fixed: () => fillState(bench, ambient) === 'off', cause: 'A HemisphereLight added the same light everywhere, lifting the shadows and weakening the weave.', fix: 'scene.remove(hemisphereLight);' },
    ]);
    readout.textContent = "The denim looks pale and flat.\nSomeone raised the exposure to fix it, and nothing changed.";
  });
};

// What's off? 2: too glossy, and the bumps look wrong.
export const offGlossy: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -65, above: 22 }, height: 420 }, (bench, readout, controls) => {
    // Broken: the normal map and the packed map both marked sRGB, as "every texture is sRGB" does.
    bench.setColorSpace('normalMap', THREE.SRGBColorSpace);
    bench.setColorSpace('arm', THREE.SRGBColorSpace);
    materialButtons(bench, controls);
    spaceButtons(bench, controls, 'map');
    spaceButtons(bench, controls, 'normalMap');
    spaceButtons(bench, controls, 'arm');
    faultChecklist(bench, controls, [
      { fixed: () => bench.maps!.normalMap.colorSpace === THREE.NoColorSpace, cause: 'The normal map was marked sRGB, so every direction bent and the surface looked tilted.', fix: 'normalMap.colorSpace = THREE.NoColorSpace;' },
      { fixed: () => bench.maps!.arm.colorSpace === THREE.NoColorSpace, cause: 'The packed map was marked sRGB, so roughness dropped (too glossy) and the creases went too dark.', fix: 'arm.colorSpace = THREE.NoColorSpace;' },
    ]);
    readout.textContent = 'The leather is too shiny, and its grain looks lit from the wrong side.\nMove the camera: the shine slides around strangely.';
  });
};
