// Read-the-code questions for the view matrix page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `camera.position.set(0, 0, 10); // not turned, so it looks down −Z
camera.updateMatrixWorld();
const v = new Vector3(0, 0, 4).applyMatrix4(camera.matrixWorldInverse);`,
    ask: 'What does `v` hold?',
    choices: ['(0, 0, −6)', '(0, 0, 6)', '(0, 0, 14)'],
    answer: 0,
    why: "The spot is 6 units in front, and in front means a negative z. `camera.matrixWorld` would give (0, 0, 14), adding the camera's move instead.",
  },
  {
    code: `camera.position.set(0, 0, 0);
camera.lookAt(-5, 0, 0); // face along the world's −X
camera.updateMatrixWorld();
const v = new Vector3(-5, 0, 0).applyMatrix4(camera.matrixWorldInverse);`,
    ask: 'What does `v` hold?',
    choices: ['(−5, 0, 0)', '(0, 0, −5)', '(5, 0, 0)'],
    answer: 1,
    why: "The spot is 5 units straight ahead, so measured from the camera it's (0, 0, −5), whichever way the camera faces. (−5, 0, 0) is where it is in the world.",
  },
  {
    code: `const offset = new Vector3(0, 0.3, -1.5); // 0.3 up and 1.5 in front of the camera
tooltip.position.copy(offset).applyMatrix4(camera.matrixWorldInverse);`,
    ask: 'Where does the tooltip end up?',
    choices: [
      '0.3 up and 1.5 in front of the camera',
      'Somewhere else, moving opposite to the camera',
      'At the camera itself, since the two cancel',
    ],
    answer: 1,
    why: 'The view matrix goes from the world to the camera, so it reads `offset` as a spot in the world. Use `camera.matrixWorld`, or add the tooltip to the camera.',
  },
  {
    code: `// The camera is at (0, 0, 10), looking down −Z.
const spot = new Vector3(6, 0, 2);
const depth = -spot.clone().applyMatrix4(camera.matrixWorldInverse).z;`,
    ask: 'What is `depth`?',
    choices: ['10', '−8', '8'],
    answer: 2,
    why: "Depth runs straight along the way the camera faces: 8 units. The spot is 10 away in a straight line, but that's `distanceTo`. The minus sign makes the depth positive.",
  },
  {
    code: `camera.scale.set(2, 2, 2); // the camera sits at the origin
camera.updateMatrixWorld();
const out = camera.localToWorld(new Vector3(0, 0, -1));
const back = out.clone().applyMatrix4(camera.matrixWorldInverse);`,
    ask: 'What does `back` hold?',
    choices: ['(0, 0, −1)', '(0, 0, −0.5)', '(0, 0, −2)'],
    answer: 2,
    why: "`localToWorld` includes the scale, so `out` is (0, 0, −2), but the view matrix leaves the scale out and doesn't shrink it back. Don't scale cameras; change `fov` or `zoom`.",
  },
];
