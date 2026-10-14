// The scale page's extra pieces: a ruler on the swatch, a texture resolution switch, a big floor
// for seeing a material from far away, and two shader additions for that floor (a large-scale
// variation that breaks up repeats, and a normal map that fades with distance).
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { loadMaps, type Bench, type BenchOptions, type MaterialMaps } from '../bench';

// ---------------------------------------------------------------------------------------------
// A 24 cm ruler with millimeter ticks, lying across the swatch's face.

function rulerTexture() {
  const canvas = document.createElement('canvas');
  const pxPerMm = 10;
  canvas.width = 240 * pxPerMm;
  canvas.height = 25 * pxPerMm;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#e9e5d8';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = '#1d1d1d';
  c.font = `bold ${7 * pxPerMm}px sans-serif`;
  c.textAlign = 'center';
  for (let mm = 1; mm < 240; mm++) {
    const x = mm * pxPerMm;
    const length = mm % 10 === 0 ? 9 : mm % 5 === 0 ? 6 : 3.5; // cm, half cm, mm
    c.fillRect(x - 1.5, 0, 3, length * pxPerMm);
    if (mm % 10 === 0) c.fillText(String(mm / 10), x, 18 * pxPerMm);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Adds the ruler to the swatch, 4 cm below its middle. Its height off the face follows the swatch's
// thickness, which depends on the material.
export function addRuler(bench: Bench) {
  const texture = rulerTexture();
  const geometry = new THREE.BoxGeometry(0.24, 0.025, 0.0015);
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.55 });
  const ruler = new THREE.Mesh(geometry, material);
  ruler.castShadow = ruler.receiveShadow = true;
  bench.swatch.add(ruler);
  onLeave(bench.harness.container, () => {
    texture.dispose();
    geometry.dispose();
    material.dispose();
  });
  const thickness: Record<string, number> = { concrete: 0.03, wood: 0.02, stone: 0.02, 'painted metal': 0.02 };
  return () => ruler.position.set(0, -0.04, (thickness[bench.entry.kind] ?? 0.025) / 2 + 0.00075);
}

// ---------------------------------------------------------------------------------------------
// Texture resolution and size

export const loadedWidth = (bench: Bench) => (bench.maps!.map.image as { width: number }).width;

// Reloads the bench's maps shrunk to `size` pixels wide (never enlarged), swapping each texture in
// place. The bench reads options.maxTextureSize each time it loads, so later materials load at this
// size too.
export async function setResolution(bench: Bench, options: BenchOptions, size: number) {
  options.maxTextureSize = size;
  const entry = bench.entry;
  if (!bench.maps || loadedWidth(bench) === Math.min(size, entry.resolution)) return;
  const maps = await loadMaps(entry, bench.harness.renderer, size);
  if (bench.entry !== entry || !bench.maps) {
    for (const texture of Object.values(maps)) texture.dispose(); // another material was picked meanwhile
    return;
  }
  for (const which of Object.keys(maps) as (keyof MaterialMaps)[]) maps[which].colorSpace = bench.colorSpaces[which];
  const old = bench.maps;
  const swap = (texture: THREE.Texture | null) =>
    texture === old.map ? maps.map : texture === old.normalMap ? maps.normalMap : texture === old.arm ? maps.arm : texture;
  const m = bench.material;
  m.map = swap(m.map);
  m.normalMap = swap(m.normalMap);
  m.aoMap = swap(m.aoMap);
  m.roughnessMap = swap(m.roughnessMap);
  m.metalnessMap = swap(m.metalnessMap);
  bench.maps = maps;
  for (const texture of Object.values(old)) texture.dispose();
  bench.refresh();
}

// Pixels per centimeter of material in the loaded map.
export const scanDensity = (bench: Bench) => loadedWidth(bench) / (bench.entry.size[0] * 100);

// Screen pixels per centimeter at the swatch's middle, from the camera's distance and field of view.
export function screenDensity(bench: Bench) {
  const { camera, renderer } = bench.harness;
  const distance = camera.position.distanceTo(bench.swatch.position);
  const visibleHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)); // meters
  return renderer.domElement.height / (visibleHeight * 100);
}

// GPU memory for one map: 4 bytes a pixel, and a third more for its mipmaps.
export const mapBytes = (bench: Bench) => {
  const image = bench.maps!.map.image as { width: number; height: number };
  return (image.width * image.height * 4 * 4) / 3;
};

// Sets every map's tile size to `factor` times the material's real size.
export function setTileScale(bench: Bench, factor: number) {
  for (const texture of Object.values(bench.maps!)) texture.repeat.set(1 / (bench.entry.size[0] * factor), 1 / (bench.entry.size[1] * factor));
}

// ---------------------------------------------------------------------------------------------
// A big floor in the bench's material, seen from standing height

