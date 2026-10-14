import { overlay, slider } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import {
  choices,
  createBench,
  faultChecklist,
  hdriButtons,
  keyControls,
  materialButtons,
  panel,
  row,
  whenBenchReady,
  type Bench,
  type BenchOptions,
} from '../bench';
import { measureWhenSettled, readPatches, swatchFace, twoPartReadout } from '../reading-light/meter';
import { keepKeyAt } from '../reading-light/rooms';
import { groundRig, type GroundRig } from './rig';

function start(harness: Harness, options: BenchOptions, ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement) => void) {
  const bench = createBench(harness, { height: 420, ...options });
  keepKeyAt(bench);
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenBenchReady(bench, readout, options, () => ready(bench, readout, controls));
}

function checkbox(parent: HTMLElement, text: string, checked: boolean, change: (on: boolean) => void) {
  const label = document.createElement('label');
  label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  label.innerHTML = `<input type="checkbox"${checked ? ' checked' : ''}> ${text}`;
  const input = label.querySelector('input')!;
  input.addEventListener('change', () => change(input.checked));
  parent.append(label);
  return input;
}

// Everything on the bench that casts a shadow.
const casters = (bench: Bench) => [bench.swatch, bench.roll, bench.plank, bench.block, ...bench.balls.children];

// The four switches.
export const switches: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -75, above: 25 } }, (bench, readout, controls) => {
    const { renderer, scene } = harness;
    const group = row(controls, 'shadows');
    const mark = (on: boolean) => (on ? '✓' : '✗');
    checkbox(group, 'renderer.shadowMap.enabled', true, (on) => {
      renderer.shadowMap.enabled = on;
      // Shaders are built with or without shadows, so turning this after the first frame needs them rebuilt.
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) (object.material as THREE.Material).needsUpdate = true;
      });
      bench.refresh();
    });
    checkbox(group, 'key.castShadow', true, (on) => ((bench.key.castShadow = on), bench.refresh()));
    checkbox(group, 'mesh.castShadow', true, (on) => {
      for (const mesh of casters(bench)) mesh.castShadow = on;
      bench.refresh();
    });
    checkbox(group, 'ground.receiveShadow', true, (on) => ((bench.ground.receiveShadow = on), bench.refresh()));
    materialButtons(bench, controls);
    bench.onChange(() => {
      const all = [renderer.shadowMap.enabled, bench.key.castShadow, bench.roll.castShadow, bench.ground.receiveShadow];
      readout.textContent = [
        `shadowMap.enabled ${mark(all[0])}   key.castShadow ${mark(all[1])}`,
        `mesh.castShadow ${mark(all[2])}   ground.receiveShadow ${mark(all[3])}`,
        all.every(Boolean) ? 'all four on: the samples\' shadows land on the floor' : 'one is off, so no shadow reaches the floor',
      ].join('\n');
    });
    bench.refresh();
  });
};

// Fitting the shadow camera around the samples.
function shadowWidth(bench: Bench) {
  const camera = bench.key.shadow.camera;
  return camera.right - camera.left;
}

function setShadowWidth(bench: Bench, width: number) {
  const camera = bench.key.shadow.camera;
  Object.assign(camera, { left: -width / 2, right: width / 2, top: width / 2, bottom: -width / 2 });
  camera.updateProjectionMatrix();
  bench.refresh();
}

// Whether every sample's shadow lands inside the shadow camera. A directional light's shadow falls
// straight along its rays, so covering the casters, seen from the light, covers their shadows too.
function coversSamples(bench: Bench) {
  const light = bench.key;
  const view = new THREE.Matrix4().lookAt(light.position, light.target.position, new THREE.Vector3(0, 1, 0));
  view.setPosition(light.position).invert();
  const half = shadowWidth(bench) / 2;
  const box = new THREE.Box3();
  for (const mesh of casters(bench)) if (mesh.visible && mesh.parent?.visible !== false) box.expandByObject(mesh);
  const corner = new THREE.Vector3();
  for (let i = 0; i < 8; i++) {
    corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).applyMatrix4(view);
    if (Math.abs(corner.x) > half || Math.abs(corner.y) > half) return false;
  }
  return true;
}

