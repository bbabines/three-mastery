import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { sss } from 'three/addons/tsl/display/SSSNode.js';
import { traa } from 'three/addons/tsl/display/TRAANode.js';
import { builtinShadowContext, mrt, output, pass, screenUV, vec3, vec4, velocity } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { costMeter, effectsStage, type EffectsStage } from '../stage';

type View = 'on' | 'off' | 'buffer';

// Contact shadows (screen-space shadows, SSSNode): from every pixel, step a short way toward the
// key light through the depth buffer; if something on screen is in the way, that pixel is in
// shadow. A depth pre-pass comes first, so the result can go into the key light's own shadow
// inside each material's lighting (builtinShadowContext), as three.js's example does.
function contactShadows(stage: EffectsStage) {
  const { scene, camera, renderer } = stage.harness;
  const pre = stage.own(pass(scene, camera, { samples: 0 }));
  pre.transparent = false; // the glass doesn't block the light here
  pre.setMRT(mrt({ output: velocity }));
  const depth = pre.getTextureNode('depth');
  const motion = pre.getTextureNode('output');

  const contact = stage.own(sss(depth, camera, stage.key));
  contact.maxDistance.value = 0.15; // how far each pixel looks toward the light, in world units
  contact.thickness.value = 0.02;
  contact.quality.value = 0.5;
  contact.useTemporalFiltering = true; // a different start each frame, smoothed by TRAA

  const shaded = stage.own(pass(scene, camera, { samples: 0 }));
  shaded.contextNode = builtinShadowContext(contact.getTextureNode().sample(screenUV).r, stage.key);
  // Off is truly off: one scene pass with its own depth and motion, no pre-pass, no march.
  const plain = stage.own(pass(scene, camera, { samples: 0 }));
  plain.setMRT(mrt({ output, velocity }));

  const views: Record<View, () => ReturnType<typeof traa>> = {
    on: () => traa(shaded, depth, motion, camera),
    off: () => traa(plain.getTextureNode('output'), plain.getTextureNode('depth'), plain.getTextureNode('velocity'), camera),
    buffer: () => traa(vec4(vec3(contact.getTextureNode().r), 1), depth, motion, camera),
  };
  const pipeline = stage.own(new THREE.RenderPipeline(renderer));
  const smoothed = new Map<View, ReturnType<typeof traa>>();
  // A new pixel ratio needs new TRAA nodes: r186's TRAA keeps its history at the old size.
  const resize = (ratio: number) => {
    for (const node of smoothed.values()) node.dispose();
    smoothed.clear();
    renderer.setPixelRatio(ratio);
  };
  const show = (view: View) => {
    if (!smoothed.has(view)) smoothed.set(view, stage.own(views[view]()));
    pipeline.outputNode = smoothed.get(view)!;
    pipeline.outputColorTransform = view !== 'buffer'; // the buffer's own values: 1 white, 0 black
    pipeline.needsUpdate = true;
  };
  stage.draw(() => pipeline.render());
  return { contact, show, resize };
}

const CODE: Record<View, string> = {
  on: 'shadow map × contact shadows (builtinShadowContext)',
  off: 'shadow map only',
  buffer: 'contact shadows alone: black is shadowed',
};

