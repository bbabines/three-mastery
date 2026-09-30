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
    why: 'The index holds vertex numbers, three per triangle, so 6 numbers make 2 triangles. They share vertices 1 and 2, so only 4 are stored.',
  },
  {
    code: `const box = mergeVertices(new BoxGeometry().deleteAttribute('normal').deleteAttribute('uv'));
box.computeVertexNormals();
console.log(box.attributes.position.count);`,
    ask: 'What does it log, and how does it light?',
    choices: ['8, and its edges stay sharp', '24, and its edges stay sharp', '8, and its edges look rounded'],
    answer: 2,
    why: "With normals and UVs gone, each corner's 3 vertices match and merge into 1. One vertex has one normal, leaning out diagonally, so the lighting blends across the edges.",
  },
  {
    code: `const sphere = new SphereGeometry(1, 64, 32);
const flat = sphere.toNonIndexed();`,
    ask: "How does `flat`'s memory compare with `sphere`'s?",
    choices: [
      'Several times more: each triangle copies them',
      'The same: the same triangles hold the same data',
      'Less: dropping the index list saves its bytes',
    ],
    answer: 0,
    why: 'Inside a smooth sphere, up to six triangles share each vertex, and non-indexed, each carries its own copy. Dropping the small index saves far less: this one needs about 4 times the memory.',
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
    why: 'Those three vertices are shared with the neighboring triangles, and each has one color, so the red fades across them. Use `toNonIndexed()` so every triangle has vertices of its own.',
  },
  {
    code: `const geometry = new BufferGeometry();
geometry.setIndex(indices); // the largest vertex number in indices is 70000
console.log(geometry.index.array.constructor.name);`,
    ask: 'What does it log?',
    choices: ['Uint16Array', 'Float32Array', 'Uint32Array'],
    answer: 2,
    why: '`setIndex` picks the smallest type that fits: `Uint16Array`, 2 bytes a number, below 65,535, and `Uint32Array`, 4 bytes, from there up. 70,000 needs 4 bytes.',
  },
];
