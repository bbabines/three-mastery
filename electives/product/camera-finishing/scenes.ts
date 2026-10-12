import { drawYourself } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { watchLab } from '../lab';

export const lens: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { camera, controls } = harness;
  const direction = camera.position.clone().sub(controls.target).normalize();
  const referenceDistance = camera.position.distanceTo(controls.target);
  const referenceFov = camera.fov;
  controls.minDistance = 1;
  controls.maxDistance = 40; // matched narrow-lens framing must not hit the stage's 12-unit limit
  let fov = referenceFov;
  let match = true;
  function apply() {
    const distance = match ? referenceDistance * Math.tan(THREE.MathUtils.degToRad(referenceFov / 2)) / Math.tan(THREE.MathUtils.degToRad(fov / 2)) : referenceDistance;
    camera.fov = fov;
    camera.position.copy(direction).multiplyScalar(distance).add(controls.target);
    camera.updateProjectionMatrix(); controls.update();
    lab.setReadout(`camera.fov = ${fov}° · distance ${distance.toFixed(2)}\n${match ? 'matching center-plane framing' : 'fixed camera distance'}\nCompare near/far strap size and case depth.`);
  }
  const fovSlider = lab.addSlider('field of view', 15, 65, 5, fov, (v) => { fov = v; apply(); });
  lab.addSelect('framing', { matched: () => { match = true; apply(); }, 'fixed distance': () => { match = false; apply(); } });
  lab.addButton('reference lens', () => { fovSlider.value = String(referenceFov); fovSlider.dispatchEvent(new Event('input')); });
  lab.registerEvidence(() => ({ fov, matchedFraming: match, referenceFov, cameraPosition: camera.position.toArray() }));
  apply();
});

export const finish: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { renderer, camera, controls, container } = harness;
  const originalScene = harness.scene;
  const world = drawYourself(harness);
  world.environment = originalScene.environment;
  world.environmentIntensity = originalScene.environmentIntensity;
  world.environmentRotation.copy(originalScene.environmentRotation);
  harness.scene = world;
  const composer = new EffectComposer(renderer);
  const render = new RenderPass(world, camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.035, 0.6, 1.82);
  bloom.enabled = false;
  const output = new OutputPass();
  composer.addPass(render); composer.addPass(bloom); composer.addPass(output);
  renderer.setPixelRatio(1);
  let dpr = 1;
  let moving = false;
  let samples = 0;
  let tone = 'ACES';
  function resize() {
    const size = renderer.getSize(new THREE.Vector2());
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(size.x, size.y);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  lab.onLeave(() => {
    observer.disconnect(); lab.setCaptureRenderer(null);
    bloom.dispose(); output.dispose(); composer.dispose();
  });
  function draw() { resizeIfNeeded(); composer.render(); }
  let lastSize = '';
  function resizeIfNeeded() {
    const size = renderer.getSize(new THREE.Vector2());
    const key = `${size.x}:${size.y}:${renderer.getPixelRatio()}`;
    if (key !== lastSize) { lastSize = key; resize(); }
  }
  lab.setCaptureRenderer(draw);
  function report() {
    lab.setReadout(`DPR ${dpr.toFixed(1)} · offscreen MSAA requested ${samples}\n${tone} · bloom ${bloom.enabled ? bloom.strength.toFixed(3) : 'off'} · threshold ${bloom.threshold.toFixed(2)}\n${moving ? 'moving: inspect highlight shimmer' : 'still: inspect grain and crisp edges'}`);
  }
  lab.addSelect('resolution', { 'DPR 1': () => { dpr = 1; renderer.setPixelRatio(dpr); report(); }, 'DPR 1.5': () => { dpr = 1.5; renderer.setPixelRatio(dpr); report(); }, 'DPR 2': () => { dpr = 2; renderer.setPixelRatio(dpr); report(); } });
  lab.addSelect('offscreen samples', {
    off: () => { samples = 0; composer.renderTarget1.samples = composer.renderTarget2.samples = samples; composer.renderTarget1.dispose(); composer.renderTarget2.dispose(); report(); },
    'request 4': () => { samples = Math.min(4, renderer.capabilities.maxSamples); composer.renderTarget1.samples = composer.renderTarget2.samples = samples; composer.renderTarget1.dispose(); composer.renderTarget2.dispose(); report(); },
  });
  lab.addSelect('bloom', { off: () => { bloom.enabled = false; report(); }, restrained: () => { bloom.enabled = true; bloom.strength = 0.035; report(); }, excessive: () => { bloom.enabled = true; bloom.strength = 0.3; report(); } });
  lab.addSlider('bloom threshold', 0.5, 3, 0.02, 1.82, (v) => { bloom.threshold = v; report(); });
  lab.addSelect('tone mapping', {
    ACES: () => { renderer.toneMapping = THREE.ACESFilmicToneMapping; tone = 'ACES'; report(); },
    Neutral: () => { renderer.toneMapping = THREE.NeutralToneMapping; tone = 'Neutral'; report(); },
    AgX: () => { renderer.toneMapping = THREE.AgXToneMapping; tone = 'AgX'; report(); },
  });
  lab.addButton('toggle continuous orbit', () => { moving = !moving; controls.autoRotate = moving; controls.autoRotateSpeed = 0.6; report(); });
  lab.registerEvidence(() => ({ dpr, requestedOffscreenSamples: samples, bloom: { enabled: bloom.enabled, strength: bloom.strength, threshold: bloom.threshold, radius: bloom.radius }, tone, moving, finishing: 'RenderPass → optional UnrealBloomPass → OutputPass; no WebGi parity claim' }));
  harness.onFrame(draw);
  report();
});
