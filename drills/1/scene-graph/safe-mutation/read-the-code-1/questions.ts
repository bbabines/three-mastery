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
    why: 'Each removal shifts the boxes after it up one place, so the walk skips every other box. It also counted the scene\'s eight children before it started, so it runs past the end of the shortened list, tries to walk into `undefined`, and throws. Collect the boxes during the walk, then remove them afterwards.',
  },
  {
    code: `// shelf holds 6 bins
const moving = new Group();
for (const bin of shelf.children) moving.add(bin);
console.log(moving.children.length, shelf.children.length);`,
    ask: 'What does it log?',
    choices: ['`6 0`', '`6 6`', '`3 3`'],
    answer: 2,
    why: '`add` takes each bin off `shelf` first, so the rest of the list shifts up and the loop skips every other bin: 3 move and 3 stay, with no error. Loop over a copy, `[...shelf.children]`, to move all 6.',
  },
  {
    code: `model.traverse((object) => {
  if (object.isMesh) object.add(new Mesh(ringGeometry, ringMaterial));
});`,
    ask: 'What happens?',
    choices: [
      'Every Mesh gets one ring Mesh as a child',
      'It keeps adding Meshes to the new Meshes until it finally throws',
      "Nothing, since the walk can't see objects added during it",
    ],
    answer: 1,
    why: "`traverse` runs your function on an object before it walks that object's children, so it walks into the ring you just added, which is a Mesh too and gets its own ring, and so on, until JavaScript runs out of room and throws a RangeError. Collect the Meshes first, then add the rings in a loop.",
  },
];
