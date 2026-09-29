// Run as: cd repo && node --input-type=module < gltf.mjs   (so bare 'three' resolves from the repo)
globalThis.ProgressEvent ??= class ProgressEvent extends Event { constructor(t, o = {}) { super(t); Object.assign(this, o); } };
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const log = (k, v) => console.log(k.padEnd(56), typeof v === 'string' ? v : JSON.stringify(v));

// One triangle: positions (3 x vec3 float) + indices (3 x uint16, padded)
const pos = new Float32Array([0,0,0, 1,0,0, 0,1,0]);
const idx = new Uint16Array([0,1,2,0]); // padded to 8 bytes
const bin = Buffer.concat([Buffer.from(pos.buffer), Buffer.from(idx.buffer)]);
const gltf = {
  asset: { version: '2.0' },
  scene: 0,
  scenes: [{ name: 'Scene', nodes: [0, 1, 2] }],
  nodes: [
    { name: 'Rack.001', mesh: 0, extras: { sku: 'R-1', selectable: true } },
    { name: 'Rack.001', mesh: 0 },
    { name: 'Shelf Top', mesh: 1 },
  ],
  meshes: [
    { name: 'OnePrim', primitives: [{ attributes: { POSITION: 0 }, indices: 1, material: 0 }] },
    { name: 'TwoPrims', primitives: [
      { attributes: { POSITION: 0 }, indices: 1, material: 0 },
      { attributes: { POSITION: 0 }, indices: 1, material: 1 },
    ] },
  ],
  materials: [{ name: 'Steel', extras: { finish: 'matte' } }, { name: 'Wood' }],
  accessors: [
    { bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [0,0,0], max: [1,1,0] },
    { bufferView: 1, componentType: 5123, count: 3, type: 'SCALAR' },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: 36 },
    { buffer: 0, byteOffset: 36, byteLength: 6 },
  ],
  buffers: [{ byteLength: bin.length, uri: 'data:application/octet-stream;base64,' + bin.toString('base64') }],
};

const loader = new GLTFLoader();
const parse = (json) => new Promise((res, rej) => loader.parse(JSON.stringify(json), '', res, rej));

const a = await parse(gltf);
const names = []; a.scene.traverse(o => names.push(`${o.type}:${o.name}`));
log('loaded tree (type:name)', names);
log('getObjectByName("Rack.001")', a.scene.getObjectByName('Rack.001') ?? 'undefined');
log('getObjectByName("Rack001")', a.scene.getObjectByName('Rack001')?.type);
log('original name kept in userData.name', a.scene.getObjectByName('Rack001')?.userData.name);
log('node extras -> userData', a.scene.getObjectByName('Rack001')?.userData);
const twoPrim = a.scene.children[2];
log('two-primitive mesh node: type, child types', [twoPrim.type, twoPrim.children.map(c => c.type)]);
log('material extras -> material.userData', a.scene.getObjectByName('Rack001').material.userData);
log('two nodes share one mesh -> geometry shared?', a.scene.children[0].geometry === a.scene.children[1].geometry);

// Loading the same data twice: new geometries/materials
const b = await parse(gltf);
log('second parse: same geometry object as first?', a.scene.children[0].geometry === b.scene.children[0].geometry);
log('second parse: same material object as first?', a.scene.children[0].material === b.scene.children[0].material);
log('second parse names (unique per load, not per scene)', b.scene.children.map(c => c.name));
