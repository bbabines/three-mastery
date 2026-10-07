import { buttonGroup, choiceButtons, drawYourself, fitModel, formatNumber, glCalls, overlay } from '@harness/lesson';
import { gltfLoader } from '@harness/models';
import type { Harness, SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { GEMS, gemMaterial } from '../gem-shader/gem-material';
import { environment, environmentImage, isGem, jewelryStage, loadSpring, MISSING_REFERENCE, mirrorStandIn } from '../shared';
import {
  bakedGroundShadow,
  FAINT_BLOOM,
  finishingComposer,
  PLAYGROUND,
  PLAYGROUND_CONTRAST,
  productCamera,
  sameFramingDistance,
  SUBTLE_AO,
  type Antialias,
  type Finishing,
  type GroundShadow,
} from './finishing';

// Calls `ready` once the page's assets have loaded, unless the page was left first. Shows the
// missing-files note in the readout when the reference files aren't on this machine.
function whenLoaded<T>(container: HTMLElement, readout: HTMLElement, load: Promise<T>, ready: (value: T) => void) {
  let left = false;
  onLeave(container, () => {
    left = true;
  });
  readout.textContent = 'Loading…';
  load.then(
    (value) => {
      if (!left) ready(value);
    },
    () => {
      readout.textContent = MISSING_REFERENCE;
    },
  );
}

// Spring standing on the ground (y = 0), 3 units at its largest, about its own size in the file, with
// the mirror stand-in on every gem until the gem shader unit.
function placeSpring(gltf: GLTF) {
  const model = gltf.scene.clone(true);
  const gem = mirrorStandIn();
  model.traverse((child) => {
    if (child instanceof THREE.Mesh && isGem(child)) child.material = gem;
  });
  return fitModel(model, 3);
}

// The playground's opening view (its saved camera, 8.5 units out), raised to match Spring standing
// on y = 0, and moved back a little so the ring clears the readout.
const OPENING_TARGET = new THREE.Vector3(-0.01, 1.53, 0.05);
const OPENING = {
  position: OPENING_TARGET.clone().add(new THREE.Vector3(1.49, 7.71, -3.33).setLength(11)),
  target: OPENING_TARGET,
};
// A three-quarter view from the front, lower down, where the ground and the lens show more.
const THREE_QUARTER = { direction: new THREE.Vector3(3.76, 2.6, 4.91).normalize(), target: new THREE.Vector3(0, 1.3, -0.1) };

function view(harness: Harness, position: THREE.Vector3, target: THREE.Vector3) {
  harness.camera.position.copy(position);
  harness.controls.target.copy(target);
}

// The playground's white, not tone mapped: a Color background is a plain clear of the canvas.
function whiteStage(harness: Harness) {
  jewelryStage(harness);
  harness.scene.background = new THREE.Color(0xffffff);
}

// For scenes drawn through the finishing chain: the harness's render draws nothing, and the scene
// has no background, so the last pass can put white behind it.
function composerStage(harness: Harness, options?: Parameters<typeof finishingComposer>[3]) {
  jewelryStage(harness);
  const world = drawYourself(harness);
  world.background = null;
  const finishing = finishingComposer(harness.renderer, world, harness.camera, options);
  harness.controls.addEventListener('change', () => finishing.restart());
  onLeave(harness.container, () => finishing.dispose());
  return { world, finishing };
}

const edgesLine = (finishing: Finishing) =>
  finishing.framesAveraged === 0
    ? 'edges: the view is moving, so one multisampled frame'
    : `edges: ${finishing.framesAveraged} of ${PLAYGROUND.progressiveFrames} jittered frames averaged`;

// Evidence: Spring with the playground's finishing, all on. Pick a .glb to see your own model in it.
export const playground: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  const { world, finishing } = composerStage(harness, { ao: SUBTLE_AO, contrast: PLAYGROUND_CONTRAST });
  productCamera(camera, controls);
  view(harness, OPENING.position, OPENING.target);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  let model: THREE.Object3D | undefined;
  let shadow: GroundShadow | undefined;
  let name = 'Spring';
  onLeave(container, () => shadow?.dispose());

  const show = (next: THREE.Object3D, label: string) => {
    if (model) world.remove(model);
    shadow?.dispose();
    model = next;
    name = label;
    world.add(model);
    shadow = bakedGroundShadow(renderer, model);
    world.add(shadow.ground);
    finishing.restart();
  };

  let frame = 0;
  onFrame(() => {
    if (shadow && !shadow.done) {
      shadow.step();
      finishing.restart(); // the ground is still changing
    }
    finishing.render();
    if (!shadow || frame++ % 10) return;
    readout.innerHTML = [
      `${name} · camera.fov = ${camera.fov}, controls.maxPolarAngle = π/2`,
      `ground: ${shadow.framesBaked} of ${PLAYGROUND.shadowFrames} light directions baked`,
      `bloom: threshold ${FAINT_BLOOM.threshold}, strength ${FAINT_BLOOM.strength}; ambient occlusion; contrast ${PLAYGROUND_CONTRAST}`,
      edgesLine(finishing),
    ].join('<br>');
  });

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    world.environment = env;
    show(placeSpring(gltf), 'Spring');

    const picker = document.createElement('label');
    picker.innerHTML = 'your .glb <input type="file" accept=".glb">';
    bar.append(picker);
    picker.querySelector('input')!.addEventListener('change', async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const loaded = await gltfLoader().parseAsync(await file.arrayBuffer(), '');
        const yours = fitModel(loaded.scene, 3);
        show(yours, file.name);
        // Aim at the middle of the new model, from the same direction and distance.
        const box = new THREE.Box3().setFromObject(yours, true);
        const offset = camera.position.clone().sub(controls.target);
        box.getCenter(controls.target);
        camera.position.copy(controls.target).add(offset);
      } catch (error) {
        readout.textContent = `${file.name} didn't load: ${error instanceof Error ? error.message : String(error)}`;
      }
    });
  });
};

