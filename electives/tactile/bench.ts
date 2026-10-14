// The lighting bench every Tactile materials page builds on: a material sample (a swatch leaning on
// the ground and a roll lying in front of it), an optional gray ball and chrome ball for reading the
// light, a ground that catches shadows, one key light you can move, an optional rim light, and an
// HDRI from the catalog. Units are meters, and the samples' UVs are measured in meters, so a
// texture's repeat of 1 / size puts it at its real size.
//
// Pages build their own controls from the pieces below (materialButtons, keyControls, ...), so
// each scene shows only what its lesson needs.
import { buttonGroup, choiceButtons, hideFloorHelpers, slider } from '@harness/lesson';
import type { Harness } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { MATERIAL_HDRIS, SOUND_MATERIALS, hdri as hdriEntry, material as materialEntry, type MaterialEntry } from './catalog';

// ---------------------------------------------------------------------------------------------
// Loading

// Decoded images, shared by every scene on the page. Each scene makes its own Texture objects from
// them, so one scene can change a texture's settings without touching another's.
const images = new Map<string, Promise<HTMLImageElement | HTMLCanvasElement>>();

// An image, shrunk to `maxSize` wide if it's bigger. Materials load at their files' own size: the
// big scans (a 2 m concrete floor, a 1.5 m tabletop) need their 4K to stay near the screen's
// texel density on a 24 cm sample. A 4K map takes 85 MB of GPU memory with its mipmaps, so only the
// scenes showing one pay for it; a lesson about resolution passes a smaller maxTextureSize.
function loadImage(url: string, maxSize: number) {
  const key = `${url}@${maxSize}`;
  if (!images.has(key)) {
    images.set(
      key,
      new THREE.ImageLoader().loadAsync(url).then((image) => {
        if (image.width <= maxSize) return image;
        const canvas = document.createElement('canvas');
        canvas.width = maxSize;
        canvas.height = Math.round((maxSize * image.height) / image.width); // some scans aren't square
        const context = canvas.getContext('2d')!;
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas;
      }),
    );
  }
  return images.get(key)!;
}

export interface MaterialMaps {
  map: THREE.Texture; // color: sRGB
  normalMap: THREE.Texture; // data: no color space
  // data: the packed map (red ambient occlusion, green roughness, blue metalness), or for a
  // 'separate' material its roughness map alone, gray, so green is roughness there too
  arm: THREE.Texture;
}

// A material's three maps, set up the way three.js needs them: the color map marked sRGB, the
// two data maps left at NoColorSpace, all repeating, and the sharpest filtering the GPU offers.
export async function loadMaps(entry: MaterialEntry, renderer: THREE.WebGLRenderer, maxSize = entry.resolution): Promise<MaterialMaps> {
  const base = `/assets/tactile/materials/${entry.id}`;
  const data = entry.layout === 'packed' ? 'arm' : 'roughness';
  const [color, normal, arm] = await Promise.all(['color', 'normal', data].map((name) => loadImage(`${base}/${name}.jpg`, maxSize)));
  const make = (image: HTMLImageElement | HTMLCanvasElement) => {
    const texture = new THREE.Texture(image);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / entry.size[0], 1 / entry.size[1]); // UVs are in meters
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    return texture;
  };
  const maps = { map: make(color), normalMap: make(normal), arm: make(arm) };
  maps.map.colorSpace = THREE.SRGBColorSpace;
  return maps;
}

// Decoded HDRIs, shared by every scene on the page, as pixels only: no scene draws with these. A
// renderer that draws a texture leaves a listener on it that holds the renderer, so a texture
// shared between scenes would keep every scene's renderer (and its WebGL context) alive after the
// page is left. Each scene draws with its own copy instead (loadHdri).
const hdrs = new Map<string, Promise<THREE.DataTexture>>();
function decodeHdri(id: string) {
  if (!hdrs.has(id)) {
    const url = hdriEntry(id).file ?? `/assets/tactile/hdr/${id}_2k.hdr`;
    const loader = url.endsWith('.exr') ? new EXRLoader() : new HDRLoader();
    hdrs.set(
      id,
      loader.loadAsync(url).then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        return texture;
      }),
    );
  }
  return hdrs.get(id)!;
}

