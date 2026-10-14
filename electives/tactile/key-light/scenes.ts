import { overlay, slider } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import {
  choices,
  createBench,
  faultChecklist,
  hdriButtons,
  keyControls,
  keyLine,
  materialButtons,
  panel,
  row,
  whenBenchReady,
  type Bench,
  type BenchOptions,
} from '../bench';
import { hdri as hdriEntry } from '../catalog';
import { ballSides, ballsInFront, hex, measureWhenSettled, relief, swatchFace, twoPartReadout, warmth } from '../reading-light/meter';
import { keepKeyAt } from '../reading-light/rooms';

const BALL_RADIUS = 0.03;

// Starts the bench with the HDRI turned so its own brightest light agrees with the key light's
// starting side (front left), as a photographer sets a key where the room's window already is.
function start(harness: Harness, options: BenchOptions, ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement) => void) {
  const bench = createBench(harness, { balls: true, height: 420, ...options });
  ballsInFront(bench.balls);
  keepKeyAt(bench);
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenBenchReady(bench, readout, options, () => ready(bench, readout, controls));
}

const grayBall = (bench: Bench) => bench.balls.children[0];

// How much the swatch's bumps change its light (see relief in meter.ts).
const swatchRelief = (harness: Harness, bench: Bench) => relief(harness, bench.material, swatchFace(bench.swatch, 0.4));

// "bright side 3.4× the dark side": the lighting ratio photographers read off a gray ball.
function ratioLine(harness: Harness, bench: Bench) {
  const sides = ballSides(harness, grayBall(bench), BALL_RADIUS);
  if (!sides) return 'gray ball: off screen';
  const verdict = sides.ratio < 2 ? 'flat: the key barely shows' : sides.ratio <= 8 ? 'readable: detail in the light and in the shade' : 'harsh: the shade side goes black';
  return `gray ball: bright side ${sides.ratio.toFixed(1)}× the dark side, ${verdict}`;
}

function brightnessSliders(bench: Bench, parent: HTMLElement, start: { key: number; hdri: number }) {
  const { scene } = bench.harness;
  bench.key.intensity = start.key;
  scene.environmentIntensity = start.hdri;
  const group = row(parent, '');
  slider(group, 'key brightness', { min: 0, max: 8, step: 0.1, value: start.key }, (v) => {
    bench.key.intensity = v;
    bench.refresh();
  });
  slider(group, 'HDRI brightness', { min: 0, max: 2, step: 0.05, value: start.hdri }, (v) => {
    scene.environmentIntensity = v;
    bench.refresh();
  });
}

function rimSlider(bench: Bench, parent: HTMLElement, start: number) {
  bench.rim.intensity = start;
  slider(row(parent, ''), 'rim brightness', { min: 0, max: 20, step: 0.5, value: start }, (v) => {
    bench.rim.intensity = v;
    bench.refresh();
  });
}

// A low raking key against a key from the front.
export const raking: SceneSetup = (harness) => {
  start(harness, { material: 'denim_fabric_06', key: { around: 0, above: 20 } }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    keyControls(bench, controls);
    materialButtons(bench, controls);
    bench.onChange(() => {
      // Glossy leather from the front: the relief readout rises, but from the key's reflection, not shade.
      const glossy = bench.entry.kind === 'leather' && bench.keyAboveSwatch() > 60;
      readout.code([keyLine(bench), ...(glossy ? ["glossy leather: the grain shows only inside the key's reflection,\nwhich moves when the camera does"] : [])]);
    });
    measureWhenSettled(harness, bench, () => {
      const value = swatchRelief(harness, bench);
      readout.measured([value === null ? 'swatch: off screen' : `swatch relief ${value.toFixed(2)}`]);
    });
    bench.refresh();
  });
};

// The key against the HDRI: the lighting ratio.
export const balance: SceneSetup = (harness) => {
  start(harness, { material: 'Leather039', key: { around: -60, above: 25 } }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    brightnessSliders(bench, controls, { key: 2.5, hdri: 1 });
    materialButtons(bench, controls);
    bench.onChange(() =>
      readout.code([`key.intensity = ${bench.key.intensity.toFixed(1)};`, `scene.environmentIntensity = ${harness.scene.environmentIntensity.toFixed(2)};`]),
    );
    measureWhenSettled(harness, bench, () => readout.measured([ratioLine(harness, bench)]));
    bench.refresh();
  });
};

