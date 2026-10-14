import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import * as THREE from 'three/webgpu';
import { costMeter, effectsStage, type EffectsStage } from '../stage';
import { crystalOf } from './crystal';
import { drawScene } from './draw';

type Crystal = 'front' | 'double' | 'opacity' | 'none';

// The watch's crystal four ways.
function crystalBench(stage: EffectsStage) {
  const crystal = crystalOf(stage.watch);
  const glass = crystal.material;
  const original = { transmission: glass.transmission, opacity: glass.opacity, transparent: glass.transparent };
  const setCrystal = (mode: Crystal) => {
    crystal.visible = mode !== 'none';
    glass.side = mode === 'double' ? THREE.DoubleSide : THREE.FrontSide;
    glass.transmission = mode === 'opacity' ? 0 : original.transmission;
    glass.opacity = mode === 'opacity' ? 0.3 : original.opacity;
    glass.transparent = original.transparent;
    glass.needsUpdate = true;
  };
  return { setCrystal, glass };
}

const CRYSTAL_CODE: Record<Crystal, string> = {
  front: 'glass.transmission = 1; glass.side = THREE.FrontSide',
  double: 'glass.transmission = 1; glass.side = THREE.DoubleSide  (as loaded)',
  opacity: 'glass.transmission = 0; glass.opacity = 0.3',
  none: 'crystal.visible = false',
};

const COST_LABEL: Record<Crystal, string> = { front: 'one side', double: 'double-sided', opacity: 'opacity only', none: 'none' };

const closeUp = (stage: EffectsStage, distance = 5.2) => {
  const { camera, controls } = stage.harness;
  camera.position.set(0.5, 2.1, distance);
  controls.target.set(-0.1, 1.75, 0);
  controls.update();
};

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    drawScene(stage);
    closeUp(stage);
    const { setCrystal } = crystalBench(stage);
    let mode: Crystal = 'front';
    const crystal = buttonGroup(stage.ui, 'crystal');
    choiceButtons(crystal, [
      { html: 'transmission, one side', select: () => setCrystal((mode = 'front')) },
      { html: 'double-sided, as loaded', select: () => setCrystal((mode = 'double')) },
      { html: 'opacity 0.3', select: () => setCrystal((mode = 'opacity')) },
      { html: 'none', select: () => setCrystal((mode = 'none')) },
    ]);
    stage.harness.onFrame(() => {
      const verdict =
        mode === 'double'
          ? 'Its own back faces go into the copy: a hazier, paler dial'
          : mode === 'opacity'
            ? 'A gray film: the dial fades, the reflections fade with it'
            : mode === 'front'
              ? 'A clear dial under full-strength reflections'
              : '';
      stage.readout.textContent = [CRYSTAL_CODE[mode], verdict].filter(Boolean).join('\n');
    });
  });
};

