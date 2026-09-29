// Read-the-code questions for the visualizing vectors page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `turntable.add(panel);            // the panel's front is its own +Z
panel.position.set(1, 0.5, 0);
turntable.rotation.y = Math.PI / 2; // a quarter turn
scene.add(new ArrowHelper(new Vector3(0, 0, 1), panel.position));`,
    ask: 'Where does the arrow point?',
    choices: [
      "Out of the panel's front, wherever it turns",
      "Along the world's +Z, away from the panel's front",
      'Nowhere, since it has no parent to follow',
    ],
    answer: 1,
    why: "Added to the scene, the arrow reads (0, 0, 1) as the world's +Z and `panel.position` as a spot in the world. The quarter turn swung the panel's front to the world's +X and moved the panel to (0, 0.5, −1), so the arrow points the wrong way from the wrong spot. `panel.add(arrow)` fixes both.",
  },
  {
    code: `const velocity = new Vector3(3, 3, 0);
velocityArrow.setDirection(velocity);`,
    ask: 'Which way does the arrow point?',
    choices: ['Diagonally, between +X and +Y', 'Straight up, along +Y', 'Nowhere, since setDirection rejects it'],
    answer: 1,
    why: "`setDirection` assumes a direction 1 long and never checks. With a y of 3 it takes the \"points straight up\" shortcut, so the arrow points along +Y. Pass `velocity.clone().normalize()`, and set the length separately with `setLength`.",
  },
  {
    code: `raycaster.setFromCamera(pointer, camera);
const { origin, direction } = raycaster.ray;
scene.add(new ArrowHelper(direction, origin, 20, 'red'));`,
    ask: 'Seen through `camera`, what does the arrow look like?',
    choices: [
      'A line from the middle of the screen to the pointer',
      'At most a dot under the pointer',
      'A line from the pointer out to the edge of the screen',
    ],
    answer: 1,
    why: "The ray starts at the camera and runs straight along its line of sight through the pointer, so every point on the arrow lands on the same pixel. That's right, not a bug. Orbit to another view, or show it in a second camera's view, to see it as a line.",
  },
];
