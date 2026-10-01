// Shared scene for visual drills: renderer, camera, scene, controls, frame loop.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { onLeave } from './teardown';

type FrameCallback = (delta: number, elapsed: number) => void;

export interface Harness {
  container: HTMLElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  onFrame(callback: FrameCallback): void;
}

// A drill's scenes.ts exports these by name; the viewer mounts each where the README says.
export type SceneSetup = (harness: Harness) => void;

export function createHarness(container: HTMLElement): Harness {
  // stencil: true because three.js leaves the stencil buffer off by default, and the stencil page's
  // scenes need one.
  const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
  const timer = new THREE.Timer();
  timer.connect(document);
  renderer.setAnimationLoop((time) => {
    timer.update(time);
    for (const callback of callbacks) callback(timer.getDelta(), timer.getElapsed());
    controls.update();
    renderer.render(scene, camera);
  });
  // Browsers cap live WebGL contexts, so leaving a page has to give its context back.
  onLeave(container, () => {
    renderer.setAnimationLoop(null);
    observer.disconnect();
    controls.dispose();
    timer.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  });

  return {
    container,
    renderer,
    scene,
    camera,
    controls,
    onFrame: (callback) => callbacks.push(callback),
  };
}
