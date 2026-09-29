// Shared scene for TSL pages (the Procedural & VFX elective): the same setup as scene.ts, but on
// WebGPURenderer from three/webgpu, so materials can be built from three/tsl nodes. It falls back
// to WebGL 2 where WebGPU is missing. three/webgpu and three share three.core.js, so addons such as
// OrbitControls, and helpers built on `three` like harness/models.ts and harness/lesson.ts, work
// with it too.
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three/webgpu';

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
}

// A TSL page's scenes.ts exports these by name; the viewer mounts each where the README says.
export type TslSceneSetup = (harness: TslHarness) => void;

// `?backend=webgl` in the page's URL forces the WebGL 2 fallback, to check a page on both.
const forceWebGL = new URLSearchParams(location.search).get('backend') === 'webgl';

// Creates a WebGPURenderer with the viewer's settings and waits for it to be ready. In r186,
// render() throws until the renderer has picked its backend, so callers await this first.
export async function createTslRenderer(options: { antialias?: boolean } = {}) {
  const renderer = new THREE.WebGPURenderer({ antialias: options.antialias ?? true, forceWebGL });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  await renderer.init();
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
  new ResizeObserver(resize).observe(container);
  resize();

  const callbacks: FrameCallback[] = [];
  const timer = new THREE.Timer();
  timer.connect(document);
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    for (const callback of callbacks) callback(timer.getDelta(), timer.getElapsed());
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    container,
    renderer,
    scene,
    camera,
    controls,
    backend,
    onFrame: (callback) => callbacks.push(callback),
  };
}