// A scene's own copy of an HDRI panorama (a .hdr from assets/tactile, or the .exr a catalog entry
// names), for its environment or background. The copy shares the decoded pixels, so it costs no
// download or memory until it's drawn, and it's disposed when the page is left.
const sceneHdris = new WeakMap<HTMLElement, Map<string, Promise<THREE.Texture>>>();
export function loadHdri(harness: Harness, id: string) {
  const { container } = harness;
  let copies = sceneHdris.get(container);
  if (!copies) {
    const made = new Map<string, Promise<THREE.Texture>>();
    copies = made;
    sceneHdris.set(container, made);
    onLeave(container, () => {
      for (const copy of made.values()) void copy.then((texture) => texture.dispose());
    });
  }
  if (!copies.has(id)) copies.set(id, decodeHdri(id).then((shared) => shared.clone()));
  return copies.get(id)!;
}

// Switches a scene's HDRI. Each HDRI is prefiltered (PMREM) once per scene and kept, so switching
// back is instant. Returns false if another HDRI was picked while this one loaded. When the scene's
// background is an HDRI, it follows.
//
// GPU memory: a prefiltered HDRI takes 24 MB. Building one also uploads the panorama (16 MB) and a
// working copy the generator keeps (24 MB); both are freed straight after, unless the background
// shows the panorama.
export function environmentSwitcher(harness: Harness) {
  const { scene, renderer, container } = harness;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const prefiltered = new Map<string, THREE.Texture>();
  let current: string | null = null;
  let disposed = false;
  onLeave(container, () => {
    disposed = true;
    pmrem.dispose();
    for (const texture of prefiltered.values()) texture.dispose();
  });
  return async (id: string | null) => {
    current = id;
    if (!id) {
      scene.environment = null;
      return true;
    }
    if (!prefiltered.has(id)) {
      const panorama = await loadHdri(harness, id);
      if (disposed) return false;
      prefiltered.set(id, pmrem.fromEquirectangular(panorama).texture);
      pmrem.dispose(); // its working copy; it makes another when the next HDRI needs one
      if (scene.background !== panorama) panorama.dispose(); // uploaded again if a background shows it
    }
    if (current !== id) return false;
    scene.environment = prefiltered.get(id)!;
    if (scene.background && !(scene.background instanceof THREE.Color)) scene.background = await loadHdri(harness, id);
    return true;
  };
}

// three.js keeps a few lookup textures that every renderer shares: the one every Standard and
// Physical material reads (its DFG lookup table) and RectAreaLight's. Like the HDRIs above, each
// renderer that draws one leaves a listener on it that holds the renderer, and they live as long
// as the page's code does. Disposing them when the page is left makes every renderer drop its
// listener; the next scene that needs one uploads it again.
export function releaseSharedTextures(harness: Harness) {
  const { renderer, scene, container } = harness;
  let lut: THREE.Texture | undefined;
  // The renderer forgets its materials when the page is left, so find the table while it runs.
  harness.onFrame(() => {
    if (lut) return;
    scene.traverse((object) => {
      if (lut || !(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshStandardMaterial)) return;
      const drawn = renderer.properties.get(object.material) as { uniforms?: { dfgLUT?: { value: THREE.Texture | null } } };
      lut = drawn.uniforms?.dfgLUT?.value ?? undefined;
    });
  });
  onLeave(container, () => {
    lut?.dispose();
    const lib = THREE.UniformsLib as unknown as Record<string, unknown>; // RectAreaLightUniformsLib.init() puts them here
    for (const name of ['LTC_FLOAT_1', 'LTC_FLOAT_2', 'LTC_HALF_1', 'LTC_HALF_2']) (lib[name] as THREE.Texture | undefined)?.dispose();
  });
}

export const MISSING_ASSETS =
  "The elective's materials and lighting files aren't on this machine. Run: node electives/tactile/tools/fetch-assets.mjs";

// ---------------------------------------------------------------------------------------------
// The sample shapes, with UVs in meters

// A rounded slab. RoundedBoxGeometry gives each side UVs from 0 to 1 measured along the surface,
// rounded edges included; this scales each side's to meters. Its vertices come side by side in the
// order +x, -x, +y, -y, +z, -z.
function swatchGeometry(width: number, height: number, depth: number, radius: number) {
  const segments = 4;
  const geometry = new RoundedBoxGeometry(width, height, depth, segments, radius);
  const along = (side: number) => side - 2 * radius + Math.PI * radius; // flat part plus two quarter arcs
  const perSide = [
    [along(depth), along(height)],
    [along(depth), along(height)],
    [along(width), along(depth)],
    [along(width), along(depth)],
    [along(width), along(height)],
    [along(width), along(height)],
  ];
  const uv = geometry.getAttribute('uv');
  const perFace = uv.count / 6;
  for (let i = 0; i < uv.count; i++) {
    const [u, v] = perSide[Math.floor(i / perFace)];
    uv.setXY(i, uv.getX(i) * u, uv.getY(i) * v);
  }
  return geometry;
}

