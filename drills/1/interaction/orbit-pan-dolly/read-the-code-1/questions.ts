// Read-the-code questions for the orbit, pan, dolly page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `camera.fov = 25; // it was 50
camera.updateProjectionMatrix();`,
    ask: 'Compared with dollying in until the product looks just as big, what is different?',
    choices: [
      'Nothing, as dolly and zoom are the same move',
      'Things behind it look bigger than after a dolly',
      'Things behind it look smaller than after a dolly',
    ],
    answer: 1,
    why: "A smaller `fov` is a zoom: the camera stays put and everything in view grows by the same amount. A dolly moves the camera much closer to the product but only a little closer to what's behind it, so the background grows less. Same product size, different picture.",
  },
  {
    code: `const camera = new OrthographicCamera(-8, 8, 6, -6, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 20;`,
    ask: 'The user keeps scrolling the wheel out. What stops it?',
    choices: [
      'Nothing, since the wheel changes camera.zoom',
      'maxDistance stops it 20 units from the target',
      "The far plane, 100 units from the camera",
    ],
    answer: 0,
    why: "Moving an orthographic camera closer or farther changes nothing about sizes, so OrbitControls' wheel changes `camera.zoom` instead of the distance, and `maxDistance` never comes into it. Limit it with `controls.minZoom` and `controls.maxZoom`.",
  },
  {
    code: `controls.pan(300, 0);             // what a right drag does
controls.rotateLeft(Math.PI / 4); // then a left drag`,
    ask: 'What does the orbit circle around?',
    choices: ['The first target, where the product still is', "The world's origin, at (0, 0, 0)", 'The target, moved along by the pan'],
    answer: 2,
    why: "Pan moves `controls.target` and the camera together, so the orbit after it circles the new target, and the product swings around off to one side. In a product viewer that should stay centered, turn it off with `controls.enablePan = false`.",
  },
];
