import { buttonGroup, choiceButtons, COLORS, formatNumber, label, overlay, screenColor, slider } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { environment, environmentImage, jewelryStage, METALS, MISSING_REFERENCE } from '../shared';
import { METAL_NAMES, metalMaterial, SPRING_METAL_LINEAR, type MetalName } from './metal';

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
    () => {
      readout.textContent = MISSING_REFERENCE;
    },
  );
}

// A comfort-fit ring band: a torus whose tube is stretched along the ring's axis into an oval,
// tilted toward the camera and turning slowly, so reflections slide across it.
function spinningBand(harness: Harness, material: THREE.Material, at = new THREE.Vector3(0, 1, 0)) {
  const holder = new THREE.Group();
  holder.position.copy(at);
  const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 64, 256), material);
  band.scale.z = 2.6;
  band.rotation.x = -0.55;
  holder.add(band);
  harness.scene.add(holder);
  harness.onFrame((delta) => {
    holder.rotation.y += delta * 0.25;
  });
  return band;
}

const hex = (color: THREE.Color) => `#${color.getHexString()}`;
const triple = (r: number, g: number, b: number) => [r, g, b].map((n) => n.toFixed(3)).join(', ');

// Evidence: a band in each of iJewel's presets, or in Spring's own metal, with the color typed right
// or wrong, in front of a plain backdrop or the room it reflects.
export const presets: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  jewelryStage(harness);
  camera.position.set(0, 1.1, 3.1);
  controls.target.set(0, 0.95, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const plain = scene.background;

  whenLoaded(container, readout, Promise.all([environment(renderer, 'metal'), environmentImage('metal')]), ([env, room]) => {
    scene.environment = env;
    const material = metalMaterial('rose gold');
    spinningBand(harness, material);

    let metal: MetalName | 'spring' = 'rose gold';
    let typed: 'right' | 'pale' | 'dark' = 'right';
    const update = () => {
      // The color the shader should get (linear), and the same color's sRGB numbers.
      const linear = metal === 'spring' ? new THREE.Color().setRGB(...SPRING_METAL_LINEAR) : new THREE.Color(METALS[metal].color);
      const srgb = linear.getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace);
      const settings = metal === 'spring' ? { metalness: 1, roughness: 0 } : METALS[metal];
      material.metalness = settings.metalness;
      material.roughness = settings.roughness;
      let code: string;
      if (typed === 'pale') {
        material.color.setRGB(srgb.r, srgb.g, srgb.b); // sRGB numbers, read as linear
        code = `material.color.setRGB(${triple(srgb.r, srgb.g, srgb.b)})`;
      } else if (typed === 'dark') {
        material.color.setRGB(linear.r, linear.g, linear.b, THREE.SRGBColorSpace); // linear numbers, read as sRGB
        code = `material.color.setRGB(${triple(linear.r, linear.g, linear.b)}, THREE.SRGBColorSpace)`;
      } else if (metal === 'spring') {
        material.color.copy(linear);
        code = `material.color.setRGB(${triple(linear.r, linear.g, linear.b)}) // from Spring.glb`;
      } else {
        material.color.set(METALS[metal].color);
        code = `material.color.set(0x${linear.getHexString()})`;
      }
      readout.innerHTML = [
        code,
        `metalness ${formatNumber(material.metalness, 3)} · roughness ${formatNumber(material.roughness, 3)} · no textures`,
        `the shader gets ${triple(material.color.r, material.color.g, material.color.b)} (linear), picked as ${hex(material.color)}`,
        typed === 'right'
          ? metal === 'spring'
            ? "right: glTF's base color is linear, setRGB's default"
            : 'right: the hex is sRGB, and set() converts it to linear'
          : typed === 'pale'
            ? 'too pale: sRGB numbers read as linear'
            : 'too dark: linear numbers read as sRGB',
      ].join('<br>');
    };

    choiceButtons(buttonGroup(bar, 'metal'), [
      ...METAL_NAMES.map((name) => ({ html: name, select: () => ((metal = name), update()) })),
      { html: "Spring's metal", select: () => ((metal = 'spring'), update()) },
    ]);
    choiceButtons(buttonGroup(bar, 'color typed'), [
      { html: 'right', select: () => ((typed = 'right'), update()) },
      { html: 'too pale', select: () => ((typed = 'pale'), update()) },
      { html: 'too dark', select: () => ((typed = 'dark'), update()) },
    ]);
    choiceButtons(buttonGroup(bar, 'behind it'), [
      { html: 'plain', select: () => (scene.background = plain) },
      { html: 'the room it reflects', select: () => (scene.background = room) },
    ]);
  });
};

