// Read-the-code questions for the controls coexistence page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gizmo = new TransformControls(camera, renderer.domElement);
gizmo.attach(crate);
scene.add(gizmo.getHelper());
// OrbitControls runs on the same canvas`,
    ask: "The user drags the gizmo's X arrow. What moves?",
    choices: ['The crate and the view, both at once', 'Only the crate, since the gizmo takes the press', 'Only the view, since OrbitControls came first'],
    answer: 0,
    why: "Both controls listen for presses on the same canvas, and neither knows about the other, so the drag moves the crate and orbits the view. Wire them together: `gizmo.addEventListener('dragging-changed', (e) => (controls.enabled = !e.value))`.",
  },
  {
    code: `controls.enableDamping = true;
// the user flicks the view, then presses on a part to drag it
controls.enabled = false;`,
    ask: 'What does the view do while the part is dragged?',
    choices: ['It stops dead the moment enabled is false', 'It keeps orbiting along with the pointer', 'It glides on for a moment, then stops'],
    answer: 2,
    why: "`enabled` only stops OrbitControls from reading the pointer. `update()` still runs every frame and still spends the glide left over from the flick, so the view drifts briefly under the drag. The pointer itself no longer turns it.",
  },
  {
    code: `const labelRenderer = new CSS2DRenderer(); // HTML labels over the canvas
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
container.append(labelRenderer.domElement); // covers the whole canvas`,
    ask: 'OrbitControls listens on the canvas. The user drags on the view. What happens?',
    choices: [
      'The view orbits, since the labels are only text on top',
      'Nothing, since the label layer gets every press',
      'Only the labels move, dragged by the pointer',
    ],
    answer: 1,
    why: "The label layer is an HTML element over the canvas, so it receives the pointer events and the canvas gets none. Set `labelRenderer.domElement.style.pointerEvents = 'none'`, and `'auto'` on any label that should be clickable.",
  },
];