// Hides the samples and lays a floor `width` × `depth` meters, UVs in meters, running away from
// the camera. Returns the floor.
export function addFloor(bench: Bench, width: number, depth: number) {
  const { scene, camera, controls, container } = bench.harness;
  for (const mesh of [bench.swatch, bench.roll, bench.plank, bench.block, bench.balls]) scene.remove(mesh);
  bench.ground.visible = false;
  const geometry = new THREE.PlaneGeometry(width, depth);
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * width, uv.getY(i) * depth);
  const floor = new THREE.Mesh(geometry, bench.material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = 1 - depth / 2; // from 1 m in front of the middle to the far end
  floor.receiveShadow = true;
  scene.add(floor);
  scene.fog = new THREE.Fog(0x2b2e34, depth * 0.5, depth * 0.95); // hides the far edge
  camera.near = 0.05;
  camera.far = depth + 10;
  camera.updateProjectionMatrix();
  controls.maxDistance = 25;
  onLeave(container, () => geometry.dispose());
  return floor;
}

// A soft, tileable pattern of light and dark, for varying each copy of a small tile: random values
// on a coarse grid, blended smoothly, at three scales. The grid wraps, so the pattern tiles.
function macroTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const random = (x: number, y: number, cells: number) => {
    let h = Math.imul(((x % cells) + cells) % cells, 374761393) ^ Math.imul(((y % cells) + cells) % cells, 668265263) ^ Math.imul(cells, 1440662683);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const noise = (x: number, y: number, cells: number) => {
    const [gx, gy] = [(x / size) * cells, (y / size) * cells];
    const [ix, iy] = [Math.floor(gx), Math.floor(gy)];
    const [fx, fy] = [smooth(gx - ix), smooth(gy - iy)];
    const top = random(ix, iy, cells) * (1 - fx) + random(ix + 1, iy, cells) * fx;
    const bottom = random(ix, iy + 1, cells) * (1 - fx) + random(ix + 1, iy + 1, cells) * fx;
    return top * (1 - fy) + bottom * fy;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v = 0.55 * noise(x, y, 4) + 0.3 * noise(x, y, 9) + 0.15 * noise(x, y, 19) - 0.5; // about −0.4 to 0.4
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = THREE.MathUtils.clamp(Math.round(128 + v * 300), 0, 255);
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export interface FloorShader {
  macroAmount: { value: number }; // 0: off; 0.2: each copy lighter or darker by up to a fifth
  fadeNear: { value: number }; // meters: the normal map starts fading here...
  fadeFar: { value: number }; // ...and is gone here
}

export const MACRO_SIZE = 2.7; // meters: no small tile's size divides it, so copies never line up with it
export const NO_FADE = 1e5;

// Adds the two floor additions to the bench's material. Both start off.
export function floorShader(bench: Bench): FloorShader {
  const macroMap = macroTexture();
  onLeave(bench.harness.container, () => macroMap.dispose());
  const uniforms = {
    macroMap: { value: macroMap },
    macroSize: { value: MACRO_SIZE },
    macroAmount: { value: 0 },
    fadeNear: { value: NO_FADE },
    fadeFar: { value: 2 * NO_FADE },
  };
  const material = bench.material;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float macroSize;\nvarying vec2 vMacroUv;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvMacroUv = uv / macroSize;'); // uv is in meters
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D macroMap;\nuniform float macroAmount, fadeNear, fadeFar;\nvarying vec2 vMacroUv;')
      .replace('#include <map_fragment>', '#include <map_fragment>\ndiffuseColor.rgb *= 1.0 + macroAmount * (texture2D(macroMap, vMacroUv).r * 2.0 - 1.0);')
      .replace(
        '#include <normal_fragment_maps>',
        THREE.ShaderChunk.normal_fragment_maps.replace(
          'mapN.xy *= normalScale;',
          'mapN.xy *= normalScale * (1.0 - smoothstep(fadeNear, fadeFar, length(vViewPosition)));',
        ),
      );
  };
  material.customProgramCacheKey = () => 'tactile-scale-floor';
  material.needsUpdate = true;
  return uniforms;
}

// ---------------------------------------------------------------------------------------------
// Filtering

export interface Filtering {
  mipmaps: boolean;
  anisotropic: boolean; // the GPU's maximum anisotropy, or 1
}

// Sets each map's filtering. Only changes what differs, since each change uploads the map again.
export function setFiltering(bench: Bench, { mipmaps, anisotropic }: Filtering) {
  const anisotropy = anisotropic ? bench.harness.renderer.capabilities.getMaxAnisotropy() : 1;
  for (const texture of Object.values(bench.maps!)) {
    if (texture.anisotropy === anisotropy && texture.generateMipmaps === mipmaps) continue;
    texture.anisotropy = anisotropy;
    texture.generateMipmaps = mipmaps;
    texture.minFilter = mipmaps ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
    texture.needsUpdate = true;
  }
}

export function filteringOf(bench: Bench): Filtering {
  const texture = bench.maps!.map;
  return { mipmaps: texture.generateMipmaps, anisotropic: texture.anisotropy > 1 };
}
