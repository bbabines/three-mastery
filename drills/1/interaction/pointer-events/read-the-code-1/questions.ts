// Read-the-code questions for the pointer events page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const rect = canvas.getBoundingClientRect();
const x = (event.clientX - rect.left) * devicePixelRatio;
ndc.x = (x / rect.width) * 2 - 1;`,
    ask: 'What goes wrong on a screen with a pixel ratio of 2?',
    choices: [
      "Clicks land twice as far from the canvas's left edge",
      'Nothing, since the ratio makes clicks more precise',
      "Clicks land half as far from the canvas's left edge",
    ],
    answer: 0,
    why: '`clientX` and `rect.width` are both CSS pixels, so their ratio is already the right fraction of the canvas. Multiplying only one of them by the pixel ratio doubles the fraction on a ratio-2 screen. Leave `devicePixelRatio` out of pointer math entirely.',
  },
  {
    code: `// the canvas sits to the right of a 280-pixel sidebar
canvas.addEventListener('pointerdown', (event) => {
  ndc.x = (event.clientX / canvas.clientWidth) * 2 - 1;
});`,
    ask: 'Where do clicks land?',
    choices: ['280 CSS pixels right of the pointer', 'Right under the pointer, as intended', '280 CSS pixels left of the pointer'],
    answer: 0,
    why: "`clientX` is measured from the window's left edge, so it includes the sidebar's 280 pixels. Measured as if from the canvas's edge, every click reads 280 pixels too far right. Subtract `canvas.getBoundingClientRect().left` first.",
  },
  {
    code: `// no controls on this canvas, and no touch-action set
canvas.addEventListener('pointermove', (event) => {
  if (dragging) moveDial(event);
});`,
    ask: 'On a phone, a finger drags across the canvas. What happens?',
    choices: [
      'The drag works the same as it does with a mouse',
      'The page scrolls, and the browser cancels the drag',
      'Nothing at all, since pointer events skip fingers',
    ],
    answer: 1,
    why: "By default the browser uses a finger drag to scroll the page. Once it takes over, it sends `pointercancel` and stops sending `pointermove`. Set `canvas.style.touchAction = 'none'` so the drag stays yours; `OrbitControls` does this for its canvas.",
  },
];