function fitLines(bench: Bench) {
  const width = shadowWidth(bench);
  const texel = (width / bench.key.shadow.mapSize.x) * 1000;
  const covers = coversSamples(bench);
  return [
    `key.shadow.camera: ${width.toFixed(2)} m across, mapSize ${bench.key.shadow.mapSize.x}`,
    `each shadow texel covers ${texel.toFixed(2)} mm`,
    !covers ? 'too small: part of the samples is outside, so its shadow is cut off' : texel > 1 ? 'covers the samples, but coarsely: smeared or blocky edges' : 'fitted: covers the samples, sharp edges',
  ];
}

function widthSlider(bench: Bench, parent: HTMLElement, start: number) {
  setShadowWidth(bench, start);
  slider(row(parent, ''), 'shadow camera width', { min: 0.1, max: 8, step: 0.05, value: start }, (v) => setShadowWidth(bench, v));
}

export const fit: SceneSetup = (harness) => {
  start(harness, { material: 'denim_fabric_06', key: { around: -60, above: 30 } }, (bench, readout, controls) => {
    const helper = new THREE.CameraHelper(bench.key.shadow.camera);
    helper.visible = false;
    harness.scene.add(helper);
    widthSlider(bench, controls, 0.7);
    choices(
      controls,
      'mapSize',
      [512, 1024, 2048, 4096].map((size) => ({
        label: String(size),
        select: () => {
          bench.key.shadow.mapSize.set(size, size); // three.js resizes the map on the next frame
          bench.refresh();
        },
      })),
      2,
    );
    checkbox(row(controls, ''), 'show the shadow camera', false, (on) => ((helper.visible = on), bench.refresh()));
    materialButtons(bench, controls);
    bench.onChange(() => {
      helper.update();
      readout.textContent = fitLines(bench).join('\n');
    });
    bench.refresh();
  });
};

// Acne and peter-panning: the two biases.
function biasSliders(bench: Bench, parent: HTMLElement, start: { normalBias: number; bias: number }) {
  const shadow = bench.key.shadow;
  shadow.normalBias = start.normalBias;
  shadow.bias = start.bias;
  const group = row(parent, '');
  slider(group, 'normalBias', { min: 0, max: 0.03, step: 0.0005, value: start.normalBias }, (v) => ((shadow.normalBias = v), bench.refresh()));
  slider(group, 'bias', { min: -0.003, max: 0.001, step: 0.0001, value: start.bias }, (v) => ((shadow.bias = v), bench.refresh()));
}

// three.js draws a solid's back faces into the shadow map (shadowSide), so its lit front is far
// from the depth it's compared with and doesn't shadow itself. A thin or double-sided surface has
// its front in the map too; frontFaces stands in for one.
const frontFaces = (bench: Bench) => bench.material.shadowSide === THREE.FrontSide;

function biasLines(bench: Bench) {
  const { normalBias, bias } = bench.key.shadow;
  const acne = frontFaces(bench) && normalBias < 0.001 && bias > -0.0005;
  const floating = normalBias > 0.008 || bias < -0.002;
  return [
    `material.shadowSide = ${frontFaces(bench) ? 'THREE.FrontSide; // like a thin sheet' : 'null; // a solid: back faces'}`,
    `key.shadow.normalBias = ${normalBias.toFixed(4)}; bias = ${bias.toFixed(4)};`,
    acne ? 'acne: the surfaces shadow themselves in stripes' : floating ? 'peter-panning: the shadow starts away from the contact' : 'clean: no stripes, and shadows start where things touch',
  ];
}

