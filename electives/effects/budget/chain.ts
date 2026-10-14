// Every effect of the elective on one watch, chosen by a settings object, with separate choices for
// a moving view and a still one. The effects are the same r186 nodes the other pages use, with
// their settings; this file only decides which ones a frame runs and in what order.
import { ao } from 'three/addons/tsl/display/GTAONode.js';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { ssgi } from 'three/addons/tsl/display/SSGINode.js';
import { ssr } from 'three/addons/tsl/display/SSRNode.js';
import { sss } from 'three/addons/tsl/display/SSSNode.js';
import { traa } from 'three/addons/tsl/display/TRAANode.js';
import {
  builtinAOContext,
  builtinShadowContext,
  context,
  convertToTexture,
  diffuseColor,
  metalness,
  mrt,
  normalView,
  output,
  packNormalToRGB,
  pass,
  roughness,
  sample,
  screenUV,
  unpackRGBToNormal,
  vec4,
  velocity,
} from 'three/tsl';
import * as THREE from 'three/webgpu';
import { STRENGTHS } from '../ambient-occlusion/scenes';
import { softGroundShadow, type SoftGroundShadow } from '../ground-shadow/bake';
import { AccumulateNode, jitter, magnify, moveWatcher } from '../progressive/smoothing';
import { FLOORS } from '../reflections/scenes';
import { restoreWatchBrushing, type WatchBrushing } from '../anisotropy/brushed';
import { crystalOf } from '../transmission/crystal';
import type { EffectsStage, Timing } from '../stage';

// Off, only in the still picture (the 32-frame average), or in every frame.
export type Use = 'off' | 'still' | 'always';
export const EFFECTS = ['ao', 'reflections', 'bounce', 'contact', 'bloom'] as const;
export type Effect = (typeof EFFECTS)[number];
export const EFFECT_NAMES: Record<Effect, string> = {
  ao: 'ambient occlusion',
  reflections: 'reflections (SSR)',
  bounce: 'bounced light',
  contact: 'contact shadows',
  bloom: 'bloom',
};

export interface Settings extends Record<Effect, Use> {
  moving: 'none' | 'msaa' | 'traa'; // smoothing while the view moves
  still: 'same' | 'progressive'; // once it stops: keep the moving picture, or average 32 frames
  keyShadow: boolean; // the key light's live shadow map
  bakedShadow: boolean; // the soft ground shadow, baked once
  floor: 'matte' | 'polished';
  glass: 'transmission' | 'none';
  brushed: boolean;
  ratio: number; // pixel ratio; 0 means the screen's own, up to 2
}

export const deviceRatio = () => Math.min(window.devicePixelRatio, 2);

export const PRESETS = {
  // What webgi.dev turns on for this watch (assets/reference/classic-watch/reference-capture.json):
  // SSAA + TAA + a 32-frame progressive still, SSAO, SSR, bloom, its contact-shadow ground, and
  // light_0's shadow; SSGI, depth of field, and its anisotropy plugin are off.
  webgi: {
    moving: 'traa', still: 'progressive', ao: 'always', reflections: 'always', bounce: 'off', contact: 'off', bloom: 'always',
    keyShadow: true, bakedShadow: true, floor: 'polished', glass: 'transmission', brushed: false, ratio: 0,
  },
  // A configurator on a desktop: parts change and the view moves a lot.
  desktop: {
    moving: 'traa', still: 'progressive', ao: 'always', reflections: 'off', bounce: 'off', contact: 'off', bloom: 'off',
    keyShadow: true, bakedShadow: true, floor: 'matte', glass: 'transmission', brushed: true, ratio: 0,
  },
  // A configurator on a phone: no extra passes while moving, occlusion only in the still picture.
  phone: {
    moving: 'msaa', still: 'progressive', ao: 'still', reflections: 'off', bounce: 'off', contact: 'off', bloom: 'off',
    keyShadow: false, bakedShadow: true, floor: 'matte', glass: 'transmission', brushed: true, ratio: 1.5,
  },
  // The misconception: every effect, every frame.
  everything: {
    moving: 'traa', still: 'progressive', ao: 'always', reflections: 'always', bounce: 'always', contact: 'always', bloom: 'always',
    keyShadow: true, bakedShadow: true, floor: 'polished', glass: 'transmission', brushed: true, ratio: 0,
  },
} satisfies Record<string, Settings>;
export type Preset = keyof typeof PRESETS;

type Smoothing = 'none' | 'msaa' | 'traa' | 'progressive';

// One frame's chain: which effects, and how it's smoothed.
interface Chain {
  output: THREE.Node;
  average?: AccumulateNode;
  dispose(): void;
}

