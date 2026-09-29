// Read-the-code questions for the Euler angles and order page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const a = new Object3D();
a.rotation.set(Math.PI / 2, Math.PI / 2, 0);        // order 'XYZ'
const b = new Object3D();
b.rotation.set(Math.PI / 2, Math.PI / 2, 0, 'ZYX');`,
    ask: 'Do `a` and `b` end up facing the same way?',
    choices: [
      'No: the same turns in another order end up elsewhere',
      'Yes: they hold the same three angles, so the same turn',
      'Yes: order only matters once all three angles are set',
    ],
    answer: 0,
    why: "Each turn goes around an axis the turns before it have moved, so the order changes the result. `a` ends with its nose (+Z) along +X, and `b` with its nose pointing straight down: 120° apart. Even with Z at 0, X then Y isn't the same as Y then X.",
  },
  {
    code: `// camera.rotation.order is the default, 'XYZ'
camera.rotation.x = MathUtils.degToRad(-30); // look down
camera.rotation.y = MathUtils.degToRad(45);  // then turn`,
    ask: 'What does the view do?',
    choices: [
      'It turns left, with the horizon kept level',
      'It turns, but the horizon comes out tilted',
      'It rolls sideways, and the view stays put',
    ],
    answer: 1,
    why: "With `'XYZ'`, the X turn comes first, so `rotation.y` turns around the camera's own Y after it has tipped down. The view turns, but the horizon tilts about 21°: a roll nobody asked for, even though `rotation.z` is 0. Set `camera.rotation.order = 'YXZ'` so yaw goes first, around the upright axis.",
  },
  {
    code: `cam.rotation.set(-0.5, 0.8, 0); // set with the default 'XYZ'
cam.rotation.order = 'YXZ';`,
    ask: 'What happens to the camera?',
    choices: [
      'Nothing: the order only affects changes made later',
      'It jumps: the same numbers now mean another turn',
      'It stays put: the three numbers change to match',
    ],
    answer: 1,
    why: "Setting `order` keeps the three numbers and reads them in the new order, so the camera turns about 22° to a new pose straight away. To keep the turn and get new numbers for it, call `cam.rotation.reorder('YXZ')`. Simpler still: set the order once, before any angles.",
  },
  {
    code: `head.rotation.order = 'YXZ';
head.rotation.y = yaw;   // from the mouse's left-right
head.rotation.x = pitch; // from the mouse's up-down`,
    ask: "Why use `'YXZ'` here?",
    choices: [
      'Units: it makes rotation.x and rotation.y read in degrees',
      'Level horizon: yaw goes first, around the upright Y',
      'No reason: each angle always turns around its own fixed axis',
    ],
    answer: 1,
    why: "`'YXZ'` does the Y turn first, around the upright axis, then tips the head around its own side-to-side axis. Looking left and right never tilts the horizon, however far it looks up or down. three.js's `PointerLockControls` uses the same order. The angles are still radians.",
  },
];
