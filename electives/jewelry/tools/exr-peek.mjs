// Prints an .exr environment's brightness (1.0 is white paper) and writes a preview at a chosen
// exposure, in stops, as a .ppm that macOS Preview opens. Loads it with three's own EXRLoader.
//
//   node electives/jewelry/tools/exr-peek.mjs <file.exr> <preview.ppm> [stops]
import { readFileSync, writeFileSync } from 'node:fs';
import { FloatType } from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

const [path, out, stopsArg] = process.argv.slice(2);
const buf = readFileSync(path);
const { width, height, data } = new EXRLoader().setDataType(FloatType).parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const channels = data.length / (width * height);

const luminance = new Float32Array(width * height);
for (let i = 0; i < luminance.length; i++) {
  luminance[i] = 0.2126 * data[i * channels] + 0.7152 * data[i * channels + 1] + 0.0722 * data[i * channels + 2];
}
const sorted = Float32Array.from(luminance).sort();
const at = (share) => sorted[Math.floor(share * (sorted.length - 1))].toFixed(3);
console.log(`${width}x${height}`);
console.log('brightness  median', at(0.5), ' 90th percentile', at(0.9), ' 99th', at(0.99), ' max', at(1));
console.log('brighter than white paper:', ((100 * luminance.filter((value) => value > 1).length) / luminance.length).toFixed(1) + '%');

// The preview: scaled by 2^stops, squeezed into 0–1 (Reinhard), sRGB, a quarter of the size.
const scale = 2 ** Number(stopsArg ?? 0);
const step = 4;
const w = width / step;
const h = height / step;
const pixels = Buffer.alloc(w * h * 3);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = y * step * width + x * step;
    for (let c = 0; c < 3; c++) {
      const value = data[i * channels + c] * scale;
      pixels[(y * w + x) * 3 + c] = Math.round(255 * Math.pow(value / (1 + value), 1 / 2.2));
    }
  }
}
writeFileSync(out, Buffer.concat([Buffer.from(`P6 ${w} ${h} 255\n`), pixels]));
