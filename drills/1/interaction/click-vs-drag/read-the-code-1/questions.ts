// Read-the-code questions for the click vs drag page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `canvas.addEventListener('pointerdown', (e) => (pressed = partUnder(e)));
canvas.addEventListener('pointerup', (e) => {
  if (partUnder(e) === pressed) select(pressed);
});`,
    ask: 'The user orbits the view, starting and ending the drag over the crate. What happens?',
    choices: [
      'Nothing, since the pointer moved during the drag',
      'The crate gets selected, though the user only orbited',
      'Nothing, since the orbit swallows the pointerup',
    ],
    answer: 1,
    why: "The code only compares the part under the press with the part under the release. An orbit around a product very often starts and ends over it, so each of those orbits selects it. `OrbitControls` doesn't stop the events, so this listener runs either way. Measure how far the pointer moved, and treat anything past a few pixels as a drag.",
  },
  {
    code: `const controls = new OrbitControls(camera, canvas);
canvas.addEventListener('click', (event) => select(partUnder(event)));`,
    ask: 'The user orbits the view and lets go over the shelf. What happens?',
    choices: ["Nothing, since a drag doesn't fire a click", 'The shelf gets selected just as the orbit ends', 'Nothing, since OrbitControls cancels clicks'],
    answer: 1,
    why: 'The browser fires `click` whenever the press and the release land on the same element, however far the pointer moved, and an orbit presses and releases on the canvas. So the handler runs after every orbit. Check the distance moved on `pointerup` instead of listening for `click`.',
  },
  {
    code: `canvas.addEventListener('pointerdown', () => (dragging = true));
canvas.addEventListener('pointerup', () => (dragging = false));
canvas.addEventListener('pointermove', (e) => {
  if (dragging) moveKnob(e);
});`,
    ask: 'With a mouse, the user drags off the canvas, lets go over the page, then moves back. What happens?',
    choices: [
      'The drag ended when the pointer left the canvas',
      'The knob follows the pointer with the button up',
      'The canvas still gets the pointerup, so it stops',
    ],
    answer: 1,
    why: "Without pointer capture, the `pointerup` goes to whatever is under the pointer, not the canvas, so `dragging` stays true and the knob follows the pointer once it's back. Call `canvas.setPointerCapture(event.pointerId)` on `pointerdown`: every event for that pointer then goes to the canvas until the release.",
  },
];