// Turns a shape's UVs a quarter turn (u and v swapped), so a texture's vertical grain runs along x.
function turnUvs(geometry: THREE.BufferGeometry) {
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getY(i), uv.getX(i));
  return geometry;
}

// Smooth random numbers in 3D (value noise): the same position always gives the same value.
function hash(x: number, y: number, z: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function noise(x: number, y: number, z: number) {
  const [ix, iy, iz] = [Math.floor(x), Math.floor(y), Math.floor(z)];
  const s = (t: number) => t * t * (3 - 2 * t);
  const [fx, fy, fz] = [s(x - ix), s(y - iy), s(z - iz)];
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const corner = (dx: number, dy: number, dz: number) => hash(ix + dx, iy + dy, iz + dz);
  return lerp(
    lerp(lerp(corner(0, 0, 0), corner(1, 0, 0), fx), lerp(corner(0, 1, 0), corner(1, 1, 0), fx), fy),
    lerp(lerp(corner(0, 0, 1), corner(1, 0, 1), fx), lerp(corner(0, 1, 1), corner(1, 1, 1), fx), fy),
    fz,
  );
}

// A box with chipped edges, like cast concrete: edges and corners pushed inward by a random amount,
// some deep, some untouched. The push depends only on a point's position, so the two faces meeting
// at an edge move their shared points the same way and no cracks open. UVs in meters, per face.
function chippedBox(width: number, height: number, depth: number, chip: number) {
  const step = 0.004;
  const geometry = new THREE.BoxGeometry(width, height, depth, Math.ceil(width / step), Math.ceil(height / step), Math.ceil(depth / step));
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  const uv = geometry.getAttribute('uv');
  const half = [width / 2, height / 2, depth / 2];
  for (let i = 0; i < position.count; i++) {
    const [nx, ny] = [Math.abs(normal.getX(i)), Math.abs(normal.getY(i))];
    const [u, v] = nx > 0.5 ? [depth, height] : ny > 0.5 ? [width, depth] : [width, height];
    uv.setXY(i, uv.getX(i) * u, uv.getY(i) * v);
    const p = [position.getX(i), position.getY(i), position.getZ(i)];
    const near = p.map((value, k) => THREE.MathUtils.clamp((chip - (half[k] - Math.abs(value))) / chip, 0, 1));
    const edge = Math.min(1, near[0] * near[1] + near[1] * near[2] + near[0] * near[2]);
    if (edge === 0) continue;
    const amount = chip * edge * THREE.MathUtils.smoothstep(noise(p[0] * 70, p[1] * 70, p[2] * 70), 0.3, 0.75);
    for (let k = 0; k < 3; k++) p[k] -= Math.sign(p[k]) * amount * near[k];
    position.setXYZ(i, p[0], p[1], p[2]);
  }
  geometry.computeVertexNormals();
  return geometry;
}

// A cylinder lying along x. Around it, u runs the circumference; along it, v runs the length; the
// end caps' UVs span the diameter.
function rollGeometry(radius: number, length: number) {
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 96, 1);
  const uv = geometry.getAttribute('uv');
  const normal = geometry.getAttribute('normal');
  for (let i = 0; i < uv.count; i++) {
    if (Math.abs(normal.getY(i)) > 0.99) uv.setXY(i, uv.getX(i) * 2 * radius, uv.getY(i) * 2 * radius);
    else uv.setXY(i, uv.getX(i) * 2 * Math.PI * radius, uv.getY(i) * length);
  }
  geometry.rotateZ(Math.PI / 2);
  return geometry;
}

// ---------------------------------------------------------------------------------------------
// The bench

export interface BenchOptions {
  material?: string | null; // null: load no maps, for a scene that replaces the samples
  hdri?: string | null;
  key?: { around: number; above: number; intensity?: number }; // degrees; see setKey
  balls?: boolean; // the gray and chrome balls
  maxTextureSize?: number;
  height?: number; // the scene's height on the page, in CSS pixels
}

// What the shared controls need from a scene: the swatch bench below and the ring bench
// (metal/rings.ts) both provide it.
export interface Stage {
  harness: Harness;
  hdriId: string | null;
  setHdri(id: string | null): Promise<void>;
  refresh(): void; // runs every onChange listener
  onChange(listener: () => void): void;
}

// A stage with a movable key light, for keyControls.
export interface KeyStage extends Stage {
  key: THREE.DirectionalLight;
  keyAngles: { around: number; above: number };
  setKey(around: number, above: number): void;
}