// The key light's color against the room's.
const KEY_COLORS: { label: string; color: number; name: string }[] = [
  { label: 'white', color: 0xffffff, name: 'white' },
  { label: 'warm (tungsten)', color: 0xffb46b, name: 'warm, like a 3200 K tungsten lamp' },
  { label: 'cool (shade)', color: 0xc9d9ff, name: 'cool, like daylight in shade' },
];

function colorButtons(bench: Bench, parent: HTMLElement, start = 0) {
  choices(
    parent,
    'key color',
    KEY_COLORS.map((option) => ({
      label: option.label,
      select: () => {
        bench.key.color.set(option.color);
        bench.refresh();
      },
    })),
    start,
  );
}

const keyColorName = (bench: Bench) => KEY_COLORS.find((option) => bench.key.color.equals(new THREE.Color(option.color)))?.name ?? 'custom';

export const color: SceneSetup = (harness) => {
  start(harness, { material: 'denim_fabric_06', hdri: 'christmas_photo_studio_01' }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    colorButtons(bench, controls, 2);
    hdriButtons(bench, controls, ['studio_small_09', 'christmas_photo_studio_01', 'blue_photo_studio']);
    materialButtons(bench, controls);
    bench.onChange(() => readout.code([`key.color: ${keyColorName(bench)}`, `room: ${hdriEntry(bench.hdriId!).name.toLowerCase()}`]));
    measureWhenSettled(harness, bench, () => {
      const sides = ballSides(harness, grayBall(bench), BALL_RADIUS);
      if (!sides) return readout.measured(['gray ball: off screen']);
      const [lit, shade] = [warmth(sides.bright.color), warmth(sides.dark.color)];
      readout.measured([
        `gray ball: lit side ${hex(sides.bright.color)} ${lit}, shade ${hex(sides.dark.color)} ${shade}`,
        lit === shade ? 'one room: the key and the HDRI agree' : 'two rooms: the key and the HDRI disagree',
      ]);
    });
    bench.refresh();
  });
};

// A rim light low behind the samples, facing the camera: it grazes only the edges that turn away
// from the camera and outlines them. The scenes that use it stand the samples on black velvet, as
// product photographers do for dark products: it reflects almost no light, so here it's unlit, and
// the samples have dark all around them.
function placeRim(bench: Bench) {
  bench.rim.position.copy(bench.rim.target.position).add(new THREE.Vector3(0.35, 0.4, -0.85)); // 23° up, behind and a little right
  const velvet = new THREE.MeshBasicMaterial({ color: 0x121316 });
  bench.ground.material = velvet;
  bench.harness.scene.background = new THREE.Color(0x0c0d10); // dark all around
  onLeave(bench.harness.container, () => velvet.dispose());
}

export const rim: SceneSetup = (harness) => {
  start(harness, { material: 'denim_fabric_06' }, (bench, readout, controls) => {
    placeRim(bench);
    rimSlider(bench, controls, 0);
    materialButtons(bench, controls);
    bench.onChange(() => {
      const r = bench.rim.intensity;
      readout.textContent = [
        `rim.intensity = ${r.toFixed(1)}; // low behind, facing the camera`,
        r < 0.5
          ? "off: the roll's top melts into the dark swatch behind it"
          : r < 6
            ? 'faint: it only grazes the edges, so a rim needs more than the key'
            : "a bright line along the roll's top and the swatch's edge\nseparates each from the dark behind it",
      ].join('\n');
    });
    bench.refresh();
  });
};

