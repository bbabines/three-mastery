import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { ssaaPass } from 'three/addons/tsl/display/SSAAPassNode.js';
import { pass } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { costMeter, effectsStage, type EffectsStage } from '../stage';
import { AccumulateNode, jitter, magnify, moveWatcher } from './smoothing';

type Mode = 'none' | 'msaa' | 'progressive' | 'ssaa';
// Where the crown sits in the opening view, across and down: steel edges, the strap's edge, and
// leather grain, none of it behind the glass (which blurs what's under it either way).
const CROWN: [number, number] = [0.63, 0.45];

// Four ways to draw the same frame: plain, multisampled (what `antialias: true` gives), averaged
// over still frames, and supersampled (16 shifted draws, every frame).
function smoothing(stage: EffectsStage) {
  const { scene, camera, renderer } = stage.harness;
  const plain = stage.own(pass(scene, camera, { samples: 0 }));
  const msaa = stage.own(pass(scene, camera, { samples: 4 }));
  const ssaa = stage.own(ssaaPass(scene, camera));
  ssaa.sampleLevel = 4; // 2⁴ = 16 draws
  const average = stage.own(new AccumulateNode(plain.getTextureNode()));
  const sources: Record<Mode, THREE.TextureNode> = {
    none: plain.getTextureNode(),
    msaa: msaa.getTextureNode(),
    progressive: average.getTextureNode(),
    ssaa: ssaa.getTextureNode(),
  };
  const outputs = new Map<string, THREE.Node>();
  const pipeline = stage.own(new THREE.RenderPipeline(renderer));
  const moved = moveWatcher(camera);
  let mode: Mode = 'progressive';

  const show = (next: Mode, zoomed = false) => {
    mode = next;
    const key = `${next}${zoomed ? ' zoomed' : ''}`;
    if (!outputs.has(key)) outputs.set(key, zoomed ? magnify(sources[next], 6, CROWN) : sources[next]);
    pipeline.outputNode = outputs.get(key)!;
    pipeline.needsUpdate = true;
    average.restart();
  };
  const render = () => {
    if (moved()) average.restart();
    const shift = mode === 'progressive' && average.jittering;
    if (shift) jitter(camera, renderer, average.frames);
    pipeline.render();
    if (shift) camera.clearViewOffset();
  };
  stage.draw(render);
  return { show, average, render, mode: () => mode };
}

const CODE: Record<Mode, string> = {
  none: 'pass(scene, camera, { samples: 0 })',
  msaa: 'pass(scene, camera, { samples: 4 })  // what antialias: true gives',
  progressive: 'one shifted frame each frame, averaged, up to 32',
  ssaa: 'ssaaPass(scene, camera)  // sampleLevel 4: 16 shifted draws',
};

function progressLine(average: AccumulateNode) {
  if (average.loop) return `averaging nonstop: frame ${average.frames} of 32, then again`;
  return average.done
    ? '32 frames in: the scene isn\'t drawn again until the view moves'
    : `averaging: frame ${average.frames} of 32 (any move starts over)`;
}

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show, average, mode } = smoothing(stage);
    let current: Mode = 'progressive';
    let zoomed = false;
    const views = buttonGroup(stage.ui, 'smoothing');
    choiceButtons(views, [
      { html: 'progressive', select: () => show((current = 'progressive'), zoomed) },
      { html: 'antialias: true', select: () => show((current = 'msaa'), zoomed) },
      { html: 'none', select: () => show((current = 'none'), zoomed) },
    ]);
    const zoom = buttonGroup(stage.ui, 'view');
    choiceButtons(zoom, [
      { html: 'whole picture', select: () => show(current, (zoomed = false)) },
      { html: 'crown, 6× closer', select: () => show(current, (zoomed = true)) },
    ]);
    stage.harness.onFrame(() => {
      stage.readout.textContent = [CODE[mode()], mode() === 'progressive' ? progressLine(average) : 'the same picture every frame'].join('\n');
    });
  });
};

type CostMode = 'none' | 'msaa' | 'averaging' | 'done' | 'ssaa';
const COST_LABEL: Record<CostMode, string> = {
  none: 'none',
  msaa: 'MSAA ×4',
  averaging: 'averaging',
  done: '32 in',
  ssaa: 'SSAA ×16',
};

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show, average, render } = smoothing(stage);
    let current: CostMode = 'none';
    let ratio = 1;
    const apply = () => {
      if (stage.harness.renderer.getPixelRatio() !== ratio) stage.harness.renderer.setPixelRatio(ratio);
      average.loop = current === 'averaging';
      show(current === 'averaging' || current === 'done' ? 'progressive' : current);
    };
    const pick = (next: CostMode) => () => {
      current = next;
      apply();
    };
    const modes = buttonGroup(stage.ui, 'smoothing');
    choiceButtons(modes, [
      { html: 'none', select: pick('none') },
      { html: 'MSAA ×4', select: pick('msaa') },
      { html: 'progressive, averaging', select: pick('averaging') },
      { html: 'progressive, 32 in', select: pick('done') },
      { html: 'SSAA ×16', select: pick('ssaa') },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => ((ratio = 1), apply()) },
      { html: '2', select: () => ((ratio = 2), apply()) },
    ]);
    // "32 in" is timed once the average is finished, as a still viewer shows it.
    const meter = costMeter(stage, pixels, () => COST_LABEL[current], () => {
      if (current !== 'done') return;
      average.restart();
      for (let i = 0; i < 100 && !average.done; i++) stage.step(render);
    });
    stage.harness.onFrame(() => {
      const code = current === 'averaging' || current === 'done' ? progressLine(average) : CODE[current as Mode];
      stage.readout.textContent = [code, ...meter.lines()].join('\n');
    });
  });
};
