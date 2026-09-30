// Read-the-code questions for the frame capture page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setAnimationLoop(() => renderer.render(scene, camera));
controls.addEventListener('change', () => renderer.render(scene, camera));
// 40 meshes, renderer.info.render.calls reads 40, and the user is orbiting`,
    ask: 'How many draw calls does each frame really make?',
    choices: [
      '40, as renderer.info reports',
      'At least 80, one set per render call',
      '40, one for each mesh in the scene',
    ],
    answer: 1,
    why: 'Orbiting fires `change`, which renders the scene, and the loop renders it again. `renderer.info` counts only the last `render()`, so only a capture shows the draws twice over.',
  },
  {
    code: `const paint = new MeshStandardMaterial({ map: woodTexture });
crateA.material = paint;
crateB.material = paint;
crateB.material.map = labelTexture;`,
    ask: "Which texture does each crate's draw call sample?",
    choices: [
      'woodTexture for crate A, labelTexture for B',
      'labelTexture for both crates',
      'woodTexture for both crates',
    ],
    answer: 1,
    why: 'Both crates share one material, so setting `map` through crate B changes it for crate A too. Give crate B its own material.',
  },
  {
    code: `renderer.setRenderTarget(thumbnail);
renderer.render(scene, thumbCamera);
renderer.setRenderTarget(null);
renderer.render(scene, camera);`,
    ask: "Where does a capture show the thumbnail's picture?",
    choices: [
      'Nowhere, since it never reaches the screen',
      'After the draws into the thumbnail target',
      'Only in the scene graph, as a texture',
    ],
    answer: 1,
    why: 'A capture keeps the picture after every draw, including draws into a render target. Step to the last draw into `thumbnail` to see what it holds.',
  },
  {
    code: `// a capture of one frame lists 1,200 draw calls`,
    ask: 'What does it say about the frame time?',
    choices: [
      "Each draw call's time on the GPU",
      'Nothing reliable, since capturing slows it',
      'Whether the frame fits in 16.67 ms',
    ],
    answer: 1,
    why: "A capture wraps every WebGL call while it records, which slows the page. Time frames separately, with Chrome's Performance panel.",
  },
  {
    code: `const paint = new MeshStandardMaterial({ color: 'orange' });
paint.name = 'crate-paint';`,
    ask: 'Where does the name show up in a capture?',
    choices: [
      'In the shader source, as SHADER_NAME',
      'Next to every draw call, as the mesh name',
      'Nowhere, since captures see only WebGL calls',
    ],
    answer: 0,
    why: "three.js writes `#define SHADER_NAME crate-paint` into the shaders it builds for that material, so the capture's shader view shows it. Mesh names never reach WebGL.",
  },
];