export const acne: SceneSetup = (harness) => {
  start(harness, { material: 'Leather039', key: { around: -60, above: 35 } }, (bench, readout, controls) => {
    // A coarse map with no blur, so the stripes are big enough to see; a blurred one turns them
    // into a grainy darkening instead.
    bench.key.shadow.mapSize.set(512, 512);
    bench.key.shadow.radius = 0;
    choices(controls, 'faces in the shadow map', [
      { label: 'front, like a thin sheet', select: () => ((bench.material.shadowSide = THREE.FrontSide), bench.refresh()) },
      { label: 'back, the default for a solid', select: () => ((bench.material.shadowSide = null), bench.refresh()) },
    ]);
    biasSliders(bench, controls, { normalBias: 0, bias: 0 });
    keyControls(bench, controls);
    materialButtons(bench, controls);
    bench.onChange(() => (readout.textContent = biasLines(bench).join('\n')));
    bench.refresh();
  });
};

// Shadow types and softness.
const TYPES: { label: string; type: THREE.ShadowMapType; note: string }[] = [
  { label: 'BasicShadowMap', type: THREE.BasicShadowMap, note: 'one sample: hard edges, stair-stepped up close; radius does nothing' },
  { label: 'PCFShadowMap', type: THREE.PCFShadowMap, note: 'several samples: radius blurs every edge by the same amount' },
  { label: 'VSMShadowMap', type: THREE.VSMShadowMap, note: 'the map itself is blurred by radius: smooth, but light can leak through thin parts' },
  { label: 'PCFSoftShadowMap', type: THREE.PCFSoftShadowMap, note: 'r186 removed this type: three.js warned in the console and switched' },
];

export const soft: SceneSetup = (harness) => {
  start(harness, { material: 'velour_velvet', key: { around: -60, above: 30 } }, (bench, element, controls) => {
    const { renderer } = harness;
    const readout = twoPartReadout(element);
    let picked = TYPES[1];
    choices(
      controls,
      'type',
      TYPES.map((option) => ({
        label: option.label,
        select: () => {
          picked = option;
          renderer.shadowMap.type = option.type; // three.js rebuilds the shaders on the next frame
          bench.refresh();
        },
      })),
      1,
    );
    slider(row(controls, ''), 'shadow.radius', { min: 0, max: 20, step: 0.5, value: bench.key.shadow.radius }, (v) => {
      bench.key.shadow.radius = v;
      bench.refresh();
    });
    materialButtons(bench, controls);
    bench.onChange(() => readout.code([`renderer.shadowMap.type = THREE.${picked.label};`, `key.shadow.radius = ${bench.key.shadow.radius};`]));
    // What the renderer actually used, read after it has drawn a frame.
    measureWhenSettled(harness, bench, () => {
      const used = TYPES.find((option) => option.type === renderer.shadowMap.type)!;
      readout.measured([used === picked ? picked.note : `type is now ${used.label}: ${picked.note}`]);
    });
    bench.refresh();
  });
};

// What grounds a sample: the key light's shadow, a contact shadow, or GTAO. The HDRI alone casts none.
// The floor just beside the front sample, in front and at both ends, and open floor well away from it.
function groundPoints(bench: Bench) {
  const front = [bench.roll, bench.plank, bench.block].find((mesh) => mesh.visible)!;
  const box = new THREE.Box3().setFromObject(front);
  const center = box.getCenter(new THREE.Vector3());
  return {
    beside: [
      new THREE.Vector3(center.x, 0.001, box.max.z + 0.004),
      new THREE.Vector3(box.max.x + 0.015, 0.001, center.z),
      new THREE.Vector3(box.min.x - 0.015, 0.001, center.z),
    ],
    open: new THREE.Vector3(-0.2, 0.001, 0.3),
  };
}

