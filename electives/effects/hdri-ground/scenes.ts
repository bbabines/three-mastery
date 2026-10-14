import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import * as THREE from 'three/webgpu';
import { softGroundShadow } from '../ground-shadow/bake';
import { costMeter, effectsStage, type EffectsStage } from '../stage';
import { frontSideCrystal } from '../transmission/crystal';
import { drawScene } from '../transmission/draw';

// The panoramas: two with a real floor, two without. All are already in the repo.
export const PANORAMAS = {
  wood: { file: '/assets/tactile/hdr/blue_photo_studio_2k.hdr', label: 'wood-floor room' },
  white: { file: '/assets/tactile/hdr/studio_small_09_2k.hdr', label: 'white studio' },
  watch: { file: '/assets/reference/classic-watch/studio.exr', label: "the watch's studio" },
  sky: { file: '/assets/tactile/hdr/overcast_soil_puresky_2k.hdr', label: 'overcast sky' },
} as const;
export type Panorama = keyof typeof PANORAMAS;
export type Backdrop = 'projected' | 'flat' | 'bench';

// The bench lit by a panorama instead of the studio, with three ways to show it behind the watch.
function hdriGround(stage: EffectsStage) {
  const { renderer, scene, camera } = stage.harness;
  frontSideCrystal(stage.watch); // the glass page explains why
  // The panorama lights everything here, so the bench's key light and floor step aside.
  stage.key.intensity = 0;
  stage.key.castShadow = false;
  scene.environmentRotation.set(0, 0, 0);
  scene.environmentIntensity = 1;
  camera.far = 2500; // the projected sphere reaches up to 1,000 units away; past `far` it's cut off
  camera.updateProjectionMatrix();

  // A soft shadow under the watch: the photo's floor can't receive one.
  const shadow = stage.own(softGroundShadow(renderer, stage.watch, { cone: 50, darkness: 0.7 }));
  scene.add(shadow.overlay);

  const textures = new Map<Panorama, Promise<THREE.Texture>>();
  const load = (name: Panorama) => {
    let texture = textures.get(name);
    if (!texture) {
      const file = PANORAMAS[name].file;
      const loader = file.endsWith('.exr') ? new EXRLoader() : new HDRLoader();
      texture = loader.loadAsync(file).then((loaded) => {
        loaded.mapping = THREE.EquirectangularReflectionMapping;
        return stage.own(loaded);
      });
      textures.set(name, texture);
    }
    return texture;
  };

  // radius is a multiple of height. GroundedSkybox flattens the sphere where it's lower than 1.5 ×
  // height, so the floor stays flat out to about two-thirds of the radius, then curves up.
  const state = { panorama: 'wood' as Panorama, backdrop: 'projected' as Backdrop, height: 15, roomy: true, resolution: 128 };
  const radius = () => state.height * (state.roomy ? 8 : 1.5);
  let skybox: GroundedSkybox | null = null;
  let current: THREE.Texture | null = null;
  const rebuild = () => {
    if (skybox) {
      scene.remove(skybox);
      skybox.geometry.dispose();
      (skybox.material as THREE.Material).dispose();
      skybox = null;
    }
    if (!current) return;
    scene.environment = current;
    stage.ground.visible = state.backdrop === 'bench';
    shadow.overlay.visible = state.backdrop !== 'flat';
    if (state.backdrop === 'projected') {
      skybox = new GroundedSkybox(current, state.height, radius(), state.resolution);
      skybox.position.y = state.height - 0.01; // the photo's floor just under the bench's floor level
      scene.add(skybox);
      scene.background = new THREE.Color(0x000000);
    } else if (state.backdrop === 'flat') {
      scene.background = current; // the same photo, infinitely far away, with no floor under the watch
    } else {
      scene.background = new THREE.Color(0xf4f4f4);
    }
  };
  let request = 0;
  const set = (change: Partial<typeof state>) => {
    Object.assign(state, change);
    const mine = ++request;
    load(state.panorama).then((texture) => {
      if (mine !== request) return;
      current = texture;
      rebuild();
    });
  };
  stage.own({ dispose: () => skybox && (skybox.geometry.dispose(), (skybox.material as THREE.Material).dispose()) });

  drawScene(stage, () => shadow.step(4));
  return { state, set, radius, shadow };
}

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { state, set, radius } = hdriGround(stage);
    stage.harness.camera.position.set(4.5, 3.2, 11);
    stage.harness.controls.update();
    const photo = buttonGroup(stage.ui, 'photo');
    choiceButtons(
      photo,
      (Object.keys(PANORAMAS) as Panorama[]).map((name) => ({ html: PANORAMAS[name].label, select: () => set({ panorama: name }) })),
    );
    const backdrop = buttonGroup(stage.ui, 'behind');
    choiceButtons(backdrop, [
      { html: 'projected ground', select: () => set({ backdrop: 'projected' }) },
      { html: 'flat background', select: () => set({ backdrop: 'flat' }) },
      { html: 'bench floor', select: () => set({ backdrop: 'bench' }) },
    ]);
    const height = buttonGroup(stage.ui, 'height');
    choiceButtons(height, [
      { html: '15', select: () => set({ height: 15 }) },
      { html: '4', select: () => set({ height: 4 }) },
      { html: '60', select: () => set({ height: 60 }) },
    ]);
    const size = buttonGroup(stage.ui, 'radius');
    choiceButtons(size, [
      { html: '8 × height', select: () => set({ roomy: true }) },
      { html: '1.5 × height', select: () => set({ roomy: false }) },
    ]);
    const { camera, controls } = stage.harness;
    const view = buttonGroup(stage.ui, 'view');
    choiceButtons(view, [
      { html: 'from above', select: () => (camera.position.set(4.5, 3.2, 11), controls.update()) },
      { html: 'low, far', select: () => (camera.position.set(10, 1.4, 11), controls.update()) },
    ]);
    stage.harness.onFrame(() => {
      const code =
        state.backdrop === 'projected'
          ? `new GroundedSkybox(photo, ${state.height}, ${radius()})`
          : state.backdrop === 'flat'
            ? 'scene.background = photo'
            : 'the bench floor; the photo only lights';
      const distance = stage.harness.camera.position.distanceTo(new THREE.Vector3(0, state.height, 0));
      const verdict =
        state.backdrop !== 'projected'
          ? ''
          : distance > radius()
            ? "The camera is outside the sphere: the radius must be bigger than the camera's reach"
            : state.panorama === 'watch' || state.panorama === 'sky'
              ? "This photo has no floor: what's under the watch is a smear"
              : !state.roomy
                ? 'Small radius: the floor bends up into walls just past the watch'
                : state.height < 10
                  ? 'Low: the room shrinks around the watch, like a dollhouse'
                  : state.height > 30
                    ? 'High: the room grows; the watch is a small thing on a big floor'
                    : 'In between: the planks read about right next to the watch';
      stage.readout.textContent = [code, verdict].filter(Boolean).join('\n');
    });
  });
};

