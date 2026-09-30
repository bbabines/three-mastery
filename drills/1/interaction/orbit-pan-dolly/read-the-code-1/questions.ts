// Read-the-code questions for the orbit, pan, dolly page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `camera.fov = 25; // it was 50
camera.updateProjectionMatrix();
// compared with a dolly that makes the product just as big`,
    ask: 'How big does the background look?',
    choices: ['The same as after the dolly', 'Bigger than after the dolly', 'Smaller than after the dolly'],
    answer: 1,
    why: "A zoom grows everything by the same amount. A dolly gets much closer to the product than to what's behind it, so the background grows less.",
  },
  {
    code: `const camera = new OrthographicCamera(-8, 8, 6, -6, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 20;`,
    ask: 'What stops the wheel scrolling out?',
    choices: ['Nothing, since the wheel changes camera.zoom', 'maxDistance, 20 units from the target', 'The far plane, 100 units from the camera'],
    answer: 0,
    why: "An orthographic camera's sizes don't change with distance, so the wheel changes `camera.zoom` and `maxDistance` never applies. Limit it with `minZoom` and `maxZoom`.",
  },
  {
    code: `controls.pan(300, 0);             // what a right drag does
controls.rotateLeft(Math.PI / 4); // then a left drag`,
    ask: 'What does the orbit circle around?',
    choices: ['The first target, where the product still is', "The world's origin, at (0, 0, 0)", 'The target, moved along by the pan'],
    answer: 2,
    why: 'Pan moves `controls.target` along with the camera, so the orbit circles the new target. Set `controls.enablePan = false` to keep a product centered.',
  },
];
