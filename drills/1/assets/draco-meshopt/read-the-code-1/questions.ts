// Read-the-code questions for the Draco vs Meshopt page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// rack.glb is Draco-compressed
const upright = gltf.scene.getObjectByName('Upright'); // a one-material Mesh
console.log(upright.geometry.attributes.position.array.constructor.name);`,
    ask: 'What does it log?',
    choices: ['Int16Array', 'Float32Array', 'Uint8Array'],
    answer: 1,
    why: 'Draco only packs the data for the download, and decoding gives back full 4-byte floats. Only a quantized file keeps smaller types like `Int16Array`.',
  },
  {
    code: `const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const gltf = await loader.loadAsync('/models/rack-meshopt.glb');`,
    ask: 'Where does the Meshopt decoding run?',
    choices: ['In workers, the way Draco does', 'On the GPU, during the upload', 'On the main thread, by default'],
    answer: 2,
    why: '`MeshoptDecoder` decodes on the main thread unless you call `MeshoptDecoder.useWorkers(2)`. The GPU only ever gets the unpacked arrays.',
  },
  {
    code: `// rack.glb is Draco-compressed; its index lists use 2 bytes an index
const index = gltf.scene.getObjectByName('Upright').geometry.index;
console.log(index.array.BYTES_PER_ELEMENT);`,
    ask: 'What does it log?',
    choices: ['2', '4', '1'],
    answer: 1,
    why: 'DRACOLoader always returns indices as a `Uint32Array`, 4 bytes each, whatever the file says, so the index memory can double.',
  },
];
