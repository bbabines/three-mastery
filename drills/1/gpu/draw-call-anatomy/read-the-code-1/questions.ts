// Read-the-code questions for the draw call anatomy page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `for (let i = 0; i < 5000; i++) {
  const bolt = new Mesh(boltGeometry, steel); // 12 triangles each
  bolt.position.copy(spots[i]);
  scene.add(bolt);
}`,
    ask: 'The frame got slower. Where does most of the extra time go?',
    choices: [
      'The GPU: 5,000 draws is a lot to draw',
      'Nowhere: sharing one material makes it one draw',
      'The CPU: 5,000 rounds of setup and draw commands',
    ],
    answer: 2,
    why: 'Each bolt is its own draw call, and each call costs about the same CPU time to submit (three.js, then the browser and the driver checking every command), however small the mesh. 60,000 triangles is little work for the GPU. Sharing a geometry and a material saves memory, not draw calls; merging or instancing, on the draw call reduction page, is what cuts the count.',
  },
  {
    code: `// 50 parts, each with its own geometry, all sharing one material
renderer.render(scene, camera);`,
    ask: 'Which of these does three.js send for every one of the 50 draw calls?',
    choices: [
      'A switch to the shared shader program',
      'Its matrices and a vertex-buffer bind',
      "The material's color and roughness uniforms",
    ],
    answer: 1,
    why: 'Each part has its own matrices and its own vertex buffers, so those go with every draw. The program switch happens only when the program changes, and the material\'s uniforms only when the material changes, so with one shared material three.js sends them once and skips them for the other 49. (Parts that share one geometry skip the buffer bind too.)',
  },
  {
    code: `renderer.shadowMap.enabled = true;
sun.castShadow = true;
for (const part of parts) part.castShadow = true; // 200 parts, all in view
// nothing else in the scene draws`,
    ask: 'About how many draw calls does a frame make now?',
    choices: [
      '201: one more for the shadow',
      '200: the shadow is drawn in the same calls',
      '400: the shadow pass draws each part again',
    ],
    answer: 2,
    why: 'The sun renders every casting mesh into its shadow map before the main render, so each part is drawn twice: 200 calls from the light, 200 from the camera. `renderer.info.render.calls` counts both, because the shadow pass runs inside the same `render()` call. A point light would draw its casters six times.',
  },
  {
    code: `const box = new BoxGeometry(); // six groups, one per side
const crate = new Mesh(box, [wood, wood, wood, wood, label, wood]);`,
    ask: 'How many draw calls does the crate make each frame?',
    choices: [
      '2: one for each different material',
      '1: it is one mesh with one geometry',
      '6: one per group of triangles',
    ],
    answer: 2,
    why: 'With a material array, three.js draws each group separately, so the six sides are six draw calls, and five of them use the same `wood`. `mergeGroups` from BufferGeometryUtils joins groups that share a material, which the groups page covers.',
  },
];
