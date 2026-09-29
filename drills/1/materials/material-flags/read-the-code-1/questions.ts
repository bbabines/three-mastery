// Read-the-code questions for the pipeline-facing material flags page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `leaves.material.transparent = true;
leaves.material.side = DoubleSide; // "so both sides show, at no extra cost"`,
    ask: 'How does three.js draw the leaves each frame?',
    choices: ['Once, the same as any other mesh in the scene', 'Twice, back faces and then front faces', 'Once, skipping the back faces entirely'],
    answer: 1,
    why: "DoubleSide isn't free: it turns off back-face culling, so the GPU shades faces it would have skipped, and three.js draws a transparent DoubleSide material in two passes so the back is blended before the front. `forceSinglePass: true` makes it one. For cutout leaves, `alphaTest` avoids transparency altogether.",
  },
  {
    code: `const fence = new MeshStandardMaterial({ map: meshTexture }); // PNG, alpha 0 in the gaps
wall.material = fence;`,
    ask: 'What do the gaps in the fence look like?',
    choices: ['See-through, since the PNG has alpha', 'Missing, along with the rest of the fence', 'Filled in solid, showing no gaps'],
    answer: 2,
    why: "A material ignores its texture's alpha until you ask for it. Set `alphaTest: 0.5` for hard-edged cutouts that stay opaque, or `transparent: true` for blended, soft edges.",
  },
  {
    code: `const sticker = new Mesh(labelPlane, new MeshBasicMaterial({ map: logo }));
sticker.position.copy(panelFrontCenter); // exactly on the panel's surface
scene.add(sticker);`,
    ask: 'What does the sticker look like as the camera moves?',
    choices: ['Flickering in and out through the panel', 'Clean, since it was added after the panel', 'Hidden, since the panel is drawn first'],
    answer: 0,
    why: "Two surfaces at the same depth fight over every pixel, and the winner flips as the view changes: z-fighting. Give the sticker `polygonOffset: true` with a negative `polygonOffsetFactor` and `polygonOffsetUnits`, which pulls its depth toward the camera.",
  },
];