export interface Bench extends KeyStage {
  material: THREE.MeshPhysicalMaterial; // the swatch's and roll's
  clay: THREE.MeshStandardMaterial; // plain mid gray, for checking the light on the shape alone
  entry: MaterialEntry;
  maps?: MaterialMaps;
  swatch: THREE.Mesh;
  roll: THREE.Mesh; // shown for fabric, leather, steel, and stone
  plank: THREE.Mesh; // shown for wood
  block: THREE.Mesh; // shown for concrete
  balls: THREE.Group;
  ground: THREE.Mesh;
  rim: THREE.DirectionalLight;
  fill: THREE.HemisphereLight; // the harness's sky light, off unless a page turns it on
  // Each map's color space, applied to every material loaded; pages that show the wrong ones change it.
  colorSpaces: Record<keyof MaterialMaps, THREE.ColorSpace>;
  setColorSpace(which: keyof MaterialMaps, space: THREE.ColorSpace): void;
  setMaterial(id: string): Promise<void>;
  keyAboveSwatch(): number; // degrees between the key light and the swatch's face
  useClay(on: boolean): void;
}

const CLAY_COLOR = 0x767676; // sRGB 118: 18% reflectance in linear light, a photographer's mid gray

export function createBench(harness: Harness, options: BenchOptions = {}): Bench {
  const { scene, renderer, camera, controls, container } = harness;
  if (options.height) container.style.height = `${options.height}px`;
  releaseSharedTextures(harness);
  hideFloorHelpers(scene);
  const fill = scene.children.find((child) => child instanceof THREE.HemisphereLight) as THREE.HemisphereLight;
  fill.visible = false;
  scene.background = new THREE.Color(0x2b2e34);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  camera.fov = 35;
  camera.near = 0.02;
  camera.far = 20;
  camera.updateProjectionMatrix();
  camera.position.set(-0.06, 0.32, 0.82);
  controls.target.set(0.04, 0.09, 0.03);
  controls.minDistance = 0.15;
  controls.maxDistance = 2;
  controls.maxPolarAngle = THREE.MathUtils.degToRad(88); // stay above the ground

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshStandardMaterial({ color: 0x5b5f66, roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const material = new THREE.MeshPhysicalMaterial({ roughness: 1, metalness: 0 });
  const clay = new THREE.MeshStandardMaterial({ color: CLAY_COLOR, roughness: 0.5, metalness: 0 });

  // The swatch: 24 × 24 cm, leaning back 12° against nothing, the way a sample board stands on an
  // easel. Its edges suit the material: soft for upholstery, crisp for wood, stone, and steel,
  // chipped for concrete. Real edges are never machine-perfect, and the eye knows how each one wears.
  const swatchShapes = {
    soft: swatchGeometry(0.24, 0.24, 0.025, 0.006),
    crisp: swatchGeometry(0.24, 0.24, 0.02, 0.0015),
    chipped: chippedBox(0.24, 0.24, 0.03, 0.008),
  };
  const swatch = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(swatchShapes.soft, material);
  swatch.rotation.x = THREE.MathUtils.degToRad(-12);
  swatch.position.set(0, 0.12 * Math.cos(THREE.MathUtils.degToRad(12)) + 0.003, -0.03);
  // In front, a second sample in a shape the material really comes in: a roll (8 cm across, 24 cm
  // long) for fabric, leather, steel tube, and stone; a plank for wood, its grain along its length;
  // a chipped block for concrete. A tabletop scan wrapped round a roll would show board grain where
  // real wood shows end grain.
  const roll = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(rollGeometry(0.04, 0.24), material);
  roll.position.set(0, 0.04, 0.12);
  const plank = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(turnUvs(swatchGeometry(0.3, 0.022, 0.09, 0.0015)), material);
  plank.position.set(0, 0.011, 0.13);
  plank.rotation.y = THREE.MathUtils.degToRad(-8);
  const block = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(chippedBox(0.13, 0.065, 0.09, 0.012), material);
  block.position.set(0.02, 0.0325, 0.13);
  block.rotation.y = THREE.MathUtils.degToRad(-20);
  for (const mesh of [swatch, roll, plank, block]) {
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
  }
  const shapesFor = (kind: MaterialEntry['kind']) => {
    swatch.geometry = kind === 'concrete' ? swatchShapes.chipped : ['wood', 'stone', 'painted metal'].includes(kind) ? swatchShapes.crisp : swatchShapes.soft;
    roll.visible = kind !== 'wood' && kind !== 'concrete';
    plank.visible = kind === 'wood';
    block.visible = kind === 'concrete';
  };
  onLeave(container, () => {
    for (const geometry of Object.values(swatchShapes)) geometry.dispose();
  });

  // The reading balls: mid gray shows how bright and from where; chrome shows the room itself.
  const balls = new THREE.Group();
  const ballGeometry = new THREE.SphereGeometry(0.03, 64, 32);
  const gray = new THREE.Mesh(ballGeometry, new THREE.MeshStandardMaterial({ color: CLAY_COLOR, roughness: 0.6 }));
  const chrome = new THREE.Mesh(ballGeometry, new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0 }));
  gray.position.set(0.19, 0.03, 0.1);
  chrome.position.set(0.19, 0.03, 0.02);
  for (const ball of [gray, chrome]) {
    ball.castShadow = ball.receiveShadow = true;
    balls.add(ball);
  }
  balls.visible = options.balls ?? false;
  scene.add(balls);

  // The key light, aimed at the swatch's middle. Shadows: a camera fitted tightly around the
  // samples (the default covers 10 m, wasting the shadow map), a 2048 map, normalBias to stop
  // speckled self-shadowing ("acne"), and radius for a softer edge (r186 treats PCFSoftShadowMap as PCFShadowMap).
  const key = new THREE.DirectionalLight(0xffffff, options.key?.intensity ?? 2.5);
  key.target.position.copy(swatch.position);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -0.35, right: 0.35, top: 0.35, bottom: -0.35, near: 0.1, far: 3 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.002;
  key.shadow.radius = 3;
  scene.add(key, key.target);

  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(0, 0.5, -1).add(swatch.position);
  rim.target.position.copy(swatch.position);
  scene.add(rim, rim.target);

  const swatchNormal = new THREE.Vector3(0, 0, 1).applyEuler(swatch.rotation);
  const listeners: (() => void)[] = [];
  const switchEnvironment = environmentSwitcher(harness);
  let disposed = false;
  onLeave(container, () => {
    disposed = true;
  });

  const bench: Bench = {
    harness,
    material,
    clay,
    entry: materialEntry(options.material ?? 'leather_red_02'),
    swatch,
    roll,
    plank,
    block,
    balls,
    ground,
    key,
    rim,
    fill,
    keyAngles: { around: 0, above: 0 },
    hdriId: null,
    colorSpaces: { map: THREE.SRGBColorSpace, normalMap: THREE.NoColorSpace, arm: THREE.NoColorSpace },

    setColorSpace(which, space) {
      bench.colorSpaces[which] = space;
      const texture = bench.maps?.[which];
      if (texture && texture.colorSpace !== space) {
        texture.colorSpace = space;
        texture.needsUpdate = true; // a color space applies when the texture is uploaded
      }
      bench.refresh();
    },

    async setMaterial(id) {
      if (bench.maps && bench.entry.id === id) return bench.refresh();
      const entry = materialEntry(id);
      const maps = await loadMaps(entry, renderer, options.maxTextureSize ?? entry.resolution);
      if (disposed) return;
      for (const which of Object.keys(maps) as (keyof MaterialMaps)[]) maps[which].colorSpace = bench.colorSpaces[which];
      const old = bench.maps;
      const packed = entry.layout === 'packed';
      bench.entry = entry;
      bench.maps = maps;
      material.map = maps.map;
      material.normalMap = maps.normalMap;
      material.aoMap = packed ? maps.arm : null; // reads red; a separate roughness map holds no AO
      material.roughnessMap = maps.arm; // reads green
      material.roughness = entry.roughnessScale ?? 1; // multiplies the roughness map; 1 leaves it as it is
      material.metalnessMap = packed && entry.trustMetal ? maps.arm : null; // reads blue
      material.metalness = packed && entry.trustMetal ? 1 : 0;
      shapesFor(entry.kind);
      material.sheen = entry.sheen?.amount ?? 0;
      material.sheenColor.set(entry.sheen?.color ?? 0x000000);
      material.sheenRoughness = entry.sheen?.roughness ?? 1;
      material.needsUpdate = true;
      if (old) for (const texture of Object.values(old)) texture.dispose();
      bench.refresh();
    },

    async setHdri(id) {
      bench.hdriId = id;
      if (await switchEnvironment(id)) bench.refresh();
    },

    // around: degrees from the camera's side (0) toward the right (90) and behind (180).
    // above: degrees above the ground.
    setKey(around, above) {
      bench.keyAngles = { around, above };
      const a = THREE.MathUtils.degToRad(around);
      const e = THREE.MathUtils.degToRad(above);
      key.position.set(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).multiplyScalar(1.2).add(key.target.position);
      bench.refresh();
    },

    keyAboveSwatch() {
      const toLight = key.position.clone().sub(key.target.position).normalize();
      return THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(toLight.dot(swatchNormal), -1, 1)));
    },

    useClay(on) {
      for (const mesh of [swatch, roll, plank, block]) mesh.material = on ? clay : material;
      bench.refresh();
    },

    refresh() {
      for (const listener of listeners) listener();
    },

    onChange(listener) {
      listeners.push(listener);
    },
  };

  bench.setKey(options.key?.around ?? -60, options.key?.above ?? 25);
  return bench;
}

