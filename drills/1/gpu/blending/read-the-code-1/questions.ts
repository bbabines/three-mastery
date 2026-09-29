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
      'Back to front, sorted pane by pane each frame',
    ],
    answer: 0,
    why: 'three.js sorts transparent objects, not triangles: each object by the center of its bounding sphere. One mesh is one draw call, and it draws its triangles in stored order, here front, middle, back. From the front that\'s front to back, the wrong way: with `depthWrite` on, the front pane hides the other two. Keep panes as separate meshes, or store them back to front for the side people see.',
  },
  {
    code: `const film = new MeshStandardMaterial({ color: 'white', opacity: 0.3 });
windowPane.material = film;`,
    ask: 'How see-through is the window pane?',
    choices: [
      'Not at all: opacity needs transparent: true',
      '70% see-through: opacity alone is enough',
      'Partly: see-through, but drawn in scene order',
    ],
    answer: 0,
    why: 'Without `transparent: true`, three.js treats the material as opaque: it builds the shader to force full opacity, turns blending off, and draws it in the opaque list. Set `transparent: true` and the 0.3 takes effect, and the pane moves to the transparent list, drawn after everything solid.',
  },
  {
    code: `// a glass case and the glass bottle inside it, both
// transparent: true, sharing one center; the case is drawn first
caseMaterial.opacity = 0.2;`,
    ask: 'Why does the bottle vanish inside the case?',
    choices: [
      "The case's opacity is too high to see through",
      'The case wrote its depth, so the bottle fails the depth test',
      "Transparent objects can't be drawn inside one another",
    ],
    answer: 1,
    why: 'three.js leaves `depthWrite` on for transparent materials. The case is drawn first and writes the depth of its front faces, so every bottle fragment behind them is rejected. `caseMaterial.depthWrite = false` lets the bottle through; the case still blends, it just stops hiding things.',
  },
  {
    code: `// the part has been on screen, solid, for a while
part.material.transparent = true;
part.material.opacity = 0.5;`,
    ask: 'The part stays solid. What\'s missing?',
    choices: [
      'part.material.depthWrite = false',
      'part.material.needsUpdate = true',
      'Nothing, it fades on the next frame',
    ],
    answer: 1,
    why: 'The shader was built while the material was opaque, and it forces full opacity. Changing `transparent` doesn\'t rebuild it; `needsUpdate = true` does, and then the 0.5 shows. Switch `transparent` back off, with another `needsUpdate`, once the part is fully visible again.',
  },
];
