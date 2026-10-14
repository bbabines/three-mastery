import { overlay, slider } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import {
  backgroundButtons,
  choices,
  createBench,
  faultChecklist,
  hdriButtons,
  loadHdri,
  materialButtons,
  panel,
  row,
  whenBenchReady,
  type Bench,
  type BenchOptions,
} from '../bench';
import { hdri as hdriEntry } from '../catalog';
import { ballSides, ballsInFront, hex, measureWhenSettled, readPatches, relief, swatchFace, twoPartReadout, warmth } from './meter';
import { keepKeyAt, turnFor } from './rooms';

const BALL_RADIUS = 0.03;

// What each HDRI does to a material, in a line. The numbers behind these are in the README.
const ON_MATERIAL: Record<string, string> = {
  studio_small_09: 'one big softbox: light from one side, soft edges',
  cyclorama_hard_light: 'one bare lamp: crisp, hot highlights, deep shade',
  overcast_soil_puresky: 'the whole sky: light from everywhere, so relief goes flat',
  christmas_photo_studio_01: 'tungsten lamps: one-sided, and everything turns orange',
  blue_photo_studio: 'daylight and blue walls: one-sided, and everything turns cool',
};

// Starts the bench lit by the HDRI alone: this page reads the room before adding any light to it.
// Each HDRI is turned so its brightest light comes from the front left, where the key light sits on
// the other pages, unless the scene is about turning it.
function start(
  harness: Harness,
  options: BenchOptions & { turn?: boolean },
  ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement) => void,
) {
  const bench = createBench(harness, { balls: true, height: 420, ...options });
  bench.key.visible = false;
  ballsInFront(bench.balls);
  if (options.turn !== false) keepKeyAt(bench);
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenBenchReady(bench, readout, options, () => ready(bench, readout, controls));
}

const gray = (bench: Bench) => bench.balls.children[0];

// "bright side 3.4× the dark side": how one-sided the light on the gray ball is.
function ballLine(sides: ReturnType<typeof ballSides>) {
  if (!sides) return 'gray ball: off screen';
  const verdict = sides.ratio < 2 ? 'even light: little shade anywhere' : sides.ratio < 6 ? 'one-sided light' : 'strongly one-sided: deep shade';
  return `gray ball: bright side ${sides.ratio.toFixed(1)}× the dark side, ${verdict}`;
}

// How much the swatch's bumps change its light (see relief in meter.ts), and, if asked, how bright
// it is in linear light (1 is white paper).
function reliefLine(bench: Bench, harness: Harness, withBrightness = false) {
  const at = swatchFace(bench.swatch, 0.4);
  const value = relief(harness, bench.material, at);
  if (value === null) return 'swatch: off screen';
  const [patch] = withBrightness ? readPatches(harness, [at], 48) : [null];
  return `swatch relief ${value.toFixed(2)}${patch ? `, brightness ${patch.luminance.toFixed(3)}` : ''}`;
}

// Gray clay first.
export const clay: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', hdri: 'studio_small_09' }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    choices(controls, 'surface', [
      { label: 'gray clay', select: () => bench.useClay(true) },
      { label: 'the material', select: () => bench.useClay(false) },
    ]);
    materialButtons(bench, controls);
    hdriButtons(bench, controls);
    bench.onChange(() =>
      readout.code([
        bench.swatch.material === bench.clay ? 'swatch.material = clay; // mid gray, roughness 0.5, no maps' : `swatch.material = ${bench.entry.name.toLowerCase()};`,
        `${hdriEntry(bench.hdriId!).name}: ${ON_MATERIAL[bench.hdriId!]}`,
      ]),
    );
    measureWhenSettled(harness, bench, () => readout.measured([ballLine(ballSides(harness, gray(bench), BALL_RADIUS))]));
    bench.refresh();
  });
};