// Loads the bench's first material and HDRI, then calls `ready`, unless the page was left first.
// Shows how to fetch the files if they're missing.
export function whenBenchReady(bench: Bench, readout: HTMLElement, options: BenchOptions, ready: () => void) {
  let left = false;
  onLeave(bench.harness.container, () => {
    left = true;
  });
  readout.textContent = 'Loading…';
  const material = options.material === null ? Promise.resolve() : bench.setMaterial(options.material ?? 'leather_red_02');
  Promise.all([material, bench.setHdri(options.hdri === undefined ? 'studio_small_09' : options.hdri)]).then(
    () => {
      if (!left) ready();
    },
    () => {
      readout.textContent = MISSING_ASSETS;
    },
  );
}

// ---------------------------------------------------------------------------------------------
// Controls. Each takes the bench and an element to add to, and returns nothing; the scene listens
// with bench.onChange to update its readout.

// A panel under the scene for controls, so the picture stays clear. It sits after the scene's box
// on the page and goes when the page does.
export function panel(container: HTMLElement) {
  const element = document.createElement('div');
  element.className = 'bench-panel';
  element.style.cssText =
    'display: flex; flex-wrap: wrap; gap: 8px 18px; align-items: center; margin: -8px 0 16px; padding: 10px 12px; border-radius: 8px; background: #1c1f25; font-size: 13px;';
  container.after(element);
  return element;
}

