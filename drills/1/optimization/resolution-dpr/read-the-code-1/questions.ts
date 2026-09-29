// Read-the-code questions for the resolution and DPR page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setPixelRatio(window.devicePixelRatio); // 3 on this phone
renderer.setSize(390, 844);`,
    ask: 'How many pixels does each frame draw, compared with a pixel ratio of 1?',
    choices: ['Nine times as many, three across and three down', 'Three times as many, one per device pixel', 'The same number, just shown more sharply'],
    answer: 0,
    why: 'The canvas draws 1170 × 2532 device pixels instead of 390 × 844: three times the width and three times the height. Every one of those pixels is shaded, so the pixel work is nine times too. Capping at 2 brings it down to four times.',
  },
  {
    code: `renderer.setPixelRatio(Math.min(devicePixelRatio, 2));`,
    ask: 'On a phone whose `devicePixelRatio` is 3, what does the cap save?',
    choices: [
      'A third of the pixels, since 2 is a third less than 3',
      "Nothing, since the phone's screen still lights the same dots",
      'More than half the pixels, 4 times ratio 1 instead of 9',
    ],
    answer: 2,
    why: 'Pixels grow with the square of the ratio: 4 times a ratio of 1 at 2, and 9 times at 3. The cap draws 4/9 of the pixels, so it saves more than half the pixel work. The browser stretches the picture over the screen\'s dots, which is why the difference is hard to see.',
  },
  {
    code: `renderer.setPixelRatio(2);
renderer.setSize(800, 600);
const picture = new WebGLRenderTarget(800, 600); // a full-screen effect draws into it`,
    ask: "The effect's picture is shown over the whole canvas. How does it look?",
    choices: [
      'Just as sharp, since render targets follow the pixel ratio',
      'Softer than the rest, stretched to twice its size',
      'Cropped to the top-left quarter of the canvas',
    ],
    answer: 1,
    why: 'The canvas draws 1600 × 1200 device pixels, but the target holds 800 × 600, so each of its pixels is stretched over four. Render targets ignore the pixel ratio: size a full-screen one from `renderer.getDrawingBufferSize(size)`, which is in device pixels.',
  },
  {
    code: `const full = Math.min(devicePixelRatio, 2); // 2 on this laptop
controls.addEventListener('start', () => renderer.setPixelRatio(full / 2));
controls.addEventListener('end', () => renderer.setPixelRatio(full));`,
    ask: 'While the user drags, how much pixel work does each frame do, compared with standing still?',
    choices: ['A quarter, since both sides are halved', 'Half, since the ratio is halved', 'The same, since only the look changes'],
    answer: 0,
    why: 'Halving the ratio halves both the width and the height the canvas draws, so a quarter of the pixels. When the drag ends, the full ratio comes back and the still picture is sharp again.',
  },
];