// A glass ball in front of the dial, with what's between them switchable.
export const lens: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    drawScene(stage);
    closeUp(stage, 6);
    const { scene } = stage.harness;
    const ball = new THREE.Mesh(
      stage.own(new THREE.SphereGeometry(0.55, 64, 32)),
      stage.own(new THREE.MeshPhysicalMaterial({ transmission: 1, roughness: 0, metalness: 0, ior: 1.5, thickness: 1.1 })),
    );
    ball.position.set(0.15, 1.75, 2.4);
    const pane = new THREE.Mesh(
      stage.own(new THREE.BoxGeometry(1.1, 1.6, 0.04)),
      stage.own(new THREE.MeshPhysicalMaterial({ transmission: 1, roughness: 0, ior: 1.5, thickness: 0.04, color: 0xbfe8ff })),
    );
    const sheet = new THREE.Mesh(
      stage.own(new THREE.PlaneGeometry(1.1, 1.6)),
      stage.own(new THREE.MeshBasicMaterial({ color: 0xff3020, transparent: true, opacity: 0.5, depthWrite: false })),
    );
    pane.position.set(0.15, 1.75, 1.6);
    sheet.position.copy(pane.position);
    scene.add(ball, pane, sheet);
    const material = ball.material;
    const state = { ior: 1.5, thickness: 1.1, tint: false, behind: 'nothing' as 'nothing' | 'pane' | 'sheet' };
    const apply = () => {
      material.ior = state.ior;
      material.thickness = state.thickness;
      material.attenuationColor.set(state.tint ? 0x2fa060 : 0xffffff);
      material.attenuationDistance = state.tint ? 0.6 : Infinity;
      pane.visible = state.behind === 'pane';
      sheet.visible = state.behind === 'sheet';
    };
    const ior = buttonGroup(stage.ui, 'ior');
    choiceButtons(ior, [
      { html: '1.5 glass', select: () => ((state.ior = 1.5), apply()) },
      { html: '1.0 air', select: () => ((state.ior = 1), apply()) },
      { html: '2.4 diamond', select: () => ((state.ior = 2.4), apply()) },
    ]);
    const thickness = buttonGroup(stage.ui, 'thickness');
    choiceButtons(thickness, [
      { html: '1.1 (the ball)', select: () => ((state.thickness = 1.1), apply()) },
      { html: '0 (thin shell)', select: () => ((state.thickness = 0), apply()) },
      { html: '3', select: () => ((state.thickness = 3), apply()) },
    ]);
    const tint = buttonGroup(stage.ui, 'tint');
    choiceButtons(tint, [
      { html: 'clear', select: () => ((state.tint = false), apply()) },
      { html: 'green, by depth', select: () => ((state.tint = true), apply()) },
    ]);
    const behind = buttonGroup(stage.ui, 'between');
    choiceButtons(behind, [
      { html: 'nothing', select: () => ((state.behind = 'nothing'), apply()) },
      { html: 'a glass pane', select: () => ((state.behind = 'pane'), apply()) },
      { html: 'a see-through red sheet', select: () => ((state.behind = 'sheet'), apply()) },
    ]);
    // The watch's own crystal is glass too, and it's the farthest: the copy is taken when it's drawn.
    const crystal = crystalOf(stage.watch);
    crystal.material.side = THREE.FrontSide;
    const watchGlass = buttonGroup(stage.ui, "watch's crystal");
    choiceButtons(watchGlass, [
      { html: 'on', select: () => (crystal.visible = true) },
      { html: 'off', select: () => (crystal.visible = false) },
    ]);
    stage.harness.onFrame(() => {
      const code = `ball.ior = ${state.ior}; ball.thickness = ${state.thickness}${state.tint ? '; attenuationColor = green' : ''}`;
      const verdict =
        state.behind === 'nothing'
          ? ''
          : crystal.visible
            ? 'Missing in the ball: the copy was taken when the farthest glass, the crystal, was drawn'
            : state.behind === 'sheet'
              ? 'There: the sheet was drawn before the first glass'
              : 'Missing: the pane is the first glass, and the copy is taken just before it';
      stage.readout.textContent = [code, verdict].filter(Boolean).join('\n');
    });
  });
};

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    drawScene(stage);
    closeUp(stage, 4.2);
    const { setCrystal } = crystalBench(stage);
    let mode: Crystal = 'front';
    const pick = (next: Crystal) => () => setCrystal((mode = next));
    const crystal = buttonGroup(stage.ui, 'crystal');
    choiceButtons(crystal, [
      { html: 'one side', select: pick('front') },
      { html: 'double-sided', select: pick('double') },
      { html: 'opacity only', select: pick('opacity') },
      { html: 'none', select: pick('none') },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => stage.harness.renderer.setPixelRatio(1) },
      { html: '2', select: () => stage.harness.renderer.setPixelRatio(2) },
    ]);
    const meter = costMeter(stage, pixels, () => COST_LABEL[mode]);
    stage.harness.onFrame(() => {
      stage.readout.textContent = [CRYSTAL_CODE[mode], ...meter.lines()].join('\n');
    });
  });
};
