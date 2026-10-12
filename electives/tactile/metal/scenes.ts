import { overlay } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import {
  backgroundButtons,
  choices,
  exposureSlider,
  faultChecklist,
  hdriButtons,
  keyControls,
  panel,
  rotationSlider,
  toneButtons,
  TONE_NAMES,
} from '../bench';
import { HDRIS, hdri as hdriEntry } from '../catalog';
import { createRingBench, LIGHT_NOTES, whenRingsReady, type ExtraLight, type RingBench } from './rings';

const ALL_HDRIS = HDRIS.map((entry) => entry.id);

// What each HDRI does to polished metal, in a line. The numbers behind these are in the README.
const ON_METAL: Record<string, string> = {
  ijewel_metal: 'bright and clean: big softboxes make long bright bands, black panels the dark lines that say "metal"',
  studio_small_09: 'dramatic: a mostly dark room, so dark rings with sharp bright streaks',
  cyclorama_hard_light: 'one bare lamp: a few small hot spots on a mid-gray reflection',
  overcast_soil_puresky: 'flat: an even sky leaves nothing dark to reflect, so the rings read as dull, almost plastic',
  christmas_photo_studio_01: 'warm lamps: every metal turns orange, and silver passes for gold',
  blue_photo_studio: 'cool daylight: silver goes blue-gray and gold turns slightly green',
};

const TONE_ON_METAL = new Map<THREE.ToneMapping, string>([
  [THREE.NoToneMapping, 'off: the lamp\'s reflection clips to flat white blobs, and the darks turn harsh'],
  [THREE.ACESFilmicToneMapping, 'ACES Filmic: highlights roll off to white smoothly, but the gold loses some of its color'],
  [THREE.AgXToneMapping, 'AgX: the gentlest roll-off, and the palest gold'],
  [THREE.NeutralToneMapping, 'Neutral: highlights roll off, and the gold keeps its color'],
]);

function start(harness: Harness, hdri: string | null, ready: (bench: RingBench, readout: HTMLElement, controls: HTMLElement) => void) {
  const bench = createRingBench(harness);
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  if (hdri === null) {
    ready(bench, readout, controls);
    return;
  }
  whenRingsReady(bench, readout, hdri, () => ready(bench, readout, controls));
}

const hdriLine = (bench: RingBench) => (bench.hdriId ? `${hdriEntry(bench.hdriId).name}:\n${ON_METAL[bench.hdriId]}` : 'no HDRI: nothing for a mirror to reflect, so the rings go black');

function lightButtons(bench: RingBench, parent: HTMLElement, startWith: ExtraLight = 'none') {
  const options: { label: string; value: ExtraLight }[] = [
    { label: 'none', value: 'none' },
    { label: 'key (DirectionalLight)', value: 'key' },
    { label: 'softbox (RectAreaLight)', value: 'softbox' },
    { label: 'AmbientLight', value: 'ambient' },
  ];
  choices(parent, 'extra light', options.map((option) => ({ label: option.label, select: () => bench.setLight(option.value) })), options.findIndex((o) => o.value === startWith));
}

// The same four rings under each HDRI.
export const hdris: SceneSetup = (harness) => {
  start(harness, 'ijewel_metal', (bench, readout, controls) => {
    hdriButtons(bench, controls, ALL_HDRIS);
    rotationSlider(bench, controls);
    backgroundButtons(bench, controls);
    bench.onChange(() => (readout.textContent = hdriLine(bench)));
    bench.refresh();
  });
};

// Tone mapping under a bare lamp, the hardest case for highlights.
export const tone: SceneSetup = (harness) => {
  start(harness, 'cyclorama_hard_light', (bench, readout, controls) => {
    const { renderer } = harness;
    toneButtons(bench, controls);
    exposureSlider(bench, controls);
    hdriButtons(bench, controls, ALL_HDRIS);
    bench.onChange(() => {
      readout.textContent = [
        `renderer.toneMapping = THREE.${TONE_NAMES.get(renderer.toneMapping)};`,
        TONE_ON_METAL.get(renderer.toneMapping)!,
      ].join('\n');
    });
    bench.refresh();
  });
};

// Extra lights on top of the HDRI.
export const lights: SceneSetup = (harness) => {
  start(harness, 'studio_small_09', (bench, readout, controls) => {
    lightButtons(bench, controls);
    keyControls(bench, controls);
    hdriButtons(bench, controls, ALL_HDRIS);
    bench.onChange(() => (readout.textContent = LIGHT_NOTES[bench.light]));
    bench.refresh();
  });
};

// What's off? 1: gray plastic, and the light someone added did nothing.
export const offPlastic: SceneSetup = (harness) => {
  start(harness, 'overcast_soil_puresky', (bench, readout, controls) => {
    bench.setLight('ambient');
    hdriButtons(bench, controls, ALL_HDRIS);
    lightButtons(bench, controls, 'ambient');
    faultChecklist(bench, controls, [
      {
        fixed: () => !['overcast_soil_puresky'].includes(bench.hdriId ?? ''),
        cause: 'An overcast sky has nothing dark in it, so a mirror shows an even gray: dull, like plastic. Metal needs a room with bright panels and dark ones.',
        fix: "scene.environment = studio; // the jewelry studio or the softbox studio",
      },
      {
        fixed: () => bench.light !== 'ambient',
        cause: "The AmbientLight added to make them shine did nothing: pure metal has no diffuse part for it to light. It only misleads the next person.",
        fix: 'scene.remove(ambientLight);',
      },
    ]);
    readout.textContent = 'The rings look like gray plastic.\nSomeone added an AmbientLight to make them shine, and nothing changed.';
  });
};

// What's off? 2: the silver passes for gold, and the highlights are white blobs.
export const offWarm: SceneSetup = (harness) => {
  start(harness, 'christmas_photo_studio_01', (bench, readout, controls) => {
    harness.renderer.toneMapping = THREE.NoToneMapping;
    hdriButtons(bench, controls, ALL_HDRIS);
    toneButtons(bench, controls, THREE.NoToneMapping);
    faultChecklist(bench, controls, [
      {
        fixed: () => !['christmas_photo_studio_01', 'blue_photo_studio'].includes(bench.hdriId ?? ''),
        cause: 'The HDRI is tungsten lamps, and a mirror shows their orange: silver and platinum pass for gold. Light metal with a neutral studio.',
        fix: 'scene.environment = neutralStudio;',
      },
      {
        fixed: () => harness.renderer.toneMapping !== THREE.NoToneMapping,
        cause: 'Tone mapping was off, so the lamps\' reflections clipped into flat white blobs.',
        fix: 'renderer.toneMapping = THREE.NeutralToneMapping;',
      },
    ]);
    readout.textContent = "The silver ring looks like gold and the gold looks orange.\nThe brightest spots are flat white blobs.";
  });
};

// What's off? 3: black rings with a single bright dot each.
export const offBlack: SceneSetup = (harness) => {
  start(harness, null, (bench, readout, controls) => {
    bench.setLight('key');
    hdriButtons(bench, controls, ALL_HDRIS, true);
    lightButtons(bench, controls, 'key');
    keyControls(bench, controls);
    faultChecklist(bench, controls, [
      {
        fixed: () => bench.hdriId !== null,
        cause: 'There was no environment. A mirror shows only what surrounds it, and a DirectionalLight has no size, so each ring showed one dot on black.',
        fix: 'scene.environment = pmrem.fromEquirectangular(hdr).texture;',
      },
    ]);
    readout.textContent = 'The rings are almost black, each with one tiny bright dot.\nMaking the light brighter only makes the dot brighter.';
  });
};
