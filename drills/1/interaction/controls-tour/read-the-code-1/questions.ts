// Read-the-code questions for the controls tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
renderer.setAnimationLoop(() => renderer.render(scene, camera));`,
    ask: 'How does the view respond to a drag?',
    choices: ['It lags and stops dead on release', 'It follows the drag, then glides to a stop', "It doesn't respond to the pointer at all"],
    answer: 0,
    why: 'Damping moves the camera a step at a time inside `update()`, so here it only moves while the pointer does. Call `controls.update()` every frame, before rendering.',
  },
  {
    code: `const gizmo = new TransformControls(camera, renderer.domElement);
gizmo.attach(crate);
scene.add(gizmo);`,
    ask: 'What shows up on screen?',
    choices: ['Handles on the crate, ready to drag', "Handles at the scene's center", 'No handles, and an error in the console'],
    answer: 2,
    why: "The controls aren't an object in the scene, so `scene.add` logs an error and adds nothing. Add the handles with `scene.add(gizmo.getHelper())`.",
  },
  {
    code: `const look = new PointerLockControls(camera, renderer.domElement);
look.lock(); // runs as the page loads`,
    ask: 'What happens?',
    choices: ['The cursor hides and the mouse turns the camera', 'The browser refuses, since nobody has clicked', 'The camera turns, but the cursor stays in view'],
    answer: 1,
    why: 'Browsers grant a pointer lock only right after a click or key press. Call `look.lock()` from a click handler, like a Start button.',
  },
];