// Normal maps shade, but never cast shadows.
export const normalShadow: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -80, above: 12 } }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    const group = row(controls, '');
    const toggle = document.createElement('label');
    toggle.style.cssText = 'display: flex; align-items: center; gap: 6px;';
    toggle.innerHTML = '<input type="checkbox" checked> key light casts shadows';
    const input = toggle.querySelector('input')!;
    input.addEventListener('change', () => {
      bench.key.castShadow = input.checked;
      bench.refresh();
    });
    group.append(toggle);
    keyControls(bench, controls);
    materialButtons(bench, controls);
    bench.onChange(() => readout.code([`key.castShadow = ${bench.key.castShadow};`, keyLine(bench)]));
    // Measures the grain both ways: with the swatch taking shadows and without.
    measureWhenSettled(harness, bench, () => {
      const receiving = bench.swatch.receiveShadow;
      bench.swatch.receiveShadow = true;
      const withShadows = bench.key.castShadow ? swatchRelief(harness, bench) : null;
      bench.swatch.receiveShadow = false;
      const without = swatchRelief(harness, bench);
      bench.swatch.receiveShadow = receiving;
      if (without === null) return readout.measured(['swatch: off screen']);
      readout.measured([
        withShadows === null ? `swatch relief ${without.toFixed(2)}, with no shadows at all` : `swatch relief ${withShadows.toFixed(2)} with shadows, ${without.toFixed(2)} without`,
      ]);
    });
    bench.refresh();
  });
};

// What's off? 1: flat denim, lit from every side. Matte denim, not glossy leather: from the front,
// leather's grain shows inside the key's reflection, so it wouldn't look flat.
export const offFlat: SceneSetup = (harness) => {
  start(harness, { material: 'denim_fabric_06', key: { around: 0, above: 20 } }, (bench, readout, controls) => {
    const extras = [
      { around: 90, above: 30 },
      { around: 0, above: 80 },
      { around: -150, above: 35 },
    ].map(({ around, above }) => {
      const light = new THREE.DirectionalLight(0xffffff, 1.5);
      const [a, e] = [THREE.MathUtils.degToRad(around), THREE.MathUtils.degToRad(above)];
      light.position.set(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).add(bench.key.target.position);
      light.target = bench.key.target;
      harness.scene.add(light);
      return light;
    });
    const setExtras = (on: boolean) => {
      for (const light of extras) light.visible = on;
      bench.refresh();
    };
    choices(controls, 'extra lights', [
      { label: 'three more lights', select: () => setExtras(true) },
      { label: 'none', select: () => setExtras(false) },
    ]);
    keyControls(bench, controls);
    materialButtons(bench, controls);
    faultChecklist(bench, controls, [
      {
        fixed: () => bench.keyAboveSwatch() >= 5 && bench.keyAboveSwatch() <= 35,
        cause:
          'The key came from the front, so every bump faced it equally and none fell into shade. Bring it low across the surface: 15 to 30° above it. That usually means from the side; this swatch leans back, so light from straight above skims it too.',
        fix: 'key.position.set(-1, 0.3, 0.2); // low, from the side',
      },
      {
        fixed: () => extras.every((light) => !light.visible),
        cause: 'Three extra lights filled the shade the key made, from three more sides, and put three more highlights on everything. One key and the HDRI read as one room.',
        fix: 'scene.remove(rightLight, topLight, backLight);',
      },
    ]);
    readout.textContent = 'The denim looks flat: its weave barely shows.\nThe gray ball is lit almost evenly from every side.';
  });
};

// What's off? 2: denim with black shadows, lost in the background.
export const offDark: SceneSetup = (harness) => {
  start(harness, { material: 'denim_fabric_06', key: { around: -70, above: 20 } }, (bench, readout, controls) => {
    placeRim(bench);
    brightnessSliders(bench, controls, { key: 6, hdri: 0.1 });
    rimSlider(bench, controls, 0);
    materialButtons(bench, controls);
    faultChecklist(bench, controls, [
      {
        fixed: () => harness.scene.environmentIntensity >= 0.6,
        cause: 'The HDRI was turned down to 0.1, so nothing lit the shade side and every shadow went black.',
        fix: 'scene.environmentIntensity = 1;',
      },
      {
        fixed: () => bench.key.intensity <= 4,
        cause: 'The key was pushed to 6 to make up for it, which only brightened the lit side. With the room back, a key of 2 to 3 is plenty.',
        fix: 'key.intensity = 2.5;',
      },
      {
        fixed: () => bench.rim.intensity >= 6,
        cause: 'Dark denim on black velvet has no edge to see. A rim light low behind the samples grazes their tops and outlines them; it only grazes, so it needs to be stronger than the key.',
        fix: 'rim.intensity = 10;',
      },
    ]);
    readout.textContent = 'The denim is pitch black everywhere the key light misses.\nIts edges vanish into the dark around it.';
  });
};
