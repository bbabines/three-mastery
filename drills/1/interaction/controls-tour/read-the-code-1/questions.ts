// Read-the-code questions for the controls tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
renderer.setAnimationLoop(() => renderer.render(scene, camera));`,
    ask: 'How does the view respond when the user drags?',
    choices: [
      'It lags, falls short, and stops dead on release',
      'It follows the drag, then glides to a stop',
      "It doesn't respond to the pointer at all",
    ],
    answer: 0,
    why: 'With damping on, each pointer move applies only a slice of the turn, and the rest waits for the next `update()`. With no `update()` in the frame loop, the camera only moves while the pointer does: it trails behind, never catches up, and freezes the moment the pointer stops. Call `controls.update()` every frame, before rendering.',
  },
  {
    code: `const gizmo = new TransformControls(camera, renderer.domElement);
gizmo.attach(crate);
scene.add(gizmo);`,
    ask: 'What shows up on screen?',
    choices: ['Handles on the crate, ready to drag', "Handles at the scene's center, not the crate", 'No handles, and an error in the console'],
    answer: 2,
    why: "In r186 `TransformControls` isn't an Object3D, so `scene.add` logs an error and adds nothing. The handles live in its helper: `scene.add(gizmo.getHelper())`.",
  },
  {
    code: `const look = new PointerLockControls(camera, renderer.domElement);
look.lock(); // runs as the page loads`,
    ask: 'What happens?',
    choices: [
      'The cursor hides and the mouse turns the camera',
      'The browser refuses, since nobody has clicked yet',
      'The camera turns, but the cursor stays in view',
    ],
    answer: 1,
    why: 'Browsers only grant a pointer lock right after the user interacts with the page, with a click or a key press. Call `look.lock()` from a click handler, such as a "Start" button, and listen for the `lock` and `unlock` events to hide or show your menu.',
  },
];
