// Read-the-code questions for the quaternions page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
console.log(q.y);`,
    ask: 'What does it log?',
    choices: ['About 0.707', 'About 1.571, which is π/2', 'Exactly 90'],
    answer: 0,
    why: "None of the four numbers is an angle: `y` is the axis scaled by how far the turn goes. Read angles back with `new Euler().setFromQuaternion(q)`.",
  },
  {
    code: `ship.rotation.y = Math.PI / 2; // nose turned to +X
const tip = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 4);
ship.quaternion.multiply(tip);    // A
// or, instead:
ship.quaternion.premultiply(tip); // B`,
    ask: 'Do A and B give the same turn?',
    choices: ['Yes: multiplying ignores order', 'No: A tips the nose, and B rolls', 'Yes: premultiply is just faster'],
    answer: 1,
    why: "`multiply` turns around the ship's own axes, so its nose tips up. `premultiply` uses the parent's X, which runs along the nose, so the ship rolls. Pick by whose axes you mean.",
  },
  {
    code: `const slope = new Vector3(3, 4, 0); // the ground's normal, not normalized
pin.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), slope);`,
    ask: 'What goes wrong?',
    choices: ['It throws, since slope is over 1 long', 'The pin leans at the wrong angle', 'Nothing, since it normalizes for you'],
    answer: 1,
    why: "`setFromUnitVectors` assumes both directions have length 1 and doesn't check, so the pin leans about 62° instead of 37°. Pass `slope.clone().normalize()`.",
  },
  {
    code: `const a = new Quaternion(0, 0.6, 0, 0.8);
const b = new Quaternion(0, -0.6, 0, -0.8);
a.equals(b); // false`,
    ask: 'Do `a` and `b` turn an object differently?',
    choices: ['No: b is −a, which is exactly the same turn', 'Yes: equals says that they differ', 'Yes: b is the same turn, backwards'],
    answer: 0,
    why: 'Flipping all four signs gives the same turn. `equals` compares the numbers, not the turns; use `a.angleTo(b) < 1e-4` to compare turns.',
  },
  {
    code: `// every frame:
step.setFromAxisAngle(new Vector3(0, 1, 0), 0.01);
ship.quaternion.multiply(step);`,
    ask: 'Which one-line call does the same?',
    choices: ['`ship.rotateY(0.01)`', '`ship.rotateOnWorldAxis(yAxis, 0.01)`', '`ship.quaternion.y += 0.01`'],
    answer: 0,
    why: "`multiply` adds the step around the ship's own Y, which is what `rotateY` does. `rotateOnWorldAxis` uses the parent's Y, and editing `y` by hand breaks the length.",
  },
];