// Why it works (a): the same framing through a long lens and a wide one.
const LENSES = [15, 30, 50];
const DISTANCE_AT_15 = 18;

export const lens: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  whiteStage(harness);
  productCamera(camera, controls);
  controls.enableZoom = false; // the buttons set the distance
  view(harness, THREE_QUARTER.target.clone().addScaledVector(THREE_QUARTER.direction, DISTANCE_AT_15), THREE_QUARTER.target);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    scene.environment = env;
    const ring = placeSpring(gltf);
    scene.add(ring);
    const radius = new THREE.Box3().setFromObject(ring, true).getBoundingSphere(new THREE.Sphere()).radius;

    const choose = (fov: number) => {
      const distance = sameFramingDistance(PLAYGROUND.fov, DISTANCE_AT_15, fov);
      camera.fov = fov;
      camera.updateProjectionMatrix();
      const direction = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).addScaledVector(direction, distance);
      // A part at the near edge of the ring against one at the far edge: how much bigger it looks.
      const nearVsFar = (distance + radius) / (distance - radius);
      readout.innerHTML = [
        `camera.fov = ${fov}, ${formatNumber(distance, 1)} units back`,
        `a near part looks ${formatNumber(nearVsFar, 1)}× the size of the same part at the back`,
        fov === PLAYGROUND.fov
          ? 'flat and even, like a product photo'
          : fov >= 50
            ? 'the near side bulges: close-up and toy-like'
            : 'in between: the front starts to swell',
      ].join('<br>');
    };
    choiceButtons(
      buttonGroup(bar, 'field of view'),
      LENSES.map((fov) => ({
        html: fov === PLAYGROUND.fov ? `${fov}° (the playground)` : fov === 50 ? `${fov}° (three.js default)` : `${fov}°`,
        select: () => choose(fov),
      })),
    );
  });
};