// Choosing an HDRI: the room is the light, not just what's behind.
export const choose: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', hdri: 'overcast_soil_puresky' }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    hdriButtons(bench, controls);
    backgroundButtons(bench, controls);
    materialButtons(bench, controls);
    bench.onChange(() => {
      const entry = hdriEntry(bench.hdriId!);
      readout.code([`scene.environment = ${entry.name.toLowerCase()};`, ON_MATERIAL[entry.id]]);
    });
    measureWhenSettled(harness, bench, () => readout.measured([ballLine(ballSides(harness, gray(bench), BALL_RADIUS)), reliefLine(bench, harness)]));
    bench.refresh();
  });
};

// Turning the lighting and the background: two settings, not one.
function rotationSliders(bench: Bench, parent: HTMLElement, start: { lighting: number; background: number }) {
  const { scene } = bench.harness;
  const group = row(parent, '');
  const set = (which: 'lighting' | 'background', degrees: number) => {
    (which === 'lighting' ? scene.environmentRotation : scene.backgroundRotation).y = THREE.MathUtils.degToRad(degrees);
    bench.refresh();
  };
  set('lighting', start.lighting);
  set('background', start.background);
  slider(group, 'turn the lighting', { min: -180, max: 180, step: 1, value: start.lighting }, (v) => set('lighting', v));
  slider(group, 'turn the background', { min: -180, max: 180, step: 1, value: start.background }, (v) => set('background', v));
}

function rotationLines(scene: THREE.Scene) {
  const lighting = Math.round(THREE.MathUtils.radToDeg(scene.environmentRotation.y));
  const background = Math.round(THREE.MathUtils.radToDeg(scene.backgroundRotation.y));
  const apart = Math.abs(lighting - background);
  return [
    `scene.environmentRotation.y = ${lighting}°;`,
    `scene.backgroundRotation.y = ${background}°;`,
    apart <= 2 ? 'they match: the chrome ball reflects the room behind it' : `${apart}° apart: the light comes from somewhere the background doesn't show`,
  ];
}

// Shows the room behind the samples, so the chrome ball can be compared with it. The ground would
// hide all but a strip of it, and with no key light there are no shadows for it to catch, so it
// goes; the camera comes down a little to show more of the room.
async function showHdriBehind(bench: Bench) {
  const { scene, camera, controls } = bench.harness;
  bench.ground.visible = false;
  camera.position.set(-0.06, 0.2, 0.84);
  controls.target.set(0.06, 0.08, 0.06);
  controls.update();
  scene.background = await loadHdri(bench.harness, bench.hdriId!);
  bench.refresh();
}

export const rotate: SceneSetup = (harness) => {
  start(harness, { material: 'velour_velvet', hdri: 'christmas_photo_studio_01', turn: false }, (bench, readout, controls) => {
    void showHdriBehind(bench);
    rotationSliders(bench, controls, { lighting: 0, background: 0 });
    hdriButtons(bench, controls);
    materialButtons(bench, controls);
    bench.onChange(() => (readout.textContent = rotationLines(harness.scene).join('\n')));
    bench.refresh();
  });
};

// The HDRI's color tints everything.
export const tint: SceneSetup = (harness) => {
  start(harness, { material: 'Leather039', hdri: 'christmas_photo_studio_01' }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    hdriButtons(bench, controls);
    materialButtons(bench, controls);
    bench.onChange(() => {
      const entry = hdriEntry(bench.hdriId!);
      readout.code([`scene.environment = ${entry.name.toLowerCase()}; // measured red ÷ blue ${entry.tint}`]);
    });
    // Each side of the gray ball takes the color of the part of the room that lights it.
    measureWhenSettled(harness, bench, () => {
      const sides = ballSides(harness, gray(bench), BALL_RADIUS);
      if (!sides) return readout.measured(['gray ball: off screen']);
      const [lit, shade] = [warmth(sides.bright.color), warmth(sides.dark.color)];
      readout.measured([
        `gray ball: lit side ${hex(sides.bright.color)} ${lit}, shade ${hex(sides.dark.color)} ${shade}`,
        lit === shade ? (lit === 'neutral' ? 'gray stays gray: colors show as they are' : `${lit} all over: every material takes that cast`) : `${lit} light, ${shade} shade: two casts at once`,
      ]);
    });
    bench.refresh();
  });
};

