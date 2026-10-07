// Two lighting files, the way iJewel lights a piece: one environment for everything, and a second
// one that only the gems reflect. Also the tools the page uses to measure an environment and to make
// the "JPG" version of one. Used by the two-environments page and the capstone unit.
import * as THREE from 'three';

const HALF_ONE = 0x3c00; // 1.0 as a half float
const HALF_SIGN = 0x8000;

// Reads one channel value from an environment's pixel data, whether it was loaded as half floats
// (EXRLoader's default) or as full floats.
function reader(data: ArrayLike<number>) {
  return data instanceof Uint16Array ? (i: number) => THREE.DataUtils.fromHalfFloat(data[i]) : (i: number) => data[i];
}

/** A loaded panorama's pixels: `texture.image` of what EXRLoader or HDRLoader returns. */
export type PanoramaPixels = { data: ArrayLike<number>; width: number; height: number };

export interface PanoramaStats {
  width: number;
  height: number;
  median: number;
  p99: number;
  max: number;
  /** The room's average color: 'neutral', or the channel it leans toward ('blue', 'warm', 'green'). */
  tint: string;
  /** The share of pixels brighter than `level`, from 0 to 1. 1.0 is white paper. */
  shareAbove(level: number): number;
  /** How many separate bright spots (lamps, windows) are brighter than `level`, ignoring specks under 4 pixels. */
  lightsAbove(level: number): number;
}

// Measures a loaded equirect panorama (an .exr or .hdr file): its brightness median, 99th
// percentile, and brightest pixel, where 1.0 is white paper, plus its tint and how many separate
// lights it holds. Brightness is luminance, the way the eye weighs red, green, and blue. Runs on the
// CPU, a fraction of a second for a 2048 × 1024 file.
export function measurePanorama(image: PanoramaPixels): PanoramaStats {
  const { data, width, height } = image;
  const channels = data.length / (width * height);
  const value = reader(data);
  const brightness = new Float32Array(width * height);
  const average = [0, 0, 0];
  for (let i = 0; i < brightness.length; i++) {
    const at = i * channels;
    const [r, g, b] = channels >= 3 ? [value(at), value(at + 1), value(at + 2)] : [value(at), value(at), value(at)];
    brightness[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    average[0] += r;
    average[1] += g;
    average[2] += b;
  }
  const strongest = Math.max(...average);
  const weakest = Math.min(...average);
  const tint = strongest <= weakest * 1.05 ? 'neutral' : ['warm', 'green', 'blue'][average.indexOf(strongest)];
  const sorted = brightness.slice().sort();
  const percentile = (share: number) => sorted[Math.floor(share * (sorted.length - 1))];
  return {
    width,
    height,
    median: percentile(0.5),
    p99: percentile(0.99),
    max: sorted[sorted.length - 1],
    tint,
    lightsAbove(level) {
      // Flood-fills each bright spot once; the picture wraps around left to right.
      const seen = new Uint8Array(brightness.length);
      const stack: number[] = [];
      let lights = 0;
      for (let start = 0; start < brightness.length; start++) {
        if (seen[start] || brightness[start] <= level) continue;
        seen[start] = 1;
        stack.push(start);
        let size = 0;
        while (stack.length) {
          const pixel = stack.pop()!;
          size++;
          const x = pixel % width;
          const y = (pixel - x) / width;
          for (const [nx, ny] of [[(x + 1) % width, y], [(x + width - 1) % width, y], [x, y + 1], [x, y - 1]]) {
            if (ny < 0 || ny >= height) continue;
            const next = ny * width + nx;
            if (!seen[next] && brightness[next] > level) {
              seen[next] = 1;
              stack.push(next);
            }
          }
        }
        if (size >= 4) lights++;
      }
      return lights;
    },
    shareAbove(level) {
      let low = 0;
      let high = sorted.length;
      while (low < high) {
        const middle = (low + high) >> 1;
        if (sorted[middle] <= level) low = middle + 1;
        else high = middle;
      }
      return (sorted.length - low) / sorted.length;
    },
  };
}

// A copy of an HDR panorama with every value above 1.0 cut down to 1.0: what a JPG or PNG of the
// same room holds, since 8-bit images top out at white. The original is left alone. Dispose the copy
// once it has been prefiltered.
export function clipAtWhite(equirect: THREE.DataTexture) {
  const { data, width, height } = equirect.image as unknown as { data: Uint16Array | Float32Array; width: number; height: number };
  const channels = data.length / (width * height);
  const clipped = data.slice();
  // Positive half floats sort like plain integers, so 1.0 is the cap; a set sign bit is negative.
  const clip =
    clipped instanceof Uint16Array
      ? (v: number) => (v & HALF_SIGN ? 0 : Math.min(v, HALF_ONE))
      : (v: number) => Math.min(Math.max(v, 0), 1);
  for (let i = 0; i < clipped.length; i++) {
    if (i % channels !== 3) clipped[i] = clip(clipped[i]); // leaves alpha alone
  }
  const copy = new THREE.DataTexture(clipped, width, height, equirect.format as THREE.PixelFormat, equirect.type);
  copy.mapping = THREE.EquirectangularReflectionMapping;
  copy.colorSpace = equirect.colorSpace;
  copy.flipY = equirect.flipY;
  copy.magFilter = copy.minFilter = THREE.LinearFilter;
  copy.needsUpdate = true;
  return copy;
}

// Prefilters any equirect panorama for this renderer (PMREMGenerator), so polished and rough
// surfaces can both reflect it. The result is for scene.environment or a material's envMap.
export function prefilter(renderer: THREE.WebGLRenderer, equirect: THREE.Texture) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromEquirectangular(equirect).texture;
  pmrem.dispose();
  return texture;
}

// Lights a model the way iJewel's viewer does: the metal file is the scene's environment, which
// every part without its own envMap reflects, and each gem material gets the gem file as its own
// envMap, which wins over the scene's. Pass gem: null to put the gems back on the scene's
// environment. The materials must be MeshStandardMaterial or MeshPhysicalMaterial.
export function lightLikeIJewel(
  scene: THREE.Scene,
  metal: THREE.Texture,
  gemMaterials: Iterable<THREE.MeshStandardMaterial>,
  gem: THREE.Texture | null,
) {
  scene.environment = metal;
  scene.environmentIntensity = 1; // iJewel's scene environment intensity
  for (const material of gemMaterials) material.envMap = gem;
}
