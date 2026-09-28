// TSL sandbox. Outside the curriculum: see experiments/README.md.
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { color, mix, normalLocal, positionLocal, sin, time, uv } from 'three/tsl';
import * as THREE from 'three/webgpu';

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);
await renderer.init();

const backendLabel = 'isWebGPUBackend' in renderer.backend ? 'WebGPU' : 'WebGL 2 fallback';
document.querySelector('#backend')!.textContent = `Backend: ${backendLabel}`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 4);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Starting node graph: a gradient along v that drifts over time, and a ripple along the normals.
const material = new THREE.MeshBasicNodeMaterial();
material.colorNode = mix(color(0x1e3a8a), color(0xf97316), uv().y.add(sin(time).mul(0.2)));
const ripple = sin(time.mul(2).add(positionLocal.y.mul(6))).mul(0.04);
material.positionNode = positionLocal.add(normalLocal.mul(ripple));

scene.add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.28, 200, 32), material));

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
