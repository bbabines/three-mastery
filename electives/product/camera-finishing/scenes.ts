import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { watchLab } from '../lab';

export const lens: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { camera, controls } = harness;
  const direction = camera.position.clone().sub(controls.target).normalize();
  const referenceDistance = camera.position.distanceTo(controls.target);
  const referenceFov = camera.fov;
  controls.minDistance = 1;
  controls.maxDistance = 40; // matched narrow-lens framing must not hit the stage's 16-unit limit
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

// The stage's own finishing chain (lab.finishing), started from a bare baseline so each tool can
// be added on its own: one frame, no offscreen MSAA, no bloom.
export const finish: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { renderer, controls } = harness;
  const { ao, accumulate, bloom, output } = lab.finishing;
  const reference = { strength: bloom.strength, contrast: output.contrast, still: accumulate.maxSamples };
  let dpr = 1;
  let moving = false;
  let samples = 0;
  let tone = 'ACES';
  // MSAA on the scene picture of each frame's first sample; jittered still samples never use it.
  function setSamples(count: number) { samples = count; lab.finishing.multisample = count; }
  renderer.setPixelRatio(dpr);
  setSamples(0);
  accumulate.maxSamples = 1;
  bloom.enabled = false;
  function report() {
    lab.setReadout(`DPR ${dpr.toFixed(1)} · offscreen MSAA requested ${samples} · still: ${accumulate.maxSamples === 1 ? 'one frame' : `${accumulate.maxSamples} jittered frames`}\n${tone} · contrast ${output.contrast.toFixed(2)} · AO ${ao.enabled ? 'on' : 'off'} · bloom ${bloom.enabled ? bloom.strength.toFixed(3) : 'off'} · threshold ${bloom.threshold.toFixed(2)}\n${moving ? 'moving: inspect highlight shimmer' : 'still: inspect grain and crisp edges'}`);
  }
  lab.addSelect('resolution', { 'DPR 1': () => { dpr = 1; renderer.setPixelRatio(dpr); report(); }, 'DPR 1.5': () => { dpr = 1.5; renderer.setPixelRatio(dpr); report(); }, 'DPR 2': () => { dpr = 2; renderer.setPixelRatio(dpr); report(); } });
  lab.addSelect('offscreen samples', {
    off: () => { setSamples(0); report(); },
    'request 4': () => { setSamples(Math.min(4, renderer.capabilities.maxSamples)); report(); },
  });
  lab.addSelect('still accumulation', {
    'one frame': () => { accumulate.maxSamples = 1; report(); },
    [`${reference.still} jittered frames`]: () => { accumulate.maxSamples = reference.still; report(); },
  });
  lab.addSelect('bloom', { off: () => { bloom.enabled = false; report(); }, restrained: () => { bloom.enabled = true; bloom.strength = reference.strength; report(); }, excessive: () => { bloom.enabled = true; bloom.strength = 0.3; report(); } });
  lab.addSlider('bloom threshold', 0.5, 3, 0.02, bloom.threshold, (v) => { bloom.threshold = v; report(); });
  lab.addSelect('tone mapping', {
    ACES: () => { renderer.toneMapping = THREE.ACESFilmicToneMapping; tone = 'ACES'; report(); },
    Neutral: () => { renderer.toneMapping = THREE.NeutralToneMapping; tone = 'Neutral'; report(); },
    AgX: () => { renderer.toneMapping = THREE.AgXToneMapping; tone = 'AgX'; report(); },
  });
  lab.addSelect('contrast', { [`${reference.contrast} (reference)`]: () => { output.contrast = reference.contrast; report(); }, '1 (none)': () => { output.contrast = 1; report(); } });
  lab.addSelect('ambient occlusion', { on: () => { ao.enabled = true; report(); }, off: () => { ao.enabled = false; report(); } });
  lab.addButton('toggle continuous orbit', () => { moving = !moving; controls.autoRotate = moving; controls.autoRotateSpeed = 0.6; report(); });
  lab.registerEvidence(() => ({ dpr, requestedOffscreenSamples: samples, stillFrames: accumulate.maxSamples, bloom: { enabled: bloom.enabled, strength: bloom.strength, threshold: bloom.threshold, radius: bloom.radius }, tone, contrast: output.contrast, ambientOcclusion: ao.enabled, moving, finishing: 'stage chain: GTAO (applied to environment light in the materials) → RenderPass → accumulation → UnrealBloomPass → OutputPass + contrast' }));
  report();
});
