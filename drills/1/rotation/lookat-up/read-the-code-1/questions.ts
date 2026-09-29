// Read-the-code questions for the lookAt and the up vector page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `turret.lookAt(ball.position); // turret is a Mesh
camera.lookAt(ball.position);`,
    ask: 'Which side of each one ends up pointing at the ball?',
    choices: ["The turret's +Z and the camera's −Z", 'The +Z side of both of them', 'The −Z side of both of them'],
    answer: 0,
    why: "`lookAt` turns ordinary objects so their +Z faces the point, and cameras so they look at it, which means their −Z faces it. It treats lights like cameras. Same call, opposite axes, so check which way a model was built before relying on `lookAt`.",
  },
  {
    code: `camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0); // straight down; camera.up is still (0, 1, 0)`,
    ask: 'What happens?',
    choices: [
      'It throws an error, because forward and up are parallel',
      'It looks straight down, with a roll set by a tiny nudge',
      'Its turn fills with NaN, and the screen goes black',
    ],
    answer: 1,
    why: "Straight down, the look direction lines up with `up`, so the cross product that would give the camera's side is (0, 0, 0). three.js nudges the direction by 0.0001 and carries on, with no error and no NaN; here the top of the picture happens to point to −Z. Move the target a hair past center and the picture flips 180°. Set `camera.up` to something that isn't parallel, like (0, 0, −1), before calling `lookAt`.",
  },
  {
    code: `const spot = new SpotLight(0xffffff, 50);
spot.position.set(0, 4, 0);
scene.add(spot);
spot.lookAt(shelf.position); // the shelf is at (3, 0, 0)`,
    ask: 'Where does the light shine?',
    choices: ['At the shelf, since lookAt turned the light', 'Straight down at (0, 0, 0), its target', 'Nowhere, until the light has a target'],
    answer: 1,
    why: "A spot light shines from its position toward `spot.target`, whatever its own rotation. `lookAt` turned the light object but not its target, which is still at (0, 0, 0), straight below. Move the target instead, `spot.target.position.copy(shelf.position)`, and add `spot.target` to the scene so its position stays current.",
  },
  {
    code: `camera.position.set(0, 20, 0);
camera.lookAt(0, 0, 0);
camera.up.set(0, 0, -1);`,
    ask: 'When does the new `up` take effect?',
    choices: ['On the next render, automatically', 'Only when lookAt is called again', 'After calling updateMatrixWorld()'],
    answer: 1,
    why: "`up` is only read inside `lookAt`, when it works out the turn. Changing it afterward changes nothing until `lookAt` runs again, so set `up` first. `OrbitControls` reads `camera.up` once, when it's created, so set it before making the controls too.",
  },
  {
    code: `// the car model was built with its front facing −Z
car.lookAt(garage.position);`,
    ask: 'Which part of the car faces the garage?',
    choices: ['Its front', 'Its rear', 'Its left side'],
    answer: 1,
    why: "`lookAt` points an object's +Z at the point, and this car's +Z is its rear, so it ends up backing toward the garage. Put the car in a holder group, turn it once so its front lines up with the holder's +Z, and aim the holder; or follow `lookAt` with `car.rotateY(Math.PI)`.",
  },
];
