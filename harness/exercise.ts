// The Procedural & VFX elective's two kinds of practice, both drawn with WebGPURenderer and TSL
// (see tsl.ts):
//
// - A mask exercise ends a concept page. Brad writes one TSL function in the page's drill.ts; the
//   page draws his mask next to the reference and their difference, reads the pixels back at a few
//   fixed settings, and scores how closely they match.
// - An effect build runs in a product viewer: Brad's rack model twice on a floor, his version of
//   the effect on the left rack and the reference on the right. Clicking a part selects it on both.
import { color, float, max, saturate, uniform, uv, vec3 } from 'three/tsl';
import type { Node } from 'three/webgpu';
import * as THREE from 'three/webgpu';
import { COLORS, fitModel, label, overlay, pointerToNdc, slider } from './lesson';
import { loadModel, MODELS } from './models';
import { createTslHarness, createTslRenderer, type Backend } from './tsl';

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- Mask exercises ----

export interface ExerciseParam {
  name: string; // the key in `params`, also the slider's label
  min: number;
  max: number;
  step: number;
  value: number; // where the slider starts
}

// What a concept page's exercise hands the drill's function.
export interface MaskInputs {
  uv: Node<'vec2'>; // the square's UV: 0 to 1 across each side
  time: Node<'float'>; // frozen, so both pictures are drawn at the same moment
  params: Record<string, Node<'float'>>; // one uniform per ExerciseParam
}

// A concept page's scenes.ts exports one of these as `exercise`. The viewer passes `draw` Brad's
// drill.ts module and the reference module from /solutions, one at a time.
export interface MaskExercise<Drill> {
  fn: string; // the function Brad writes, for messages like "softRing returns null"
  params: ExerciseParam[];
  checks: Record<string, number>[]; // the settings the match is measured at; the lowest counts
  time?: number; // the frozen time, in seconds
  draw(drill: Drill, inputs: MaskInputs): Node<'float'> | null;
}

// The match that counts as solved. A correct answer scores 100%; a missing abs, a hard step edge,
// or a width that's off by half all land well under it.
export const PASS_MATCH = 0.95;
const CHECK_SIZE = 128; // pixels per side; 128 × 4 bytes keeps WebGPU's readback rows 256-byte aligned
const FROZEN_TIME = 1.5;

// How much two masks overlap: the sum of the smaller value at each pixel over the sum of the larger
// one. 1 when they're identical, 0 when they share nothing, and a thin ring can't score well by
// being mostly black like the reference.
function similarity(a: ArrayLike<number>, b: ArrayLike<number>) {
  let overlap = 0;
  let union = 0;
  for (let i = 0; i < a.length; i += 4) {
    overlap += Math.min(a[i], b[i]);
    union += Math.max(a[i], b[i]);
  }
  return union === 0 ? 1 : overlap / union;
}

const maskMaterial = (mask: Node<'float'>) => {
  const material = new THREE.MeshBasicNodeMaterial();
  material.colorNode = vec3(mask);
  return material;
};

