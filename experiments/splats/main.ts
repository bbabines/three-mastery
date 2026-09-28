// Gaussian splat sandbox using Spark. Outside the curriculum: see experiments/README.md.
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Any .spz, .ply, .splat, .ksplat, or .sog URL. This is Spark's sample asset.
const SPLAT_URL = 'https://sparkjs.dev/assets/splats/butterfly.spz';

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 0, 3);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Spark sorts and draws every SplatMesh in the scene through this one object.
scene.add(new SparkRenderer({ renderer }));

const status = document.querySelector('#status')!;
const splats = new SplatMesh({
  url: SPLAT_URL,
  onLoad: () => {
    status.textContent = SPLAT_URL.split('/').at(-1) ?? '';
  },
});
// Many splat files are y-down; this rotation turns them upright.
splats.quaternion.set(1, 0, 0, 0);
scene.add(splats);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
