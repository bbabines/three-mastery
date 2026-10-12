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

// A synthetic pebbled-leather set, made in code so the second finish needs no download.
// It is a stand-in for a second scanned leather, not a measured material.
const PEBBLE_SIZE = 256, PEBBLE_CELLS = 16;
function hash(x: number, y: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function pebbleMaps(): { normal: Uint8Array; roughness: Uint8Array } {
  const height = new Float32Array(PEBBLE_SIZE * PEBBLE_SIZE);
  const cell = PEBBLE_SIZE / PEBBLE_CELLS;
  for (let y = 0; y < PEBBLE_SIZE; y++) for (let x = 0; x < PEBBLE_SIZE; x++) {
    const gx = x / cell, gy = y / cell;
    let top = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const cx = Math.floor(gx) + dx, cy = Math.floor(gy) + dy;
      const wx = (cx + PEBBLE_CELLS) % PEBBLE_CELLS, wy = (cy + PEBBLE_CELLS) % PEBBLE_CELLS; // wraps, so the map tiles
      const radius = 0.45 + 0.2 * hash(wx, wy, 3);
      const d = Math.hypot(gx - (cx + 0.2 + 0.6 * hash(wx, wy, 1)), gy - (cy + 0.2 + 0.6 * hash(wx, wy, 2))) / radius;
      if (d < 1) top = Math.max(top, Math.cos(d * Math.PI / 2));
    }
    height[y * PEBBLE_SIZE + x] = top;
  }
  const normal = new Uint8Array(PEBBLE_SIZE * PEBBLE_SIZE * 4), roughness = new Uint8Array(PEBBLE_SIZE * PEBBLE_SIZE * 4);
  const at = (x: number, y: number) => height[((y + PEBBLE_SIZE) % PEBBLE_SIZE) * PEBBLE_SIZE + (x + PEBBLE_SIZE) % PEBBLE_SIZE];
  const n = new THREE.Vector3();
  for (let y = 0; y < PEBBLE_SIZE; y++) for (let x = 0; x < PEBBLE_SIZE; x++) {
    const i = (y * PEBBLE_SIZE + x) * 4;
    n.set(-(at(x + 1, y) - at(x - 1, y)) * 2, -(at(x, y + 1) - at(x, y - 1)) * 2, 1).normalize();
    normal[i] = (n.x * 0.5 + 0.5) * 255; normal[i + 1] = (n.y * 0.5 + 0.5) * 255; normal[i + 2] = (n.z * 0.5 + 0.5) * 255; normal[i + 3] = 255;
    // three.js reads roughness from green: worn pebble tops are smoother than the creases.
    roughness[i] = roughness[i + 1] = roughness[i + 2] = (0.85 - 0.4 * at(x, y)) * 255; roughness[i + 3] = 255;
  }
  return { normal, roughness };
}
function mapTexture(data: Uint8Array, name: string): THREE.DataTexture {
  const texture = new THREE.DataTexture(data, PEBBLE_SIZE, PEBBLE_SIZE);
  texture.name = name;
  texture.colorSpace = THREE.NoColorSpace; // data, not color
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

type Variant = 'reference' | 'pebbled';
type Method = 'reuse' | 'leak';
const VARIANT_NAMES: Record<Variant, string> = { reference: 'reference leather · silver', pebbled: 'pebbled chestnut (synthetic maps) · warm metal' };

export const stability: SceneSetup = (harness) => watchLab(harness, (lab) => {
  const { renderer, scene, camera } = harness;
  const metal = lab.materials.get('metal');

  // Made once. The second finish has its own maps and materials; every switch reuses them.
  const pebbles = pebbleMaps();
  const pebbledNormal = mapTexture(pebbles.normal, 'pebbled normal (synthetic)');
  const pebbledRoughness = mapTexture(pebbles.roughness, 'pebbled roughness (synthetic)');
  const pebbledStrap = lab.strap.clone();
  pebbledStrap.name = 'strap · pebbled (synthetic)';
  pebbledStrap.color.setHex(0x703d22);
  pebbledStrap.normalMap = pebbledNormal;
  pebbledStrap.normalScale.set(0.8, 0.8);
  pebbledStrap.roughnessMap = pebbledRoughness; // a shader feature the reference strap lacks: it needs its own program
  pebbledStrap.roughness = 1; // the map supplies the value
  const warmMetal = metal?.clone();
  if (warmMetal) { warmMetal.name = 'metal · warm'; warmMetal.color.setHex(0xc9a965); }
  const swaps = new Map<THREE.Material, THREE.Material>([[lab.strap, pebbledStrap]]);
  if (metal && warmMetal) swaps.set(metal, warmMetal);
  const meshes: { mesh: THREE.Mesh; original: THREE.Material | THREE.Material[] }[] = [];
  lab.model.traverse((object) => { if (object instanceof THREE.Mesh) meshes.push({ mesh: object, original: object.material }); });
  const swapped = (material: THREE.Material) => swaps.get(material) ?? material;

  let variant: Variant = 'reference';
  let method: Method = 'reuse';
  let warmed = false, left = false;
  let result: { method: Method; switches: number; before: Counts; after: Counts; stable: boolean } | null = null;
  const leaked: THREE.Texture[] = [];

  function show(name: Variant) {
    variant = name;
    for (const { mesh, original } of meshes) {
      mesh.material = name === 'reference' ? original : Array.isArray(original) ? original.map(swapped) : swapped(original);
    }
  }
  function apply(name: Variant) {
    if (name === 'pebbled' && method === 'leak') {
      // Broken on purpose: new pixels (a new upload) on every switch, and the old textures are never disposed.
      const normal = mapTexture(pebbles.normal.slice(), 'leaked normal'), roughness = mapTexture(pebbles.roughness.slice(), 'leaked roughness');
      leaked.push(normal, roughness);
      pebbledStrap.normalMap = normal; pebbledStrap.roughnessMap = roughness;
    }
    show(name);
  }
  type Counts = { textures: number; geometries: number; programs: number };
  function counts(): Counts { return { textures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries, programs: renderer.info.programs?.length ?? 0 }; }
  function report() {
    const lines = [
      `Showing: ${VARIANT_NAMES[variant]}`,
      `Switch method: ${method === 'reuse' ? 'reuse the preloaded maps (correct)' : 'allocate a new texture each switch (broken)'}`,
      warmed ? 'Warm-up done: both finishes\' maps uploaded and shaders compiled before the first switch.' : 'Warming up: uploading both finishes\' maps and compiling their shaders…',
    ];
    if (result) {
      const { before, after } = result;
      lines.push(`Last sweep (${result.method === 'reuse' ? 'reuse' : 'new texture each switch'}, ${result.switches} switches): textures ${before.textures} → ${after.textures} · geometries ${before.geometries} → ${after.geometries} · shader programs ${before.programs} → ${after.programs}`);
      const grew = (['textures', 'geometries', 'programs'] as const).filter((key) => after[key] !== before[key])
        .map((key) => `${key === 'programs' ? 'shader programs' : key} grew by ${after[key] - before[key]}`);
      lines.push(result.stable ? 'PASS: switching created nothing new on the GPU.'
        : `FAIL: ${grew.join(', ')} during switching. ${after.textures > before.textures ? 'Each switch made new textures and never freed the old ones.' : 'Something was created on first use instead of during warm-up.'}`);
    } else lines.push('Run the sweep to compare renderer counts after warm-up and after 24 switches.');
    if (leaked.length) lines.push(`${leaked.length} leaked textures stay in GPU memory until you leave this page.`);
    lab.setReadout(lines.join('\n'));
  }

  // Warm-up: upload both finishes' maps, then compile each finish's shaders while it is applied.
  // compile() assigns programs synchronously, so the scene never draws the pebbled finish here.
  const warming = (async () => {
    const shown = variant;
    for (const texture of [lab.normalTexture, pebbledNormal, pebbledRoughness]) renderer.initTexture(texture);
    show('pebbled'); const pebbledReady = renderer.compileAsync(scene, camera);
    show('reference'); const referenceReady = renderer.compileAsync(scene, camera);
    show(shown);
    await Promise.all([pebbledReady, referenceReady]);
    if (left) return;
    // The glass is transmissive: three.js also draws the scene behind it into its own target,
    // with tone mapping off, and compile() can't prepare that pass. Draw each finish once in the
    // same task; only the last draw reaches the screen, so the pebbled finish never flashes.
    show('pebbled'); renderer.render(scene, camera);
    show('reference'); renderer.render(scene, camera);
    show(shown); renderer.render(scene, camera);
    warmed = true;
    if (!left) report();
  })();

  async function sweep() {
    await warming;
    if (left) return;
    const previous = variant;
    const before = counts();
    for (let i = 0; i < 24; i++) { apply(i % 2 ? 'reference' : 'pebbled'); renderer.render(scene, camera); }
    const after = counts();
    // Put the preloaded maps back; leaked textures stay allocated, as a real leak would.
    pebbledStrap.normalMap = pebbledNormal; pebbledStrap.roughnessMap = pebbledRoughness;
    show(previous);
    result = { method, switches: 24, before, after, stable: before.textures === after.textures && before.geometries === after.geometries && before.programs === after.programs };
    report();
  }

  lab.addSelect('variant', { reference: () => { apply('reference'); report(); }, 'pebbled chestnut (synthetic)': () => { apply('pebbled'); report(); } });
  lab.addSelect('switch method', {
    'reuse preloaded maps (correct)': () => { method = 'reuse'; pebbledStrap.normalMap = pebbledNormal; pebbledStrap.roughnessMap = pebbledRoughness; report(); },
    'allocate a new texture each switch (broken)': () => { method = 'leak'; report(); },
  });
  lab.addButton('run 24 variant switches', () => { void sweep(); });
  lab.registerEvidence(() => ({ variant, method, warmed, sweep: result, leakedTextures: leaked.length, syntheticMaps: 'pebbled normal and roughness are generated in code, not measured leather', note: 'Synchronous count sweep checks allocation stability, not interaction latency or GPU duration.' }));
  lab.onLeave(() => {
    left = true;
    for (const { mesh, original } of meshes) mesh.material = original;
    pebbledStrap.dispose(); warmMetal?.dispose();
    for (const texture of [pebbledNormal, pebbledRoughness, ...leaked]) texture.dispose();
  });
  report();
});