// Mounts the exercise in `container`. `onPass` runs when the match reaches PASS_MATCH and returns
// the text to show after it, such as whether the page was logged as done. Returns the backend.
export async function mountMaskExercise<Drill>(
  container: HTMLElement,
  exercise: MaskExercise<Drill>,
  drills: { yours: Drill; reference: Drill },
  onPass: (match: number) => Promise<string>,
): Promise<Backend> {
  container.className = 'exercise';
  container.innerHTML = '<div class="captions"><span>Yours</span><span>Reference</span><span>Difference</span></div>';
  const pictures = document.createElement('div');
  pictures.className = 'pictures';
  const settings = document.createElement('div');
  settings.className = 'settings';
  const result = document.createElement('p');
  result.className = 'result';
  container.append(pictures, settings, result);

  const { renderer, backend } = await createTslRenderer();
  pictures.append(renderer.domElement);

  const frozenTime = uniform(exercise.time ?? FROZEN_TIME);
  const makeParams = () => Object.fromEntries(exercise.params.map((param) => [param.name, uniform(param.value)]));
  const shown = makeParams(); // driven by the sliders
  const checked = makeParams(); // set to each check in turn while measuring
  const build = (drill: Drill, params: typeof shown) => exercise.draw(drill, { uv: uv(), time: frozenTime, params });

  // Brad's mask is null until he writes it, and building it can throw.
  let problem: string | undefined;
  let yoursShown: Node<'float'> | null = null;
  let yoursChecked: Node<'float'> | null = null;
  try {
    yoursShown = build(drills.yours, shown);
    yoursChecked = build(drills.yours, checked);
  } catch (error) {
    problem = `Your \`${exercise.fn}\` threw an error: ${message(error)}`;
  }
  const referenceShown = saturate(build(drills.reference, shown)!);
  const referenceChecked = saturate(build(drills.reference, checked)!);

  // Three squares side by side: yours, the reference, and where they differ.
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x15171c);
  const camera = new THREE.OrthographicCamera(-1.65, 1.65, 0.55, -0.55, 0.1, 10);
  camera.position.z = 1;
  const square = new THREE.PlaneGeometry(1, 1);
  const outline = new THREE.EdgesGeometry(square);
  const yoursMaterial = yoursShown ? maskMaterial(saturate(yoursShown)) : new THREE.MeshBasicNodeMaterial({ color: 0x22252c });
  const yoursValue = yoursShown ? saturate(yoursShown) : float(0);
  const differenceMaterial = new THREE.MeshBasicNodeMaterial();
  // Orange where yours is brighter than the reference, blue where it's dimmer, black where they agree.
  differenceMaterial.colorNode = color(COLORS.orange)
    .mul(max(yoursValue.sub(referenceShown), 0))
    .add(color(COLORS.blue).mul(max(referenceShown.sub(yoursValue), 0)));
  [yoursMaterial, maskMaterial(referenceShown), differenceMaterial].forEach((material, i) => {
    const mesh = new THREE.Mesh(square, material);
    mesh.position.x = (i - 1) * 1.1;
    const edges = new THREE.LineSegments(outline, new THREE.LineBasicNodeMaterial({ color: 0x3a3f4a }));
    edges.position.copy(mesh.position);
    scene.add(mesh, edges);
  });

  const resize = () => {
    const width = pictures.clientWidth;
    if (width > 0) renderer.setSize(width, width / 3);
  };
  new ResizeObserver(resize).observe(pictures);
  resize();

  for (const param of exercise.params) {
    slider(settings, param.name, param, (value) => (shown[param.name].value = value));
  }

  // Draws each mask alone into a small offscreen picture at every check setting, reads the pixels
  // back, and returns the lowest match.
  const measure = async () => {
    const quadCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    quadCamera.position.z = 1;
    const quad = new THREE.Mesh(square, maskMaterial(saturate(yoursChecked!)));
    const quadScene = new THREE.Scene().add(quad);
    const referenceMaterial = maskMaterial(referenceChecked);
    const targets = [new THREE.RenderTarget(CHECK_SIZE, CHECK_SIZE), new THREE.RenderTarget(CHECK_SIZE, CHECK_SIZE)];
    const yoursMaskMaterial = quad.material;
    let lowest = 1;
    try {
      for (const check of exercise.checks) {
        for (const [name, value] of Object.entries(check)) checked[name].value = value;
        quad.material = yoursMaskMaterial;
        renderer.setRenderTarget(targets[0]);
        renderer.render(quadScene, quadCamera);
        quad.material = referenceMaterial;
        renderer.setRenderTarget(targets[1]);
        renderer.render(quadScene, quadCamera);
        renderer.setRenderTarget(null);
        const [yours, reference] = await Promise.all(
          targets.map((target) => renderer.readRenderTargetPixelsAsync(target, 0, 0, CHECK_SIZE, CHECK_SIZE)),
        );
        lowest = Math.min(lowest, similarity(yours, reference));
      }
    } finally {
      renderer.setRenderTarget(null);
      for (const target of targets) target.dispose();
    }
    return lowest;
  };

  const percent = (match: number) => `${Math.floor(match * 100)}%`;
  const settingsText = `${exercise.checks.length} settings`;
  if (problem) {
    result.textContent = problem;
  } else if (!yoursShown) {
    result.innerHTML = `Not answered yet: <code>${exercise.fn}</code> in <code>drill.ts</code> returns <code>null</code>. Write it and save; the page reloads with your picture.`;
    pictures.insertAdjacentHTML('beforeend', '<span class="empty">not answered yet</span>');
  } else {
    result.textContent = 'Measuring…';
    try {
      const match = await measure();
      if (match >= PASS_MATCH) {
        result.textContent = `Match: ${percent(match)}, the lowest of ${settingsText}. Solved. ${await onPass(match)}`;
      } else {
        result.textContent = `Match: ${percent(match)}, the lowest of ${settingsText}; ${percent(PASS_MATCH)} counts as solved. Orange marks where yours is brighter than the reference, blue where it's dimmer.`;
      }
    } catch (error) {
      result.textContent = `Your \`${exercise.fn}\` couldn't be drawn: ${message(error)}`;
      // Fall back to drawing without it, so the page doesn't hit the same error every frame.
      yoursMaterial.colorNode = color(0x22252c);
      differenceMaterial.colorNode = color(COLORS.blue).mul(referenceShown);
      yoursMaterial.needsUpdate = differenceMaterial.needsUpdate = true;
    }
  }

  renderer.setAnimationLoop(() => renderer.render(scene, camera));
  return backend;
}

// ---- Effect builds ----

// What an effect build's drill.ts gets: the viewer's scene and camera, and the selection.
export interface EffectViewer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  // `callback` runs whenever the selection changes, with the selected part, or with null when a
  // click misses the rack. It returns the effect's object, or null when there's nothing to show.
  onSelect(callback: (part: THREE.Object3D | null) => THREE.Object3D | null): void;
  onFrame(callback: (delta: number, elapsed: number) => void): void;
}

