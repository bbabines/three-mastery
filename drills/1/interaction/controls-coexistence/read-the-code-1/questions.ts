// Read-the-code questions for the controls coexistence page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gizmo = new TransformControls(camera, renderer.domElement);
gizmo.attach(crate);
scene.add(gizmo.getHelper());
// OrbitControls runs on the same canvas; the user drags the X arrow`,
    ask: 'What moves during the drag?',
    choices: ['The crate and the view, both at once', 'Only the crate, since the gizmo takes the press', 'Only the view, since OrbitControls came first'],
    answer: 0,
    why: "Both controls listen for presses on the same canvas, and neither knows about the other. Switch the orbit off on the gizmo's `dragging-changed` event.",
  },
  {
    code: `controls.enableDamping = true;
// the user flicks the view, then presses on a part to drag it
controls.enabled = false;`,
    ask: 'What does the view do during the drag?',
    choices: ['It stops dead the moment enabled is false', 'It keeps orbiting along with the pointer', 'It glides on for a moment, then stops'],
    answer: 2,
    why: '`enabled` only stops OrbitControls reading the pointer. `update()` still spends the glide left over from the flick, so the view drifts briefly.',
  },
  {
    code: `const labelRenderer = new CSS2DRenderer(); // HTML labels over the canvas
labelRenderer.domElement.style.position = 'absolute';
container.append(labelRenderer.domElement); // covers the whole canvas
// OrbitControls listens on the canvas; the user drags on the view`,
    ask: 'What happens to the view?',
    choices: ['It orbits, since the labels are only text', 'Nothing, since the label layer gets every press', 'Only the labels move, dragged by the pointer'],
    answer: 1,
    why: "The label layer is an HTML element over the canvas, so it takes the pointer events. Set its `style.pointerEvents = 'none'`, and `'auto'` on clickable labels.",
  },
];
