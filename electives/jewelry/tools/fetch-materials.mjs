// Downloads every material file (.pmat, .dmat) Spring.glb's materials point to, plus the textures
// those files name, into assets/reference/ijewel/materials and /textures.
//
//   node electives/jewelry/tools/fetch-materials.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const outDir = 'assets/reference/ijewel';
const buf = readFileSync(join(outDir, 'Spring.glb'));
const json = JSON.parse(buf.subarray(20, 20 + buf.readUInt32LE(12)).toString('utf8'));
mkdirSync(join(outDir, 'materials'), { recursive: true });
mkdirSync(join(outDir, 'textures'), { recursive: true });

const strip = (url) => url.replace(/\?.*$/, '');
const materialUrls = [...new Set(json.materials.map((material) => material.extras?.rootPath).filter(Boolean))];
const textureUrls = new Set();
const findTextures = (value) => {
  if (!value || typeof value !== 'object') return;
  for (const [key, inner] of Object.entries(value)) {
    if (key === 'rootPath' && typeof inner === 'string' && /\.(jpe?g|png|webp|exr|hdr|ktx2)/i.test(inner)) textureUrls.add(inner);
    else findTextures(inner);
  }
};

for (const url of materialUrls) {
  const response = await fetch(strip(url));
  const text = await response.text();
  writeFileSync(join(outDir, 'materials', basename(strip(url))), text);
  findTextures(JSON.parse(text));
  console.log(response.status, basename(strip(url)));
}
for (const url of textureUrls) {
  const response = await fetch(strip(url));
  writeFileSync(join(outDir, 'textures', basename(strip(url))), Buffer.from(await response.arrayBuffer()));
  console.log(response.status, basename(strip(url)));
}
