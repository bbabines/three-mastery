// Read-the-code questions for the rotation matrix as a basis page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `ship.rotation.y = Math.PI / 2; // a quarter turn around Y
ship.updateMatrix();
const v = new Vector3().setFromMatrixColumn(ship.matrix, 2);`,
    ask: 'What is `v`?',
    choices: ['(0, 0, 1), as column 2 is always +Z', "(1, 0, 0), the ship's turned front", '(0, 1, 0), since column 2 is Y'],
    answer: 1,
    why: "The columns are the ship's own axes after its turn, counted from 0, so column 2 is its front, swung from +Z to +X. Read facing straight off the matrix.",
  },
  {
    code: `crate.scale.setScalar(2);
crate.updateMatrixWorld();
const forward = new Vector3().setFromMatrixColumn(crate.matrixWorld, 2);
crate.position.addScaledVector(forward, speed * delta);`,
    ask: 'What goes wrong?',
    choices: ['Nothing, since columns are length 1', 'It moves twice as fast', 'It moves sideways, along its +Y'],
    answer: 1,
    why: 'Each column carries the scale, so `forward` is 2 long. Add `.normalize()`, or use `crate.getWorldDirection(forward)`.',
  },
  {
    code: `camera.updateMatrixWorld();
const f = new Vector3().setFromMatrixColumn(camera.matrixWorld, 2);
camera.position.addScaledVector(f, 1); // "move forward"`,
    ask: 'Which way does the camera move?',
    choices: ['Backward, away from what it sees', 'Forward, toward what it sees', 'Up, along its own +Y'],
    answer: 0,
    why: 'A camera looks down its −Z, so its third column points backward. Use `camera.getWorldDirection(f)`, which gives the way it looks.',
  },
  {
    code: `const forward = new Vector3(0, 0.5, 1).normalize(); // up a slope
const side = new Vector3().crossVectors(worldUp, forward).normalize();
m.makeBasis(side, worldUp, forward);
cart.quaternion.setFromRotationMatrix(m);`,
    ask: "What's wrong?",
    choices: ["worldUp isn't at right angles to forward", 'Nothing, since makeBasis straightens them', 'side points the wrong way round'],
    answer: 0,
    why: "`makeBasis` copies the axes as given, and on a slope `worldUp` isn't at right angles to `forward`, so the cart tips about 13° instead of 27°. Use `up.crossVectors(forward, side)`.",
  },
];
