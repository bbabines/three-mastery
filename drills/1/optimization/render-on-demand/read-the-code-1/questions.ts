// Read-the-code questions for the render on demand page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a product viewer; the shopper reads the specs for a minute, touching nothing
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});`,
    ask: 'What does the GPU do meanwhile?',
    choices: [
      'Draws the same picture at every refresh',
      'Nothing, since three.js skips a matching frame',
      'Draws once, then waits for a change',
    ],
    answer: 0,
    why: "`render()` draws everything every time, and three.js never compares frames. Render only after the controls' `change` event and your own changes.",
  },
  {
    code: `controls.enableDamping = true;
controls.addEventListener('change', render); // render() draws one frame
render(); // the first frame; there's no animation loop`,
    ask: 'What goes wrong when the user orbits?',
    choices: [
      'Nothing, since change fires for the whole glide',
      'Nothing draws, since there is no loop',
      'The camera lags, then stops with no glide',
    ],
    answer: 2,
    why: 'With damping, each `controls.update()` moves only part of the way, and the glide needs it every frame. Keep a loop that calls `update()`, and render only after a `change`.',
  },
  {
    code: `controls.addEventListener('change', render);
colorPicker.addEventListener('input', () => {
  body.material.color.set(colorPicker.value);
});`,
    ask: 'The shopper picks a color. What do they see?',
    choices: ['The old color, until they next orbit', 'The new color, right away', 'A black frame until the next orbit'],
    answer: 0,
    why: 'Changing a color changes the material, not the screen, and only an orbit renders here. Call `render()` after every change: colors, visibility, a finished load, a resize.',
  },
];
