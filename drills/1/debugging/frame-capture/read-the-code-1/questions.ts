// Read-the-code questions for the frame capture page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setAnimationLoop(() => renderer.render(scene, camera));
controls.addEventListener('change', () => renderer.render(scene, camera));
// the scene has 40 meshes, and renderer.info.render.calls reads 40`,
    ask: 'While the user orbits, how many draw calls does each frame really make?',
    choices: [
      '40, as renderer.info reports',
      'At least 80, one set per render call',
      '40, one for each mesh in the scene',
    ],
    answer: 1,
    why: "Orbiting fires `change`, which renders the whole scene, and the animation loop renders it again: at least two renders a frame. `renderer.info` counts only the last `render()` call, and the scene graph still has 40 meshes, so neither shows it. A capture lists the draws twice over.",
  },
  {
    code: `const paint = new MeshStandardMaterial({ map: woodTexture });
crateA.material = paint;
crateB.material = paint;
crateB.material.map = labelTexture;`,
    ask: "A capture shows each crate's draw call. Which texture does each one sample?",
    choices: [
      'woodTexture for crate A, labelTexture for crate B',
      'labelTexture for both crates',
      'woodTexture for both crates',
    ],
    answer: 1,
    why: "Both crates share one material, so setting `map` through crate B changes it for crate A too. The capture shows both draws sampling `labelTexture`, whatever the code seemed to mean. Give crate B its own material, as the clone semantics page covers.",
  },
  {
    code: `renderer.setRenderTarget(thumbnail);
renderer.render(scene, thumbCamera);
renderer.setRenderTarget(null);
renderer.render(scene, camera);`,
    ask: "Where does the thumbnail's picture show up in a capture of this frame?",
    choices: [
      'Nowhere, since it never reaches the screen',
      'After the draws into the thumbnail target',
      'Only in the scene graph, as a texture',
    ],
    answer: 1,
    why: "A capture records every draw, including the ones into a render target, and keeps the picture after each. Step to the last draw into `thumbnail` and you see what it holds, before the canvas draws begin. That's how you check a thumbnail, a shadow map, or a post-processing buffer that never shows by itself.",
  },
  {
    code: `// a capture of one frame lists 1,200 draw calls`,
    ask: 'What does the capture tell you about how long the frame takes?',
    choices: [
      "Each draw call's time on the GPU",
      'Nothing reliable, since capturing slows it',
      'Whether the frame fits in 16.67 ms',
    ],
    answer: 1,
    why: "A capture shows what a frame does: its commands, state, and pictures. While it records, it wraps every WebGL call, which slows the page, so its timings mean little. Time frames separately, with Chrome's Performance panel and the tools on the measurement tools page.",
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
    why: "three.js writes `#define SHADER_NAME crate-paint` near the top of the shaders it builds for that material, so the name shows in the capture's shader view and marks which draws use it. Mesh names never reach WebGL.",
  },
];
