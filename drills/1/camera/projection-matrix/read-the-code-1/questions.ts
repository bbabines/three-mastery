// Read-the-code questions for the projection matrix page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// The canvas is twice as wide as it is tall.
const camera = new PerspectiveCamera(50, 2, 0.1, 100);`,
    ask: 'What angle does it see from side to side?',
    choices: ['50°', 'About 86°', '100°'],
    answer: 1,
    why: '`fov` is the angle from bottom to top. The side-to-side angle follows from it and the aspect, about 86° here, not simply double.',
  },
  {
    code: `camera.fov = 25; // it was 50
renderer.render(scene, camera);`,
    ask: 'What changes on screen?',
    choices: ['Nothing yet', 'Everything looks about twice as big', 'The view opens twice as wide'],
    answer: 0,
    why: "`render` doesn't rebuild the projection matrix, so nothing changes until `camera.updateProjectionMatrix()` runs. After that, everything looks about twice as big.",
  },
  {
    code: `// Each option makes the box in front fill the same share of the view.
camera.fov = 25; // A: zoom in
camera.updateProjectionMatrix();
camera.position.z -= 2; // B, instead: dolly in`,
    ask: 'How do the two pictures differ?',
    choices: [
      'With B, things behind the box look smaller',
      'With A, things behind the box look smaller',
      'They match, since a smaller fov is moving closer',
    ],
    answer: 0,
    why: "Zooming grows near and far things by the same amount. Moving closer grows the box more than what's behind it, so with B the background looks smaller.",
  },
  {
    code: `const camera = new OrthographicCamera(-4, 4, 3, -3, 0.1, 100);
camera.position.set(0, 0, 10);
camera.position.z = 5; // halfway to a box at the origin`,
    ask: 'How much bigger does the box look?',
    choices: ['Twice as big', 'The same size', 'Four times as big'],
    answer: 1,
    why: 'An orthographic camera sees the same 8 by 6 box of the world at any distance, so moving closer changes no sizes. Zoom with `camera.zoom` instead.',
  },
  {
    code: `const camera = new PerspectiveCamera(50, 1.5, 0.1, 20);
// A long building runs from 15 to 30 units in front of the camera.`,
    ask: 'What of the building gets drawn?',
    choices: ['None of it, since most is past `far`', 'All of it, since part is in range', 'Only the part closer than 20'],
    answer: 2,
    why: '`far` cuts the view off point by point, not object by object, so the building is sliced at 20 units. Set `far` to reach the farthest thing.',
  },
];
