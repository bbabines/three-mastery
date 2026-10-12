import { collectResources, formatBytes, geometryBytes } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { watchLab } from '../lab';

function rgbaEquivalent(texture: THREE.Texture): number {
  const image = texture.image as { width?: number; height?: number } | undefined;
  return (image?.width ?? 0) * (image?.height ?? 0) * 4 * (texture.generateMipmaps ? 4 / 3 : 1);
}
function quantile(values: number[], fraction: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) * fraction)] ?? 0;
}

export const budget: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { renderer, controls } = harness;
  const resources = collectResources(lab.model);
  const geometryEstimate = [...resources.geometries].reduce((n, geometry) => n + geometryBytes(geometry), 0);
  const textureEstimate = [...resources.textures].reduce((n, texture) => n + rgbaEquivalent(texture), 0);
  const samples: number[] = [];
  let preset = 'DPR 1 / filtering 1';
  let rotating = false;
  function quality(dpr: number, filtering: number, name: string) {
    preset = name;
    renderer.setPixelRatio(dpr);
    for (const texture of resources.textures) { texture.anisotropy = Math.min(filtering, renderer.capabilities.getMaxAnisotropy()); texture.needsUpdate = true; }
    samples.length = 0;
  }
  quality(1, 1, preset);
  lab.addSelect('quality', {
    'DPR 1 / filtering 1': () => quality(1, 1, 'DPR 1 / filtering 1'),
    'DPR 1.5 / filtering 4': () => quality(1.5, 4, 'DPR 1.5 / filtering 4'),
    'DPR 2 / filtering 8': () => quality(2, 8, 'DPR 2 / filtering 8'),
  });
  lab.addButton('toggle continuous orbit', () => { rotating = !rotating; controls.autoRotate = rotating; controls.autoRotateSpeed = 0.6; samples.length = 0; });
  lab.addButton('clear interval sample', () => { samples.length = 0; });
  harness.onFrame((delta) => {
    if (document.visibilityState === 'visible' && delta > 0) { samples.push(delta * 1000); if (samples.length > 120) samples.shift(); }
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    lab.setReadout(`${preset} · buffer ${size.x} × ${size.y}\nPrevious renderer.render call: ${renderer.info.render.calls} draws / ${renderer.info.render.triangles.toLocaleString()} triangles\nIntervals n=${samples.length}: median ${quantile(samples, 0.5).toFixed(1)} ms / p95 ${quantile(samples, 0.95).toFixed(1)} ms (not GPU time)\nModel buffers ≈${formatBytes(geometryEstimate)} · maps RGBA8 equivalent ≈${formatBytes(textureEstimate)}`);
  });
  lab.registerEvidence(() => ({ preset, rotating, drawingBuffer: renderer.getDrawingBufferSize(new THREE.Vector2()).toArray(), previousRender: { scope: 'previous renderer.render call, not a complete multi-render composer frame', ...renderer.info.render }, resources: { ...renderer.info.memory }, modelGeometryByteEstimate: geometryEstimate, modelMapRGBA8EquivalentByteEstimate: textureEstimate, intervalSamples: samples.length, intervalMedianMs: quantile(samples, 0.5), intervalP95Ms: quantile(samples, 0.95), gpuTimingMeasured: false, note: 'Map estimate excludes EXR, PMREM, framebuffer, driver overhead, and postprocessing targets. This browser is not evidence of phone performance.' }));
});

export const stability: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { renderer, scene, camera } = harness;
  const source = lab.strap.color.clone();
  const metal = lab.materials.get('metal');
  const metalColor = metal?.color.clone();
  let variant = 'reference';
  let result: Record<string, unknown> = {};
  function apply(name: string) {
    variant = name;
    if (name === 'reference') { lab.strap.color.copy(source); if (metal && metalColor) metal.color.copy(metalColor); }
    else { lab.strap.color.setHex(0x703d22); metal?.color.setHex(0xc9a965); }
    // Reuse the same material, geometry and textures. No shader feature changes.
  }
  function counts() { return { textures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries, programs: renderer.info.programs?.length ?? 0 }; }
  function report() { lab.setReadout(`variant: ${variant} · maps/materials reused\n${Object.keys(result).length ? JSON.stringify(result) : 'Run the variant sweep after the model has drawn.'}\nStable counts support resource reuse; inspect both looks by eye.`); }
  lab.addSelect('variant', { reference: () => { apply('reference'); report(); }, 'warm / chestnut': () => { apply('warm / chestnut'); report(); } });
  lab.addButton('run 24 variant switches', () => {
    const previous = variant;
    apply('reference'); renderer.render(scene, camera);
    apply('warm / chestnut'); renderer.render(scene, camera); // warm both before taking baseline
    const before = counts();
    for (let i = 0; i < 24; i++) { apply(i % 2 ? 'reference' : 'warm / chestnut'); renderer.render(scene, camera); }
    const after = counts();
    apply(previous);
    result = { switches: 24, before, after, stable: before.textures === after.textures && before.geometries === after.geometries && before.programs === after.programs };
    report();
  });
  lab.registerEvidence(() => ({ variant, sweep: result, note: 'Synchronous count sweep checks allocation stability, not interaction latency or GPU duration.' }));
  report();
});