// Why it works: the same rose gold band under each of three.js's tone mapping curves, with gray
// cards at three of the metal room's light levels (1.0 is white paper) to show what each curve does.
const MODES: { name: string; mode: THREE.ToneMapping; code: string; verdict: string }[] = [
  { name: 'ACES Filmic', mode: THREE.ACESFilmicToneMapping, code: 'ACESFilmicToneMapping', verdict: "the playground's: highlights roll off, darks go deeper" },
  { name: 'none', mode: THREE.NoToneMapping, code: 'NoToneMapping', verdict: 'no squeeze: everything over 1 clips, and exposure does nothing' },
  { name: 'Linear', mode: THREE.LinearToneMapping, code: 'LinearToneMapping', verdict: 'exposure, then a hard clip: the bright room goes flat white' },
  { name: 'AgX', mode: THREE.AgXToneMapping, code: 'AgXToneMapping', verdict: 'gentler: lighter darks, grayer highlights, less contrast' },
  { name: 'Neutral', mode: THREE.NeutralToneMapping, code: 'NeutralToneMapping', verdict: 'keeps colors closest to the picked hex' },
];
const CARDS = [0.05, 1.28, 84];

export const tone: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0.55, 1.1, 4.4);
  controls.target.set(0.55, 0.95, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, environment(renderer, 'metal'), (env) => {
    scene.environment = env;
    spinningBand(harness, metalMaterial('rose gold'), new THREE.Vector3(-0.35, 1, 0));
    // Each card is lit at a fixed level and goes through tone mapping like everything else.
    const cards = CARDS.map((level, index) => {
      const material = new THREE.SpriteMaterial();
      material.color.setScalar(level); // linear: 84 is 84 times white paper
      const card = new THREE.Sprite(material);
      card.scale.setScalar(0.42);
      card.position.set(1.65, 1.7 - index * 0.62, 0);
      const tag = label(String(level), COLORS.white);
      (tag.material as THREE.SpriteMaterial).toneMapped = false;
      tag.position.set(2.25, card.position.y, 0);
      scene.add(card, tag);
      return card;
    });

    let current = MODES[0];
    let shown = ['…', '…', '…'];
    const write = () => {
      readout.innerHTML = [
        `renderer.toneMapping = THREE.${current.code};`,
        `renderer.toneMappingExposure = ${formatNumber(renderer.toneMappingExposure)};`,
        `cards ${CARDS.join(' · ')} show as ${shown.join(' · ')} of 255`,
        current.verdict,
      ].join('<br>');
    };
    // Reads the cards' on-screen values (green, 0–255) after a change, once a frame shows it.
    let stale = true;
    const change = () => {
      stale = true;
      write();
    };
    onFrame(() => {
      if (!stale) return;
      stale = false;
      shown = cards.map((card) => {
        const color = screenColor(harness, card.position);
        return color ? String(parseInt(color.slice(3, 5), 16)) : '–';
      });
      write();
    });
    controls.addEventListener('change', () => (stale = true));

    choiceButtons(
      buttonGroup(bar, 'tone mapping'),
      MODES.map((entry) => ({
        html: entry.name,
        // No needsUpdate: the renderer notices the change and rebuilds each material's shader.
        select: () => ((current = entry), (renderer.toneMapping = entry.mode), change()),
      })),
    );
    slider(bar, 'exposure', { min: 0.2, max: 3, step: 0.05, value: 1 }, (value) => {
      renderer.toneMappingExposure = value;
      change();
    });
  });
};

// Why it works: roughness and metalness on the rose gold band.
export const finish: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  jewelryStage(harness);
  camera.position.set(0, 1.1, 3.1);
  controls.target.set(0, 0.95, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, environment(renderer, 'metal'), (env) => {
    scene.environment = env;
    const material = metalMaterial('rose gold');
    spinningBand(harness, material);

    const update = () => {
      const { roughness: r, metalness: m } = material;
      readout.innerHTML = [
        `material.roughness = ${formatNumber(r)}: ${
          r < 0.07 ? 'a sharp mirror, crisp panel edges' : r < 0.25 ? 'softened edges, a satin polish' : r < 0.6 ? 'blurred: brushed or satin' : 'dull: reads as matte paint'
        }`,
        `material.metalness = ${formatNumber(m)}: ${
          m > 0.99
            ? 'all tinted mirror'
            : m >= 0.85
              ? `${Math.round(m * 100)}% tinted mirror, the rest plain shine and matte color`
              : m > 0.2
                ? 'half and half: no real material looks like this'
                : 'a non-metal: colored paint under a clear shine'
        }`,
      ].join('<br>');
    };
    slider(bar, 'roughness', { min: 0, max: 1, step: 0.01, value: 0 }, (value) => {
      material.roughness = value;
      update();
    });
    slider(bar, 'metalness', { min: 0, max: 1, step: 0.01, value: 1 }, (value) => {
      material.metalness = value;
      update();
    });
    update();
  });
};
