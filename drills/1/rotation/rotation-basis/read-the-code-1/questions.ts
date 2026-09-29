// Read-the-code questions for the rotation matrix as a basis page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `ship.rotation.y = Math.PI / 2; // a quarter turn around Y
ship.updateMatrix();
const v = new Vector3().setFromMatrixColumn(ship.matrix, 2);`,
    ask: 'What is `v`?',
    choices: [
      '(0, 0, 1): the third column always holds +Z',
      "(1, 0, 0): the ship's front, now turned to +X",
      '(0, 1, 0): column 2 is the Y column',
    ],
    answer: 1,
    why: "The first three columns are the ship's own +X, +Y, and +Z after its turn, and `setFromMatrixColumn` counts from 0, so column 2 is the third: its +Z, its front. A quarter turn around Y swings the front from +Z to +X. The matrix isn't a sealed box of numbers: its columns tell you which way the object faces.",
  },
  {
    code: `crate.scale.setScalar(2);
crate.updateMatrixWorld();
const forward = new Vector3().setFromMatrixColumn(crate.matrixWorld, 2);
crate.position.addScaledVector(forward, speed * delta);`,
    ask: 'What goes wrong?',
    choices: [
      'Nothing: the columns of a matrix are always length 1',
      'It moves twice as fast: forward is 2 long',
      "It moves sideways: column 2 is the crate's +Y",
    ],
    answer: 1,
    why: 'Each column carries the object\'s scale on that axis, so at scale 2 `forward` is 2 long and the crate covers twice the distance. Add `.normalize()`, or use `crate.getWorldDirection(forward)`, which normalizes for you.',
  },
  {
    code: `camera.updateMatrixWorld();
const f = new Vector3().setFromMatrixColumn(camera.matrixWorld, 2);
camera.position.addScaledVector(f, 1); // "move forward"`,
    ask: 'Which way does the camera move?',
    choices: ['Backward, away from what it sees', 'Forward, toward what it sees', 'Up, since column 2 holds its +Y'],
    answer: 0,
    why: "A camera looks down its own −Z, so its +Z, the third column, points backward. `camera.getWorldDirection(f)` gives the way it looks, which is that column negated. Ordinary objects are the other way round: their +Z is their front.",
  },
  {
    code: `const forward = new Vector3(0, 0.5, 1).normalize(); // up a slope
const side = new Vector3().crossVectors(worldUp, forward).normalize();
m.makeBasis(side, worldUp, forward);
cart.quaternion.setFromRotationMatrix(m);`,
    ask: "What's wrong?",
    choices: [
      "worldUp isn't at right angles to forward, so the turn comes out wrong",
      'Nothing, because makeBasis straightens the three axes out itself',
      'side points the wrong way, because the cross product order is backward',
    ],
    answer: 0,
    why: "`makeBasis` copies the axes in as given. On a slope, the world's up isn't at right angles to `forward`, so the matrix is skewed, and `setFromRotationMatrix`, which assumes a pure turn, gives a wrong one: the cart tips about 13° when the slope is about 27°. Make up from the other two: `up.crossVectors(forward, side)`. `side` is fine: worldUp × forward gives +X.",
  },
];
