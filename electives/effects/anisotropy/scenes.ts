import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import * as THREE from 'three/webgpu';
import { costMeter, effectsStage, type EffectsStage } from '../stage';
import { frontSideCrystal } from '../transmission/crystal';
import { drawScene } from '../transmission/draw';
import { circularDirectionMap, restoreWatchBrushing, streakColorMap } from './brushed';

// A close view of the dial with the brushing the file saves, on or off, and a light to sweep.
export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    frontSideCrystal(stage.watch); // the glass page explains why
    drawScene(stage);
    const { camera, controls } = stage.harness;
    camera.position.set(0.6, 2.2, 5.2);
    controls.target.set(-0.1, 1.75, 0);
    controls.update();
    let on = true;
    let sweep = true;
    let angle = 0;
    restoreWatchBrushing(stage.watch).then((brushing) => {
      stage.own(brushing);
      const finish = buttonGroup(stage.ui, 'brushing');
      choiceButtons(finish, [
        { html: "the file's, restored", select: () => ((on = true), brushing.set(true)) },
        { html: 'off, as GLTFLoader loads it', select: () => ((on = false), brushing.set(false)) },
      ]);
      const light = buttonGroup(stage.ui, 'light');
      choiceButtons(light, [
        { html: 'sweeping', select: () => (sweep = true) },
        { html: 'still', select: () => (sweep = false) },
      ]);
    });
    stage.key.intensity = 4;
    stage.harness.onFrame((delta) => {
      if (sweep) angle += delta * 0.8;
      stage.key.position.set(Math.sin(angle) * 6, 5, Math.abs(Math.cos(angle)) * 6 + 1);
      stage.readout.textContent = [
        on ? 'dial.anisotropy = 1; dial.anisotropyMap = directions' : 'dial.anisotropy = 0',
        on ? 'A sunburst: light and dark wedges that turn as the light moves' : 'An even dial: no wedges',
      ].join('\n');
    });
  });
};

type Finish = 'anisotropy' | 'off' | 'painted';
type Layout = 'straight' | 'rotated' | 'spun' | 'sunburst' | 'no-uv';

// A brushed test disc in front of the watch, with every way to set the direction.
function testDisc(stage: EffectsStage) {
  const geometry = stage.own(new THREE.CircleGeometry(1.3, 128));
  const noUv = stage.own(geometry.clone());
  noUv.deleteAttribute('uv');
  const streaks = stage.own(streakColorMap());
  // The highlight stretches across the grooves. Spun metal's grooves circle the center, so it
  // stretches out from the center; a sunburst's run out from it, so it stretches around.
  const spun = stage.own(circularDirectionMap(512, true));
  const sunburst = stage.own(circularDirectionMap(512, false));
  const material = stage.own(new THREE.MeshPhysicalMaterial({ color: 0xd0d0d0, metalness: 1, roughness: 0.3 }));
  const disc = new THREE.Mesh(geometry, material);
  disc.position.set(0, 1.6, 0);
  stage.harness.scene.add(disc);
  // A dark room and one small lamp in front of the disc: a flat mirror-like disc only shows a
  // highlight's shape when the light is close, so its direction changes across the disc.
  const { scene, controls, camera } = stage.harness;
  stage.watch.visible = false;
  stage.ground.visible = false;
  stage.key.intensity = 0;
  scene.background = new THREE.Color(0x1d1f24);
  scene.environmentIntensity = 0.12;
  const lamp = new THREE.PointLight(0xffffff, 6, 0, 2);
  scene.add(lamp);
  stage.own({ dispose: () => lamp.dispose() });
  controls.target.set(0, 1.6, 0);
  camera.position.set(0, 1.6, 6.5);
  controls.update();
  let angle = 0;
  stage.harness.onFrame((delta) => {
    angle += delta * 0.7;
    lamp.position.set(Math.sin(angle) * 0.9, 1.6 + Math.cos(angle * 1.3) * 0.7, 1.1);
  });

  const state = { finish: 'anisotropy' as Finish, layout: 'straight' as Layout, strength: 0.8 };
  const apply = () => {
    const brushed = state.finish === 'anisotropy';
    material.anisotropy = brushed ? state.strength : 0;
    material.map = state.finish === 'painted' ? streaks : null;
    material.anisotropyRotation = state.layout === 'rotated' ? Math.PI / 2 : 0;
    material.anisotropyMap = !brushed ? null : state.layout === 'spun' ? spun : state.layout === 'sunburst' ? sunburst : null;
    disc.geometry = state.layout === 'no-uv' ? noUv : geometry;
    material.needsUpdate = true;
  };
  return { state, apply, material, disc };
}

