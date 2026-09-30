// Read-the-code questions for the blending and transparency page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const geometry = mergeGeometries([frontPane, middlePane, backPane]);
const panes = new Mesh(geometry, new MeshBasicMaterial({ transparent: true, opacity: 0.5 }));`,
    ask: 'In what order are the three panes drawn?',
    choices: [
      'In the order the geometry stores them',
      'Back to front, sorted triangle by triangle',
      'Back to front, sorted pane by pane',
    ],
    answer: 0,
    why: 'three.js sorts see-through objects, not triangles, and one mesh draws its triangles in stored order. Keep the panes as separate meshes so each one is sorted.',
  },
  {
    code: `const film = new MeshStandardMaterial({ color: 'white', opacity: 0.3 });
windowPane.material = film;`,
    ask: 'How see-through is the window pane?',
    choices: [
      'Not at all, since transparent is still false',
      '70% see-through, since opacity is enough',
      'Partly, but drawn in scene order',
    ],
    answer: 0,
    why: 'Without `transparent: true`, three.js builds the shader to force full opacity and draws the pane with the solid objects. Set `transparent: true` and the 0.3 takes effect.',
  },
  {
    code: `// a glass case and the glass bottle inside it, both
// transparent: true, sharing one center; the case is drawn first
caseMaterial.opacity = 0.2;`,
    ask: 'Why does the bottle vanish inside the case?',
    choices: [
      "The case's opacity is too high to see through",
      'The case wrote its depth, hiding the bottle',
      "See-through objects can't sit inside each other",
    ],
    answer: 1,
    why: "three.js leaves `depthWrite` on for see-through materials, so the case's front faces hide what's drawn behind them later. Set `caseMaterial.depthWrite = false`.",
  },
  {
    code: `// the part has been on screen, solid, for a while
part.material.transparent = true;
part.material.opacity = 0.5;`,
    ask: "The part stays solid. What's missing?",
    choices: [
      'part.material.depthWrite = false',
      'part.material.needsUpdate = true',
      'Nothing, it fades on the next frame',
    ],
    answer: 1,
    why: "The shader was built while the material was solid, and it forces full opacity. Changing `transparent` doesn't rebuild it; `needsUpdate = true` does.",
  },
];