// Why it works (b): no ground shadow, a hard real-time one, and the baked soft one.
export const groundShadow: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  whiteStage(harness);
  renderer.shadowMap.enabled = true; // before the first draw, so materials compile with it
  productCamera(camera, controls);
  view(harness, THREE_QUARTER.target.clone().addScaledVector(THREE_QUARTER.direction, DISTANCE_AT_15), THREE_QUARTER.target);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    scene.environment = env;
    const ring = placeSpring(gltf);
    ring.traverse((child) => (child.castShadow = true));
    scene.add(ring);

    // The hard shadow: one light, shadows on, and a ground that shows only shadow. Its intensity is
    // 0 so it changes nothing on the ring; shadows don't depend on it.
    const sun = new THREE.DirectionalLight(0xffffff, 0);
    sun.position.set(2, 8, 1.5);
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.1, far: 20 });
    sun.visible = false;
    const hardGround = new THREE.Mesh(new THREE.PlaneGeometry(8, 8).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.6 }));
    hardGround.receiveShadow = true;
    hardGround.visible = false;
    scene.add(sun, hardGround);

    const baked = bakedGroundShadow(renderer, ring);
    baked.ground.visible = false;
    scene.add(baked.ground);
    onLeave(container, () => {
      baked.dispose();
      sun.dispose();
      hardGround.geometry.dispose();
      (hardGround.material as THREE.Material).dispose();
    });

    let choice = 'none';
    const lines: Record<string, () => [string, string]> = {
      none: () => ['// no ground', 'nothing ties the ring to the floor: it floats'],
      hard: () => ['sun.castShadow = true; // redrawn every frame', 'a crisp copy of the outline: one light, a cheap-render look'],
      baked: () => [
        `bakedGroundShadow(renderer, ring) // ${baked.framesBaked} of ${PLAYGROUND.shadowFrames} directions`,
        baked.done ? 'darkest where it touches, fading out: it sits on the ground' : 'baking: each frame adds a few more light directions',
      ],
    };
    let frame = 0;
    onFrame(() => {
      const triangles = renderer.info.render.triangles; // the harness's last render, shadow map included
      if (choice === 'baked') baked.step();
      if (frame++ % 10) return;
      const [code, verdict] = lines[choice]();
      readout.innerHTML = [code, `triangles drawn last frame: ${triangles.toLocaleString('en-US')}`, verdict].join('<br>');
    });
    choiceButtons(buttonGroup(bar, 'ground'), [
      { html: 'no shadow', select: () => (choice = 'none') },
      { html: 'hard real-time shadow', select: () => (choice = 'hard') },
      { html: 'baked soft shadow', select: () => (choice = 'baked') },
    ].map(({ html, select }) => ({
      html,
      select: () => {
        select();
        sun.visible = sun.castShadow = hardGround.visible = choice === 'hard';
        baked.ground.visible = choice === 'baked';
        frame = 0;
      },
    })));
  });
};

// Of the pixels the ring covers (alpha near 1; the see-through shadow stays below that), the share
// whose brightness before tone mapping passes `threshold`. Reads back a half-size float copy of the
// frame, so call it now and then, not every frame.
function shareAbove(renderer: THREE.WebGLRenderer, world: THREE.Scene, camera: THREE.Camera, threshold: number) {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2()).multiplyScalar(0.5).floor();
  const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.FloatType });
  const previous = { target: renderer.getRenderTarget(), color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha() };
  const background = world.background;
  world.background = null; // empty behind the ring, so only the ring is opaque
  renderer.setRenderTarget(target);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.render(world, camera);
  const pixels = new Float32Array(size.x * size.y * 4);
  renderer.readRenderTargetPixels(target, 0, 0, size.x, size.y, pixels);
  renderer.setRenderTarget(previous.target);
  renderer.setClearColor(previous.color, previous.alpha);
  world.background = background;
  target.dispose();
  const weights = THREE.ColorManagement.getLuminanceCoefficients(new THREE.Vector3());
  let above = 0;
  let ring = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 0.95) continue;
    ring++;
    const brightness = weights.x * pixels[i] + weights.y * pixels[i + 1] + weights.z * pixels[i + 2];
    if (brightness > threshold) above++;
  }
  return ring ? above / ring : 0;
}

// Why it works (c): bloom off, faint like the playground, the playground's numbers copied as they
// are, and on everything.
const BLOOMS = {
  off: null,
  faint: FAINT_BLOOM,
  'strength 0.2': { threshold: PLAYGROUND.bloom.threshold, strength: PLAYGROUND.bloom.intensity, radius: PLAYGROUND.bloom.radius },
  'threshold 0': { threshold: 0, strength: 0.3, radius: 0.6 },
};

