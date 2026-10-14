import { choiceButtons, buttonGroup } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { ssgi } from 'three/addons/tsl/display/SSGINode.js';
import { traa } from 'three/addons/tsl/display/TRAANode.js';
import { add, diffuseColor, mrt, normalView, output, packNormalToRGB, pass, sample, unpackRGBToNormal, vec4, velocity } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { costMeter, effectsStage, type EffectsStage } from '../stage';

type View = 'off' | 'ao' | 'on' | 'bounce';

// The pipeline from the page's code section: one scene pass writing color, surface color,
// normals, and motion, then bounced light, then smoothing over frames (TRAA).
function bouncedLight(stage: EffectsStage) {
  const { scene, camera, renderer } = stage.harness;
  // No MSAA: TRAA smooths the edges itself, and it can't copy a multisampled depth buffer.
  const scenePass = stage.own(pass(scene, camera, { samples: 0 }));
  scenePass.setMRT(mrt({ output, diffuseColor, normal: packNormalToRGB(normalView), velocity }));
  const color = scenePass.getTextureNode('output');
  const surface = scenePass.getTextureNode('diffuseColor');
  const depth = scenePass.getTextureNode('depth');
  const motion = scenePass.getTextureNode('velocity');
  const normalNode = scenePass.getTextureNode('normal');
  // Surface color and normals fit in 8 bits a channel, which halves what they cost to write.
  scenePass.getTexture('diffuseColor').type = THREE.UnsignedByteType;
  scenePass.getTexture('normal').type = THREE.UnsignedByteType;
  const normal = sample((uv) => unpackRGBToNormal(normalNode.sample(uv)));

  const gi = stage.own(ssgi(color, depth, normal, camera));
  // Reach in world units rather than a share of the screen width (the default), sized for a
  // watch about 3 units across. The strength is picked by eye.
  gi.useScreenSpaceSampling.value = false;
  gi.radius.value = 3;
  gi.giIntensity.value = 12;
  gi.thickness.value = 0.3;
  const ao = gi.getAONode();
  const bounce = gi.getGINode();

  const views = {
    off: color,
    ao: vec4(color.rgb.mul(ao), color.a),
    on: vec4(add(color.rgb.mul(ao), surface.rgb.mul(bounce.rgb)), color.a),
    bounce: vec4(bounce.rgb, 1),
  };
  const smoothed = new Map<View, ReturnType<typeof traa>>();
  const pipeline = stage.own(new THREE.RenderPipeline(renderer));

  // Each view gets its own TRAA, so only the passes a view uses are drawn and timed.
  // A new pixel ratio needs new ones: r186's TRAA keeps its history at the old size.
  const resize = (ratio: number) => {
    for (const node of smoothed.values()) node.dispose();
    smoothed.clear();
    renderer.setPixelRatio(ratio);
  };
  const show = (view: View, temporal = true) => {
    gi.useTemporalFiltering = temporal;
    let node = smoothed.get(view);
    if (temporal && !node) {
      node = stage.own(traa(views[view], depth, motion, camera));
      smoothed.set(view, node);
    }
    pipeline.outputNode = temporal ? node! : views[view];
    pipeline.needsUpdate = true;
  };
  stage.draw(() => pipeline.render());
  return { gi, show, resize };
}

const CODE: Record<View, string> = {
  off: 'output = traa(color, …)',
  ao: 'output = traa(color × ao, …)',
  on: 'output = traa(color × ao + surface × bounce, …)',
  bounce: 'output = traa(bounce, …)',
};

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show } = bouncedLight(stage);
    let view: View = 'on';
    const pick = (next: View) => () => {
      view = next;
      show(next);
    };
    const studio = stage.harness.scene.environmentIntensity;
    const room = buttonGroup(stage.ui, 'room');
    choiceButtons(room, [
      { html: 'bright studio', select: () => (stage.harness.scene.environmentIntensity = studio) },
      { html: 'dim room', select: () => (stage.harness.scene.environmentIntensity = 0.12) },
    ]);
    const card = buttonGroup(stage.ui, 'card');
    choiceButtons(card, [
      { html: 'orange', select: () => stage.setCard('orange') },
      { html: 'blue', select: () => stage.setCard('blue') },
      { html: 'none', select: () => stage.setCard('none') },
    ]);
    const views = buttonGroup(stage.ui, 'show');
    choiceButtons(views, [
      { html: 'bounced light', select: pick('on') },
      { html: 'off', select: pick('off') },
      { html: 'darkening only', select: pick('ao') },
      { html: 'just the bounce', select: pick('bounce') },
    ]);
    stage.harness.onFrame(() => {
      stage.readout.textContent = CODE[view];
    });
  });
};

// Low, medium, and high from three.js's own notes on SSGINode, for use with TRAA.
const PRESETS = {
  low: { slices: 1, steps: 12 },
  medium: { slices: 2, steps: 8 },
  high: { slices: 3, steps: 16 },
} as const;

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    stage.setCard('orange');
    const { gi, show, resize } = bouncedLight(stage);
    let on = true;
    let temporal = true;
    let preset: keyof typeof PRESETS = 'medium';
    let ratio = 1;
    const label = () => (on ? `${preset}${temporal ? '' : ', raw'}` : 'off');
    const apply = () => {
      gi.sliceCount.value = PRESETS[preset].slices;
      gi.stepCount.value = PRESETS[preset].steps;
      if (stage.harness.renderer.getPixelRatio() !== ratio) resize(ratio);
      show(on ? 'on' : 'off', temporal);
    };

    const quality = buttonGroup(stage.ui, 'quality');
    choiceButtons(quality, [
      { html: 'medium', select: () => ((preset = 'medium'), (on = true), apply()) },
      { html: 'low', select: () => ((preset = 'low'), (on = true), apply()) },
      { html: 'high', select: () => ((preset = 'high'), (on = true), apply()) },
      { html: 'off', select: () => ((on = false), apply()) },
    ]);
    const frames = buttonGroup(stage.ui, 'frames');
    choiceButtons(frames, [
      { html: 'smoothed over frames', select: () => ((temporal = true), apply()) },
      { html: 'raw, one frame', select: () => ((temporal = false), apply()) },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => ((ratio = 1), apply()) },
      { html: '2', select: () => ((ratio = 2), apply()) },
    ]);
    const meter = costMeter(stage, pixels, label);
    const motion = buttonGroup(stage.ui, '');
    choiceButtons(motion, [
      { html: 'still', select: () => (stage.harness.controls.autoRotate = false) },
      { html: 'turning', select: () => (stage.harness.controls.autoRotate = true) },
    ]);

    stage.harness.onFrame(() => {
      const samples = on ? PRESETS[preset].slices * PRESETS[preset].steps * 2 : 0;
      stage.readout.textContent = [
        on ? `gi.sliceCount = ${PRESETS[preset].slices}; gi.stepCount = ${PRESETS[preset].steps}  (${samples} samples a pixel)` : 'bounced light off',
        ...meter.lines(),
      ].join('\n');
    });
  });
};
