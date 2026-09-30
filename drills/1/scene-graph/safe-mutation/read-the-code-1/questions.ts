// Read-the-code questions for the safe mutation page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the scene holds the grid, the axes, a light, the rack,
// and then four BoxHelpers
scene.traverse((object) => {
  if (object instanceof BoxHelper) scene.remove(object);
});`,
    ask: 'What happens?',
    choices: [
      'All four boxes are removed, with no error',
      'Only the first box is removed, then it stops quietly',
      'It throws a TypeError, leaving two of the boxes',
    ],
    answer: 2,
    why: 'Each removal shifts the next box into the spot just walked, so every other box is skipped. The walk then runs past the end of the shorter list and throws. Collect first, then remove.',
  },
  {
    code: `// shelf holds 6 bins
const moving = new Group();
for (const bin of shelf.children) moving.add(bin);`,
    ask: 'How many bins end up in `moving`?',
    choices: ['6', '3', '0'],
    answer: 1,
    why: '`add` takes each bin off `shelf` first, so the list shifts and the loop skips every other bin, with no error. Loop over a copy, `[...shelf.children]`, to move all six.',
  },
  {
    code: `model.traverse((object) => {
  if (object.isMesh) object.add(new Mesh(ringGeometry, ringMaterial));
});`,
    ask: 'What happens?',
    choices: [
      'Every Mesh gets one ring as its child',
      'Each new ring gets a ring, until it throws',
      'It throws right away, on the first add',
    ],
    answer: 1,
    why: '`traverse` visits an object before its children, so it walks into each new ring, a Mesh too, and gives it a ring, until JavaScript throws a RangeError. Collect the Meshes first.',
  },
];
