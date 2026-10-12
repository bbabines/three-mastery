// Checks a downloaded material before you trust it. Runs in the browser (it decodes the images with a
// canvas). Each check measures something a badly authored material gets wrong:
//
// - Baked light: does the color map get brighter where the surface faces one way? A delit scan
//   doesn't; a photo taken under a lamp does. Measured as the correlation between the color's
//   brightness and the normal map's left-right and up-down tilt.
// - Normal map direction: OpenGL style (what three.js expects) or DirectX style (green flipped).
//   Measured against the height map: in an OpenGL map, green rises where the height rises downward
//   in the image.
// - Seams: is jumping off one edge and back in at the other no bigger a step than between neighbors?
// - Values: color brightness in linear light (real materials sit between about 0.02 and 0.9),
//   roughness, and metalness from the packed map.

import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

// What an HDRI's light is like, weighted by how much of the sphere each pixel covers:
// - directionality: 0 when light comes equally from everywhere (overcast), toward 1 when it all
//   comes from one side. Relief needs light from one side.
// - keyShare: the share of all light coming from the brightest 2% of the sphere: how much a few
//   lamps or windows dominate.
// - key: where the brightest direction is, as degrees around (0 = toward -Z, the equirect's middle)
//   and above the horizon.
// - tint: the light's average red over blue; above 1 is warm, below 1 is cool.
// - peak and median brightness (1.0 is white paper).
export interface HdriResult {
  directionality: number;
  keyShare: number;
  key: { around: number; above: number };
  tint: number;
  peak: number;
  median: number;
}

export async function vetHdri(url: string): Promise<HdriResult> {
  const loader = url.endsWith('.exr') ? new EXRLoader() : new HDRLoader();
  const texture = await loader.setDataType(THREE.FloatType).loadAsync(url);
  const { data, width, height } = texture.image as { data: Float32Array; width: number; height: number };
  const sum = new THREE.Vector3();
  let total = 0, red = 0, blue = 0, peak = 0;
  const cells: { lum: number; weight: number; dir: THREE.Vector3 }[] = [];
  for (let y = 0; y < height; y += 2) {
    const lat = (0.5 - (y + 0.5) / height) * Math.PI; // +90° at the top row
    const weight = Math.cos(lat);
    for (let x = 0; x < width; x += 2) {
      const i = (y * width + x) * 4;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      const lon = ((x + 0.5) / width) * 2 * Math.PI - Math.PI;
      const dir = new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), -Math.cos(lat) * Math.cos(lon));
      sum.addScaledVector(dir, lum * weight);
      total += lum * weight;
      red += data[i] * weight;
      blue += data[i + 2] * weight;
      peak = Math.max(peak, lum);
      cells.push({ lum, weight, dir });
    }
  }
  cells.sort((a, b) => b.lum - a.lum);
  const allWeight = cells.reduce((s, c) => s + c.weight, 0);
  let topWeight = 0, topLight = 0;
  for (const cell of cells) {
    if (topWeight > 0.02 * allWeight) break;
    topWeight += cell.weight;
    topLight += cell.lum * cell.weight;
  }
  const byLum = cells.map((c) => c.lum).sort((a, b) => a - b);
  const key = sum.clone().normalize();
  texture.dispose();
  const round = (v: number, d = 3) => Math.round(v * 10 ** d) / 10 ** d;
  return {
    directionality: round(sum.length() / total),
    keyShare: round(topLight / total),
    key: { around: Math.round(THREE.MathUtils.radToDeg(Math.atan2(key.x, -key.z))), above: Math.round(THREE.MathUtils.radToDeg(Math.asin(key.y))) },
    tint: round(red / blue),
    peak: round(peak, 1),
    median: round(byLum[byLum.length >> 1]),
  };
}

export interface VetResult {
  bakedLight: { leftRight: number; upDown: number };
  normalStyle: { green: number; red: number; style: 'OpenGL' | 'DirectX' | 'unclear' };
  seam: { color: number; normal: number }; // edge jump over the average neighbor step; ~1 is seamless
  albedo: { p2: number; median: number; p98: number }; // linear light, 0 to 1
  roughness: { p5: number; median: number; p95: number };
  metalness: { max: number; share: number }; // share: fraction of pixels above 0.5
  ao: { p5: number; median: number };
}

async function pixels(url: string, size: number) {
  const image = await createImageBitmap(await (await fetch(url)).blob());
  const canvas = new OffscreenCanvas(size, size);
  const context = canvas.getContext('2d')!;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, size, size);
  return context.getImageData(0, 0, size, size).data;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function correlation(a: Float32Array, b: Float32Array) {
  let ma = 0, mb = 0;
  for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; }
  ma /= a.length; mb /= b.length;
  let sab = 0, saa = 0, sbb = 0;
  for (let i = 0; i < a.length; i++) {
    const da = a[i] - ma, db = b[i] - mb;
    sab += da * db; saa += da * da; sbb += db * db;
  }
  return sab / Math.sqrt(saa * sbb);
}

