// Read-the-code questions for the Draco vs Meshopt page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// rack.glb: exported from Blender with Draco compression, 0.4 MB
const gltf = await loader.loadAsync('/models/rack.glb');
const upright = gltf.scene.getObjectByName('Upright'); // a one-material Mesh
console.log(upright.geometry.attributes.position.array.constructor.name);`,
    ask: 'What does it log?',
    choices: ['Float32Array', 'Int16Array', 'Uint8Array'],
    answer: 0,
    why: 'Draco only packs the data for the download. Decoding gives back the full 4-byte floats the file describes, and those are what go to the GPU. Only a quantized file, like the ones gltfpack writes by default, keeps smaller types such as `Int16Array` after loading.',
  },
  {
    code: `const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const gltf = await loader.loadAsync('/models/rack-meshopt.glb');`,
    ask: 'Where does the Meshopt decoding run?',
    choices: [
      'On the main thread, unless you call useWorkers',
      'In workers, the same way that DRACOLoader decodes',
      'On the GPU, while the geometry is uploaded',
    ],
    answer: 0,
    why: "`MeshoptDecoder` decodes on the main thread by default; it's built to be fast enough for that. `MeshoptDecoder.useWorkers(2)` moves it to workers. DRACOLoader always uses workers, up to 4 by default. Neither decodes on the GPU: the GPU only ever receives the unpacked arrays.",
  },
  {
    code: `// every index accessor in rack.glb is UNSIGNED_SHORT: 2 bytes per index
// and the file is Draco-compressed
const index = gltf.scene.getObjectByName('Upright').geometry.index;
console.log(index.array.BYTES_PER_ELEMENT);`,
    ask: 'What does it log?',
    choices: ['4', '2', '1'],
    answer: 0,
    why: "DRACOLoader always returns indices as a `Uint32Array`, 4 bytes each, whatever the file's accessors say. So a Draco model's indices can take twice the memory an uncompressed copy of the same file would use.",
  },
];
