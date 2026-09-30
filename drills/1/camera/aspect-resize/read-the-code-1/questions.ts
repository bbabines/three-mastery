// Read-the-code questions for the aspect and resize page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight); // now twice as wide
});`,
    ask: 'How does the scene look now?',
    choices: ['Correct, just wider', 'Stretched sideways', 'The same, with black bars'],
    answer: 1,
    why: "`setSize` resizes only the canvas. The camera's `aspect` still has the old shape, so the picture stretches. Set `camera.aspect` and call `camera.updateProjectionMatrix()`.",
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
    why: "Setting `aspect` changes nothing until `camera.updateProjectionMatrix()` rebuilds the projection matrix. The order of the two lines doesn't matter.",
  },
  {
    code: `const w = container.clientWidth;  // 0 while the panel is collapsed
const h = container.clientHeight; // 0 too
camera.aspect = w / h;
camera.updateProjectionMatrix();`,
    ask: 'What happens while the panel is collapsed?',
    choices: [
      'The camera keeps its last aspect',
      'NaN gets into the projection matrix',
      'three.js throws a divide-by-zero error',
    ],
    answer: 1,
    why: '0 / 0 is NaN in JavaScript, with no error, so NaN gets into the projection matrix. Skip the update when either size is 0.',
  },
];
