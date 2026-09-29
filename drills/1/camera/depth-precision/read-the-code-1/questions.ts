// Read-the-code questions for the depth precision page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const camera = new PerspectiveCamera(50, 1, 0.1, 100);
// A wall stands 1 unit in front of the camera.`,
    ask: "About how much of the depth buffer's range lies between the near plane and the wall?",
    choices: ['About 1%', 'About 50%', 'About 90%'],
    answer: 2,
    why: "A perspective camera spends most of its depth steps just past `near`. The wall's depth value is about 0.9, so the first 0.9 units past the near plane use 90% of the steps, and the other 99 units share the last 10%.",
  },
  {
    code: `const camera = new PerspectiveCamera(50, 1, 0.0001, 100);
// A rug lies 0.005 above the floor, 20 units from the camera.`,
    ask: 'What happens to the rug?',
    choices: ['It flickers through the floor', 'It draws cleanly on top', 'It vanishes past `far`'],
    answer: 0,
    why: "With `near` at 0.0001, almost every depth step is used up within a few centimeters of the camera. At 20 units away, the rug and the floor are a small fraction of a step apart, so they z-fight. Raising `near` to 0.1 gives a thousand times more steps there.",
  },
  {
    code: `const camera = new PerspectiveCamera(50, aspect, 0.001, 5000);
// Hills 300 units away flicker through each other.`,
    ask: 'Which change helps most?',
    choices: ['Lowering far to 1000', 'Both, since they matter equally', 'Raising near to 0.1'],
    answer: 2,
    why: 'The depth steps at a distance depend almost entirely on `near`: raising it from 0.001 to 0.1 gives about 100 times more steps at every distance. Once `far` is much bigger than `near`, lowering it barely changes anything.',
  },
  {
    code: `const sticker = new Mesh(new PlaneGeometry(1, 1), stickerMaterial);
sticker.position.copy(spotOnWall); // exactly on the wall's surface`,
    ask: 'The sticker flickers with the wall. What fixes it?',
    choices: [
      'Turning on `polygonOffset`, with negative values',
      'Raising `near` from 0.1 to 1',
      'Lowering `far` from 100 to 50',
    ],
    answer: 0,
    why: "Two surfaces at exactly the same depth fight however precise the depth buffer is. `polygonOffset` with a negative `polygonOffsetFactor` and `polygonOffsetUnits` nudges the sticker's depth toward the camera by a few depth steps, so it wins at any distance. Lifting it a little off the wall works too.",
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
    why: "It spreads the depth steps out over the whole distance, so far-off surfaces stop fighting. The cost: each pixel's depth is written from the fragment shader, which stops the GPU from skipping hidden pixels before shading them. That's GPU work for every pixel.",
  },
];
