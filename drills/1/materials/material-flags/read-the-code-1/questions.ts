// Read-the-code questions for the pipeline-facing material flags page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `leaves.material.transparent = true;
leaves.material.side = DoubleSide; // "both sides, at no extra cost"`,
    ask: 'How does three.js draw the leaves each frame?',
    choices: ['Once, like any other mesh', 'Twice, back faces and then front', 'Once, skipping the back faces'],
    answer: 1,
    why: '`DoubleSide` shades faces the GPU would skip, and a transparent one is drawn twice so the back blends first. For cutout leaves, use `alphaTest` instead.',
  },
  {
    code: `const fence = new MeshStandardMaterial({ map: meshTexture }); // PNG, alpha 0 in the gaps
wall.material = fence;`,
    ask: 'What do the gaps in the fence look like?',
    choices: ['See-through, since the PNG has alpha', 'Missing, along with the whole fence', 'Filled in solid, with no gaps'],
    answer: 2,
    why: 'A material ignores its texture\'s alpha until you ask for it. Set `alphaTest: 0.5` for hard cutouts, or `transparent: true` for soft, blended edges.',
  },
  {
    code: `const sticker = new Mesh(labelPlane, new MeshBasicMaterial({ map: logo }));
sticker.position.copy(panelFrontCenter); // exactly on the panel's surface`,
    ask: 'How does the sticker look as the camera moves?',
    choices: ['Flickering in and out through the panel', 'Clean, since it was added after the panel', 'Hidden, since the panel is drawn first'],
    answer: 0,
    why: 'Two surfaces at the same depth fight over every pixel: z-fighting. Give the sticker `polygonOffset: true` with a negative `polygonOffsetFactor` and `polygonOffsetUnits`.',
  },
];
