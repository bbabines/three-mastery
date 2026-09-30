// Read-the-code questions for the depth precision page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const camera = new PerspectiveCamera(50, 1, 0.1, 100);
// a wall stands 1 unit in front of the camera`,
    ask: 'What share of the steps lie before the wall?',
    choices: ['About 1%', 'About 50%', 'About 90%'],
    answer: 2,
    why: "A perspective camera spends most of its steps just past `near`. The wall's depth value is about 0.9, so the other 99 units share the last 10%.",
  },
  {
    code: `const camera = new PerspectiveCamera(50, 1, 0.0001, 100);
// a rug lies 0.005 above the floor, 20 units from the camera`,
    ask: 'What happens to the rug?',
    choices: ['It flickers through the floor', 'It draws cleanly on top', 'It vanishes past `far`'],
    answer: 0,
    why: 'With `near` at 0.0001, nearly every step is used up within centimeters of the camera, so at 20 units the rug and floor share a step. Raise `near` to 0.1.',
  },
  {
    code: `const camera = new PerspectiveCamera(50, aspect, 0.001, 5000);
// hills 300 units away flicker through each other`,
    ask: 'Which change helps most?',
    choices: ['Lowering far to 1000', 'Both, since they matter equally', 'Raising near to 0.1'],
    answer: 2,
    why: 'The steps at a distance depend almost entirely on `near`: raising it to 0.1 gives about 100 times more. Lowering `far` barely changes anything.',
  },
  {
    code: `const sticker = new Mesh(new PlaneGeometry(1, 1), stickerMaterial);
sticker.position.copy(spotOnWall); // exactly on the wall: it flickers`,
    ask: 'What fixes the flicker?',
    choices: [
      'Turning on `polygonOffset`, with negative values',
      'Raising `near` from 0.1 to 1',
      'Lowering `far` from 100 to 50',
    ],
    answer: 0,
    why: 'Surfaces at exactly the same depth fight however precise the buffer is. Negative `polygonOffset` values nudge the sticker toward the camera by a few depth steps.',
  },
  {
    code: `const renderer = new WebGLRenderer({ logarithmicDepthBuffer: true });`,
    ask: 'What does this setting trade?',
    choices: [
      'Sharper precision up close, and nothing lost',
      'Precision spread out, for GPU work per pixel',
      'Less GPU memory, in return for worse precision',
    ],
    answer: 1,
    why: "It spreads the steps over the whole distance, but writes each pixel's depth from the fragment shader, so the GPU can't skip hidden pixels before shading them.",
  },
];
