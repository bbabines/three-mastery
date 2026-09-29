// Read-the-code questions for the draw call reduction page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// 40 soft smoke puffs, each covering most of the screen, used to be 40 meshes
const smoke = new InstancedMesh(puffGeometry, smokeMaterial, 40);`,
    ask: 'The frame was slow because of pixel work. What does the change do?',
    choices: [
      'The frame gets about 40 times faster, with one call instead of 40',
      'Draw calls fall to 1, but each puff is still shaded at every pixel',
      'Where puffs overlap, each pixel is now shaded once instead of 40 times',
    ],
    answer: 1,
    why: "Instancing saves the CPU time of 39 draw calls. The GPU still draws all 40 puffs, and every pixel each one covers is shaded, so a frame held up by pixel work stays just as slow. Fewer or smaller puffs, or fewer pixels (the overdraw reduction and resolution and DPR pages), cut pixel work; fewer draw calls don't.",
  },
  {
    code: `const pieces = [];
shelving.traverse((part) => {
  if (part.isMesh) pieces.push(part.geometry);
});
scene.add(new Mesh(mergeGeometries(pieces), steel));`,
    ask: 'The shelving has 40 parts spread across a room. What does the merged mesh look like?',
    choices: [
      'Every part piled up at the center of the scene',
      'Exactly like the shelving, in one draw call',
      'Nothing draws, since mergeGeometries returns null',
    ],
    answer: 0,
    why: "A geometry holds a part's shape measured from the part itself; where the part stands is on the mesh, and `mergeGeometries` never sees it. Bake it into a copy first: `part.geometry.clone().applyMatrix4(part.matrixWorld)`, after `shelving.updateMatrixWorld()`.",
  },
  {
    code: `const merged = mergeGeometries(partGeometries, true); // 30 parts: a group each
const machine = new Mesh(merged, partMaterials);      // 30 entries, 3 different materials`,
    ask: 'How many draw calls does the machine make each frame?',
    choices: ['3, one for each different material', '1, for one mesh with one geometry', '30, one for each group'],
    answer: 2,
    why: "With `true`, the merged geometry keeps a group per part, and with a material array three.js draws each group separately, even when groups use the same material. Merge only parts that share a material, without groups, to get one call: here, three merged meshes, one per material.",
  },
  {
    code: `// 500 identical bolts, 1,000 vertices each
const a = new Mesh(mergeGeometries(boltPieces), steel);
const b = new InstancedMesh(boltGeometry, steel, 500);`,
    ask: 'Both are one draw call. How do they differ in GPU memory?',
    choices: [
      "`a` holds 500 copies of the bolt's vertices, `b` holds one",
      'They match, since both draw the same 500 bolts',
      '`b` needs more, since every copy keeps its own geometry',
    ],
    answer: 0,
    why: "Merging copies every bolt's vertices into one big geometry: 500,000 vertices. The InstancedMesh keeps the bolt's 1,000 vertices once, plus 16 numbers of matrix per copy. Merge unique parts; instance repeats.",
  },
  {
    code: `const batch = new BatchedMesh(300, 60000, 120000, steel);
// 12 shapes added with addGeometry, then 300 copies with addInstance, all in view
renderer.extensions.has('WEBGL_multi_draw'); // false on this device`,
    ask: 'How many draw calls does the batch make each frame on this device?',
    choices: ['12, one for each shape added', '300, one for each visible copy', '1, since a BatchedMesh is one call'],
    answer: 1,
    why: "A BatchedMesh draws in one call through WebGL's multi-draw extension. Where that's missing, three.js falls back to a draw call per visible copy, so the batch still works, but saves no draw calls there.",
  },
];
