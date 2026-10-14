import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { ao } from 'three/addons/tsl/display/GTAONode.js';
import { traa } from 'three/addons/tsl/display/TRAANode.js';
import { builtinAOContext, mrt, normalView, output, packNormalToRGB, pass, sample, screenUV, unpackRGBToNormal, vec3, vec4, velocity } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { costMeter, effectsStage, type EffectsStage } from '../stage';

type View = 'off' | 'environment' | 'everything' | 'buffer';

export const STRENGTHS = {
  subtle: { radius: 0.5, scale: 1.5 },
  strong: { radius: 2, scale: 4 },
} as const;
type Strength = keyof typeof STRENGTHS;

// Ambient occlusion (GTAO) two ways, each smoothed over frames (TRAA):
//   environment: a pre-pass draws normals and depth, the darkening is worked out from them, and the
//                scene is drawn again with it applied to environment light only (builtinAOContext).
//   everything:  one scene draw writes color, normals, and depth; the darkening multiplies the
//                finished picture, key light and all. What WebGL's GTAOPass does.
function occlusion(stage: EffectsStage) {
  const { scene, camera, renderer } = stage.harness;

  // One draw: color, normals, motion.
  const plain = stage.own(pass(scene, camera, { samples: 0 }));
  plain.setMRT(mrt({ output, normal: packNormalToRGB(normalView), velocity }));
  plain.getTexture('normal').type = THREE.UnsignedByteType;
  const plainColor = plain.getTextureNode('output');
  const plainDepth = plain.getTextureNode('depth');
  const plainMotion = plain.getTextureNode('velocity');
  const plainNormalTexture = plain.getTextureNode('normal');
  const plainNormal = sample((uv) => unpackRGBToNormal(plainNormalTexture.sample(uv)));
  const after = stage.own(ao(plainDepth, plainNormal, camera));

  // A pre-pass for normals, depth, and motion, then the scene with the darkening inside its lighting.
  const pre = stage.own(pass(scene, camera, { samples: 0 }));
  pre.transparent = false;
  pre.setMRT(mrt({ output: packNormalToRGB(normalView), velocity }));
  pre.getTexture('output').type = THREE.UnsignedByteType;
  const preNormalTexture = pre.getTextureNode();
  const preNormal = sample((uv) => unpackRGBToNormal(preNormalTexture.sample(uv)));
  const preDepth = pre.getTextureNode('depth');
  const preMotion = pre.getTextureNode('velocity');
  const inside = stage.own(ao(preDepth, preNormal, camera));
  const lit = stage.own(pass(scene, camera, { samples: 0 }));
  lit.contextNode = builtinAOContext(inside.getTextureNode().sample(screenUV).r);

  const both = [after, inside];
  for (const node of both) {
    node.resolutionScale = 1;
    // Full size: at half size (three.js's suggestion) the grain on the watch shows through TRAA.
    node.useTemporalFiltering = true; // a different pattern each frame, smoothed by TRAA
  }

  const pipeline = stage.own(new THREE.RenderPipeline(renderer));
  const smoothed = new Map<View, ReturnType<typeof traa>>();
  const build: Record<View, () => ReturnType<typeof traa>> = {
    off: () => traa(plainColor, plainDepth, plainMotion, camera),
    everything: () => traa(vec4(plainColor.rgb.mul(after.getTextureNode().r), plainColor.a), plainDepth, plainMotion, camera),
    environment: () => traa(lit, preDepth, preMotion, camera),
    buffer: () => traa(vec4(vec3(inside.getTextureNode().r), 1), preDepth, preMotion, camera),
  };
  // A new pixel ratio needs new TRAA nodes: r186's TRAA keeps its history at the old size.
  const resize = (ratio: number) => {
    for (const node of smoothed.values()) node.dispose();
    smoothed.clear();
    renderer.setPixelRatio(ratio);
  };
  const show = (view: View) => {
    if (!smoothed.has(view)) {
      const node = build[view]() as ReturnType<typeof traa>;
      // Leans harder on past frames when still, which calms the darkening's grain (as three.js's
      // own GTAO example sets it).
      node.useSubpixelCorrection = false;
      smoothed.set(view, stage.own(node));
    }
    pipeline.outputNode = smoothed.get(view)!;
    // The darkening's own values, untouched by tone mapping: 1 shows white, 0.5 middle gray.
    pipeline.outputColorTransform = view !== 'buffer';
    pipeline.needsUpdate = true;
  };
  const setStrength = (strength: Strength) => {
    for (const node of both) {
      node.radius.value = STRENGTHS[strength].radius;
      node.scale.value = STRENGTHS[strength].scale;
    }
  };
  stage.draw(() => pipeline.render());
  return { show, resize, setStrength, both };
}

