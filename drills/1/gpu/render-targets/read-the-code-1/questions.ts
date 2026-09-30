// Read-the-code questions for the render targets page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setRenderTarget(thumbTarget);
renderer.render(productScene, thumbCamera);
// ...and later, in the frame loop:
renderer.render(scene, camera);`,
    ask: "Where does the frame loop's render draw?",
    choices: [
      'On the canvas, where render always draws',
      'Into thumbTarget, over the thumbnail',
      'On the canvas, with the thumbnail on top',
    ],
    answer: 1,
    why: '`setRenderTarget` stays in effect until you change it, so every later render goes into `thumbTarget`. Call `renderer.setRenderTarget(null)` right after the offscreen render.',
  },
  {
    code: `const target = new WebGLRenderTarget(2048, 2048); // 8-bit color, with depth
renderer.setRenderTarget(target);
renderer.render(scene, camera);
renderer.setRenderTarget(null);`,
    ask: 'About how much GPU memory does the color take?',
    choices: [
      'About 4.2 MB, a byte for each pixel',
      'None until it is shown on screen',
      'About 16.8 MB, 4 bytes for each pixel',
    ],
    answer: 2,
    why: 'Each pixel holds red, green, blue, and alpha, a byte each, for as long as the target exists. The depth buffer usually adds about as much; `target.dispose()` frees both.',
  },
  {
    code: `renderer.toneMapping = ACESFilmicToneMapping;
renderer.setRenderTarget(target);
renderer.render(scene, camera);`,
    ask: 'Is the picture in `target` tone mapped?',
    choices: [
      "Yes, the renderer's setting applies to all",
      'No, only the canvas render tone maps',
      "Only with HalfFloatType, since 8-bit can't",
    ],
    answer: 1,
    why: 'three.js applies tone mapping and the sRGB conversion only when drawing to the canvas, so the target holds linear colors. A last pass onto the canvas, like `OutputPass`, puts both back.',
  },
  {
    code: `renderer.setRenderTarget(swatchTarget);
renderer.render(swatchScene, swatchCamera); // once, at startup
renderer.setRenderTarget(null);
card.material.map = swatchTarget.texture;`,
    ask: 'What does the swatch cost every frame after that?',
    choices: [
      'Just drawing the card it sits on',
      'A full render of swatchScene, every frame',
      'Nothing at all, not even GPU memory',
    ],
    answer: 0,
    why: 'A target keeps its picture until something draws into it again, so the card samples a finished texture. The target still holds its GPU memory until `dispose()`.',
  },
];
