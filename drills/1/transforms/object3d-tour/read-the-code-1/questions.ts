// Read-the-code questions for the Object3D API tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// in a module, like most three.js code
const spot = new Vector3(2, 0, -1);
rack.position = spot;`,
    ask: 'What happens?',
    choices: ['It throws a TypeError', 'The rack moves to (2, 0, −1)', 'The rack moves, then follows spot'],
    answer: 0,
    why: '`position` is a read-only property, so assigning a new vector to it throws in a module. Change the vector that is already there instead: `rack.position.copy(spot)`. In an old non-module script the assignment silently does nothing, which is harder to spot.',
  },
  {
    code: `rack.rotation.y = Math.PI / 2;
rack.quaternion.identity(); // no turn at all
console.log(rack.rotation.y);`,
    ask: 'What does it log?',
    choices: ['0', 'About 1.571, which is π/2', '0, but only after the next render'],
    answer: 0,
    why: '`rotation` and `quaternion` store the same turn two ways, and three.js keeps them in sync the moment either changes. Resetting the quaternion to no turn resets `rotation` too, with no render needed.',
  },
  {
    code: `rack.add(shelf);
rack.visible = false;
console.log(shelf.visible);`,
    ask: 'What does it log, and is the shelf drawn?',
    choices: ["true, but the shelf isn't drawn", 'false, and the shelf is not drawn', 'true, and the shelf is still drawn'],
    answer: 0,
    why: "Hiding a parent leaves its children's own `visible` alone, so the shelf still says `true`. The renderer skips a hidden object and everything attached to it, though, so the shelf isn't drawn until the rack is visible again.",
  },
];
