// Read-the-code questions for the object types tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const edges = new LineSegments(
  new EdgesGeometry(shelfGeometry),
  new LineBasicMaterial({ color: 'white', linewidth: 4 }),
);`,
    ask: 'How thick do the edges draw with the WebGL renderer?',
    choices: ['4 pixels, as `linewidth` asks', '1 pixel, whatever `linewidth` says', '4 world units, thinner far away'],
    answer: 1,
    why: "The WebGL renderer draws every line 1 pixel wide and ignores `linewidth`; three.js's own docs say so. For thick lines, use `LineSegments2` with a `LineMaterial` from `three/addons/lines/`, which draws each line as flat triangles.",
  },
  {
    code: `// 40 bolts, 40 washers, and 40 nuts, all the same steel
const steel = new MeshStandardMaterial({ color: 'silver', metalness: 1 });
const parts = new InstancedMesh(boltGeometry, steel, 120);`,
    ask: 'Can `parts` draw the washers and nuts too?',
    choices: [
      'Yes: like a BatchedMesh, it mixes shapes',
      'Yes: all three share the one material',
      'No: every copy is the bolt shape',
    ],
    answer: 2,
    why: 'An InstancedMesh repeats one geometry; each copy only gets its own matrix, and optionally a color. Different shapes under one material is what a BatchedMesh is for: `addGeometry` once per shape, then `addInstance` for each copy. Three InstancedMeshes, one per shape, also work, at three draw calls.',
  },
  {
    code: `const rack = new Group();
for (let i = 0; i < 12; i++) rack.add(new Mesh(shelfGeometry, material));
rack.add(new Sprite(tagMaterial));
scene.add(rack);`,
    ask: 'How many draw calls does the rack take each frame?',
    choices: ['1', '13', '12'],
    answer: 1,
    why: 'A Group draws nothing, so it costs none. Each Mesh is its own draw call even though all 12 share one geometry and one material, and the Sprite is one more. An InstancedMesh would draw the 12 shelves in one.',
  },
];
