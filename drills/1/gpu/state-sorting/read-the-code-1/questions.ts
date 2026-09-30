// Read-the-code questions for the state changes and sorting page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const glass = new Mesh(pane, new MeshStandardMaterial({ transparent: true, opacity: 0.3 }));
scene.add(glass); // added first
scene.add(floor); // an ordinary opaque floor`,
    ask: 'Which one does three.js draw first?',
    choices: [
      'The glass, since it was added first',
      'The floor, since solid objects come first',
      'The nearer one, since they go front to back',
    ],
    answer: 1,
    why: "Scene order doesn't decide it. three.js draws every solid object first, then every see-through one, so the glass has something to blend over.",
  },
  {
    code: `// two opaque meshes with different materials;
// the sign is farther from the camera than the wall
sign.renderOrder = -1;`,
    ask: 'Which is drawn first?',
    choices: [
      'The wall, since solid objects go front to back',
      'The sign, since renderOrder beats distance',
      'The wall, since it was added to the scene first',
    ],
    answer: 1,
    why: "In the solid list, three.js compares `renderOrder` first, then material, then distance. The sign's −1 is below the wall's default 0, so it draws first wherever it is.",
  },
  {
    code: `label.renderOrder = 999; // drawn after everything else
// from where the camera is, the label is behind a wall`,
    ask: 'Does the label show through the wall?',
    choices: [
      'No, since the depth test still hides it',
      'Yes, since the last draw ends up on top',
      'Only if it is see-through enough',
    ],
    answer: 0,
    why: "The wall was drawn earlier and wrote its depth, so the label's fragments behind it fail the depth test. Set `label.material.depthTest = false` too.",
  },
];
