// Read-the-code questions for the projection matrix page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// The canvas is twice as wide as it is tall.
const camera = new PerspectiveCamera(50, 2, 0.1, 100);`,
    ask: 'How wide an angle does the camera see from side to side?',
    choices: ['50°', 'About 86°', '100°'],
    answer: 1,
    why: "`fov` is the angle from the bottom of the view to the top. The side-to-side angle follows from it and the aspect: about 86° here. It isn't simply doubled to 100°, because angles don't grow in step with the width they cover.",
  },
  {
    code: `camera.fov = 25; // it was 50
renderer.render(scene, camera);`,
    ask: 'What changes on screen?',
    choices: ['Nothing yet', 'Everything looks about twice as big', 'The view opens twice as wide'],
    answer: 0,
    why: "The projection matrix is a saved copy that `render` doesn't rebuild. Nothing changes until `camera.updateProjectionMatrix()` runs. After that, everything looks about twice as big: a smaller `fov` shows a smaller slice of the world.",
  },
  {
    code: `// Option A: zoom in
camera.fov = 25;
camera.updateProjectionMatrix();
// Option B: dolly in
camera.position.z -= 2;`,
    ask: 'Say both options make the box in front fill the same share of the view. How do the two pictures differ?',
    choices: [
      'With B, things behind the box look smaller',
      'With A, things behind the box look smaller',
      'They match, since a smaller fov is moving closer',
    ],
    answer: 0,
    why: "Zooming enlarges near and far things by the same amount. Moving closer enlarges the box more than what's behind it, because the camera closed a bigger share of the distance to the box. So with B, the background looks smaller and farther away.",
  },
  {
    code: `const camera = new OrthographicCamera(-4, 4, 3, -3, 0.1, 100);
camera.position.set(0, 0, 10);
camera.position.z = 5; // halfway to a box at the origin`,
    ask: 'How much bigger does the box look after the move?',
    choices: ['Twice as big', 'The same size', 'Four times as big'],
    answer: 1,
    why: 'An orthographic camera sees a box of the world 8 units wide and 6 tall at any distance, so moving closer changes nothing about sizes. To zoom it, set `camera.zoom` and call `updateProjectionMatrix()`.',
  },
  {
    code: `const camera = new PerspectiveCamera(50, 1.5, 0.1, 20);
// A long building runs from 15 to 30 units in front of the camera.`,
    ask: 'What of the building gets drawn?',
    choices: ['None of it, since most is past `far`', 'All of it, since part is in range', 'Only the part closer than 20'],
    answer: 2,
    why: "`far` cuts the view off point by point, not object by object. The building is sliced at 20 units: its front part draws and the rest vanishes. Set `far` to reach the farthest thing in the scene.",
  },
];
