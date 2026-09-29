// Read-the-code questions for the TRS order page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `crate.position.set(3, 0.5, 0);
crate.rotation.y = Math.PI / 2;
crate.scale.set(2, 1, 1);`,
    ask: 'A teammate moves the `position` line to the end. What changes?',
    choices: [
      'Nothing, the crate looks and sits exactly the same',
      'The crate swings around the center to a new spot',
      "The stretch now runs along the world's X, not the crate's",
    ],
    answer: 0,
    why: "Setting `position`, `rotation`, and `scale` only stores numbers. When three.js builds the crate's matrix, it always resizes first, then turns, then moves, so the order of the lines never matters.",
  },
  {
    code: `moon.position.set(3, 0.5, 0);
const turn = new Matrix4().makeRotationY(Math.PI / 2);
moon.applyMatrix4(turn);`,
    ask: 'What does the moon do?',
    choices: [
      "Swings a quarter circle around its parent's origin",
      'Turns a quarter turn in place, staying at (3, 0.5, 0)',
      'Nothing until the next render updates its matrix',
    ],
    answer: 0,
    why: "`applyMatrix4` adds the change measured from the moon's parent, so the turn happens around the parent's origin: the moon swings from (3, 0.5, 0) to (0, 0.5, −3) and turns to match. It writes the result into `position` and `rotation` right away. To turn in place, turn the moon itself: `moon.rotation.y += Math.PI / 2`.",
  },
  {
    code: `// trees is an InstancedMesh: one shape drawn many times
const m = new Matrix4().makeTranslation(4, 0, 0);
m.multiply(new Matrix4().makeRotationY(angle));
trees.setMatrixAt(0, m);
trees.instanceMatrix.needsUpdate = true;`,
    ask: 'What does copy 0 do as `angle` grows each frame?',
    choices: [
      'Spins in place where it stands',
      "Circles around the trees mesh's origin",
      'Stays still, since the move was set first',
    ],
    answer: 0,
    why: "`multiply` adds the turn measured from the copy itself, so the turn happens before the move: the tree spins where it stands. `premultiply` would add the turn measured from the parent, and the tree would circle the `trees` mesh's origin instead.",
  },
  {
    code: `plank.rotation.z = Math.PI / 6; // tilted 30°
plank.scale.x = 2;`,
    ask: 'Which way does the plank get longer?',
    choices: [
      'Along its own tilted length, staying a rectangle',
      "Along the world's X, since the tilt was set first",
      'Out from its left end only, like a tape measure',
    ],
    answer: 0,
    why: "three.js resizes first, while the plank is still level, and turns it after, so `scale.x` stretches along the plank's own length whichever line comes first. It grows both ways from its origin, which for a box shape is its middle.",
  },
  {
    code: `holder.scale.set(3, 1, 1); // stretched wide
holder.add(tile);          // a square tile
tile.rotation.z = Math.PI / 4;`,
    ask: 'What shape is the tile in the world?',
    choices: [
      'A slanted diamond, its corners no longer square',
      'A rectangle, stretched along one of its own edges',
      'A bigger square, turned 45° just like before',
    ],
    answer: 0,
    why: "The holder's stretch is measured from the holder, so it runs along the holder's X, which goes corner to corner across the tilted tile. That slants the square into a diamond: a skew, called shear. `tile.scale` still says (1, 1, 1). To stretch the tile along its own edge, set `tile.scale` instead, and keep groups that hold turned parts at a uniform scale.",
  },
];
