// Read-the-code questions for the clip space, NDC, screen page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// A spot 8 units straight in front of a PerspectiveCamera, measured from the camera
const clip = new Vector4(0, 0, -8, 1).applyMatrix4(camera.projectionMatrix);`,
    ask: 'What is `clip.w`?',
    choices: ['1', '8', '−8'],
    answer: 1,
    why: "For a perspective camera, w is the spot's depth in front of it, 8 here. Dividing by w is what makes farther things smaller.",
  },
  {
    code: `const ndc = point.clone().project(camera);
// ndc is (-1, 1, 0.9)`,
    ask: 'Where on the view does the point appear?',
    choices: ['The bottom-left corner', 'The top-right corner', 'The top-left corner'],
    answer: 2,
    why: "NDC's x runs from −1 at the left to 1 at the right, and y from −1 at the bottom to 1 at the top, so (−1, 1) is the top-left.",
  },
  {
    code: `const ndc = part.getWorldPosition(v).project(camera);
label.style.left = \`\${(ndc.x + 1) / 2 * canvas.clientWidth}px\`;
label.style.top = \`\${(ndc.y + 1) / 2 * canvas.clientHeight}px\`;
// the part rises on screen`,
    ask: 'What does the label do?',
    choices: ['Moves down as the part rises', 'Rises along with it', 'Stays at the same height'],
    answer: 0,
    why: "NDC's y points up, but CSS's `top` counts down, so the label mirrors and moves the opposite way. Use `(1 - ndc.y) / 2 * canvas.clientHeight`.",
  },
  {
    code: `// the pointer is at the canvas's bottom-right corner
const rect = canvas.getBoundingClientRect();
ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;`,
    ask: 'What is `ndc`?',
    choices: ['(1, 1)', '(1, −1)', '(−1, 1)'],
    answer: 1,
    why: "The right edge gives x = 1, and the minus sign turns the bottom edge into y = −1, because NDC's y points up. Without it, you'd get (1, 1).",
  },
  {
    code: `renderer.setPixelRatio(2);
renderer.setSize(800, 400);
const x = (ndc.x + 1) / 2 * renderer.domElement.width; // ndc.x is 0: mid-view
label.style.left = \`\${x}px\`;`,
    ask: 'Where does the label go?',
    choices: ['To the right edge of the canvas', 'To the middle of the canvas', 'Halfway to the left edge'],
    answer: 0,
    why: '`domElement.width` counts device pixels, 1600 here, so `x` is 800 CSS pixels: the right edge. Use `canvas.clientWidth` for HTML positions.',
  },
];
