// Read-the-code questions for the aspect and resize page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
    ask: 'The window gets twice as wide. How does the scene look?',
    choices: ['Correct, just wider', 'Stretched sideways', 'The same, with black bars'],
    answer: 1,
    why: "`setSize` resizes the canvas and nothing else. The camera's `aspect` still describes the old shape, so its picture is stretched to fill the wider canvas. Add `camera.aspect = window.innerWidth / window.innerHeight` and `camera.updateProjectionMatrix()`.",
  },
  {
    code: `renderer.setSize(w, h, false);
camera.aspect = w / h;`,
    ask: 'How does the picture look after a resize?',
    choices: [
      'Correct: setting aspect is enough',
      'Stretched: the lens still has the old shape',
      'Blank: aspect must come before setSize',
    ],
    answer: 1,
    why: "`aspect` is only a setting. The projection matrix is built from it when `camera.updateProjectionMatrix()` runs, and until then it keeps the old shape. The order of the two lines doesn't matter.",
  },
  {
    code: `const resize = () => {
  const w = container.clientWidth;  // 0 while the panel is collapsed
  const h = container.clientHeight; // 0 too
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
};`,
    ask: 'What happens while the panel is collapsed?',
    choices: [
      'The camera keeps its last aspect',
      'NaN gets into the projection matrix',
      'three.js throws a divide-by-zero error',
    ],
    answer: 1,
    why: "0 / 0 is NaN in JavaScript, with no error, so `aspect` becomes NaN and so does part of the projection matrix. Nothing draws properly until the next resize. Skip the update when either size is 0: `if (w === 0 || h === 0) return;`.",
  },
];