export const bloom: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  const { world, finishing } = composerStage(harness);
  productCamera(camera, controls);
  view(harness, OPENING.position, OPENING.target);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const calls = glCalls(renderer);

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    world.environment = env;
    const ring = placeSpring(gltf);
    world.add(ring);
    const shadow = bakedGroundShadow(renderer, ring);
    world.add(shadow.ground);
    onLeave(container, () => shadow.dispose());

    let setting: keyof typeof BLOOMS = 'off';
    const threshold = () => BLOOMS[setting]?.threshold ?? PLAYGROUND.bloom.threshold;
    let toneMappedBackground = false;
    let share = 0;
    let measured = false;
    let frame = 0;
    onFrame(() => {
      const draws = calls.counts.draws; // the last frame's
      calls.reset();
      if (!shadow.done) {
        shadow.step();
        finishing.restart();
      }
      // Measure once each time the view comes to rest.
      if (finishing.framesAveraged === 0) measured = false;
      else if (!measured) {
        share = shareAbove(renderer, world, camera, threshold());
        measured = true;
      }
      finishing.render();
      // The background pixel at the top-right corner, as it reached the screen.
      let corner = '';
      if (frame % 10 === 0) {
        const gl = renderer.getContext();
        const pixel = new Uint8Array(4);
        gl.readPixels(gl.drawingBufferWidth - 2, gl.drawingBufferHeight - 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        corner = `${pixel[0]} of 255`;
      }
      if (frame++ % 10) return;
      const settings = BLOOMS[setting];
      readout.innerHTML = [
        settings ? `bloom.threshold = ${settings.threshold}, bloom.strength = ${settings.strength}` : 'bloom.enabled = false',
        `brighter than ${threshold()} before tone mapping: ${formatNumber(share * 100, 1)}% of the ring`,
        `draws last frame: ${draws}${settings ? ' (bloom adds 13)' : ''}`,
        toneMappedBackground
          ? `scene.background = white: ${corner} on screen, tone mapped to gray`
          : `background: ${corner} on screen, added after tone mapping`,
      ].join('<br>');
    });

    choiceButtons(
      buttonGroup(bar, 'bloom'),
      (Object.keys(BLOOMS) as (keyof typeof BLOOMS)[]).map((key) => ({
        html: key,
        select: () => {
          setting = key;
          const settings = BLOOMS[key];
          finishing.bloom!.enabled = Boolean(settings);
          if (settings) Object.assign(finishing.bloom!, settings);
          measured = false;
          frame = 0;
        },
      })),
    );
    choiceButtons(buttonGroup(bar, 'background'), [
      { html: 'added last', select: () => ((toneMappedBackground = false), apply()) },
      { html: 'in the scene', select: () => ((toneMappedBackground = true), apply()) },
    ]);
    function apply() {
      // In the scene, the white fills every pixel before tone mapping, so the last pass has
      // nothing empty to fill.
      world.background = toneMappedBackground ? new THREE.Color(0xffffff) : null;
      finishing.restart();
      frame = 0;
    }
  });
};

// Why it works (d): thin highlights at plain, multisampled, and progressive anti-aliasing.
const CLOSE_TARGET = new THREE.Vector3(-0.1, 2.2, 0.05);
const CLOSE = { position: CLOSE_TARGET.clone().add(new THREE.Vector3(1.49, 7.71, -3.33).setLength(6.5)), target: CLOSE_TARGET };

export const smoothEdges: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  renderer.setPixelRatio(1); // one pixel per CSS pixel, so the steps are big enough to see
  const { world, finishing } = composerStage(harness, { antialias: 'none' });
  productCamera(camera, controls);
  controls.autoRotateSpeed = 0.4;
  view(harness, CLOSE.position, CLOSE.target);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const calls = glCalls(renderer);

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    world.environment = env;
    world.add(placeSpring(gltf));

    const code: Record<Antialias, string> = {
      none: "finishing.antialias = 'none'",
      msaa: "finishing.antialias = 'msaa' // samples: 4",
      progressive: "finishing.antialias = 'progressive'",
    };
    let frame = 0;
    onFrame(() => {
      const draws = calls.counts.draws;
      calls.reset();
      finishing.render();
      if (frame++ % 5) return;
      const mode = finishing.antialias;
      readout.innerHTML = [
        code[mode],
        mode === 'progressive'
          ? edgesLine(finishing)
          : mode === 'msaa'
            ? 'outlines smooth, but each pixel is shaded once: highlights still jump'
            : 'one sample a pixel: stair-stepped outlines, jumping highlights',
        `draws last frame: ${draws}${mode === 'progressive' && finishing.framesAveraged === PLAYGROUND.progressiveFrames ? ' (done: the scene isn\'t drawn again)' : ''}`,
        'renderer.setPixelRatio(1): big pixels, so the steps show',
      ].join('<br>');
    });
    choiceButtons(buttonGroup(bar, 'anti-aliasing'), [
      { html: 'none', select: () => (finishing.antialias = 'none') },
      { html: 'MSAA ×4', select: () => (finishing.antialias = 'msaa') },
      { html: 'progressive', select: () => (finishing.antialias = 'progressive') },
    ]);
    choiceButtons(buttonGroup(bar, 'camera'), [
      { html: 'still', select: () => (controls.autoRotate = false) },
      { html: 'turning', select: () => (controls.autoRotate = true) },
    ]);
  });
};

