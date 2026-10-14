// The grounding tools on top of the bench: a contact shadow, ambient occlusion on screen (GTAO), and
// a choice of ground, a gray floor or a shadow catcher. GTAO is a post-processing pass, so a scene
// with this rig draws through an EffectComposer from its own frame loop instead of the harness's.
import type { Harness } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import type { Bench } from '../bench';
import { settled } from '../reading-light/meter';
import { contactShadow, type ContactShadow } from './contact';

export type GroundKind = 'floor' | 'catcher';

// A light page color, for the shadow catcher: the ground vanishes and the samples sit on the page.
const PAGE_COLOR = 0xdcdad6;

// Drawn straight to the screen, a plain background color skips tone mapping; through a composer it
// goes through OutputPass like everything else, and NeutralToneMapping pulls dark colors down by
// their smallest channel, turning the bench's dark gray navy. This is the color that comes out of
// Neutral (at exposure 1) as `wanted`, for colors below its highlight roll-off.
function beforeNeutral(wanted: THREE.Color) {
  const low = Math.min(wanted.r, wanted.g, wanted.b);
  const x = low < 0.04 ? Math.sqrt(low / 6.25) : low + 0.04; // Neutral subtracts x − 6.25x² below 0.08, else 0.04
  const lift = x - low;
  return new THREE.Color(wanted.r + lift, wanted.g + lift, wanted.b + lift);
}

export interface GroundRig {
  contact: ContactShadow;
  gtao: GTAOPass;
  ground: GroundKind;
  setGround(kind: GroundKind): void;
  setContact(on: boolean): void;
  setGtao(on: boolean): void;
  draw(): void; // the frame as the viewer sees it
  measureWhenSettled(measure: () => void): void;
}

// GTAO settings for the bench, picked by eye: it looks 6 cm around each point for surfaces that
// hide it (the roll is 8 cm across), counts only surfaces within 10 cm in depth, so the swatch
// doesn't shade the floor far behind it, and deepens the result a little (scale).
export const BENCH_AO = { radius: 0.06, thickness: 0.1, scale: 1.5 };

export function groundRig(bench: Bench, harness: Harness): GroundRig {
  const { renderer, scene, camera, controls, container } = harness;
  const floorMaterial = bench.ground.material;
  const catcher = new THREE.ShadowMaterial({ opacity: 0.45 }); // see-through except where shadowed
  const floorBackground = beforeNeutral(scene.background as THREE.Color);
  const pageBackground = beforeNeutral(new THREE.Color(PAGE_COLOR));
  scene.background = floorBackground;
  bench.ground.userData.ground = true;

  const contact = contactShadow();
  contact.plane.position.set(0.04, 0.0008, 0.06); // under the samples and the balls
  contact.plane.visible = false;
  scene.add(contact.plane);

  const size = renderer.getSize(new THREE.Vector2());
  let ratio = renderer.getPixelRatio();
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(size.x * ratio, size.y * ratio, { type: THREE.HalfFloatType, samples: 4 }));
  composer.setPixelRatio(ratio);
  composer.setSize(size.x, size.y);
  const gtao = new GTAOPass(scene, camera, size.x * ratio, size.y * ratio);
  gtao.updateGtaoMaterial(BENCH_AO);
  gtao.enabled = false;
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(gtao);
  composer.addPass(new OutputPass()); // tone mapping and sRGB, which the renderer skips when drawing to a target

  let contactDirty = true;
  bench.onChange(() => (contactDirty = true)); // a new material can mean a new shape

  // Follows the canvas when it resizes.
  const drawn = size.clone();
  const draw = () => {
    renderer.getSize(size);
    if (!size.equals(drawn) || renderer.getPixelRatio() !== ratio) {
      drawn.copy(size);
      ratio = renderer.getPixelRatio();
      composer.setPixelRatio(ratio);
      composer.setSize(size.x, size.y);
    }
    composer.render();
  };

  const timing = settled(harness, bench);
  const measures: (() => void)[] = [];
  harness.setRendering(false); // this loop replaces the harness's
  renderer.setAnimationLoop(() => {
    controls.update();
    if (contactDirty && contact.plane.visible) {
      contact.update(renderer, scene);
      contactDirty = false;
    }
    draw();
    if (timing.due()) for (const measure of measures) measure();
  });
  onLeave(container, () => {
    renderer.setAnimationLoop(null);
    contact.dispose();
    catcher.dispose();
    for (const pass of composer.passes) pass.dispose();
    composer.dispose();
  });

  const rig: GroundRig = {
    contact,
    gtao,
    ground: 'floor',
    setGround(kind) {
      rig.ground = kind;
      bench.ground.material = kind === 'catcher' ? catcher : floorMaterial;
      scene.background = kind === 'catcher' ? pageBackground : floorBackground;
      bench.refresh();
    },
    setContact(on) {
      contact.plane.visible = on;
      contactDirty = true;
      bench.refresh();
    },
    setGtao(on) {
      gtao.enabled = on;
      bench.refresh();
    },
    draw,
    measureWhenSettled(measure) {
      measures.push(measure);
    },
  };
  return rig;
}
