// Read-the-code questions for the resolution and DPR page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setPixelRatio(window.devicePixelRatio); // 3 on this phone
renderer.setSize(390, 844);`,
    ask: 'How much pixel work, compared with ratio 1?',
    choices: ['Nine times, three across and three down', 'Three times, one per device pixel', 'The same, just shown more sharply'],
    answer: 0,
    why: 'Three times the width by three times the height is nine times the pixels, and every one is shaded. Capping the ratio at 2 brings it down to four times.',
  },
  {
    code: `renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // devicePixelRatio is 3`,
    ask: 'What does the cap save on this phone?',
    choices: [
      'A third, since 2 is a third less than 3',
      "Nothing, since the screen's dots don't change",
      'Over half, 4 times ratio 1 instead of 9',
    ],
    answer: 2,
    why: 'Pixels grow with the square of the ratio: 4 times ratio 1 at 2, and 9 times at 3. The cap draws 4/9 of the pixels, saving over half the pixel work.',
  },
  {
    code: `renderer.setPixelRatio(2);
renderer.setSize(800, 600);
const picture = new WebGLRenderTarget(800, 600); // a full-screen effect draws into it`,
    ask: 'How does the effect look on screen?',
    choices: [
      'As sharp, since targets follow the ratio',
      'Softer, each pixel stretched over four',
      'Cropped to the top-left quarter',
    ],
    answer: 1,
    why: 'The canvas draws 1600 × 1200 device pixels, but the target holds 800 × 600. Size a full-screen target from `renderer.getDrawingBufferSize(size)`, which is in device pixels.',
  },
  {
    code: `const full = Math.min(devicePixelRatio, 2); // 2 on this laptop
controls.addEventListener('start', () => renderer.setPixelRatio(full / 2));
controls.addEventListener('end', () => renderer.setPixelRatio(full));`,
    ask: 'How much pixel work while the user drags?',
    choices: ['A quarter, since both sides are halved', 'Half, since the ratio is halved', 'The same, since only the look changes'],
    answer: 0,
    why: 'Halving the ratio halves both the width and the height the canvas draws, so a quarter of the pixels. When the drag ends, the full ratio comes back.',
  },
];
