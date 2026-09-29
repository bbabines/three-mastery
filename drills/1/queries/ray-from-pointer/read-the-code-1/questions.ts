// Read-the-code questions for the ray from pointer page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const rect = canvas.getBoundingClientRect();
pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;`,
    ask: "The click is on the canvas's top-left corner. What is `pointer`?",
    choices: ['(−1, −1)', '(0, 0)', '(−1, 1)'],
    answer: 2,
    why: 'NDC runs from −1 at the left edge to 1 at the right, and from −1 at the bottom to 1 at the top. The top-left corner is (−1, 1). The minus sign on y is what makes the top come out as 1, since the page measures y downward.',
  },
  {
    code: `// The canvas sits right of a 300 px sidebar: 900 px wide, in a 1200 px window.
pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
raycaster.setFromCamera(pointer, camera);`,
    ask: 'The user clicks the middle of the canvas. Where does the ray go?',
    choices: ['Right of the spot that was clicked', 'Through the spot that was clicked', 'Left of the spot that was clicked'],
    answer: 0,
    why: "The window's size only works when the canvas starts at the window's left edge. Here the middle of the canvas is at `clientX` 750, which gives `pointer.x` 0.25 instead of 0. Subtract `rect.left` and divide by `rect.width` from `canvas.getBoundingClientRect()`.",
  },
  {
    code: `const rect = canvas.getBoundingClientRect();
pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;`,
    ask: 'The user clicks near the top of the canvas. Where does the ray go?',
    choices: ['Off to the side, near the left edge', 'Near the bottom of the view instead', 'Near the top of the view, as intended'],
    answer: 1,
    why: "The page's y runs down and NDC's runs up. Without the minus sign, a click near the top gives `pointer.y` close to −1, the bottom of the view. The line should be `-((event.clientY - rect.top) / rect.height) * 2 + 1`.",
  },
  {
    code: `renderer.setPixelRatio(2);
const rect = canvas.getBoundingClientRect();
pointer.x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;`,
    ask: "The click is on the canvas's right edge. What is `pointer.x`?",
    choices: ['1, the right edge, as intended', '3, far past the right edge', '0, the middle of the view'],
    answer: 2,
    why: "`canvas.width` counts device pixels, twice the CSS width at a pixel ratio of 2, while `clientX` counts CSS pixels. The right edge is only halfway to `canvas.width`, so `pointer.x` comes out 0. Divide by `rect.width` instead.",
  },
  {
    code: `camera.position.set(0, 5, 10); // moved in code, since the last render
raycaster.setFromCamera(pointer, camera);
console.log(raycaster.ray.origin);`,
    ask: 'What does it log?',
    choices: ["The camera's spot as of the last render", '(0, 5, 10), where the camera is now', '(0, 0, 0), where every ray starts'],
    answer: 0,
    why: "`setFromCamera` reads the camera's saved `matrixWorld`, which still holds where it was last rendered. Call `camera.updateMatrixWorld()` after moving it in code, as on the update timing page.",
  },
];
