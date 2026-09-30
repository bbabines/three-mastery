// Read-the-code questions for the draw call reduction page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// 40 smoke puffs, each covering most of the screen, used to be 40 meshes
// the frame was slow because of pixel work
const smoke = new InstancedMesh(puffGeometry, smokeMaterial, 40);`,
    ask: 'What does the change save?',
    choices: [
      'The CPU time of 39 draw calls, but no pixel work',
      'Pixel work, since overlaps are shaded once',
      'Both, so the frame runs 40 times faster',
    ],
    answer: 0,
    why: 'Instancing cuts draw calls, which is CPU time. The GPU still shades every pixel each puff covers, so a fill-rate-bound frame stays slow. Use fewer or smaller puffs.',
  },
  {
    code: `// 40 shelving parts, spread across a room
const pieces = parts.map((part) => part.geometry);
scene.add(new Mesh(mergeGeometries(pieces), steel));`,
    ask: 'What does the merged mesh look like?',
    choices: [
      'Every part piled up at the center',
      'The shelving as before, in one call',
      'Nothing, since mergeGeometries returns null',
    ],
    answer: 0,
    why: "A geometry doesn't hold where its part stands; the mesh does. Bake it into a copy first: `part.geometry.clone().applyMatrix4(part.matrixWorld)`.",
  },
  {
    code: `const merged = mergeGeometries(partGeometries, true); // 30 parts: a group each
const machine = new Mesh(merged, partMaterials);      // 30 entries, 3 different materials`,
    ask: 'How many draw calls does the machine make?',
    choices: ['3, one for each different material', '1, for one mesh with one geometry', '30, one for each group'],
    answer: 2,
    why: "With `true`, each part keeps a group, and three.js draws each group separately, even when groups share a material. Merge each material's parts without groups: three meshes, three calls.",
  },
  {
    code: `// 500 identical bolts, 1,000 vertices each; both are one draw call
const a = new Mesh(mergeGeometries(boltPieces), steel);
const b = new InstancedMesh(boltGeometry, steel, 500);`,
    ask: 'How do `a` and `b` differ in GPU memory?',
    choices: [
      "`a` stores the bolt's vertices 500 times",
      'They match, since both draw 500 bolts',
      '`b` needs more, a geometry per copy',
    ],
    answer: 0,
    why: "Merging copies every bolt's vertices into one geometry, 500,000 in all. The InstancedMesh keeps 1,000 once, plus a matrix per copy. Merge unique parts; instance repeats.",
  },
  {
    code: `const batch = new BatchedMesh(300, 60000, 120000, steel);
// 12 shapes added, then 300 copies, all in view
renderer.extensions.has('WEBGL_multi_draw'); // false on this device`,
    ask: 'How many draw calls does the batch make?',
    choices: ['12, one for each shape', '300, one for each visible copy', '1, since a BatchedMesh is one call'],
    answer: 1,
    why: "A BatchedMesh draws in one call through WebGL's multi-draw extension. Without it, three.js falls back to a call per visible copy, so the batch works but saves no calls.",
  },
];
