import { buttonGroup, choiceButtons, drawYourself, overlay } from '@harness/lesson';
import { gltfLoader } from '@harness/models';
import type { Harness, SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { bakedGroundShadow, finishingComposer, type GroundShadow, productCamera } from '../finishing/finishing';
import { METAL_NAMES } from '../polished-metal/metal';
import { jewelryStage, loadSpring, MISSING_REFERENCE } from '../shared';
import { assemble, type Assembled, PLAYGROUND, type Recipe } from './assemble';

// The playground's four saved camera views for Spring (its WEBGI_viewer config), in Spring's own
// units: the ring stands 3 units tall, centered on the origin. The views' tilted "up" is left out;
// the orbit controls keep the camera upright.
type Vec3 = [number, number, number];
// 'from above' is the one the playground opens on (its default camera).
const VIEWS: Record<string, { position: Vec3; target: Vec3 }> = {
  'from above': { position: [1.482, 7.731, -3.278], target: [-0.014, 0.024, 0.049] },
  'three quarter': { position: [3.77, 2.036, 4.687], target: [0.01, 0.752, -0.215] },
  side: { position: [-13.233, 0.041, 0.091], target: [0.04, 0.038, 0.06] },
  'far above': { position: [0.576, 6.241, -9.53], target: [-0.015, 0.057, 0.07] },
};

// The playground's stage, from the finishing unit: a 15° lens, the camera kept above the ground,
// and the scene drawn through the finishing chain (bloom, averaged frames, white laid in after tone
// mapping), with a soft shadow baked under whatever `place` puts down.
function playgroundStage(harness: Harness) {
  const { camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  const world = drawYourself(harness);
  world.background = null; // the last pass puts white behind the piece
  productCamera(camera, controls);
  camera.far = 100;
  camera.updateProjectionMatrix();
  const finishing = finishingComposer(renderer, world, camera);
  controls.addEventListener('change', () => finishing.restart());
  let shadow: GroundShadow | undefined;
  onFrame(() => {
    if (shadow && !shadow.done) {
      shadow.step();
      finishing.restart(); // the ground is still changing
    }
    finishing.render();
  });
  onLeave(container, () => {
    shadow?.dispose();
    finishing.dispose();
  });
  return {
    world,
    finishing,
    get shadow() {
      return shadow;
    },
    // Puts a piece on the stage, taking off the last one, and starts baking its shadow.
    place(model: THREE.Object3D, previous?: THREE.Object3D) {
      if (previous) world.remove(previous);
      shadow?.dispose();
      world.add(model);
      shadow = bakedGroundShadow(renderer, model);
      world.add(shadow.ground);
      finishing.restart();
    },
  };
}

// The saved views' directions, with the camera backed off until the whole piece fits: at the saved
// distances a 15° lens shows only part of the ring, so the playground must fit the model to the
// view as well. The piece's bounding sphere has to fit the lens's narrower angle, with a margin.
function look(harness: Harness, view: string, model: THREE.Object3D) {
  const { camera, controls } = harness;
  const position = new THREE.Vector3(...VIEWS[view].position);
  const target = new THREE.Vector3(...VIEWS[view].target);
  const sphere = new THREE.Box3().setFromObject(model, true).getBoundingSphere(new THREE.Sphere());
  const vertical = THREE.MathUtils.degToRad(camera.fov);
  const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
  // A sphere around a ring is roomier than the ring, so 0.8 of it still leaves a margin.
  const distance = (0.8 * sphere.radius) / Math.sin(Math.min(vertical, horizontal) / 2);
  position.sub(target).setLength(distance).add(target);
  // Aim a little below the piece, so it sits above the scene's control rows.
  const lift = new THREE.Vector3(0, 0.12 * distance * Math.tan(vertical / 2), 0);
  position.sub(lift);
  target.sub(lift);
  camera.position.copy(position);
  controls.target.copy(target);
  controls.update();
}

// Loads a piece, assembles it into `world`, and calls `ready`, unless the page was left first.
function whenAssembled(harness: Harness, world: THREE.Scene, readout: HTMLElement, load: Promise<{ scene: THREE.Object3D }>, ready: (assembled: Assembled) => void) {
  let left = false;
  let built: Assembled | undefined;
  onLeave(harness.container, () => {
    left = true;
    built?.dispose();
  });
  readout.textContent = 'Loading…';
  load
    .then((gltf) => assemble(gltf.scene.clone(true), harness.renderer, world))
    .then(
      (assembled) => {
        built = assembled;
        if (!left) ready(assembled);
      },
      (error) => {
        readout.textContent = MISSING_REFERENCE;
        console.warn(error);
      },
    );
}

// Evidence: Spring, assembled from every unit's code, at the playground's own camera views.
export const whole: SceneSetup = (harness) => {
  const { container } = harness;
  const stage = playgroundStage(harness);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  whenAssembled(harness, stage.world, readout, loadSpring(), (assembled) => {
    stage.place(assembled.model);
    const recipe: Recipe = { ...PLAYGROUND };
    assembled.apply(recipe);
    const show = () => {
      readout.innerHTML = [
        `${assembled.counts.gem} stones traced, ${assembled.counts.metal} metal parts in ${recipe.metal}`,
        'two environments, ACES Filmic, a 15° lens, a baked shadow, faint bloom, averaged frames',
      ].join('<br>');
    };
    choiceButtons(buttonGroup(bar, 'view'), Object.keys(VIEWS).map((view) => ({ html: view, select: () => look(harness, view, assembled.model) })));
    choiceButtons(
      buttonGroup(bar, 'metal'),
      METAL_NAMES.map((name) => ({
        html: name,
        select: () => {
          recipe.metal = name;
          assembled.apply(recipe);
          stage.finishing.restart();
          show();
        },
      })),
    );
    show();
  });
};

// Why it works: the same ring, with each piece switchable to the shortcut people usually take.
export const layers: SceneSetup = (harness) => {
  const { container } = harness;
  const stage = playgroundStage(harness);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  whenAssembled(harness, stage.world, readout, loadSpring(), (assembled) => {
    stage.place(assembled.model);
    look(harness, 'from above', assembled.model);
    const recipe: Recipe = { ...PLAYGROUND };
    let finished = true;
    const update = () => {
      assembled.apply(recipe);
      // Without the finish: no ground shadow, no bloom, and one multisampled frame, like a plain
      // renderer with antialias: true.
      if (stage.shadow) stage.shadow.ground.visible = finished;
      if (stage.finishing.bloom) stage.finishing.bloom.enabled = finished;
      stage.finishing.antialias = finished ? 'progressive' : 'msaa';
      stage.finishing.restart();
      const shortcuts = [
        recipe.gems !== 'traced' && (recipe.gems === 'glass' ? 'gems as glass' : 'gems as mirrors'),
        recipe.lighting === 'one' && 'one environment',
        recipe.toneMapping === 'none' && 'no tone mapping',
        recipe.wood === 'uv' && 'wood on its UVs',
        !finished && 'no finish',
      ].filter(Boolean);
      readout.innerHTML = shortcuts.length ? `shortcuts on: ${shortcuts.join(', ')}` : 'the playground recipe: every piece on';
    };
    const row = (text: string, choices: [string, () => void][]) =>
      choiceButtons(buttonGroup(bar, text), choices.map(([html, select]) => ({ html, select: () => (select(), update()) })));
    row('gems', [['traced', () => (recipe.gems = 'traced')], ['glass', () => (recipe.gems = 'glass')], ['mirror', () => (recipe.gems = 'mirror')]]);
    row('lighting', [['two files', () => (recipe.lighting = 'split')], ['one file', () => (recipe.lighting = 'one')]]);
    row('tone mapping', [['ACES', () => (recipe.toneMapping = 'aces')], ['none', () => (recipe.toneMapping = 'none')]]);
    row('wood', [['triplanar', () => (recipe.wood = 'triplanar')], ['UVs', () => (recipe.wood = 'uv')]]);
    row('finish', [['on', () => (finished = true)], ['off', () => (finished = false)]]);
  });
};

// Your own model, through the same recipe: pick a .glb and it's assembled and staged like Spring.
export const yours: SceneSetup = (harness) => {
  const { container } = harness;
  const stage = playgroundStage(harness);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  readout.textContent = 'Pick one of your .glb files.';
  const picker = document.createElement('label');
  picker.innerHTML = 'model <input type="file" accept=".glb">';
  bar.append(picker);
  let current: Assembled | undefined;
  onLeave(container, () => current?.dispose());
  picker.querySelector('input')!.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    readout.textContent = `Loading ${file.name}…`;
    try {
      const gltf = await gltfLoader().parseAsync(await file.arrayBuffer(), '');
      const assembled = await assemble(gltf.scene, harness.renderer, stage.world);
      // Center it and scale it to Spring's size, so the same stage and lens frame it.
      const box = new THREE.Box3().setFromObject(assembled.model, true);
      const size = box.getSize(new THREE.Vector3());
      assembled.model.scale.setScalar(3 / Math.max(size.x, size.y, size.z));
      assembled.model.position.copy(box.getCenter(new THREE.Vector3()).multiplyScalar(-assembled.model.scale.x));
      assembled.model.updateMatrixWorld(true);
      stage.place(assembled.model, current?.model);
      current?.dispose();
      current = assembled;
      assembled.apply(PLAYGROUND);
      look(harness, 'from above', assembled.model);
      const { gem, metal, other } = assembled.counts;
      readout.innerHTML = [
        `${file.name}: ${gem} parts treated as stones, ${metal} as metal, ${other} left as loaded`,
        gem === 0 ? 'no stones found: name gem materials "diamond", "ruby", … or "gem"' : "stones traced with iJewel's settings, by name",
      ].join('<br>');
    } catch (error) {
      readout.textContent = `${file.name} didn't load: ${error instanceof Error ? error.message : String(error)}`;
    }
  });
};
