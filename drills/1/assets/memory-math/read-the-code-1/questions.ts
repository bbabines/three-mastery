// Read-the-code questions for the runtime memory math page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// two exports of the same chair, with the same geometry
// chair-a.glb: 1.2 MB, its textures are 1024 × 1024 JPGs
// chair-b.glb: 1.1 MB, its textures are 4096 × 4096 JPGs`,
    ask: "Which chair's textures take more GPU memory?",
    choices: ['chair-a, since its file is bigger', 'Neither, since the files are the same size', 'chair-b, by far, for its pixel count'],
    answer: 2,
    why: 'Every pixel costs 4 bytes on the GPU, however hard the JPG was squeezed. A 4096 × 4096 texture has 16 times the pixels of a 1024 × 1024 one.',
  },
  {
    code: `const bytes = TextureUtils.getByteLength(2048, 2048, RGBAFormat, UnsignedByteType);`,
    ask: 'What does `bytes` leave out?',
    choices: ['The alpha channel, which JPGs lack', 'The mipmaps, a third more on top', "Nothing, since it's the full GPU cost"],
    answer: 1,
    why: '`getByteLength` measures the full-size image only. A texture with mipmaps keeps smaller copies too, so multiply by 4/3.',
  },
  {
    code: `const env = await new HDRLoader().loadAsync('/env/studio.hdr');
console.log(env.format === RGBAFormat, env.type === HalfFloatType); // true true`,
    ask: 'How many bytes does each pixel take?',
    choices: ['4, one byte for each channel', '3, since HDR has no alpha', '8, four half floats of 2 bytes'],
    answer: 2,
    why: 'HDRLoader gives four channels, each a 2-byte half float, so 8 bytes a pixel, twice a decoded JPG. It adds the alpha channel the file lacks.',
  },
  {
    code: `scene.add(gltf.scene);
renderer.render(scene, camera); // the geometry uploads here
const positions = mesh.geometry.attributes.position.array;`,
    ask: 'Where do the positions live after the upload?',
    choices: [
      'In both JavaScript and GPU memory',
      'Only on the GPU, once the array is freed',
      'Only in JavaScript, where the GPU reads it',
    ],
    answer: 0,
    why: 'three.js keeps the array after uploading it, because raycasting and bounding boxes read it. So a model costs its memory twice.',
  },
  {
    code: `console.log(renderer.info.memory); // { geometries: 15, textures: 2 }`,
    ask: 'What does it tell you about memory?',
    choices: [
      'The megabytes they take on the GPU',
      'How many geometries and textures, not bytes',
      "The bytes in the page's JavaScript memory",
    ],
    answer: 1,
    why: '`renderer.info.memory` counts what the renderer has uploaded, not bytes. The counts should drop back after you dispose a model, which makes it a quick leak check.',
  },
];