// Builds the passes for one set of effects. Each chain owns its nodes, so switching settings never
// leaves an unused pass drawing.
function buildChain(stage: EffectsStage, effects: Set<Effect>, smoothing: Smoothing, zoom: number): Chain {
  const { scene, camera } = stage.harness;
  const nodes: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(node: T) => (nodes.push(node), node);
  const temporal = smoothing === 'traa' || smoothing === 'progressive'; // a new noise pattern each frame
  // Contact shadows darken the key light's shadow, so they need it on.
  const contact = effects.has('contact') && stage.key.visible;

  // Occlusion and contact shadows go inside the materials' lighting, so they're worked out first,
  // from a pass that draws only normals and depth.
  const inside: Record<string, unknown> = {};
  if (effects.has('ao') || contact) {
    const pre = keep(pass(scene, camera, { samples: 0 }));
    pre.transparent = false; // the glass doesn't hide the dial's shape
    pre.setMRT(mrt({ output: packNormalToRGB(normalView) }));
    pre.getTexture('output').type = THREE.UnsignedByteType;
    const preNormal = pre.getTextureNode();
    const preDepth = pre.getTextureNode('depth');
    if (effects.has('ao')) {
      const occlusion = keep(ao(preDepth, sample((uv) => unpackRGBToNormal(preNormal.sample(uv))), camera));
      occlusion.radius.value = STRENGTHS.subtle.radius;
      occlusion.scale.value = STRENGTHS.subtle.scale;
      occlusion.resolutionScale = 1;
      occlusion.useTemporalFiltering = temporal;
      Object.assign(inside, builtinAOContext(occlusion.getTextureNode().sample(screenUV).r).value);
    }
    if (contact) {
      const shadows = keep(sss(preDepth, camera, stage.key));
      shadows.maxDistance.value = 0.15;
      shadows.thickness.value = 0.02;
      shadows.quality.value = 0.5;
      shadows.useTemporalFiltering = temporal;
      Object.assign(inside, builtinShadowContext(shadows.getTextureNode().sample(screenUV).r, stage.key).value);
    }
  }

  // The scene, writing only the extra pictures the chosen effects read. WebGPU allows 32 bytes of
  // pictures per pixel (each counts 8 here), so with everything on they're packed into four:
  // roughness rides in the normal's spare channel, metalness in the surface color's.
  const screenSpace = effects.has('reflections') || effects.has('bounce');
  const main = keep(pass(scene, camera, { samples: smoothing === 'msaa' ? 4 : 0 }));
  if (Object.keys(inside).length) main.contextNode = context(inside);
  const targets: Record<string, THREE.Node> = { output };
  if (smoothing === 'traa') targets.velocity = velocity;
  if (screenSpace) {
    targets.normal = vec4(packNormalToRGB(normalView), roughness);
    targets.surface = vec4(diffuseColor.rgb, metalness);
  }
  if (Object.keys(targets).length > 1) main.setMRT(mrt(targets));
  for (const name of ['normal', 'surface']) if (targets[name]) main.getTexture(name).type = THREE.UnsignedByteType;
  const color = main.getTextureNode('output');
  const depth = main.getTextureNode('depth');
  const normal = screenSpace ? sample((uv) => unpackRGBToNormal(main.getTextureNode('normal').sample(uv).rgb)) : null;

  let picture = color as unknown as THREE.Node<'vec4'>;
  if (effects.has('bounce')) {
    const gi = keep(ssgi(color, depth, normal!, camera));
    gi.sliceCount.value = 2; // medium
    gi.stepCount.value = 8;
    gi.useScreenSpaceSampling.value = false;
    gi.radius.value = 3;
    gi.giIntensity.value = 12;
    gi.thickness.value = 0.3;
    gi.useTemporalFiltering = temporal;
    const surface = main.getTextureNode('surface');
    picture = vec4(color.rgb.mul(gi.getAONode()).add(surface.rgb.mul(gi.getGINode().rgb)), color.a);
  }
  if (effects.has('reflections')) {
    const mirror = keep(
      ssr(color, depth, normal!, { metalnessNode: main.getTextureNode('surface').a, roughnessNode: main.getTextureNode('normal').a, camera }),
    );
    mirror.maxDistance.value = 4;
    mirror.thickness.value = 0.03;
    mirror.quality.value = 0.5;
    picture = vec4(picture.rgb.add(mirror.rgb), color.a);
  }
  if (effects.has('bloom')) {
    // WebGi's threshold (1.82, in linear light before tone mapping); strength picked by eye.
    const glow = keep(bloom(picture, 0.15, 0.4, 1.82));
    picture = picture.add(glow);
  }

  let average: AccumulateNode | undefined;
  let final: THREE.TextureNode;
  if (smoothing === 'traa') {
    const smoothed = keep(traa(picture, depth, main.getTextureNode('velocity'), camera));
    if (effects.has('ao')) smoothed.useSubpixelCorrection = false; // as the occlusion page
    final = (smoothed as unknown as { getTextureNode(): THREE.TextureNode }).getTextureNode();
  } else if (smoothing === 'progressive') {
    average = keep(new AccumulateNode(keep(convertToTexture(picture) as unknown as THREE.TextureNode)));
    final = average.getTextureNode();
  } else {
    final = picture === (color as unknown) ? color : keep(convertToTexture(picture) as unknown as THREE.TextureNode);
  }
  return {
    output: zoom > 1 ? magnify(final, zoom, CROWN) : final,
    average,
    dispose: () => {
      for (const node of nodes) node.dispose();
    },
  };
}

