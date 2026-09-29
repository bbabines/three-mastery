// Read-the-code questions for the compose and decompose page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const m = new Matrix4().compose(spot, crate.rotation, size);
trees.setMatrixAt(0, m);`,
    ask: 'What goes wrong?',
    choices: [
      'The matrix fills with NaN, so copy 0 vanishes',
      'Nothing, rotation and quaternion hold the same turn',
      'compose throws an error about the wrong type',
    ],
    answer: 0,
    why: "`compose` wants a quaternion. `crate.rotation` holds the same turn written a different way, which the rotation domain covers, so `compose` reads a value that isn't there. Plain JavaScript doesn't stop it: every number comes out NaN (not a number) and the copy disappears. TypeScript flags it before it runs. Pass `crate.quaternion` instead.",
  },
  {
    code: `rack.scale.set(2, 1, 1);  // stretched wide
rack.add(panel);
panel.rotation.z = Math.PI / 4;
// …after the next render:
panel.matrixWorld.decompose(copy.position, copy.quaternion, copy.scale);`,
    ask: '`copy` was added straight to the scene. Does it match the panel?',
    choices: [
      'No, the copy comes out as a plain unskewed box',
      'Yes, every matrix splits into the three parts',
      'No, decompose throws on a skewed matrix',
    ],
    answer: 0,
    why: "The stretched rack skews the tilted panel (shear, from the TRS order page). A position, a turn, and a size can't describe a skew, so `decompose` drops it without a warning, and the copy is an unskewed box of about the same size. To copy it exactly, copy the whole matrix: `copy.matrix.copy(panel.matrixWorld)` with `copy.matrixAutoUpdate = false`.",
  },
  {
    code: `car.add(wheel);
car.rotation.y = Math.PI / 2;
const turn = new Quaternion();
wheel.getWorldQuaternion(turn);`,
    ask: 'How does `turn` compare with `wheel.quaternion`?',
    choices: [
      "It includes the car's turn too, so they differ",
      'The same, since the wheel itself was never turned',
      "Out of date until a render updates the car's turn",
    ],
    answer: 0,
    why: "`wheel.quaternion` is measured from the car, so it's still no turn at all. `getWorldQuaternion` refreshes the matrices, decomposes the wheel's `matrixWorld`, and keeps only the rotation, so `turn` holds the car's quarter turn. It's right even straight after the car turns.",
  },
];