// One row in a panel, with a label, holding buttons or sliders.
export function row(parent: HTMLElement, text: string) {
  const group = buttonGroup(parent, text);
  group.style.flexBasis = '100%';
  return group;
}

const panelButtonStyle = (group: HTMLElement) => {
  for (const button of group.querySelectorAll('button')) {
    button.style.cssText = 'background: #22252c; border: 1px solid #3a3f4a; color: #d8dbe2; border-radius: 6px; padding: 4px 10px; cursor: pointer;';
  }
  // The pressed button's outline, kept in step with aria-pressed.
  const mark = () => group.querySelectorAll('button').forEach((b) => (b.style.borderColor = b.getAttribute('aria-pressed') === 'true' ? '#8ab4ff' : '#3a3f4a'));
  group.addEventListener('click', mark);
  mark();
};

// Buttons that pick one of several options; the first starts picked unless `start` names another.
export function choices(parent: HTMLElement, text: string, options: { label: string; select: () => void }[], start = 0) {
  const group = row(parent, text);
  const ordered = [...options.slice(start), ...options.slice(0, start)];
  choiceButtons(group, ordered.map((option) => ({ html: option.label, select: option.select })));
  // Put the buttons back in their listed order after choiceButtons clicked the starting one.
  const buttons = [...group.querySelectorAll('button')];
  const byLabel = new Map(buttons.map((b) => [b.innerHTML, b]));
  for (const option of options) group.append(byLabel.get(option.label)!);
  panelButtonStyle(group);
  return group;
}

export function materialButtons(bench: Bench, parent: HTMLElement, ids = SOUND_MATERIALS.map((entry) => entry.id)) {
  choices(
    parent,
    'material',
    ids.map((id) => ({ label: materialEntry(id).name, select: () => void bench.setMaterial(id) })),
    Math.max(0, ids.indexOf(bench.entry.id)),
  );
}

export function hdriButtons(bench: Stage, parent: HTMLElement, ids = MATERIAL_HDRIS, withNone = false) {
  const options = ids.map((id) => ({ label: hdriEntry(id).name, select: () => void bench.setHdri(id) }));
  if (withNone) options.push({ label: 'none', select: () => void bench.setHdri(null) });
  // Start on the scene's current HDRI, or on "none" when it has none, so a broken scene stays broken.
  const start = bench.hdriId === null && withNone ? options.length - 1 : Math.max(0, ids.indexOf(bench.hdriId ?? ''));
  choices(parent, 'HDRI', options, start);
}