// Where the crown sits in the stage's opening view, across and down (as on the progressive page).
const CROWN: [number, number] = [0.63, 0.45];

export type Motion = 'turning' | 'still' | 'averaging';
export type State = 'moving' | 'still' | 'averaging' | 'settled';

// The watch with every effect available. `apply` takes new settings; each frame draws the moving
// chain while the view moves and the still chain once it stops.
export function budgetBench(stage: EffectsStage) {
  const { renderer, camera, controls } = stage.harness;
  const crystal = crystalOf(stage.watch);
  crystal.material.side = THREE.FrontSide; // the glass page explains why
  const transmission = crystal.material.transmission;
  const floor = stage.ground.material as THREE.MeshStandardMaterial;
  const ground: SoftGroundShadow = stage.own(softGroundShadow(renderer, stage.watch, { toward: stage.key.position, cone: 20 }));
  stage.harness.scene.add(ground.overlay);
  // "Key shadow off" swaps in the same light without a shadow, rather than turning castShadow
  // off: in r186 that disposes the light's shadow while other passes still draw with it, and
  // quick clicks threw "Cannot read properties of null (reading 'depthTexture')".
  const unshadowedKey = stage.key.clone();
  unshadowedKey.castShadow = false;
  unshadowedKey.visible = false;
  stage.harness.scene.add(unshadowedKey, unshadowedKey.target);
  unshadowedKey.target.position.copy(stage.key.target.position);
  stage.own({ dispose: () => unshadowedKey.dispose() });
  let brushing: WatchBrushing | null = null;
  let settings: Settings = { ...PRESETS.desktop };
  let zoom = 1;
  restoreWatchBrushing(stage.watch).then((loaded) => {
    brushing = stage.own(loaded);
    brushing.set(settings.brushed);
  });

  const moving = stage.own(new THREE.RenderPipeline(renderer));
  const still = stage.own(new THREE.RenderPipeline(renderer));
  const chains = new Map<string, Chain>();
  let movingChain: Chain;
  let stillChain: Chain;
  const chainFor = (effects: Set<Effect>, smoothing: Smoothing) => {
    const key = `${[...effects].sort().join('+')}|${smoothing}|${zoom}|${stage.key.visible}`;
    let chain = chains.get(key);
    if (!chain) chains.set(key, (chain = buildChain(stage, effects, smoothing, zoom)));
    return chain;
  };
  // A chain that's no longer shown is disposed a few frames later, once the pipelines draw with
  // their new chains.
  let frameCount = 0;
  const retired: { chain: Chain; at: number }[] = [];
  const retire = (chain: Chain) => retired.push({ chain, at: frameCount });
  const disposeRetired = (all = false) => {
    let disposed = false;
    for (let i = retired.length - 1; i >= 0; i--) {
      if (!all && frameCount - retired[i].at < 3) continue;
      retired[i].chain.dispose();
      retired.splice(i, 1);
      disposed = true;
    }
    // r186's WebGL 2 fallback remembers the last framebuffer it read from when copying a texture
    // (TRAA copies two a frame) and binds it again after the next copy, even once it's deleted:
    // "bindFramebuffer: attempt to use a deleted object". Forgetting it after a dispose stops that.
    const backend = renderer.backend as unknown as { isWebGLBackend?: boolean; gl: WebGL2RenderingContext; state: { bindFramebuffer(target: number, framebuffer: null): void } };
    if (disposed && backend.isWebGLBackend) {
      backend.state.bindFramebuffer(backend.gl.READ_FRAMEBUFFER, null);
      backend.state.bindFramebuffer(backend.gl.DRAW_FRAMEBUFFER, null);
    }
  };
  const clearChains = () => {
    for (const chain of chains.values()) retire(chain);
    chains.clear();
  };
  stage.own({ dispose: () => (clearChains(), disposeRetired(true)) });

  const ratio = () => settings.ratio || deviceRatio();
  const apply = (next: Settings) => {
    const resized = ratio() !== (next.ratio || deviceRatio());
    settings = { ...next };
    // The scene itself: shadows, floor, glass, brushing.
    stage.key.visible = settings.keyShadow;
    unshadowedKey.visible = !settings.keyShadow;
    ground.overlay.visible = settings.bakedShadow;
    Object.assign(floor, FLOORS[settings.floor]);
    crystal.visible = settings.glass === 'transmission';
    crystal.material.transmission = transmission;
    brushing?.set(settings.brushed);
    // A new pixel ratio needs new TRAA nodes: r186's TRAA keeps its history at the old size.
    if (resized || renderer.getPixelRatio() !== ratio()) {
      clearChains();
      renderer.setPixelRatio(ratio());
    }
    const always = new Set(EFFECTS.filter((effect) => settings[effect] === 'always'));
    const whenStill = new Set(EFFECTS.filter((effect) => settings[effect] !== 'off'));
    movingChain = chainFor(always, settings.moving);
    stillChain = chainFor(whenStill, settings.still === 'progressive' ? 'progressive' : settings.moving);
    // Unused chains are dropped, so nothing they own keeps memory.
    for (const [key, chain] of chains) {
      if (chain !== movingChain && chain !== stillChain) {
        retire(chain);
        chains.delete(key);
      }
    }
    moving.outputNode = movingChain.output;
    moving.needsUpdate = true;
    still.outputNode = stillChain.output;
    still.needsUpdate = true;
    stillChain.average?.restart();
  };

  let motion: Motion = 'turning';
  const setMotion = (next: Motion) => {
    motion = next;
    controls.autoRotate = next === 'turning';
    stillChain.average?.restart();
  };
  const setZoom = (next: number) => {
    zoom = next;
    clearChains();
    apply(settings);
  };

  // One frame of the moving chain, or of the still one (shifting the camera while it averages).
  const drawFrame = (which: State) => {
    if (settings.bakedShadow) ground.step(4);
    if (which === 'moving') return moving.render();
    const average = stillChain.average;
    const shift = average?.jittering;
    if (shift) jitter(camera, renderer, average!.frames);
    still.render();
    if (shift) camera.clearViewOffset();
  };

  const moved = moveWatcher(camera);
  let calm = 0; // frames since the view last moved
  let state: State = 'moving';
  let timing = false;
  apply(settings);
  stage.draw(() => {
    if (timing) return;
    calm = moved() ? 0 : calm + 1;
    const average = stillChain.average;
    if (average) average.loop = motion === 'averaging';
    const next: State = calm < 2 ? 'moving' : !average ? 'still' : average.done ? 'settled' : 'averaging';
    if (next !== state) {
      if (next === 'moving' || state === 'moving') average?.restart();
      state = next;
    }
    drawFrame(state);
    frameCount++;
    disposeRetired();
  });

  // Times the moving picture and the still one (while averaging, and once the 32 are in), each
  // with the stage's `timeIt`: frames back to back for the cost, then one at a time.
  const time = async () => {
    timing = true;
    try {
      const finishBake = () => {
        if (settings.bakedShadow) while (!ground.done) ground.step(50);
      };
      const timeState = (which: State, prepare?: () => void) =>
        stage.timeIt({ render: () => drawFrame(which), prepare: () => (finishBake(), prepare?.()) });
      const results: Partial<Record<State, Timing>> = { moving: await timeState('moving') };
      const average = stillChain.average;
      if (!average) results.still = await timeState('still');
      else {
        results.averaging = await timeState('averaging', () => (average.loop = true));
        results.settled = await timeState('settled', () => {
          average.loop = false;
          average.restart();
          for (let i = 0; i < average.maxFrames; i++) stage.step(() => drawFrame('averaging'));
        });
      }
      return results;
    } finally {
      timing = false;
      const average = stillChain.average;
      if (average) {
        average.loop = false;
        average.restart();
      }
    }
  };

  return {
    apply,
    setMotion,
    setZoom,
    settings: () => settings,
    state: () => state,
    time,
    timing: () => timing,
    averaged: () => stillChain.average?.frames ?? 0,
    baking: () => (settings.bakedShadow && !ground.done ? `${ground.frames} of ${ground.total}` : ''),
  };
}

// "moving: TRAA · ambient occlusion · bloom", and the still picture's additions.
export function describe(settings: Settings) {
  const smoothing = { none: 'no smoothing', msaa: 'MSAA ×4', traa: 'TRAA' }[settings.moving];
  const always = EFFECTS.filter((effect) => settings[effect] === 'always').map((effect) => EFFECT_NAMES[effect]);
  const still = EFFECTS.filter((effect) => settings[effect] === 'still').map((effect) => EFFECT_NAMES[effect]);
  const stillSmoothing = settings.still === 'progressive' ? '32 frames averaged' : still.length ? smoothing : 'the moving picture';
  const stillLine = [stillSmoothing, ...still].join(' + ');
  return [`moving: ${[smoothing, ...always].join(' · ')}`, `still: ${stillLine}`];
}
