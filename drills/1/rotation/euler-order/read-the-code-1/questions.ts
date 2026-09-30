// Read-the-code questions for the Euler angles and order page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const a = new Object3D();
a.rotation.set(Math.PI / 2, Math.PI / 2, 0);        // order 'XYZ'
const b = new Object3D();
b.rotation.set(Math.PI / 2, Math.PI / 2, 0, 'ZYX');`,
    ask: 'Do `a` and `b` face the same way?',
    choices: [
      'No: the order changes the turn',
      'Yes: they hold the same three angles',
      "Yes: order matters only when z isn't 0",
    ],
    answer: 0,
    why: 'Each turn goes around an axis the earlier turns moved, so the order changes the result: these two end up 120° apart. Set the order once, before the angles.',
  },
  {
    code: `// camera.rotation.order is the default, 'XYZ'
camera.rotation.x = MathUtils.degToRad(-30); // look down
camera.rotation.y = MathUtils.degToRad(45);  // then turn`,
    ask: 'What does the view do?',
    choices: ['Turns, with the horizon level', 'Turns, with the horizon tilted', 'Rolls, without turning at all'],
    answer: 1,
    why: "The X turn comes first, so `rotation.y` turns around the camera's own tipped Y, and the horizon tilts about 21°. Set `rotation.order = 'YXZ'` first.",
  },
  {
    code: `cam.rotation.set(-0.5, 0.8, 0); // with the default 'XYZ'
cam.rotation.order = 'YXZ';`,
    ask: 'What happens to the camera?',
    choices: ['Nothing, until an angle changes', 'It jumps to a different turn', 'It stays put, with new numbers'],
    answer: 1,
    why: "Setting `order` keeps the numbers and reads them in the new order, so the camera turns about 22°. `cam.rotation.reorder('YXZ')` keeps the turn and changes the numbers.",
  },
  {
    code: `head.rotation.order = 'YXZ';
head.rotation.y = yaw;   // from the mouse's left-right
head.rotation.x = pitch; // from the mouse's up-down`,
    ask: "Why use `'YXZ'` here?",
    choices: ['So the angles read in degrees', 'So yaw keeps the horizon level', 'It makes no difference here'],
    answer: 1,
    why: "`'YXZ'` does yaw first, around the upright axis, then pitch around the head's own side axis, so the horizon never tilts. The angles are still radians.",
  },
];
