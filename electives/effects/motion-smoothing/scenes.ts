import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { traa } from 'three/addons/tsl/display/TRAANode.js';
import { abs, mrt, output, pass, vec4, velocity } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { AccumulateNode, magnify } from '../progressive/smoothing';
import { costMeter, effectsStage, type EffectsStage } from '../stage';

type Mode = 'traa' | 'msaa' | 'none' | 'blend' | 'motion';
const CROWN: [number, number] = [0.63, 0.45];

// Ways to smooth a moving picture. TRAA shifts the camera by part of a pixel each frame and blends
// the new frame into the last ones, moving the old ones along each pixel's motion first (the
// motion buffer). 'blend' is the same blending without the motion buffer, as WebGL's
// TAARenderPass does, which smears anything that moves.
function smoothing(stage: EffectsStage) {
  const { scene, camera, renderer } = stage.harness;
  // samples: 0, always: TRAA can't copy a multisampled depth buffer (WebGPU reports a sample-count
  // mismatch every frame), and its shifted frames already cover what MSAA would.
  const scenePass = stage.own(pass(scene, camera, { samples: 0 }));
  scenePass.setMRT(mrt({ output, velocity }));
  const color = scenePass.getTextureNode('output');
  const depth = scenePass.getTextureNode('depth');
  const motion = scenePass.getTextureNode('velocity');
  const msaa = stage.own(pass(scene, camera, { samples: 4 }));
  const blended = stage.own(new AccumulateNode(color));
  blended.mode = 'blend';
  blended.blendWeight = 0.1;

  const pipeline = stage.own(new THREE.RenderPipeline(renderer));
  const outputs = new Map<string, THREE.Node>();
  let smoothed: ReturnType<typeof traa> | null = null;
  const source = (mode: Mode): THREE.TextureNode => {
    if (mode === 'traa') {
      smoothed ??= stage.own(traa(color, depth, motion, camera));
      return (smoothed as unknown as { getTextureNode(): THREE.TextureNode }).getTextureNode();
    }
    if (mode === 'msaa') return msaa.getTextureNode();
    if (mode === 'blend') return blended.getTextureNode();
    return color;
  };
  let current: Mode = 'traa';
  let zoomed = false;
  const show = (mode = current, zoom = zoomed) => {
    current = mode;
    zoomed = zoom;
    const key = `${mode}${zoom ? ' zoomed' : ''}`;
    if (!outputs.has(key)) {
      // The motion buffer: how far each pixel moved since the last frame, sideways in red,
      // up and down in green, strengthened so small moves show.
      const picture = mode === 'motion' ? vec4(abs(motion.xy).mul(40), 0, 1) : source(mode);
      outputs.set(key, zoom && mode !== 'motion' ? magnify(picture as THREE.TextureNode, 6, CROWN) : picture);
    }
    pipeline.outputNode = outputs.get(key)!;
    pipeline.outputColorTransform = mode !== 'motion';
    pipeline.needsUpdate = true;
    blended.restart();
  };
  // A new pixel ratio needs a new TRAA node: r186's TRAA keeps its history at the old size.
  const resize = (ratio: number) => {
    smoothed?.dispose();
    smoothed = null;
    outputs.clear();
    renderer.setPixelRatio(ratio);
  };
  stage.draw(() => pipeline.render());
  return { show, resize };
}

const CODE: Record<Mode, string> = {
  traa: 'traa(color, depth, velocity, camera)  // pass samples: 0',
  msaa: 'pass(scene, camera, { samples: 4 })  // what antialias: true gives',
  none: 'pass(scene, camera, { samples: 0 })',
  blend: 'new frame × 0.1 + last frames × 0.9, not following motion',
  motion: 'the motion buffer: red sideways, green up and down',
};

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show } = smoothing(stage);
    const { controls } = stage.harness;
    controls.autoRotateSpeed = 6;
    let mode: Mode = 'traa';
    const motion = buttonGroup(stage.ui, '');
    choiceButtons(motion, [
      { html: 'turning', select: () => (controls.autoRotate = true) },
      { html: 'still', select: () => (controls.autoRotate = false) },
    ]);
    const zoom = buttonGroup(stage.ui, 'view');
    choiceButtons(zoom, [
      { html: 'whole picture', select: () => show(undefined, false) },
      { html: '6× closer', select: () => show(undefined, true) },
    ]);
    const modes = buttonGroup(stage.ui, 'smoothing');
    choiceButtons(modes, [
      { html: 'TRAA', select: () => show((mode = 'traa')) },
      { html: 'antialias: true', select: () => show((mode = 'msaa')) },
      { html: 'none', select: () => show((mode = 'none')) },
      { html: 'blend, no motion buffer', select: () => show((mode = 'blend')) },
      { html: 'the motion buffer', select: () => show((mode = 'motion')) },
    ]);
    stage.harness.onFrame(() => {
      stage.readout.textContent = [CODE[mode], controls.autoRotate ? 'turning: the camera circles the watch' : 'still'].join('\n');
    });
  });
};

type CostMode = 'none' | 'msaa' | 'traa';
const COST_LABEL: Record<CostMode, string> = { none: 'none', msaa: 'MSAA ×4', traa: 'TRAA' };

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show, resize } = smoothing(stage);
    let mode: CostMode = 'traa';
    let ratio = 1;
    const apply = () => {
      if (stage.harness.renderer.getPixelRatio() !== ratio) resize(ratio);
      show(mode, false);
    };
    const modes = buttonGroup(stage.ui, 'smoothing');
    choiceButtons(modes, [
      { html: 'TRAA', select: () => ((mode = 'traa'), apply()) },
      { html: 'MSAA ×4', select: () => ((mode = 'msaa'), apply()) },
      { html: 'none', select: () => ((mode = 'none'), apply()) },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => ((ratio = 1), apply()) },
      { html: '2', select: () => ((ratio = 2), apply()) },
    ]);
    const meter = costMeter(stage, pixels, () => COST_LABEL[mode]);
    stage.harness.onFrame(() => {
      stage.readout.textContent = [CODE[mode], ...meter.lines()].join('\n');
    });
  });
};