// Why it works (e): ambient occlusion and contrast, close on the flowers and prongs, where the gaps are.
const AO_SETTINGS = {
  off: null,
  subtle: SUBTLE_AO,
  strong: { radius: 0.6, scale: 5, intensity: 1 },
};
const CONTRASTS = [1, PLAYGROUND_CONTRAST, 1.3];

export const aoContrast: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  const { world, finishing } = composerStage(harness, { ao: SUBTLE_AO });
  productCamera(camera, controls);
  view(harness, CLOSE.position, CLOSE.target);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const calls = glCalls(renderer);

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    world.environment = env;
    const ring = placeSpring(gltf);
    world.add(ring);
    const shadow = bakedGroundShadow(renderer, ring);
    world.add(shadow.ground);
    onLeave(container, () => shadow.dispose());

    let setting: keyof typeof AO_SETTINGS = 'off';
    let frame = 0;
    onFrame(() => {
      const draws = calls.counts.draws;
      calls.reset();
      if (!shadow.done) {
        shadow.step();
        finishing.restart();
      }
      finishing.render();
      if (frame++ % 10) return;
      const settings = AO_SETTINGS[setting];
      readout.innerHTML = [
        settings ? `ao: radius ${settings.radius}, scale ${settings.scale}, intensity ${settings.intensity}` : 'ao.enabled = false',
        `contrast = ${finishing.contrast}${finishing.contrast === PLAYGROUND_CONTRAST ? " (the playground's number)" : ''}`,
        setting === 'off'
          ? 'gaps between parts are as bright as open surfaces'
          : setting === 'subtle'
            ? 'a soft darkening in the gaps: the parts sit into each other'
            : 'dark halos around every part: a dirty, cheap look',
        `draws last frame: ${draws}${settings ? ' (ambient occlusion draws the scene again every frame)' : ''}`,
      ].join('<br>');
    });

    choiceButtons(
      buttonGroup(bar, 'ambient occlusion'),
      (Object.keys(AO_SETTINGS) as (keyof typeof AO_SETTINGS)[]).map((key) => ({
        html: key,
        select: () => {
          setting = key;
          const settings = AO_SETTINGS[key];
          finishing.ao!.enabled = Boolean(settings);
          if (settings) finishing.setAO(settings);
          finishing.restart();
          frame = 0;
        },
      })),
    );
    choiceButtons(
      buttonGroup(bar, 'contrast'),
      CONTRASTS.map((value) => ({
        html: String(value),
        select: () => {
          finishing.contrast = value;
          finishing.restart();
          frame = 0;
        },
      })),
    );
  });
};

// Why it works (f): the same ring, with the real gem shader, from different heights and distances.
// All three heights face the butterfly from the side the playground's opening view does; 'from above'
// is that view's own height, 65° above the ground.
const heightAt = (degrees: number) => {
  const facing = new THREE.Vector3(1.48, 0, -3.28).normalize(); // the opening view, flattened
  const angle = THREE.MathUtils.degToRad(degrees);
  return facing.multiplyScalar(Math.cos(angle)).setY(Math.sin(angle));
};
const HEIGHTS = {
  'from above': heightAt(65),
  halfway: heightAt(35),
  low: heightAt(8),
};
const DISTANCES = { 'close-up': 7, 'whole ring': 18, far: 45 };

// Which of iJewel's gem settings a Spring stone uses, from the .dmat file its material points to.
function gemKind(mesh: THREE.Mesh) {
  const path = String((mesh.material as THREE.Material).userData.rootPath ?? '');
  return path.includes('ruby') ? 'ruby' : path.includes('sapphire') ? 'yellow sapphire' : path.includes('emerald') ? 'emerald' : 'diamond';
}

