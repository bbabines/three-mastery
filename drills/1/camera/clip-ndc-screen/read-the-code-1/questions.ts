// Read-the-code questions for the clip space, NDC, screen page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// A spot 8 units straight in front of a PerspectiveCamera, measured from the camera
const clip = new Vector4(0, 0, -8, 1).applyMatrix4(camera.projectionMatrix);`,
    ask: 'What is `clip.w`?',
    choices: ['1', '8', '−8'],
    answer: 1,
    why: "For a perspective camera, w comes out as the spot's depth in front of the camera, 8 here. Dividing x, y, and z by it is what makes farther things smaller. An orthographic camera's w is always 1, which is why its sizes don't change with distance.",
  },
  {
    code: `const ndc = point.clone().project(camera);
// ndc is (-1, 1, 0.9)`,
    ask: 'Where on the view does the point appear?',
    choices: ['The bottom-left corner', 'The top-right corner', 'The top-left corner'],
    answer: 2,
    why: 'In NDC, x runs from −1 at the left edge to 1 at the right, and y from −1 at the bottom to 1 at the top: y points up, like y in the world. So (−1, 1) is the top-left corner. Its z of 0.9 is between −1 and 1, so it lies between the near and far planes.',
  },
  {
    code: `const ndc = part.getWorldPosition(v).project(camera);
label.style.left = \`\${(ndc.x + 1) / 2 * canvas.clientWidth}px\`;
label.style.top = \`\${(ndc.y + 1) / 2 * canvas.clientHeight}px\`;`,
    ask: 'The part rises on screen. What does the label do?',
    choices: ['Moves down as the part rises', 'Rises along with it', 'Stays at the same height'],
    answer: 0,
    why: "NDC's y points up, but CSS's `top` counts down from the top of the canvas. Without a flip, the label mirrors top to bottom and moves the opposite way. Use `(1 - ndc.y) / 2 * canvas.clientHeight`.",
  },
  {
    code: `const rect = canvas.getBoundingClientRect();
ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;`,
    ask: "The pointer is at the canvas's bottom-right corner. What is `ndc`?",
    choices: ['(1, 1)', '(1, −1)', '(−1, 1)'],
    answer: 1,
    why: "The right edge gives x = 1. The bottom edge is the far end of `clientY`, and the minus sign flips it to y = −1, because NDC's y points up. Without the minus sign, you'd get (1, 1), the top-right corner, and a ray from it would aim at the mirror spot.",
  },
  {
    code: `renderer.setPixelRatio(2);
renderer.setSize(800, 400);
const x = (ndc.x + 1) / 2 * renderer.domElement.width;
label.style.left = \`\${x}px\`;`,
    ask: 'The point is in the middle of the view, so `ndc.x` is 0. Where does the label go?',
    choices: ['To the right edge of the canvas', 'To the middle of the canvas', 'Halfway to the left edge'],
    answer: 0,
    why: "`domElement.width` counts device pixels: 800 CSS pixels times a pixel ratio of 2 is 1600, so `x` is 800, and 800 CSS pixels is the canvas's right edge. HTML positions are CSS pixels: use `canvas.clientWidth`, which is 800, and the label lands at 400, the middle.",
  },
];
