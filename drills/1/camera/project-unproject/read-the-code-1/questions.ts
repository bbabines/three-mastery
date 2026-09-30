// Read-the-code questions for the project and unproject page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const pos = mesh.position;
const ndc = pos.project(camera);`,
    ask: 'What happens to the mesh?',
    choices: ['Nothing, since project returns a copy', 'It moves in front of the camera', 'It jumps to its own NDC numbers'],
    answer: 2,
    why: '`project` changes the vector it\'s called on, and `pos` is `mesh.position` itself. Clone first: `mesh.position.clone().project(camera)`.',
  },
  {
    code: `const a = new Vector3(0, 0, -1).unproject(camera);
const b = new Vector3(0, 0, 1).unproject(camera);`,
    ask: 'Where are `a` and `b` in the world?',
    choices: [
      'On the near and far planes, straight ahead',
      'Both at the camera, since x and y are 0',
      'One unit in front and one unit behind',
    ],
    answer: 0,
    why: 'z picks the depth: −1 is the near plane and 1 the far plane. x and y of 0 is the middle of the view, so both lie straight ahead.',
  },
  {
    code: `const ndc = sign.getWorldPosition(v).project(camera);
// ndc is (0.2, -0.3, 1.04)
label.hidden = Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1;`,
    ask: 'Is the label shown, and is that right?',
    choices: [
      'Shown, wrongly: the sign is behind the camera',
      'Shown, rightly: the sign is on screen',
      'Hidden: x and y are outside the view',
    ],
    answer: 0,
    why: 'z above 1 means behind the camera, where x and y flip and can land inside −1 to 1. Add `|| Math.abs(ndc.z) > 1`.',
  },
  {
    code: `// near is 0.1 and far is 100.
const spot = new Vector3(0, 0, 0.5).unproject(camera);
marker.position.copy(spot);`,
    ask: 'How far from the camera does the marker land?',
    choices: ['About 50 units, halfway to far', 'About 0.4 units, right at the lens', 'Exactly 0.5 units away'],
    answer: 1,
    why: "NDC z isn't spread evenly: most of its range is used up close to the camera. Take the direction from `unproject` and choose the distance yourself.",
  },
  {
    code: `camera.position.set(0, 2, 10); // it was somewhere else until now
const ndc = target.position.clone().project(camera);`,
    ask: 'Which camera position does `ndc` use?',
    choices: ['The new one, (0, 2, 10)', 'The old one, from the last render', 'Neither, since project throws first'],
    answer: 1,
    why: "`project` uses the view matrix as last saved, and setting `position` doesn't refresh it. Call `camera.updateMatrixWorld()` first.",
  },
];
