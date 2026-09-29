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
    why: "The spot is 6 units in front of the camera, and in front means a negative z when measured from the camera, because a camera looks down its own −Z. (0, 0, 14) is what `camera.matrixWorld` would give: it adds the camera's move instead of taking it away.",
  },
  {
    code: `camera.position.set(0, 0, 0);
camera.lookAt(-5, 0, 0); // face along the world's −X
camera.updateMatrixWorld();
const v = new Vector3(-5, 0, 0).applyMatrix4(camera.matrixWorldInverse);`,
    ask: 'What does `v` hold?',
    choices: ['(−5, 0, 0)', '(0, 0, −5)', '(5, 0, 0)'],
    answer: 1,
    why: "The spot is straight ahead of the camera, 5 away, so measured from the camera it's (0, 0, −5), whichever way the camera faces in the world. (−5, 0, 0) is the same spot in the world: the view matrix re-measures it from the camera, which includes the camera's turn.",
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
    why: "`matrixWorldInverse` goes from the world to measured from the camera, so it reads `offset` as a spot in the world and measures that from the camera. The tooltip lands somewhere unrelated, and it moves the opposite way whenever the camera moves. `applyMatrix4(camera.matrixWorld)` goes the right way, or add the tooltip to the camera as a child.",
  },
  {
    code: `// The camera is at (0, 0, 10), looking down −Z.
const spot = new Vector3(6, 0, 2);
const depth = -spot.clone().applyMatrix4(camera.matrixWorldInverse).z;`,
    ask: 'What is `depth`?',
    choices: ['10', '−8', '8'],
    answer: 2,
    why: "View depth is measured straight along the way the camera faces: the spot is 8 units further down −Z than the camera. It's 10 away in a straight line, because it's also 6 to the side, but that's what `distanceTo` gives, a different number. The minus sign turns the negative z of a spot in front into a positive depth.",
  },
  {
    code: `camera.scale.set(2, 2, 2);
camera.updateMatrixWorld();
const out = camera.localToWorld(new Vector3(0, 0, -1));
const back = out.clone().applyMatrix4(camera.matrixWorldInverse);`,
    ask: 'The camera sits at the origin. What does `back` hold?',
    choices: ['(0, 0, −1)', '(0, 0, −0.5)', '(0, 0, −2)'],
    answer: 2,
    why: "`localToWorld` uses `camera.matrixWorld`, which includes the scale, so `out` is (0, 0, −2). In r186 the view matrix leaves the camera's scale out, so it doesn't shrink the spot back: `back` is (0, 0, −2), not the (0, 0, −1) you started with. Don't scale cameras; change `fov` or `zoom` to see more or less.",
  },
];