// A brighter environment: the same detail, brighter.
function brightnessSlider(bench: Bench, parent: HTMLElement, start = 1) {
  const { scene } = bench.harness;
  scene.environmentIntensity = start;
  slider(row(parent, ''), 'HDRI brightness', { min: 0.25, max: 4, step: 0.05, value: start }, (v) => {
    scene.environmentIntensity = v;
    bench.refresh();
  });
}

export const brightness: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', hdri: 'studio_small_09' }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    brightnessSlider(bench, controls);
    hdriButtons(bench, controls);
    materialButtons(bench, controls);
    bench.onChange(() => readout.code([`scene.environmentIntensity = ${harness.scene.environmentIntensity.toFixed(2)};`]));
    measureWhenSettled(harness, bench, () => readout.measured([reliefLine(bench, harness, true), ballLine(ballSides(harness, gray(bench), BALL_RADIUS))]));
    bench.refresh();
  });
};

// What's off? 1: everything orange, and the reflections don't match the room.
export const offTint: SceneSetup = (harness) => {
  start(harness, { material: 'Leather039', hdri: 'christmas_photo_studio_01', turn: false }, (bench, readout, controls) => {
    void showHdriBehind(bench);
    // The lighting turned to put the lamps at the front left, and the background left behind.
    const lamps = Math.round(THREE.MathUtils.radToDeg(turnFor('christmas_photo_studio_01', -60)));
    rotationSliders(bench, controls, { lighting: lamps, background: 0 });
    hdriButtons(bench, controls);
    materialButtons(bench, controls);
    const { scene } = harness;
    faultChecklist(bench, controls, [
      {
        fixed: () => Math.abs(hdriEntry(bench.hdriId!).tint - 1) < 0.05, // the softbox studio or the overcast sky
        cause: "The HDRI was picked for its cozy background: tungsten lamps, whose orange tints every material and turns the shade brown. Light a product with a neutral room, and check the gray ball stays gray.",
        fix: 'scene.environment = neutralStudio;',
      },
      {
        fixed: () => Math.abs(scene.environmentRotation.y - scene.backgroundRotation.y) < THREE.MathUtils.degToRad(3),
        cause: 'Only the lighting was turned, so it came from somewhere the background doesn\'t show. The two rotations are separate settings: turn them together.',
        fix: 'scene.backgroundRotation.y = scene.environmentRotation.y;',
      },
    ]);
    readout.textContent = "The tan suede looks orange, and the gray ball looks brown.\nThe chrome ball's bright lamp isn't anywhere in the room behind it.";
  });
};

// What's off? 2: flat velvet, made paler by turning the environment up.
export const offFlat: SceneSetup = (harness) => {
  start(harness, { material: 'velour_velvet', hdri: 'overcast_soil_puresky' }, (bench, readout, controls) => {
    brightnessSlider(bench, controls, 3);
    hdriButtons(bench, controls);
    materialButtons(bench, controls);
    faultChecklist(bench, controls, [
      {
        // Measured on the velvet: relief 0.01 under the overcast sky and the softbox, 0.03 to 0.04
        // under the bare lamp and the cool studio (the warm lamps too, but they turn it orange).
        fixed: () => ['cyclorama_hard_light', 'blue_photo_studio'].includes(bench.hdriId!),
        cause:
          "An overcast sky lights from everywhere, so nothing on the surface is in shade and the pile has no relief. Fine pile needs a small, bright source: the bare lamp, or the cool studio's daylight. The softbox lights the shape from one side, but its big soft panel adds almost nothing to the pile.",
        fix: 'scene.environment = hardLight;',
      },
      {
        fixed: () => harness.scene.environmentIntensity <= 1.5,
        cause: 'Turning the environment up made everything brighter by the same amount, which adds no detail; tone mapping then squeezed the brights together. Bring it back to 1.',
        fix: 'scene.environmentIntensity = 1;',
      },
    ]);
    const lines = twoPartReadout(readout);
    lines.code(['The velvet looks flat and pale: its pile barely shows.']);
    measureWhenSettled(harness, bench, () => lines.measured([reliefLine(bench, harness), ballLine(ballSides(harness, gray(bench), BALL_RADIUS))]));
    bench.refresh();
  });
};
