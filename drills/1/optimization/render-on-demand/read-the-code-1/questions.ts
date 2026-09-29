// Read-the-code questions for the render on demand page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a product viewer: nothing moves unless the shopper orbits
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});`,
    ask: 'The shopper reads the specs for a minute without touching anything. What does the GPU do meanwhile?',
    choices: [
      'Draws the same picture again at every screen refresh',
      'Nothing, since three.js skips a frame that matches',
      'Draws once, then waits for the next change',
    ],
    answer: 0,
    why: "`setAnimationLoop` runs the callback at every refresh, and `render()` draws everything each time. three.js never compares frames. On demand: render only after the controls' `change` event and your own changes.",
  },
  {
    code: `const render = () => renderer.render(scene, camera);
controls.enableDamping = true;
controls.addEventListener('change', render);
render(); // the first frame; there's no animation loop`,
    ask: 'What goes wrong when the user orbits?',
    choices: [
      'Nothing, since the change event fires for the whole glide',
      'Nothing ever draws, since there is no loop to render',
      'The camera lags the drag, then stops dead with no glide',
    ],
    answer: 2,
    why: "With damping, each `controls.update()` applies only part of the move, and the glide needs `update()` called every frame. Here only pointer moves call it, so the camera falls short and stops when the pointer does. Keep a loop that calls `controls.update()`, and render only when a `change` has come in.",
  },
  {
    code: `controls.addEventListener('change', render);
colorPicker.addEventListener('input', () => {
  body.material.color.set(colorPicker.value);
});`,
    ask: 'The shopper picks a new color without touching the view. What do they see?',
    choices: ['The old color, until they next orbit', 'The new color, right away', 'A black frame until the next orbit'],
    answer: 0,
    why: "Changing a color changes the material, not the screen. Only a render draws it, and in this viewer only an orbit renders. Call `render()` after every change to the picture: colors, visibility, a finished load, a resize.",
  },
];
