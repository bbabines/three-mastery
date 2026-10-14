// Shared scene for TSL pages (the Procedural & VFX elective): the same setup as scene.ts, but on
// WebGPURenderer from three/webgpu, so materials can be built from three/tsl nodes. It falls back
// to WebGL 2 where WebGPU is missing. three/webgpu and three share three.core.js, so addons such as
// OrbitControls, and helpers built on `three` like harness/models.ts and harness/lesson.ts, work
// with it too.
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { toneMappingExposure } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { onLeave } from './teardown';

type FrameCallback = (delta: number, elapsed: number) => void;

export type Backend = 'WebGPU' | 'WebGL 2';

export interface TslHarness {
  container: HTMLElement;
  renderer: THREE.WebGPURenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  backend: Backend; // what the renderer ended up running on
  onFrame(callback: FrameCallback): void;
  // Draws each frame with `draw` instead of rendering the scene, for a page with its own
  // RenderPipeline. null goes back to rendering the scene.
  drawWith(draw: (() => void) | null): void;
}

// A TSL page's scenes.ts exports these by name; the viewer mounts each where the README says.
export type TslSceneSetup = (harness: TslHarness) => void;

// `?backend=webgl` in the page's URL forces the WebGL 2 fallback, to check a page on both.
const forceWebGL = new URLSearchParams(location.search).get('backend') === 'webgl';

// r186's renderer puts a 'dispose' listener on every texture and render target it uploads, and
// renderer.dispose() leaves them there. Most of those go away with their page, but some live for
// the whole visit, like the small lighting table every standard material reads (DFG_LUT, made once
// by three.js), and each listener kept its renderer, and through it the page's scene and models,
// in memory: about 45 MB a page. So each renderer notes what it uploads, and disposeTslRenderer
// takes its listeners off whatever is still around.
interface UploadMap {
  updateTexture(...args: unknown[]): unknown;
  updateRenderTarget(...args: unknown[]): unknown;
  has(item: object): boolean;
  get(item: object): { onDispose?: () => void };
}
const uploads = new WeakMap<THREE.WebGPURenderer, Set<THREE.EventDispatcher<{ dispose: object }>>>();
const uploadMap = (renderer: THREE.WebGPURenderer) => (renderer as unknown as { _textures: UploadMap })._textures;

function trackUploads(renderer: THREE.WebGPURenderer) {
  const map = uploadMap(renderer);
  const seen = new Set<THREE.EventDispatcher<{ dispose: object }>>();
  uploads.set(renderer, seen);
  const note = (item: unknown) => {
    seen.add(item as THREE.EventDispatcher<{ dispose: object }>);
    // Forget what's already been disposed, so a long visit doesn't pile them up.
    if (seen.size % 512 === 0) for (const old of seen) if (!map.has(old)) seen.delete(old);
  };
  const { updateTexture, updateRenderTarget } = map;
  map.updateTexture = function (this: UploadMap, ...args) {
    note(args[0]);
    return updateTexture.apply(this, args);
  };
  map.updateRenderTarget = function (this: UploadMap, ...args) {
    note(args[0]);
    return updateRenderTarget.apply(this, args);
  };
}

// Disposes a renderer made by createTslRenderer and lets go of everything it held.
export function disposeTslRenderer(renderer: THREE.WebGPURenderer) {
  // The renderer's own picture for post-processing has a listener of the renderer's on its
  // texture, and three.js keeps the last render target it drew to in a few module variables
  // (PMREMGenerator's _oldTarget, the shadow pass's saved state). Disposing that texture now runs
  // and removes the listener, so such a leftover doesn't keep this renderer.
  const frameTargets = (renderer as unknown as { _frameBufferTargets?: Map<unknown, THREE.RenderTarget> })._frameBufferTargets;
  for (const target of frameTargets?.values() ?? []) for (const texture of target.textures) texture.dispose();
  const map = uploadMap(renderer);
  for (const item of uploads.get(renderer) ?? []) {
    if (!map.has(item)) continue;
    const { onDispose } = map.get(item);
    if (onDispose) item.removeEventListener('dispose', onDispose);
  }
  uploads.delete(renderer);
  // Tone mapping's exposure is one node for every renderer, and it remembers the last one it read.
  const exposure = toneMappingExposure as unknown as { reference: unknown };
  if (exposure.reference === renderer) exposure.reference = null;
  // Some of three's add-ons keep their last material in a module variable, and through it the last
  // renderer. Taking the canvas out of the page means such a renderer can't also hold on to the
  // left page, and through its buttons every other renderer on it.
  renderer.domElement.remove();
  renderer.dispose();
}

// Creates a WebGPURenderer with the viewer's settings and waits for it to be ready. In r186,
// render() throws until the renderer has picked its backend, so callers await this first.
export async function createTslRenderer(options: { antialias?: boolean } = {}) {
  const renderer = new THREE.WebGPURenderer({ antialias: options.antialias ?? true, forceWebGL });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  await renderer.init();
  trackUploads(renderer);
  const backend: Backend = (renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend ? 'WebGPU' : 'WebGL 2';
  return { renderer, backend };
}

export async function createTslHarness(container: HTMLElement): Promise<TslHarness> {
  const { renderer, backend } = await createTslRenderer();
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x15171c);
  scene.add(new THREE.GridHelper(10, 10, 0x555555, 0x2c2f36));
  scene.add(new THREE.AxesHelper(1));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x404040, 2));

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(4, 4, 7);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = container;
    if (width === 0 || height === 0) return; // hidden, e.g. inside a collapsed section
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  const callbacks: FrameCallback[] = [];
  let draw: (() => void) | null = null;
  const timer = new THREE.Timer();
  timer.connect(document);
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    for (const callback of callbacks) callback(timer.getDelta(), timer.getElapsed());
    controls.update();
    if (draw) draw();
    else renderer.render(scene, camera);
  });
  onLeave(container, () => {
    renderer.setAnimationLoop(null);
    observer.disconnect();
    controls.dispose();
    timer.dispose();
    disposeTslRenderer(renderer);
  });

  return {
    container,
    renderer,
    scene,
    camera,
    controls,
    backend,
    onFrame: (callback) => callbacks.push(callback),
    drawWith: (next) => {
      draw = next;
    },
  };
}