function groundMeasure(harness: Harness, bench: Bench, rig: GroundRig) {
  const { beside, open } = groundPoints(bench);
  const patches = readPatches(harness, [...beside, open], 5, rig.draw);
  const far = patches.pop();
  const near = patches.filter((patch) => patch !== null);
  if (!far || near.length === 0) return 'the floor by the sample: off screen';
  const darkest = Math.min(...near.map((patch) => patch!.luminance));
  const percent = Math.round((100 * darkest) / Math.max(far.luminance, 1e-4));
  const verdict = percent > 85 ? 'nothing darkens it: the sample floats' : 'darker where it meets the floor: grounded';
  return `floor beside the sample: ${percent}% of open floor, ${verdict}`;
}

function groundingControls(bench: Bench, rig: GroundRig, parent: HTMLElement, start: { key: boolean }) {
  const group = row(parent, '');
  bench.key.visible = start.key;
  checkbox(group, 'key light and its shadow', start.key, (on) => ((bench.key.visible = on), bench.refresh()));
  checkbox(group, 'contact shadow', false, (on) => rig.setContact(on));
  checkbox(group, 'ambient occlusion (GTAO)', false, (on) => rig.setGtao(on));
}

const groundCode = (bench: Bench, rig: GroundRig) =>
  `key ${bench.key.visible ? 'on' : 'off'} · contact shadow ${rig.contact.plane.visible ? 'on' : 'off'} · GTAO ${rig.gtao.enabled ? 'on' : 'off'}`;

export const ground: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', hdri: 'cyclorama_hard_light', key: { around: -60, above: 30 } }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    const rig = groundRig(bench, harness);
    groundingControls(bench, rig, controls, { key: false });
    choices(controls, 'ground', [
      { label: 'gray floor', select: () => rig.setGround('floor') },
      { label: 'shadow catcher (ShadowMaterial)', select: () => rig.setGround('catcher') },
    ]);
    hdriButtons(bench, controls);
    materialButtons(bench, controls);
    bench.onChange(() => readout.code([groundCode(bench, rig), rig.ground === 'catcher' ? 'ground.material = new THREE.ShadowMaterial({ opacity: 0.45 });' : 'ground: a gray MeshStandardMaterial']));
    rig.measureWhenSettled(() => readout.measured([groundMeasure(harness, bench, rig)]));
    bench.refresh();
  });
};

// An AO map darkens only the light that isn't from a light: the environment's.
type Lighting = 'both' | 'hdri' | 'key';

export const aoMap: SceneSetup = (harness) => {
  start(harness, { material: 'denim_fabric_06', key: { around: -75, above: 20 } }, (bench, element, controls) => {
    const readout = twoPartReadout(element);
    let lighting: Lighting = 'both';
    const light = (which: Lighting) => {
      lighting = which;
      bench.key.visible = which !== 'hdri';
      void bench.setHdri(which === 'key' ? null : 'studio_small_09');
      bench.refresh();
    };
    choices(controls, 'light', [
      { label: 'HDRI and key', select: () => light('both') },
      { label: 'HDRI only', select: () => light('hdri') },
      { label: 'key only', select: () => light('key') },
    ]);
    // aoMapIntensity 0 shows the material as if it had no AO map, without rebuilding its shader.
    checkbox(row(controls, ''), 'AO map', true, (on) => ((bench.material.aoMapIntensity = on ? 1 : 0), bench.refresh()));
    materialButtons(bench, controls);
    bench.onChange(() => readout.code([`material.aoMap = arm; // the packed map's red channel`, `light: ${lighting === 'both' ? 'the HDRI and the key' : lighting === 'hdri' ? 'the HDRI only' : 'the key only, no environment'}`]));
    // Measures the swatch with its AO map at full strength and at none.
    measureWhenSettled(harness, bench, () => {
      const material = bench.material;
      if (!material.aoMap) return readout.measured(['this material has no AO map: pick a Poly Haven one']);
      const at = swatchFace(bench.swatch, 0.4);
      const shown = material.aoMapIntensity;
      material.aoMapIntensity = 1;
      const [withAo] = readPatches(harness, [at], 48);
      material.aoMapIntensity = 0;
      const [without] = readPatches(harness, [at], 48);
      material.aoMapIntensity = shown;
      if (!withAo || !without) return readout.measured(['swatch: off screen']);
      const darker = Math.max(0, Math.round(100 * (1 - withAo.luminance / Math.max(without.luminance, 1e-5))));
      readout.measured([`the AO map darkens the swatch by ${darker}%`]);
    });
    bench.refresh();
  });
};

