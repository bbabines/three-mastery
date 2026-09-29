// Read-the-code questions for the filtering page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `scene.add(new GridHelper(10, 10)); // lines on the floor
scene.add(crate);                   // standing on the floor
const hits = raycaster.intersectObjects(scene.children);`,
    ask: 'On its way down to the crate, the ray passes half a unit above a grid line. What is `hits[0].object`?',
    choices: [
      'The crate, since lines are too thin to hit',
      'The `GridHelper`, since a line counts within 1 unit',
      'The crate, since three.js skips helpers',
    ],
    answer: 1,
    why: "Helpers are ordinary objects to the raycaster. A ray counts as touching a line when it passes within `raycaster.params.Line.threshold`, 1 unit by default, and the grid line is nearer than the crate. Pass a list of what can be picked instead of `scene.children`.",
  },
  {
    code: `raycaster.layers.set(1);
rack.layers.set(1); // rack: a Group holding the shelf meshes
const hits = raycaster.intersectObject(rack);`,
    ask: 'The ray passes straight through two shelves. What does `hits` hold?',
    choices: ['Both shelves, since they sit inside the rack', 'One hit on the rack group itself', 'No hits, since the shelves are still on layer 0'],
    answer: 2,
    why: "Layers are tested on each object alone. The rack is on layer 1, but a group has no shape to hit, and its shelves are still on layer 0, so the raycaster skips them. `rack.traverse((o) => o.layers.enable(1))` puts every shelf on layer 1 too.",
  },
  {
    code: `let part = hits[0].object; // a screw, inside the toolbox's lid
while (part && !part.userData.sku) part = part.parent;`,
    ask: 'Only the toolbox group has a `userData.sku`. What is `part` after the loop?',
    choices: ['The toolbox group', 'The screw that was hit', 'The scene, at the very top'],
    answer: 0,
    why: "The loop climbs one parent at a time, from the screw to the lid to the toolbox, and stops at the first object with an sku. If nothing above had one, it would climb past the scene and end at `null`.",
  },
];
