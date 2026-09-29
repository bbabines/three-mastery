// Read-the-code questions for the inverse matrices lesson. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `shelf.position.set(3, 0, -2);
const spot = shelf.worldToLocal(new Vector3(3, 1, -2));`,
    ask: 'What does `spot` hold?',
    choices: ['(0, 1, 0)', '(3, 1, −2)', '(6, 1, −4)'],
    answer: 0,
    why: "`worldToLocal` refreshes the shelf's `matrixWorld`, then applies its inverse, which undoes the shelf's move. The spot is 1 above the shelf's own center. (6, 1, −4) is what applying `matrixWorld` itself would give: the move added again instead of undone.",
  },
  {
    code: `const toWorld = crate.matrixWorld;
const toCrate = crate.matrixWorld.clone().invert();
const spot = new Vector3(0.2, 0.5, 0).applyMatrix4(toWorld).applyMatrix4(toCrate);`,
    ask: 'What does `spot` hold?',
    choices: ['(0.2, 0.5, 0), back where it started', '(0, 0, 0), since the two cancel out', "(0.4, 1, 0), since it's changed twice"],
    answer: 0,
    why: "The inverse undoes the matrix, so converting into the world and back returns the spot you started with, give or take a tiny rounding error, as on the floating-point tolerance page. What cancels out is the change, not the spot's numbers.",
  },
  {
    code: `const toPart = part.matrixWorld.invert(); // invert once, outside the loop
for (const p of scanPoints) p.applyMatrix4(toPart);
const hits = raycaster.intersectObject(part);`,
    ask: 'What goes wrong?',
    choices: [
      'The raycast tests the part in the wrong place',
      'Nothing, since invert gives back a new matrix',
      'The scan points end up measured in the world',
    ],
    answer: 0,
    why: "`invert()` changes the matrix it's called on and hands back that same matrix, so `part.matrixWorld` now holds the inverse. Inverting once outside the loop is right, and the points convert fine, but anything that reads `matrixWorld` before three.js rebuilds it at the next render, like this raycast, finds the part in the wrong place. Clone first: `part.matrixWorld.clone().invert()`.",
  },
  {
    code: `arm.position.set(2, 0, 0);
arm.rotation.y = Math.PI / 4;
arm.updateMatrixWorld();
const undo = arm.matrixWorld.clone().transpose();`,
    ask: 'Does `undo` bring world spots back to being measured from the arm?',
    choices: [
      'No, because the arm is moved as well as turned',
      'Yes, because a transpose always undoes a matrix',
      'Yes, because the arm is turned but not resized',
    ],
    answer: 0,
    why: "Transposing flips the matrix's rows and columns. That happens to undo a matrix that only turns, but this one also moves, so `undo` lands world spots in the wrong place. Use `arm.matrixWorld.clone().invert()`, which undoes any mix of move, turn, and resize.",
  },
  {
    code: `badge.scale.set(0, 0, 0); // shrunk away until it pops in
const offset = badge.worldToLocal(new Vector3(1, 2, 0));`,
    ask: 'What does `offset` hold?',
    choices: ['(NaN, NaN, NaN)', '(0, 0, 0)', 'It throws an error'],
    answer: 0,
    why: 'A resize to 0 squashes every spot onto one point, and nothing can undo that, so the matrix has no inverse. three.js doesn\'t throw: `invert()` quietly gives back a matrix of all zeros, and applying it gives NaN, which spreads into everything computed from it. Check for a 0 in the scale first, or hide the badge with `visible = false`.',
  },
];
