// Read-the-code questions for the render targets page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setRenderTarget(thumbTarget);
renderer.render(productScene, thumbCamera);
// ...and later, in the frame loop:
renderer.render(scene, camera);`,
    ask: 'Where does the frame loop\'s render draw?',
    choices: [
      'On the canvas, where render always draws',
      'Into thumbTarget, over the thumbnail',
      'On the canvas, with the thumbnail pasted on top',
    ],
    answer: 1,
    why: '`setRenderTarget` stays in effect until you change it, so every later render keeps going into `thumbTarget` and the canvas stops changing. Call `renderer.setRenderTarget(null)` straight after the offscreen render to point back at the canvas.',
  },
  {
    code: `const target = new WebGLRenderTarget(2048, 2048); // 8-bit color, with depth
renderer.setRenderTarget(target);
renderer.render(scene, camera);
renderer.setRenderTarget(null);`,
    ask: 'About how much GPU memory does the color texture alone take?',
    choices: [
      'About 4.2 MB: a byte for each pixel',
      'None: it lives on the CPU until shown',
      'About 16.8 MB: 4 bytes for each pixel',
    ],
    answer: 2,
    why: '2048 × 2048 pixels × 4 bytes (red, green, blue, alpha) is 16,777,216 bytes, about 16.8 MB, on the GPU for as long as the target exists. The depth buffer adds about as much again, and `HalfFloatType` doubles the color. `target.dispose()` frees it.',
  },
  {
    code: `renderer.toneMapping = ACESFilmicToneMapping;
renderer.setRenderTarget(target);
renderer.render(scene, camera);`,
    ask: 'Is the picture in `target` tone mapped?',
    choices: [
      'Yes: the renderer\'s setting applies to every render',
      'No: tone mapping only happens when drawing to the canvas',
      "Only with HalfFloatType: 8-bit can't hold it",
    ],
    answer: 1,
    why: 'three.js applies tone mapping and the sRGB conversion only as materials draw to the canvas. Into a render target, it writes linear colors with no tone mapping, so further passes work on the real values. The last step onto the canvas puts both back, which the multi-pass page shows `OutputPass` doing.',
  },
  {
    code: `renderer.setRenderTarget(swatchTarget);
renderer.render(swatchScene, swatchCamera); // once, at startup
renderer.setRenderTarget(null);
card.material.map = swatchTarget.texture;`,
    ask: 'What does the swatch cost every frame after that?',
    choices: [
      'Just drawing the card it sits on',
      'A full render of swatchScene again, every frame',
      'Nothing at all, not even any GPU memory',
    ],
    answer: 0,
    why: 'A render target keeps its picture until something draws into it again, so the card samples a finished texture: one ordinary draw call. The target still holds its GPU memory until `dispose()`. Only targets that must follow the scene, like a mirror or a monitor, need a render every frame.',
  },
];