// The opening view, and a close look at where the strap meets the floor and the case meets the strap.
const FRAMINGS = {
  whole: { position: [3.2, 4.2, 12.5], target: [-0.5, 1.1, 0] },
  close: { position: [2.6, 1.4, 5.2], target: [0.1, 0.5, 0.3] },
} as const;

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show } = contactShadows(stage);
    const { camera, controls } = stage.harness;
    const { key } = stage;
    let view: View = 'on';
    const frame = (framing: keyof typeof FRAMINGS) => {
      camera.position.fromArray(FRAMINGS[framing].position);
      controls.target.fromArray(FRAMINGS[framing].target);
      controls.update();
    };
    const studio = stage.harness.scene.environmentIntensity;
    const room = buttonGroup(stage.ui, 'light');
    choiceButtons(room, [
      { html: 'key light only', select: () => (stage.harness.scene.environmentIntensity = 0.1) },
      { html: 'studio', select: () => (stage.harness.scene.environmentIntensity = studio) },
    ]);
    const framing = buttonGroup(stage.ui, 'view');
    choiceButtons(framing, [
      { html: 'close up', select: () => frame('close') },
      { html: 'whole watch', select: () => frame('whole') },
    ]);
    const sizes = buttonGroup(stage.ui, 'shadow map');
    choiceButtons(sizes, [
      { html: '2048', select: () => stage.setShadowMapSize(2048) },
      { html: '512', select: () => stage.setShadowMapSize(512) },
      { html: '4096', select: () => stage.setShadowMapSize(4096) },
    ]);
    let fitted = true;
    const box = buttonGroup(stage.ui, 'shadow camera');
    choiceButtons(box, [
      { html: 'fitted', select: () => stage.setShadowFit((fitted = true)) },
      { html: 'three.js default', select: () => stage.setShadowFit((fitted = false)) },
    ]);
    const views = buttonGroup(stage.ui, 'show');
    choiceButtons(views, [
      { html: 'contact shadows on', select: () => show((view = 'on')) },
      { html: 'shadow map only', select: () => show((view = 'off')) },
      { html: 'contact shadows alone', select: () => show((view = 'buffer')) },
    ]);
    stage.harness.onFrame(() => {
      const size = key.shadow.mapSize.x;
      const { near, far } = key.shadow.camera;
      stage.readout.textContent = [
        CODE[view],
        `key.shadow.mapSize.set(${size}, ${size})`,
        `shadow camera ${fitted ? 'fitted' : 'default'}: near ${near.toFixed(1)}, far ${far.toFixed(1)}; bias moves the shadow ${stage.shadowBiasDistance().toFixed(3)} units`,
      ].join('\n');
    });
  });
};

const QUALITIES = { low: 0.25, medium: 0.5, high: 1 } as const;
type Quality = keyof typeof QUALITIES;
const REACH = { short: 0.15, long: 0.6 } as const;
type Reach = keyof typeof REACH;

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { contact, show, resize } = contactShadows(stage);
    const { key } = stage;
    let on = true;
    let quality: Quality = 'medium';
    let reach: Reach = 'short';
    let mapSize = 2048;
    let ratio = 1;
    const label = () => `${on ? `${quality} ${reach}` : 'off'}, map ${mapSize}`;
    const apply = () => {
      contact.quality.value = QUALITIES[quality];
      contact.maxDistance.value = REACH[reach];
      stage.setShadowMapSize(mapSize);
      if (stage.harness.renderer.getPixelRatio() !== ratio) resize(ratio);
      show(on ? 'on' : 'off');
    };
    const qualities = buttonGroup(stage.ui, 'contact shadows');
    choiceButtons(qualities, [
      { html: 'medium', select: () => ((quality = 'medium'), (on = true), apply()) },
      { html: 'low', select: () => ((quality = 'low'), (on = true), apply()) },
      { html: 'high', select: () => ((quality = 'high'), (on = true), apply()) },
      { html: 'off', select: () => ((on = false), apply()) },
    ]);
    const reaches = buttonGroup(stage.ui, 'reach');
    choiceButtons(reaches, [
      { html: `${REACH.short}`, select: () => ((reach = 'short'), apply()) },
      { html: `${REACH.long}`, select: () => ((reach = 'long'), apply()) },
    ]);
    const sizes = buttonGroup(stage.ui, 'shadow map');
    choiceButtons(sizes, [
      { html: '2048', select: () => ((mapSize = 2048), apply()) },
      { html: '4096', select: () => ((mapSize = 4096), apply()) },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => ((ratio = 1), apply()) },
      { html: '2', select: () => ((ratio = 2), apply()) },
    ]);
    const meter = costMeter(stage, pixels, label);
    stage.harness.onFrame(() => {
      stage.readout.textContent = [
        on ? `sss.quality.value = ${QUALITIES[quality]}; sss.maxDistance.value = ${REACH[reach]}` : 'contact shadows off: no pre-pass, no march',
        ...meter.lines(),
      ].join('\n');
    });
  });
};