const CODE: Record<View, string> = {
  off: 'no ambient occlusion',
  environment: 'scenePass.contextNode = builtinAOContext(ao…r)  // environment light only',
  everything: 'color × ao  // the whole picture, key light too',
  buffer: 'the darkening alone: white is open, black is hidden',
};

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show, setStrength } = occlusion(stage);
    const { key } = stage;
    const keyIntensity = key.intensity;
    let strength: Strength = 'subtle';
    let view: View = 'environment';
    const light = buttonGroup(stage.ui, 'key light');
    choiceButtons(light, [
      { html: 'right', select: () => (key.position.set(4, 7, 5), (key.intensity = keyIntensity)) },
      { html: 'left', select: () => (key.position.set(-6, 5, 3), (key.intensity = keyIntensity)) },
      { html: 'off', select: () => (key.intensity = 0) },
    ]);
    const strengths = buttonGroup(stage.ui, 'strength');
    choiceButtons(strengths, [
      { html: 'subtle', select: () => setStrength((strength = 'subtle')) },
      { html: 'strong', select: () => setStrength((strength = 'strong')) },
    ]);
    const views = buttonGroup(stage.ui, 'show');
    choiceButtons(views, [
      { html: 'environment only', select: () => show((view = 'environment')) },
      { html: 'off', select: () => show((view = 'off')) },
      { html: 'whole picture', select: () => show((view = 'everything')) },
      { html: 'the darkening alone', select: () => show((view = 'buffer')) },
    ]);
    stage.harness.onFrame(() => {
      const { radius, scale } = STRENGTHS[strength];
      stage.readout.textContent = [CODE[view], view === 'off' ? '' : `ao.radius = ${radius}; ao.scale = ${scale}`].filter(Boolean).join('\n');
    });
  });
};

const SAMPLES = [8, 16, 32] as const;

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show, resize, setStrength, both } = occlusion(stage);
    setStrength('subtle');
    let view: View = 'environment';
    let samples: (typeof SAMPLES)[number] = 16;
    let half = false;
    let ratio = 1;
    const label = () =>
      view === 'off' ? 'off' : `${view === 'environment' ? 'env only' : 'whole'} ${samples}${half ? ' half' : ''}`;
    const apply = () => {
      for (const node of both) {
        node.samples.value = samples; // rebuilds its shader
        node.resolutionScale = half ? 0.5 : 1;
      }
      if (stage.harness.renderer.getPixelRatio() !== ratio) resize(ratio);
      show(view);
    };
    const routes = buttonGroup(stage.ui, 'route');
    choiceButtons(routes, [
      { html: 'environment only', select: () => ((view = 'environment'), apply()) },
      { html: 'whole picture', select: () => ((view = 'everything'), apply()) },
      { html: 'off', select: () => ((view = 'off'), apply()) },
    ]);
    const counts = buttonGroup(stage.ui, 'samples');
    choiceButtons(counts, [
      { html: '16', select: () => ((samples = 16), apply()) },
      { html: '8', select: () => ((samples = 8), apply()) },
      { html: '32', select: () => ((samples = 32), apply()) },
    ]);
    const resolution = buttonGroup(stage.ui, 'worked out at');
    choiceButtons(resolution, [
      { html: 'full size', select: () => ((half = false), apply()) },
      { html: 'half size', select: () => ((half = true), apply()) },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => ((ratio = 1), apply()) },
      { html: '2', select: () => ((ratio = 2), apply()) },
    ]);
    const meter = costMeter(stage, pixels, label);
    stage.harness.onFrame(() => {
      stage.readout.textContent = [
        view === 'off' ? 'no ambient occlusion' : `ao.samples.value = ${samples}; ao.resolutionScale = ${half ? 0.5 : 1}`,
        ...meter.lines(),
      ].join('\n');
    });
  });
};
