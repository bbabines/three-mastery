// Read-the-code questions for the quaternions page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
console.log(q.y);`,
    ask: 'What does it log?',
    choices: ['About 0.707', 'About 1.571, which is π/2', '90'],
    answer: 0,
    why: "The four numbers aren't angles. For a quarter turn around Y, the quaternion is (0, 0.707, 0, 0.707): `y` holds the axis scaled by how far the turn goes, and `w` holds the rest. Build quaternions with `setFromAxisAngle` or `setFromEuler`, and read angles back with `new Euler().setFromQuaternion(q)`.",
  },
  {
    code: `ship.rotation.y = Math.PI / 2; // nose turned to +X
const tip = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 4);
ship.quaternion.multiply(tip);    // A
// or, instead:
ship.quaternion.premultiply(tip); // B`,
    ask: 'Do A and B leave the ship facing the same way?',
    choices: [
      'Yes: multiplying turns gives one result either way',
      'No: A tips its nose up, while B rolls it around the nose',
      'Yes: premultiply is just a faster version of multiply',
    ],
    answer: 1,
    why: "`multiply` applies `tip` around the ship's own axes, so the turn goes around its own side-to-side axis and the nose rises. `premultiply` applies it around the parent's axes, and the parent's X now runs along the ship's nose, so the ship rolls instead. The order changes the result, just like the matrices on the TRS order page.",
  },
  {
    code: `const up = new Vector3(0, 1, 0);
const slope = new Vector3(3, 4, 0); // the ground's normal, not normalized
pin.quaternion.setFromUnitVectors(up, slope);`,
    ask: 'What goes wrong?',
    choices: [
      'It throws an error, because slope is longer than 1',
      'The pin leans at the wrong angle, with no error or warning',
      'Nothing, since the method normalizes both vectors itself',
    ],
    answer: 1,
    why: "`setFromUnitVectors` assumes both directions are unit length and doesn't check. Here the pin leans about 62° when the slope is only about 37°. Normalize first: `pin.quaternion.setFromUnitVectors(up, slope.clone().normalize())`.",
  },
  {
    code: `const a = new Quaternion(0, 0.6, 0, 0.8);
const b = new Quaternion(0, -0.6, 0, -0.8);
console.log(a.equals(b), a.angleTo(b)); // false 0`,
    ask: 'Do `a` and `b` turn an object differently?',
    choices: [
      'No: b is −a, which is exactly the same turn',
      'Yes: equals says false, so they must differ',
      'Yes: b is the same turn, but backwards',
    ],
    answer: 0,
    why: "Flipping the sign of all four numbers gives the same turn: every turn has two quaternions, q and −q. `equals` compares the numbers, so it says `false`; `angleTo` compares the turns and gives 0. To check whether two objects face the same way, use `a.angleTo(b) < 1e-4`. The turn backwards would be `a.clone().invert()`, which is (0, −0.6, 0, 0.8).",
  },
  {
    code: `// the ship is already tilted; every frame:
const step = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.01);
ship.quaternion.multiply(step);`,
    ask: 'Which one-line call does the same thing?',
    choices: ['`ship.rotateY(0.01)`', '`ship.rotateOnWorldAxis(new Vector3(0, 1, 0), 0.01)`', '`ship.quaternion.y += 0.01`'],
    answer: 0,
    why: "`multiply` adds the step around the ship's own Y, which is exactly what `rotateY` does inside. `rotateOnWorldAxis` premultiplies, so it would turn around the parent's Y instead. Adding 0.01 to `quaternion.y` isn't a turn around Y at all: it knocks the length off 1, so the ship turns by some odd amount and is slightly distorted.",
  },
];