type Setting = 'color' | 'flat' | 'projected 128' | 'projected 32';

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { set, shadow } = hdriGround(stage);
    let setting: Setting = 'projected 128';
    const pick = (next: Setting) => () => {
      setting = next;
      if (next === 'color') set({ backdrop: 'bench' });
      else if (next === 'flat') set({ backdrop: 'flat' });
      else set({ backdrop: 'projected', resolution: next === 'projected 32' ? 32 : 128 });
    };
    const backdrop = buttonGroup(stage.ui, 'behind');
    choiceButtons(backdrop, [
      { html: 'projected, 128', select: pick('projected 128') },
      { html: 'projected, 32', select: pick('projected 32') },
      { html: 'flat background', select: pick('flat') },
      { html: 'plain floor', select: pick('color') },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => stage.harness.renderer.setPixelRatio(1) },
      { html: '2', select: () => stage.harness.renderer.setPixelRatio(2) },
    ]);
    // Timed once the soft shadow under the watch is baked, so only the backdrop differs.
    const meter = costMeter(stage, pixels, () => setting, () => {
      while (!shadow.done) shadow.step(50);
    });
    const code: Record<Setting, string> = {
      'projected 128': 'new GroundedSkybox(photo, 15, 120, 128)  (the default sphere)',
      'projected 32': 'new GroundedSkybox(photo, 15, 120, 32)',
      flat: 'scene.background = photo',
      color: 'scene.background = color; a floor plane',
    };
    stage.harness.onFrame(() => {
      stage.readout.textContent = [code[setting], ...meter.lines()].join('\n');
    });
  });
};
