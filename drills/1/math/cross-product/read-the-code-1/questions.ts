// Read-the-code questions for the cross product page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const right = new Vector3(1, 0, 0);
const up = new Vector3(0, 1, 0);
right.clone().cross(up);`,
    ask: 'Which way does the result point?',
    choices: ['Toward you (+Z)', 'Right (+X)', 'Away from you (−Z)'],
    answer: 0,
    why: 'Fingers along right, curl them toward up, and your right thumb points toward you. In three.js, right × up is +Z.',
  },
  {
    code: `up.clone().cross(right);`,
    ask: 'With the order swapped, which way does it point?',
    choices: ['Away from you (−Z)', 'Toward you (+Z)', "Nowhere, it's (0, 0, 0)"],
    answer: 0,
    why: 'Swapping the inputs flips the result. Order matters for the cross product.',
  },
  {
    code: `const edge1 = new Vector3(2, 0, 0);
const edge2 = new Vector3(0, 0, -3);
const n = new Vector3().crossVectors(edge1, edge2);`,
    ask: 'Is `n` ready to use as a normal?',
    choices: ['Not yet: it needs normalizing first', 'Yes: cross products have length 1', 'No: right-angle edges give (0, 0, 0)'],
    answer: 0,
    why: "`n` points the right way, straight up, but a cross product's length grows with its inputs, so it's rarely 1. Normals should have length 1, so call `.normalize()`.",
  },
  {
    code: `const n = new Vector3().crossVectors(edge1, edge2).normalize();
// edge1 and edge2 point the same way (a sliver triangle)`,
    ask: 'What is `n`?',
    choices: ['(0, 0, 0), with no warning', '(0, 1, 0), a default of up', 'An error about parallel edges'],
    answer: 0,
    why: 'Parallel inputs form no area, so the cross product is (0, 0, 0), and normalizing (0, 0, 0) leaves it (0, 0, 0).',
  },
];