// An effect build's drill.ts exports its wiring as `effect`.
export type EffectSetup = (viewer: EffectViewer) => void;

// Frees the GPU memory of every mesh's geometry and material under `object`. Call it after taking
// an effect's object out of the scene; removing it alone frees nothing.
export function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) material.dispose();
  });
}

// A part's name as Blender had it, without the "(export) " marker Brad's files use.
const partName = (part: THREE.Object3D) => String(part.userData.name ?? part.name).replace(/^\(export\)\s*/, '');

const RACK_SIZE = 2.2;
const RACK_X = 1.3; // each rack stands this far from the middle
const CLICK_SLOP = 4; // CSS pixels a press can move and still count as a click, not an orbit
const FIRST_PART = 0; // selected when the page opens, so the reference shows straight away

// Mounts the product viewer in `container`: the rack twice on a floor, `yours` on the left and
// `reference` on the right. `hook` names Brad's function, for messages. Returns the backend.
export async function mountEffect(
  container: HTMLElement,
  effects: { yours?: EffectSetup; reference?: EffectSetup; hook: string },
): Promise<Backend> {
  const harness = await createTslHarness(container);
  const { scene, camera, controls, renderer } = harness;
  camera.position.set(0, 2.6, 6);
  controls.target.set(0, 0.9, 0);
  controls.update(); // aims the camera now, so a click before the first frame still picks right
  camera.updateMatrixWorld();

  // A product viewer's floor instead of the grid, and a light from above so the metal reads.
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(5, 64).rotateX(-Math.PI / 2),
    new THREE.MeshStandardNodeMaterial({ color: 0x23262d, roughness: 1 }),
  );
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(3, 6, 4);
  scene.add(floor, sun);

  const readout = overlay(container, 'readout');
  readout.textContent = 'loading rack-parts.glb…';
  const [left, right] = await Promise.all([loadModel(MODELS.rackParts), loadModel(MODELS.rackParts)]);

  const sides = [
    { model: left.scene, x: -RACK_X, text: 'Yours', color: COLORS.yellow, setup: effects.yours },
    { model: right.scene, x: RACK_X, text: 'Reference', color: COLORS.green, setup: effects.reference },
  ].map((side) => {
    scene.add(fitModel(side.model, RACK_SIZE, new THREE.Vector3(side.x, 0, 0)));
    const tag = label(side.text, side.color);
    tag.position.set(side.x, RACK_SIZE + 0.35, 0);
    scene.add(tag);
    const listeners: ((part: THREE.Object3D | null) => THREE.Object3D | null)[] = [];
    let problem: string | undefined;
    try {
      side.setup?.({
        scene,
        camera,
        onSelect: (callback) => listeners.push(callback),
        onFrame: harness.onFrame,
      });
    } catch (error) {
      problem = message(error);
    }
    return { ...side, listeners, problem };
  });
  scene.updateMatrixWorld();

  const yours = sides[0];
  const select = (index: number | null) => {
    scene.updateMatrixWorld(); // the effect measures the part in the world
    let yoursShows = false;
    let yoursProblem = yours.problem;
    let referenceProblem = sides[1].problem;
    for (const side of sides) {
      const part = index === null ? null : side.model.children[index];
      for (const listener of side.listeners) {
        try {
          const shown = listener(part);
          if (side === yours && shown) yoursShows = true;
        } catch (error) {
          if (side === yours) yoursProblem = message(error);
          else referenceProblem = message(error);
        }
      }
    }
    const lines = [
      index === null ? 'Click a part of either rack.' : `Selected: ${partName(left.scene.children[index])}`,
      'Drag to orbit. Both racks select the same part.',
    ];
    if (!yours.setup) lines.push("Yours: drill.ts doesn't export `effect`");
    else if (yoursProblem) lines.push(`Yours: error: ${yoursProblem}`);
    else if (index !== null && !yoursShows) lines.push(`Yours: ${effects.hook} returned null`);
    if (referenceProblem) lines.push(`Reference error: ${referenceProblem}`);
    readout.textContent = lines.join('\n');
  };

  // The part a clicked mesh belongs to: the model's child that holds it.
  const partIndex = (object: THREE.Object3D) => {
    let current = object;
    while (current.parent && current.parent !== left.scene && current.parent !== right.scene) current = current.parent;
    return current.parent ? current.parent.children.indexOf(current) : null;
  };

  // Only the two racks are tested, so the floor, the labels, and the effects never catch a click.
  const raycaster = new THREE.Raycaster();
  const canvas = renderer.domElement;
  const pressed = new THREE.Vector2();
  canvas.addEventListener('pointerdown', (event) => pressed.set(event.clientX, event.clientY));
  canvas.addEventListener('pointerup', (event) => {
    if (event.button !== 0 || pressed.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > CLICK_SLOP) return;
    raycaster.setFromCamera(pointerToNdc(event, canvas), camera);
    const [hit] = raycaster.intersectObjects([left.scene, right.scene], true);
    select(hit ? partIndex(hit.object) : null);
  });

  select(FIRST_PART);
  return harness.backend;
}