const LAYOUT_CODE: Record<Layout, string> = {
  straight: 'anisotropyRotation = 0  (along the UVs\' u)',
  rotated: 'anisotropyRotation = Math.PI / 2',
  spun: 'anisotropyMap = directions out from the center  (grooves in circles)',
  sunburst: 'anisotropyMap = directions around the center  (grooves out from it)',
  'no-uv': "geometry.deleteAttribute('uv')  (no UVs, no tangents)",
};

export const direction: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    drawScene(stage);
    const { state, apply } = testDisc(stage);
    const finish = buttonGroup(stage.ui, 'finish');
    choiceButtons(finish, [
      { html: 'anisotropy 0.8', select: () => ((state.finish = 'anisotropy'), apply()) },
      { html: 'brushed color map only', select: () => ((state.finish = 'painted'), apply()) },
      { html: 'plain polished', select: () => ((state.finish = 'off'), apply()) },
    ]);
    const layout = buttonGroup(stage.ui, 'direction');
    choiceButtons(layout, [
      { html: 'along u', select: () => ((state.layout = 'straight'), apply()) },
      { html: 'turned 90°', select: () => ((state.layout = 'rotated'), apply()) },
      { html: 'spun', select: () => ((state.layout = 'spun'), apply()) },
      { html: 'sunburst', select: () => ((state.layout = 'sunburst'), apply()) },
      { html: 'no UVs', select: () => ((state.layout = 'no-uv'), apply()) },
    ]);
    stage.harness.onFrame(() => {
      const code =
        state.finish === 'anisotropy'
          ? `anisotropy = 0.8; ${LAYOUT_CODE[state.layout]}`
          : state.finish === 'painted'
            ? 'map = streaks; anisotropy = 0'
            : 'anisotropy = 0';
      stage.readout.textContent = code;
    });
  });
};

type Setting = 'standard' | 'physical 0' | 'anisotropy' | 'anisotropy + map';

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    drawScene(stage);
    const { state, apply, disc } = testDisc(stage);
    // Close enough that the disc fills the picture: the cost is per pixel of the brushed part.
    stage.harness.camera.position.set(0, 1.6, 3.05);
    stage.harness.controls.update();
    const standard = stage.own(new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 1, roughness: 0.3 }));
    const physical = disc.material as THREE.MeshPhysicalMaterial;
    let setting: Setting = 'anisotropy';
    const pick = (next: Setting) => () => {
      setting = next;
      (disc as THREE.Mesh).material = next === 'standard' ? standard : physical;
      state.finish = next === 'standard' || next === 'physical 0' ? 'off' : 'anisotropy';
      state.layout = next === 'anisotropy + map' ? 'spun' : 'straight';
      apply();
    };
    const finish = buttonGroup(stage.ui, 'material');
    choiceButtons(finish, [
      { html: 'anisotropy', select: pick('anisotropy') },
      { html: 'anisotropy + map', select: pick('anisotropy + map') },
      { html: 'physical, 0', select: pick('physical 0') },
      { html: 'standard', select: pick('standard') },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => stage.harness.renderer.setPixelRatio(1) },
      { html: '2', select: () => stage.harness.renderer.setPixelRatio(2) },
    ]);
    const meter = costMeter(stage, pixels, () => setting);
    const code: Record<Setting, string> = {
      anisotropy: 'MeshPhysicalMaterial, anisotropy = 0.8',
      'anisotropy + map': 'anisotropy = 0.8; anisotropyMap = directions',
      'physical 0': 'MeshPhysicalMaterial, anisotropy = 0  (its extra code is left out)',
      standard: 'MeshStandardMaterial',
    };
    stage.harness.onFrame(() => {
      stage.readout.textContent = [code[setting], ...meter.lines()].join('\n');
    });
  });
};
