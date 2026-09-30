// Read-the-code questions for the lookAt and the up vector page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `turret.lookAt(ball.position); // turret is a Mesh
camera.lookAt(ball.position);`,
    ask: 'Which side of each one faces the ball?',
    choices: ["The turret's +Z, the camera's −Z", 'The +Z side of both, like any object', 'The −Z side of both, like a camera'],
    answer: 0,
    why: "`lookAt` points an ordinary object's +Z at the point, but a camera looks down its −Z. Check which way a model was built before relying on `lookAt`.",
  },
  {
    code: `camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0); // straight down; camera.up is still (0, 1, 0)`,
    ask: 'What happens?',
    choices: ['It throws an error about parallel axes', 'It looks down, rolled by a tiny nudge', 'Its turn fills with NaN, and goes black'],
    answer: 1,
    why: 'Looking along `up` leaves no roll to pick, so three.js nudges the direction and carries on, and the nudge decides the roll. Set `camera.up` to (0, 0, −1) first.',
  },
  {
    code: `spot.position.set(0, 4, 0);
scene.add(spot);
spot.lookAt(shelf.position); // the shelf is at (3, 0, 0)`,
    ask: 'Where does the light shine?',
    choices: ['At the shelf, where lookAt aimed it', 'Straight down at (0, 0, 0), its target', 'Nowhere, until it has a target'],
    answer: 1,
    why: "A spot light shines at `spot.target`, which `lookAt` doesn't move. Copy the shelf's position into `spot.target.position`, and add `spot.target` to the scene.",
  },
  {
    code: `camera.position.set(0, 20, 0);
camera.lookAt(0, 0, 0);
camera.up.set(0, 0, -1);`,
    ask: 'When does the new `up` take effect?',
    choices: ['On the next render', 'The next time lookAt runs', 'After updateMatrixWorld()'],
    answer: 1,
    why: '`up` is only read inside `lookAt`, so changing it afterward does nothing until `lookAt` runs again. Set `up` first.',
  },
  {
    code: `// the car model was built with its front facing −Z
car.lookAt(garage.position);`,
    ask: 'Which part of the car faces the garage?',
    choices: ['Its front', 'Its rear', 'Its left side'],
    answer: 1,
    why: "`lookAt` points the car's +Z at the garage, and this car's +Z is its rear. Aim a holder group, with the car turned once inside it.",
  },
];
