// Read-the-code questions for the state changes and sorting page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const glass = new Mesh(pane, new MeshStandardMaterial({ transparent: true, opacity: 0.3 }));
scene.add(glass); // added first
scene.add(floor); // an ordinary opaque floor`,
    ask: 'Which one does three.js draw first?',
    choices: [
      'The glass: it was added to the scene first',
      'The floor: opaque ones come first',
      'The nearer one: they go front to back',
    ],
    answer: 1,
    why: 'Scene order doesn\'t decide it. three.js draws every opaque object first, then every transparent one, so the glass has something to blend over. Within each list it sorts again: opaque by `renderOrder`, material, then front to back; transparent by `renderOrder`, then back to front.',
  },
  {
    code: `// two opaque meshes; the sign is farther from the camera
// than the wall, and their materials differ
sign.renderOrder = -1;`,
    ask: 'Which is drawn first?',
    choices: [
      'The wall, because opaque objects go front to back',
      'The sign, because renderOrder comes before distance',
      'The wall, because it was added to the scene first',
    ],
    answer: 1,
    why: 'Within the opaque list, three.js compares `renderOrder` first, then material, then distance. The sign\'s -1 is lower than the wall\'s default 0, so it draws first wherever it is. Sorting front to back only decides between objects with the same `renderOrder` and material.',
  },
  {
    code: `label.renderOrder = 999; // drawn after everything else
// from where the camera is, the label is behind a wall`,
    ask: 'Does the label show through the wall?',
    choices: [
      'No: the depth test still hides it',
      'Yes: whatever is drawn last ends up on top',
      'Only when transparent: it blends through',
    ],
    answer: 0,
    why: 'The wall was drawn earlier and wrote its depth, so the label\'s fragments behind it fail the depth test however late they come. To draw over everything, set `label.material.depthTest = false` as well, which is what the labels on these pages do.',
  },
];