function percentiles(values: Float32Array, ...ps: number[]) {
  const sorted = Float32Array.from(values).sort();
  return ps.map((p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))]);
}

// Average step between horizontal neighbors, and the step across the wrap (last column to first),
// likewise vertically; returns wrap step over neighbor step.
function seamRatio(data: Uint8ClampedArray, size: number) {
  const value = (x: number, y: number) => data[(y * size + x) * 4] + data[(y * size + x) * 4 + 1] + data[(y * size + x) * 4 + 2];
  let inner = 0, innerCount = 0, wrap = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size - 1; x++) { inner += Math.abs(value(x + 1, y) - value(x, y)); innerCount++; }
    wrap += Math.abs(value(0, y) - value(size - 1, y));
  }
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size - 1; y++) { inner += Math.abs(value(x, y + 1) - value(x, y)); innerCount++; }
    wrap += Math.abs(value(x, 0) - value(x, size - 1));
  }
  return wrap / (2 * size) / (inner / innerCount);
}

export async function vetMaterial(id: string): Promise<VetResult> {
  const base = `/assets/tactile/materials/${id}`;
  const size = 1024;
  const [color, normal, arm] = await Promise.all([pixels(`${base}/color.jpg`, size), pixels(`${base}/normal.jpg`, size), pixels(`${base}/arm.jpg`, size)]);
  const n = size * size;
  const brightness = new Float32Array(n), tiltX = new Float32Array(n), tiltY = new Float32Array(n);
  const albedo = new Float32Array(n), roughness = new Float32Array(n), ao = new Float32Array(n);
  let metalMax = 0, metalCount = 0;
  for (let i = 0; i < n; i++) {
    const [r, g, b] = [color[i * 4] / 255, color[i * 4 + 1] / 255, color[i * 4 + 2] / 255];
    albedo[i] = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    brightness[i] = albedo[i];
    tiltX[i] = normal[i * 4] / 255 - 0.5;
    tiltY[i] = normal[i * 4 + 1] / 255 - 0.5;
    ao[i] = arm[i * 4] / 255;
    roughness[i] = arm[i * 4 + 1] / 255;
    const metal = arm[i * 4 + 2] / 255;
    metalMax = Math.max(metalMax, metal);
    if (metal > 0.5) metalCount++;
  }

  // Normal style, from the 1K normal and height maps in assets/tactile/vet (fetch-assets.mjs --vet).
  const vetBase = `/assets/tactile/vet/${id}`;
  const [vetNormal, height] = await Promise.all([pixels(`${vetBase}/normal_1k.jpg`, size), pixels(`${vetBase}/height_1k.png`, size)]);
  const h = (x: number, y: number) => height[(((y + size) % size) * size + ((x + size) % size)) * 4];
  const downSlope = new Float32Array(n), leftSlope = new Float32Array(n), green = new Float32Array(n), red = new Float32Array(n);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      downSlope[i] = h(x, y + 1) - h(x, y - 1); // height rising toward the bottom of the image
      leftSlope[i] = h(x - 1, y) - h(x + 1, y); // height rising toward the left
      green[i] = vetNormal[i * 4 + 1];
      red[i] = vetNormal[i * 4];
    }
  }
  const greenCorr = correlation(green, downSlope);
  const redCorr = correlation(red, leftSlope);
  const style = Math.abs(greenCorr) < 0.1 ? 'unclear' : greenCorr > 0 ? 'OpenGL' : 'DirectX';

  const [a2, a50, a98] = percentiles(albedo, 0.02, 0.5, 0.98);
  const [r5, r50, r95] = percentiles(roughness, 0.05, 0.5, 0.95);
  const [ao5, ao50] = percentiles(ao, 0.05, 0.5);
  const round = (v: number) => Math.round(v * 1000) / 1000;
  return {
    bakedLight: { leftRight: round(correlation(brightness, tiltX)), upDown: round(correlation(brightness, tiltY)) },
    normalStyle: { green: round(greenCorr), red: round(redCorr), style },
    seam: { color: round(seamRatio(color, size)), normal: round(seamRatio(normal, size)) },
    albedo: { p2: round(a2), median: round(a50), p98: round(a98) },
    roughness: { p5: round(r5), median: round(r50), p95: round(r95) },
    metalness: { max: round(metalMax), share: round(metalCount / n) },
    ao: { p5: round(ao5), median: round(ao50) },
  };
}
