// Fetch the publicly served WebGi study reference; never rewrite its original GLB.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../../../assets/reference/classic-watch');
await mkdir(path.join(root, 'textures'), {recursive: true});
const files = [];
async function fetchFile(url, file) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(root, file), bytes);
  files.push({file, url, bytes:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex')});
  return bytes;
}
const glb = await fetchFile('https://asset-samples.threepipe.org/demos/classic-watch.glb', 'classic-watch.glb');
if (glb.readUInt32LE(0) !== 0x46546c67) throw new Error('Expected GLB');
const jsonLength = glb.readUInt32LE(12);
const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString());
const binStart = 20 + jsonLength + 8;
const viewer = json.scenes[0].extensions.WEBGI_viewer;
await writeFile(path.join(root, 'viewer.json'), JSON.stringify(viewer, null, 2) + '\n');
for (const [index, image] of json.images.entries()) {
  if (image.bufferView === undefined) continue;
  const view = json.bufferViews[image.bufferView];
  const bytes = glb.subarray(binStart + (view.byteOffset ?? 0), binStart + (view.byteOffset ?? 0) + view.byteLength);
  const file = `textures/embedded-${index}.${image.mimeType === 'image/png' ? 'png' : 'jpg'}`;
  await writeFile(path.join(root, file), bytes);
  files.push({file, source:`classic-watch.glb image ${index}`, bytes:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex')});
}
const resources = viewer.resources.textures;
const environmentResource = resources[viewer.scene.environment.uuid];
const normalResource = Object.values(resources).find(t => t.userData?.rootPath?.includes('map-normal-leather'));
await fetchFile(environmentResource.userData.rootPath, 'studio.exr');
await fetchFile(normalResource.userData.rootPath, 'textures/leather-normal.jpg');
const audit = {
  source:'https://webgi.dev/',
  extensionsUsed:json.extensionsUsed,
  materials:json.materials.map(m=>({name:m.name,baseColor:m.pbrMetallicRoughness?.baseColorFactor ?? [1,1,1,1],roughness:m.pbrMetallicRoughness?.roughnessFactor ?? 1,metalness:m.pbrMetallicRoughness?.metallicFactor ?? 1,normal:m.normalTexture ?? null,extensions:m.extensions})),
  scene:viewer.scene,
  environment:environmentResource,
  leatherNormal:normalResource,
  plugins:viewer.plugins.filter(p=>['Tonemap','SSAO','SSR','Bloom','Progressive','Ground','SSBevel','TemporalAA'].some(name=>p.type.includes(name))),
};
await writeFile(path.join(root, 'audit.json'), JSON.stringify(audit, null, 2) + '\n');
await writeFile(path.join(root, 'manifest.json'), JSON.stringify({fetchedAt:new Date().toISOString(),files}, null, 2) + '\n');
console.log(JSON.stringify({files:files.map(({file,bytes})=>({file,bytes})),materials:audit.materials.map(({name,roughness,metalness})=>({name,roughness,metalness})),plugins:audit.plugins.map(p=>p.type)},null,2));
