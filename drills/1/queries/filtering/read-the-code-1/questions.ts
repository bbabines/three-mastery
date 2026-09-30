// Read-the-code questions for the filtering page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `scene.add(new GridHelper(10, 10)); // lines on the floor
scene.add(crate);                   // standing on the floor
// on its way down to the crate, the ray passes half a unit above a grid line
const hits = raycaster.intersectObjects(scene.children);`,
    ask: 'What is `hits[0].object`?',
    choices: [
      'The crate, since lines are too thin to hit',
      'The `GridHelper`, since a line counts within 1 unit',
      'The crate, since three.js skips helpers',
    ],
    answer: 1,
    why: 'Helpers are ordinary objects to a raycaster, and a line counts as hit within `raycaster.params.Line.threshold`, 1 unit by default. Pass a target list instead of `scene.children`.',
  },
  {
    code: `raycaster.layers.set(1);
rack.layers.set(1); // rack: a Group holding the shelf meshes
// the ray passes straight through two shelves
const hits = raycaster.intersectObject(rack);`,
    ask: 'What does `hits` hold?',
    choices: ['Both shelves, since they sit inside the rack', 'One hit, on the rack group itself', 'No hits, since the shelves are still on layer 0'],
    answer: 2,
    why: 'Layers are tested per object. The group is on layer 1 but has no shape, and its shelves are still on layer 0. Enable layer 1 on each with `rack.traverse`.',
  },
  {
    code: `// only the toolbox group has a userData.sku
let part = hits[0].object; // a screw, inside the toolbox's lid
while (part && !part.userData.sku) part = part.parent;`,
    ask: 'What is `part` after the loop?',
    choices: ['The toolbox group', 'The screw that was hit', 'The scene, at the very top'],
    answer: 0,
    why: 'The loop climbs one parent at a time and stops at the first object with an sku: the toolbox. With none above, it would end at `null`.',
  },
];
