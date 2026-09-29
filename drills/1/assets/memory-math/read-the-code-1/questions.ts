// Read-the-code questions for the runtime memory math page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// two exports of the same chair, with the same geometry
// chair-a.glb: 1.2 MB, its textures are 1024 × 1024 JPGs
// chair-b.glb: 1.1 MB, its textures are 4096 × 4096 JPGs, compressed harder`,
    ask: 'Once each is loaded, which takes more GPU memory for its textures?',
    choices: [
      'chair-b, by far: memory follows the pixel count',
      'Neither: the two files are about the same size',
      'chair-a: its file is the bigger of the two',
    ],
    answer: 0,
    why: "On the GPU every pixel costs 4 bytes, however hard the JPG was compressed. A 4096 × 4096 texture has 16 times the pixels of a 1024 × 1024 one, so chair-b's textures take about 16 times the memory, while its file is slightly smaller.",
  },
  {
    code: `const bytes = TextureUtils.getByteLength(2048, 2048, RGBAFormat, UnsignedByteType);`,
    ask: "What does `bytes` leave out of the texture's GPU cost?",
    choices: ['The mipmaps, a third more on top', 'The alpha channel, which JPGs lack', "Nothing, since it's the full GPU cost"],
    answer: 0,
    why: '`getByteLength` measures the full-size image only: 2048 × 2048 × 4 bytes. A texture drawn with mipmaps keeps smaller copies as well, which add a third, so multiply by 4/3 for those.',
  },
  {
    code: `const env = await new HDRLoader().loadAsync('/env/studio.hdr');
console.log(env.format === RGBAFormat, env.type === HalfFloatType); // true true`,
    ask: 'How many bytes does each pixel of `env` take on the GPU?',
    choices: ['8: four half floats of 2 bytes each', '4: one byte for each of four channels', '3: an HDR file has no alpha channel'],
    answer: 0,
    why: "HDRLoader gives four channels, red, green, blue, and alpha, each a half float of 2 bytes, so 8 bytes a pixel, twice the 4 of a decoded JPG. The .hdr file itself has no alpha, but HDRLoader adds one.",
  },
  {
    code: `scene.add(gltf.scene);
renderer.render(scene, camera); // the geometry uploads here
const positions = mesh.geometry.attributes.position.array;`,
    ask: 'After the upload, where do the positions live?',
    choices: [
      'Both: in JavaScript memory, and in GPU memory too',
      'Only on the GPU: three.js frees the array',
      'Only in JavaScript: the GPU reads it',
    ],
    answer: 0,
    why: 'three.js keeps the array after uploading it, because raycasting, bounding boxes, and later edits all read it. So a model costs its memory twice: once in JavaScript and once on the GPU.',
  },
  {
    code: `console.log(renderer.info.memory); // { geometries: 15, textures: 2 }`,
    ask: 'What does it tell you about memory use?',
    choices: [
      'How many geometries and textures it holds, not bytes',
      'The megabytes that geometries and textures take on the GPU',
      "The total bytes held in the page's JavaScript memory",
    ],
    answer: 0,
    why: "`renderer.info.memory` counts things the renderer has uploaded, not bytes. It's the quick check that disposal worked: the counts should drop back after you dispose a model. For bytes, add up array lengths and `getByteLength` as this page shows.",
  },
];
