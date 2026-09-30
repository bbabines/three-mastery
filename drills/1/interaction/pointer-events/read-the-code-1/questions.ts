// Read-the-code questions for the pointer events page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// on a screen whose devicePixelRatio is 2
const x = (event.clientX - rect.left) * devicePixelRatio;
ndc.x = (x / rect.width) * 2 - 1;`,
    ask: 'Where do clicks land on this screen?',
    choices: ["Twice as far from the canvas's left edge", 'Right under the pointer, but more precise', "Half as far from the canvas's left edge"],
    answer: 0,
    why: '`clientX` and `rect.width` are both CSS pixels, so scaling only one of them doubles the fraction. Leave `devicePixelRatio` out of pointer math.',
  },
  {
    code: `// the canvas sits to the right of a 280-pixel sidebar
canvas.addEventListener('pointerdown', (event) => {
  ndc.x = (event.clientX / canvas.clientWidth) * 2 - 1;
});`,
    ask: 'Where do clicks land?',
    choices: ['280 CSS pixels right of the pointer', 'Right under the pointer, as intended', '280 CSS pixels left of the pointer'],
    answer: 0,
    why: "`clientX` counts from the window's left edge, so it includes the sidebar. Subtract `canvas.getBoundingClientRect().left` first.",
  },
  {
    code: `// on a phone, with no controls and no touch-action set
canvas.addEventListener('pointermove', (event) => {
  if (dragging) moveDial(event);
});`,
    ask: 'What does a finger drag do?',
    choices: ['Turns the dial, the same as a mouse', 'Scrolls the page, and the drag is cancelled', 'Nothing, since pointer events skip fingers'],
    answer: 1,
    why: "The browser uses a finger drag to scroll, then sends `pointercancel` and stops sending moves. Set `canvas.style.touchAction = 'none'`.",
  },
];