// What's off? 1: a blocky shadow that starts away from the roll.
export const offShadow: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -70, above: 22 } }, (bench, readout, controls) => {
    const shadow = bench.key.shadow;
    shadow.radius = 0;
    shadow.mapSize.set(1024, 1024);
    widthSlider(bench, controls, 8);
    const group = row(controls, '');
    shadow.normalBias = 0.025;
    slider(group, 'normalBias', { min: 0, max: 0.03, step: 0.0005, value: shadow.normalBias }, (v) => ((shadow.normalBias = v), bench.refresh()));
    slider(group, 'shadow.radius', { min: 0, max: 20, step: 0.5, value: 0 }, (v) => ((shadow.radius = v), bench.refresh()));
    materialButtons(bench, controls);
    faultChecklist(bench, controls, [
      {
        fixed: () => coversSamples(bench) && shadowWidth(bench) <= 1.2,
        cause: 'The shadow camera covered 8 m for samples under half a meter, so each of its 1024 texels was 8 mm wide: blocky. Fit it to what casts shadows.',
        fix: 'key.shadow.camera.left = -0.35; // and right, top, bottom; then updateProjectionMatrix()',
      },
      {
        fixed: () => shadow.normalBias <= 0.006,
        cause: 'normalBias was 2.5 cm, so every shadow started that far from where things touch, and the roll floated. A couple of millimeters stops acne without that.',
        fix: 'key.shadow.normalBias = 0.002;',
      },
      {
        fixed: () => shadow.radius >= 2,
        cause: 'radius was 0, so the edges were as hard as the texels. A few texels of radius softens them.',
        fix: 'key.shadow.radius = 3;',
      },
    ]);
    readout.textContent = 'The roll seems to hover above the floor.\nIts shadow has hard, stair-stepped edges.';
  });
};

// What's off? 2: a floating roll and dirty creases.
export const offAo: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', hdri: 'cyclorama_hard_light', key: { around: -60, above: 30 } }, (bench, readout, controls) => {
    const rig = groundRig(bench, harness);
    groundingControls(bench, rig, controls, { key: false });
    bench.material.aoMapIntensity = 3;
    slider(row(controls, ''), 'aoMapIntensity', { min: 0, max: 3, step: 0.1, value: 3 }, (v) => ((bench.material.aoMapIntensity = v), bench.refresh()));
    hdriButtons(bench, controls);
    materialButtons(bench, controls);
    faultChecklist(bench, controls, [
      {
        fixed: () => (bench.key.visible && bench.key.castShadow) || rig.contact.plane.visible || rig.gtao.enabled,
        cause: 'Only the HDRI lit the scene, and an HDRI casts no shadows, even one with a bare lamp: environment light reaches every point as if nothing were in the way. Add a shadow from a light, a contact shadow, or GTAO.',
        fix: 'contact.plane.visible = true; // or key.castShadow = true',
      },
      {
        fixed: () => bench.material.aoMapIntensity <= 1.05,
        cause: 'aoMapIntensity was 3, pushing the creases past black in the environment light, while the key light, which an AO map never touches, stayed the same. Leave it at 1.',
        fix: 'material.aoMapIntensity = 1;',
      },
    ]);
    readout.textContent = "The roll floats, though the HDRI has a bright lamp.\nThe leather's creases look dirty, almost black.";
  });
};