// How many of the picture's pixels the stones cover: everything else hidden, the stones drawn plain
// white into a small target, and the covered pixels counted, scaled up to the canvas.
function stonePixels(renderer: THREE.WebGLRenderer, world: THREE.Scene, camera: THREE.Camera, stones: THREE.Mesh[]) {
  const canvas = renderer.getDrawingBufferSize(new THREE.Vector2());
  const scale = 0.25;
  const size = canvas.clone().multiplyScalar(scale).floor();
  const target = new THREE.WebGLRenderTarget(size.x, size.y);
  const hidden: THREE.Object3D[] = [];
  world.traverse((child) => {
    if (child.visible && child instanceof THREE.Mesh && !stones.includes(child)) {
      child.visible = false;
      hidden.push(child);
    }
  });
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const previous = { target: renderer.getRenderTarget(), color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha() };
  world.overrideMaterial = white;
  renderer.setRenderTarget(target);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.render(world, camera);
  const pixels = new Uint8Array(size.x * size.y * 4);
  renderer.readRenderTargetPixels(target, 0, 0, size.x, size.y, pixels);
  world.overrideMaterial = null;
  renderer.setRenderTarget(previous.target);
  renderer.setClearColor(previous.color, previous.alpha);
  for (const child of hidden) child.visible = true;
  white.dispose();
  target.dispose();
  let covered = 0;
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 0) covered++;
  return { pixels: Math.round(covered / (scale * scale)), share: covered / (size.x * size.y) };
}

export const angles: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  const { world, finishing } = composerStage(harness);
  productCamera(camera, controls);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal'), environmentImage('gem')]), ([gltf, env, gemImage]) => {
    world.environment = env;
    const ring = fitModel(gltf.scene.clone(true), 3);
    const stones: THREE.Mesh[] = [];
    const materials = new Map<string, THREE.ShaderMaterial>(); // one per stone shape and kind
    ring.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !isGem(child)) return;
      const kind = gemKind(child);
      const key = `${child.geometry.uuid} ${kind}`;
      if (!materials.has(key)) materials.set(key, gemMaterial(child.geometry, gemImage, GEMS[kind]));
      child.material = materials.get(key)!;
      stones.push(child);
    });
    world.add(ring);
    const shadow = bakedGroundShadow(renderer, ring);
    world.add(shadow.ground);
    onLeave(container, () => {
      shadow.dispose();
      materials.forEach((material) => material.dispose());
    });
    // Aim at the middle of the stones.
    ring.updateMatrixWorld(true);
    const target = new THREE.Box3();
    for (const stone of stones) target.expandByObject(stone, true);
    const center = target.getCenter(new THREE.Vector3());

    let height: keyof typeof HEIGHTS = 'from above';
    let distance: keyof typeof DISTANCES = 'whole ring';
    let coverage = { pixels: 0, share: 0 };
    const look = () => {
      controls.target.copy(center);
      camera.position.copy(center).addScaledVector(HEIGHTS[height].clone().normalize(), DISTANCES[distance]);
      camera.updateMatrixWorld();
      controls.update();
      coverage = stonePixels(renderer, world, camera, stones);
      finishing.restart();
      frame = 0;
    };
    let frame = 0;
    onFrame(() => {
      if (!shadow.done) {
        shadow.step();
        finishing.restart();
      }
      finishing.render();
      if (frame++ % 10) return;
      readout.innerHTML = [
        `${height}, ${DISTANCES[distance]} units back: stones cover ${formatNumber(coverage.share * 100, 1)}% of the picture`,
        `gem shader: up to ${(coverage.pixels * 5).toLocaleString('en-US')} BVH searches a frame (${coverage.pixels.toLocaleString('en-US')} pixels × 5 bounces)`,
        height === 'from above'
          ? "looking into the stones' tops: light bounced inside comes back at you"
          : height === 'low'
            ? 'looking across them: less of their light comes back this way, so the rubies darken'
            : 'a mix: some facets send light back, some go dark',
        distance === 'far'
          ? 'facets smaller than a pixel: sparkle flickers until frames are averaged'
          : distance === 'close-up'
            ? 'every facet is many pixels: sharp, but the gem shader runs on far more of the picture'
            : edgesLine(finishing),
      ].join('<br>');
    });
    choiceButtons(buttonGroup(bar, 'height'), (Object.keys(HEIGHTS) as (keyof typeof HEIGHTS)[]).map((key) => ({ html: key, select: () => ((height = key), look()) })));
    choiceButtons(buttonGroup(bar, 'distance'), (Object.keys(DISTANCES) as (keyof typeof DISTANCES)[]).map((key) => ({ html: key, select: () => ((distance = key), look()) })));
    controls.addEventListener('end', () => {
      coverage = stonePixels(renderer, world, camera, stones); // after an orbit, measure again
    });
  });
};
