// Read-the-code questions for the click vs drag page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the user orbits, starting and ending over the crate
canvas.addEventListener('pointerdown', (e) => (pressed = partUnder(e)));
canvas.addEventListener('pointerup', (e) => {
  if (partUnder(e) === pressed) select(pressed);
});`,
    ask: 'What does that orbit do to the crate?',
    choices: ['Nothing, since the pointer moved', 'Selects it, though the user only orbited', 'Nothing, since the orbit eats the pointerup'],
    answer: 1,
    why: 'The code only compares the parts under the press and the release, and an orbit often starts and ends over the product. Measure how far the pointer moved instead.',
  },
  {
    code: `const controls = new OrbitControls(camera, canvas);
canvas.addEventListener('click', (event) => select(partUnder(event)));
// the user orbits, then lets go over the shelf`,
    ask: 'What happens when the orbit ends?',
    choices: ["Nothing, since drags don't fire clicks", 'The shelf gets selected as the orbit ends', 'Nothing, since OrbitControls cancels it'],
    answer: 1,
    why: 'The browser fires `click` whenever the press and the release land on the same element, however far the pointer moved. Check the distance on `pointerup` instead.',
  },
  {
    code: `// a mouse drags off the canvas, lets go, then comes back
canvas.addEventListener('pointerdown', () => (dragging = true));
canvas.addEventListener('pointerup', () => (dragging = false));
canvas.addEventListener('pointermove', (e) => dragging && moveKnob(e));`,
    ask: 'What does the knob do then?',
    choices: ['Nothing, since the drag ended when it left', 'Follows the pointer with the button up', 'Stops, since the canvas got the pointerup'],
    answer: 1,
    why: 'Without pointer capture, the `pointerup` goes to whatever is under the pointer, so `dragging` stays true. Call `canvas.setPointerCapture(event.pointerId)` on `pointerdown`.',
  },
];
