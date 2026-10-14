import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import * as THREE from 'three/webgpu';
import { costMeter, effectsStage, type EffectsStage } from '../stage';
import { frontSideCrystal } from '../transmission/crystal';
import { drawScene } from '../transmission/draw';
import { softGroundShadow } from './bake';

type Ground = 'baked' | 'live' | 'none';

// The bench with a baked soft shadow added. The key light's own shadow is on only for "live".
function groundShadow(stage: EffectsStage) {
  const { renderer, scene } = stage.harness;
  frontSideCrystal(stage.watch); // the glass page explains why
  // The key light from the left, so its shadow falls to the right where the camera sees it.
  stage.key.position.set(-5, 8, 2);
  // A big soft light where the key light is, about 40° across: the same light, made large.
  const shadow = stage.own(softGroundShadow(renderer, stage.watch, { toward: stage.key.position, cone: 20 }));
  scene.add(shadow.overlay);
  let ground: Ground = 'baked';
  let stepsPerFrame = 4;
  let rebakeWhenDone = false;
  const show = (next: Ground) => {
    ground = next;
    shadow.overlay.visible = next === 'baked';
    // Baked: no shadow map is drawn each frame. Live: the key light draws one every frame.
    stage.key.castShadow = next === 'live';
  };
  drawScene(stage, () => {
    if (ground !== 'baked') return;
    if (shadow.done && rebakeWhenDone) shadow.restart();
    shadow.step(stepsPerFrame);
  });
  return {
    shadow,
    show,
    ground: () => ground,
    setSteps: (steps: number, keepBaking: boolean) => {
      stepsPerFrame = steps;
      rebakeWhenDone = keepBaking;
    },
  };
}

const CODE: Record<Ground, string> = {
  baked: 'shadow.step() until done; key.castShadow = false',
  live: 'key.castShadow = true  (a shadow map every frame)',
  none: 'key.castShadow = false; no baked shadow',
};

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { shadow, show, ground } = groundShadow(stage);
    const home = stage.watch.position.clone();
    let moved = false;
    const shadowButtons = buttonGroup(stage.ui, 'shadow');
    choiceButtons(shadowButtons, [
      { html: 'baked soft', select: () => show('baked') },
      { html: 'live, one light', select: () => show('live') },
      { html: 'none', select: () => show('none') },
    ]);
    const watchButtons = buttonGroup(stage.ui, 'watch');
    choiceButtons(watchButtons, [
      { html: 'shown', select: () => (stage.watch.visible = true) },
      { html: 'just the shadow', select: () => (stage.watch.visible = false) },
    ]);
    const place = buttonGroup(stage.ui, '');
    choiceButtons(place, [
      { html: 'where it was baked', select: () => ((moved = false), stage.watch.position.copy(home)) },
      { html: 'moved', select: () => ((moved = true), stage.watch.position.copy(home).add(new THREE.Vector3(1.4, 0, 0.6))) },
    ]);
    const again = document.createElement('button');
    again.textContent = 'bake again';
    again.addEventListener('click', () => shadow.restart());
    place.append(again);

    stage.harness.onFrame(() => {
      const progress = shadow.done ? `baked: ${shadow.total} directions averaged` : `baking: ${shadow.frames} of ${shadow.total} directions`;
      const verdict =
        ground() === 'baked' && moved && shadow.done && stage.watch.visible
          ? 'The shadow stayed where it was baked: press bake again'
          : ground() === 'live'
            ? 'One light, one direction: a sharper shadow off to one side'
            : '';
      stage.readout.textContent = [CODE[ground()], ground() === 'baked' ? progress : '', verdict].filter(Boolean).join('\n');
    });
  });
};

type Setting = 'live 2048' | 'live 1024' | 'live 2048, radius 6' | 'baking' | 'baked' | 'none';

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { shadow, show, setSteps } = groundShadow(stage);
    let setting: Setting = 'baked';
    const pick = (next: Setting) => () => {
      setting = next;
      const live = next.startsWith('live');
      if (live) {
        stage.setShadowMapSize(next.includes('1024') ? 1024 : 2048);
        stage.key.shadow.radius = next.includes('radius') ? 6 : 1;
      }
      // "baking" keeps baking one direction a frame, starting over when done, so it can be timed.
      setSteps(1, next === 'baking');
      show(live ? 'live' : next === 'none' ? 'none' : 'baked');
    };
    const shadowButtons = buttonGroup(stage.ui, 'shadow');
    choiceButtons(shadowButtons, [
      { html: 'baked', select: pick('baked') },
      { html: 'baking', select: pick('baking') },
      { html: 'live 2048', select: pick('live 2048') },
      { html: 'live 1024', select: pick('live 1024') },
      { html: 'live, soft edges', select: pick('live 2048, radius 6') },
      { html: 'none', select: pick('none') },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => stage.harness.renderer.setPixelRatio(1) },
      { html: '2', select: () => stage.harness.renderer.setPixelRatio(2) },
    ]);
    // "baked" is timed once the bake is finished: what a viewer pays from then on.
    const meter = costMeter(stage, pixels, () => setting, () => {
      if (setting === 'baked') while (!shadow.done) shadow.step(50);
    });

    const code: Record<Setting, string> = {
      'live 2048': 'key.shadow.mapSize.set(2048, 2048)  (watch drawn into it every frame)',
      'live 1024': 'key.shadow.mapSize.set(1024, 1024)',
      'live 2048, radius 6': 'key.shadow.radius = 6  (more samples per pixel)',
      baking: 'shadow.step()  (one direction a frame, over and over)',
      baked: 'the overlay alone: 2 triangles, one texture read',
      none: 'no shadow at all',
    };
    stage.harness.onFrame(() => {
      stage.readout.textContent = [code[setting], ...meter.lines()].join('\n');
    });
  });
};