// Turns the HDRI around the scene. The lighting and the visible background are separate settings,
// so both turn together, or reflections stop matching what's behind the object.
export function rotationSlider(stage: Stage, parent: HTMLElement) {
  const { scene } = stage.harness;
  slider(row(parent, ''), 'turn the HDRI', { min: -180, max: 180, step: 1, value: 0 }, (degrees) => {
    const radians = THREE.MathUtils.degToRad(degrees);
    scene.environmentRotation.y = radians;
    scene.backgroundRotation.y = radians;
    stage.refresh();
  });
}

// What's behind the object: a plain dark gray, or the HDRI itself.
export function backgroundButtons(stage: Stage, parent: HTMLElement) {
  const { scene } = stage.harness;
  const plain = scene.background;
  choices(parent, 'background', [
    { label: 'dark gray', select: () => ((scene.background = plain), stage.refresh()) },
    {
      label: 'the HDRI',
      select: () => {
        if (stage.hdriId) void loadHdri(stage.harness, stage.hdriId).then((panorama) => ((scene.background = panorama), stage.refresh()));
      },
    },
  ]);
}

// The key light: presets, sliders, and a mode where dragging on the scene moves the light instead
// of the camera.
export function keyControls(bench: KeyStage, parent: HTMLElement) {
  const presets: { label: string; around: number; above: number }[] = [
    { label: 'raking from the left', around: -80, above: 12 },
    { label: 'from the side, higher', around: -60, above: 35 },
    { label: 'from the front', around: 0, above: 20 },
    { label: 'from above', around: 0, above: 85 },
    { label: 'raking from the right', around: 80, above: 12 },
  ];
  const group = row(parent, 'key light');
  for (const preset of presets) {
    const button = document.createElement('button');
    button.textContent = preset.label;
    button.addEventListener('click', () => {
      bench.setKey(preset.around, preset.above);
      syncSliders();
    });
    group.append(button);
  }
  panelButtonStyle(group);

  const sliders = row(parent, '');
  const make = (text: string, min: number, max: number, value: () => number, set: (v: number) => void) => {
    const label = document.createElement('label');
    label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
    label.innerHTML = `${text} <input type="range" min="${min}" max="${max}" step="1" style="width: 120px">`;
    const input = label.querySelector('input')!;
    input.value = String(value());
    input.addEventListener('input', () => set(Number(input.value)));
    sliders.append(label);
    return () => (input.value = String(Math.round(value())));
  };
  const syncAround = make('around', -180, 180, () => bench.keyAngles.around, (v) => bench.setKey(v, bench.keyAngles.above));
  const syncAbove = make('height', 2, 89, () => bench.keyAngles.above, (v) => bench.setKey(bench.keyAngles.around, v));
  const syncSliders = () => {
    syncAround();
    syncAbove();
  };
  slider(sliders, 'brightness', { min: 0, max: 8, step: 0.1, value: bench.key.intensity }, (v) => {
    bench.key.intensity = v;
    bench.refresh();
  });

  // Drag the light: horizontal drags turn it around, vertical drags raise and lower it.
  const { controls, renderer } = bench.harness;
  const dragToggle = document.createElement('label');
  dragToggle.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  dragToggle.innerHTML = '<input type="checkbox"> drag on the scene moves the light';
  const checkbox = dragToggle.querySelector('input')!;
  sliders.append(dragToggle);
  let dragging: { x: number; y: number; around: number; above: number } | null = null;
  const canvas = renderer.domElement;
  checkbox.addEventListener('change', () => (controls.enabled = !checkbox.checked));
  canvas.addEventListener('pointerdown', (event) => {
    if (!checkbox.checked) return;
    dragging = { x: event.clientX, y: event.clientY, ...bench.keyAngles };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const around = THREE.MathUtils.euclideanModulo(dragging.around + (event.clientX - dragging.x) * 0.5 + 180, 360) - 180;
    const above = THREE.MathUtils.clamp(dragging.above - (event.clientY - dragging.y) * 0.3, 2, 89);
    bench.setKey(around, above);
    syncSliders();
  });
  canvas.addEventListener('pointerup', () => (dragging = null));
}

