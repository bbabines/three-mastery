// Read-the-code questions for the draw call anatomy page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `for (let i = 0; i < 5000; i++) {
  const bolt = new Mesh(boltGeometry, steel); // 12 triangles each
  bolt.position.copy(spots[i]);
  scene.add(bolt);
}`,
    ask: 'Where does most of the extra time go?',
    choices: [
      'The GPU, drawing 5,000 small meshes',
      'Nowhere, since one shared material is one draw',
      'The CPU, setting up 5,000 draw calls',
    ],
    answer: 2,
    why: 'Each bolt is its own draw call, and each costs about the same CPU time to submit, however small. Sharing a material saves memory, not calls; merge or instance the bolts.',
  },
  {
    code: `// 50 parts, each with its own geometry, all sharing one material
renderer.render(scene, camera);`,
    ask: 'What goes with every one of the 50 draws?',
    choices: [
      'A switch to the shared shader program',
      'Its own matrices and a vertex-buffer bind',
      "The material's color and roughness",
    ],
    answer: 1,
    why: "Each part has its own matrices and vertex buffers. The program and the material's values don't change, so three.js sends them once and skips them for the other 49.",
  },
  {
    code: `renderer.shadowMap.enabled = true;
sun.castShadow = true;
for (const part of parts) part.castShadow = true; // 200 parts, all in view`,
    ask: 'About how many draw calls does a frame make?',
    choices: [
      '201, one more for the shadow',
      '200, since shadows share the same calls',
      '400, since each part is drawn twice',
    ],
    answer: 2,
    why: 'The sun draws every casting mesh into its shadow map before the main render, and `renderer.info.render.calls` counts both. Set `castShadow` only where the shadow shows.',
  },
  {
    code: `const box = new BoxGeometry(); // six groups, one per side
const crate = new Mesh(box, [wood, wood, wood, wood, label, wood]);`,
    ask: 'How many draw calls does the crate make?',
    choices: [
      '2, one for each different material',
      '1, since it is one mesh and one geometry',
      '6, one for each group of triangles',
    ],
    answer: 2,
    why: 'With a material array, three.js draws each group separately, even groups that share `wood`. `mergeGroups` from BufferGeometryUtils joins groups that share a material.',
  },
];
