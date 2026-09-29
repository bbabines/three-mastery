// Read-the-code questions for the interleaved attributes page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// loaded model: position and uv share one buffer, x y z u v per vertex
const position = mesh.geometry.attributes.position;
const y = position.array[1 * 3 + 1]; // the y of vertex 1?`,
    ask: 'What does `y` hold?',
    choices: ['The y of vertex 1', 'The x of vertex 4', 'The v (a UV) of vertex 0'],
    answer: 2,
    why: "`position.array` is the whole shared list, 5 numbers per vertex, so index 4 is still inside vertex 0: its v. Vertex 1's y is at 1 × 5 + 0 + 1 = 6. `position.getY(1)` uses the stride and offset for you.",
  },
  {
    code: `// one buffer: x y z, then nx ny nz, then u v, for every vertex
const normal = geometry.attributes.normal;
console.log(normal.itemSize, normal.data.stride, normal.offset);`,
    ask: 'What does it log?',
    choices: ['3 3 0', '3 8 3', '8 8 3'],
    answer: 1,
    why: 'A normal still has 3 numbers, so `itemSize` is 3. Every vertex takes 8 numbers in the shared buffer, which is the stride, and the normal starts after the 3 position numbers, at offset 3.',
  },
  {
    code: `const uv = geometry.attributes.uv; // interleaved with position
uv.setXY(0, 0.5, 0.5);
uv.needsUpdate = true;`,
    ask: 'What gets sent to the GPU again?',
    choices: ['The whole shared buffer, positions too', 'Only the one UV that changed', 'Only the UV numbers, for every vertex'],
    answer: 0,
    why: "On an interleaved attribute, `needsUpdate` marks the shared buffer, `uv.data`, so all of it uploads again. To send less, mark a range with `uv.data.addUpdateRange(start, count)`, the updating buffers page's topic.",
  },
];