// The packed map holds three maps; each toggle plugs or unplugs one material slot.
export function mapToggles(bench: Bench, parent: HTMLElement) {
  const group = row(parent, 'maps');
  const slots: { label: string; on: () => boolean; set: (on: boolean) => void }[] = [
    { label: 'color', on: () => !!bench.material.map, set: (on) => (bench.material.map = on ? bench.maps!.map : null) },
    // Without the map, one flat roughness everywhere: the map's middle value, so only the variation goes.
    { label: 'roughness', on: () => !!bench.material.roughnessMap, set: (on) => ((bench.material.roughnessMap = on ? bench.maps!.arm : null), (bench.material.roughness = on ? (bench.entry.roughnessScale ?? 1) : bench.entry.roughness)) },
    { label: 'normal', on: () => !!bench.material.normalMap, set: (on) => (bench.material.normalMap = on ? bench.maps!.normalMap : null) },
    // A material without ambient occlusion (ambientCG's separate maps) has nothing to switch.
    { label: 'ambient occlusion', on: () => !!bench.material.aoMap, set: (on) => (bench.material.aoMap = on && bench.entry.layout === 'packed' ? bench.maps!.arm : null) },
  ];
  for (const slot of slots) {
    const label = document.createElement('label');
    label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
    label.innerHTML = `<input type="checkbox" checked> ${slot.label}`;
    const input = label.querySelector('input')!;
    input.addEventListener('change', () => {
      slot.set(input.checked);
      bench.material.needsUpdate = true; // adding or removing a map builds a different shader
      bench.refresh();
    });
    bench.onChange(() => {
      input.checked = slot.on();
      input.disabled = slot.label === 'ambient occlusion' && bench.entry.layout !== 'packed';
    });
    group.append(label);
  }
}

export function toneButtons(bench: Stage, parent: HTMLElement, start: THREE.ToneMapping = THREE.NeutralToneMapping) {
  const { renderer } = bench.harness;
  const options: { label: string; value: THREE.ToneMapping }[] = [
    { label: 'none', value: THREE.NoToneMapping },
    { label: 'ACES Filmic', value: THREE.ACESFilmicToneMapping },
    { label: 'AgX', value: THREE.AgXToneMapping },
    { label: 'Neutral', value: THREE.NeutralToneMapping },
  ];
  choices(
    parent,
    'tone mapping',
    options.map((option) => ({
      label: option.label,
      select: () => {
        renderer.toneMapping = option.value;
        bench.refresh();
      },
    })),
    options.findIndex((option) => option.value === start),
  );
}

export function exposureSlider(bench: Stage, parent: HTMLElement, start = 1) {
  bench.harness.renderer.toneMappingExposure = start;
  slider(row(parent, ''), 'exposure', { min: 0.2, max: 3, step: 0.05, value: start }, (v) => {
    bench.harness.renderer.toneMappingExposure = v;
    bench.refresh();
  });
}

export const TONE_NAMES = new Map<THREE.ToneMapping, string>([
  [THREE.NoToneMapping, 'NoToneMapping'],
  [THREE.ACESFilmicToneMapping, 'ACESFilmicToneMapping'],
  [THREE.AgXToneMapping, 'AgXToneMapping'],
  [THREE.NeutralToneMapping, 'NeutralToneMapping'],
]);

// ---------------------------------------------------------------------------------------------
// "What's off?" scenes: the page starts the bench broken in a few ways and gives you the controls
// to fix it. The panel counts what's still off, without naming it, and can show the answer.

export interface Fault {
  fixed: () => boolean; // true once the setting is right again
  cause: string; // what was wrong, in a sentence
  fix: string; // the line of code that fixes it
}

export function faultChecklist(bench: Stage, parent: HTMLElement, faults: Fault[]) {
  const group = row(parent, '');
  const status = document.createElement('strong');
  const reveal = document.createElement('button');
  reveal.textContent = 'Show the answer';
  reveal.style.cssText = 'background: #22252c; border: 1px solid #3a3f4a; color: #d8dbe2; border-radius: 6px; padding: 4px 10px; cursor: pointer;';
  const answer = document.createElement('ol');
  answer.style.cssText = 'flex-basis: 100%; margin: 4px 0 0; padding-left: 20px; display: none;';
  answer.innerHTML = faults.map((fault) => `<li>${fault.cause} <code>${fault.fix}</code></li>`).join('');
  reveal.addEventListener('click', () => (answer.style.display = answer.style.display === 'none' ? 'block' : 'none'));
  group.append(status, reveal, answer);
  const update = () => {
    const left = faults.filter((fault) => !fault.fixed()).length;
    status.textContent = left ? `Still off: ${left} of ${faults.length}` : `Fixed: all ${faults.length}`;
    status.style.color = left ? '#f0b35a' : '#4ade80';
  };
  bench.onChange(update);
  update();
}

// A readout line naming the key light's angle above the swatch's face, and what that does.
export function keyLine(bench: Bench) {
  const above = Math.round(bench.keyAboveSwatch());
  const verdict =
    above < 0 ? 'behind the face: the swatch is lit only by the HDRI'
    : above <= 30 ? 'raking: relief shows'
    : above <= 60 ? 'moderate: some relief'
    : 'head-on: relief goes flat';
  return `key light ${above}° above the swatch's face, ${verdict}`;
}
