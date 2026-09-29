// Read-the-code questions for the indexed vs non-indexed page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute(corners, 3)); // 4 corners
geometry.setIndex([0, 2, 1, 2, 3, 1]);`,
    ask: 'What does the GPU get to draw?',
    choices: ['6 vertices, 2 triangles', '4 vertices, 2 triangles', '4 vertices, 6 triangles'],
    answer: 1,
    why: 'The index holds vertex numbers, three per triangle, so 6 numbers make 2 triangles. They share vertices 1 and 2, so only 4 vertices are stored. Without the index, the same square would need 6.',
  },
  {
    code: `const box = mergeVertices(new BoxGeometry().deleteAttribute('normal').deleteAttribute('uv'));
box.computeVertexNormals();
console.log(box.attributes.position.count);`,
    ask: 'What does it log, and how does the box light?',
    choices: ['8, and its edges stay sharp', '24, and its edges stay sharp', '8, and its edges look rounded'],
    answer: 2,
    why: "With normals and UVs gone, the 3 vertices at each corner match and merge into 1. A vertex has only one normal, so each corner's normal leans out diagonally and the lighting blends across the edges. Sharp edges need a separate vertex per face at each corner, which is why `BoxGeometry` has 24.",
  },
  {
    code: `const sphere = new SphereGeometry(1, 64, 32);
const flat = sphere.toNonIndexed();`,
    ask: 'How does the memory of `flat` compare with `sphere`?',
    choices: [
      'Several times more: each triangle copies them',
      'The same: the same triangles hold the same data',
      'Less: dropping the index list saves its bytes',
    ],
    answer: 0,
    why: 'Inside a smooth sphere, each vertex is shared by up to six triangles. Non-indexed, each of those triangles carries its own copy, at 32 bytes each for position, normal, and UV. The index costs only 2 bytes per number, so dropping it saves far less than the copies cost: about 4 times more memory here.',
  },
  {
    code: `// sphere is indexed; paint the triangle the ray hit
const t = hit.faceIndex;
for (const v of [index.getX(3 * t), index.getX(3 * t + 1), index.getX(3 * t + 2)]) colors.setXYZ(v, 1, 0, 0);
colors.needsUpdate = true;`,
    ask: 'What turns red?',
    choices: [
      'Exactly that one triangle, sharp-edged',
      'A blurry patch around that triangle',
      'Nothing, since indexed meshes skip colors',
    ],
    answer: 1,
    why: "Those three vertices are shared with every neighboring triangle, and each vertex has only one color, so the red fades across all of them. For a sharp single-triangle color, use `toNonIndexed()` so every triangle has vertices of its own.",
  },
  {
    code: `const geometry = new BufferGeometry();
geometry.setIndex(indices); // the largest vertex number in indices is 70000
console.log(geometry.index.array.constructor.name);`,
    ask: 'What does it log?',
    choices: ['Uint16Array', 'Float32Array', 'Uint32Array'],
    answer: 2,
    why: '`setIndex` with a plain array picks the smallest type that fits: `Uint16Array`, 2 bytes per number, while every vertex number is below 65,535, and `Uint32Array`, 4 bytes, above that. 70,000 needs 4 bytes.',
  },
];
