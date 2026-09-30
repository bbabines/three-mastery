// Read-the-code questions for the groups and multi-material page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const box = new BoxGeometry(1, 1, 1); // comes with 6 groups
const crate = new Mesh(box, sideMaterials); // an array of 6 materials
scene.add(crate);`,
    ask: 'How many draw calls does the crate take?',
    choices: ['1', '7', '6'],
    answer: 2,
    why: "With a material array, every group is drawn on its own, so the six sides are six draw calls. It's still one mesh; with a single material it would be one draw call.",
  },
  {
    code: `const crate = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial());
const hit = raycaster.intersectObject(crate)[0]; // the ray hits the top side
console.log(hit.face.materialIndex);`,
    ask: 'What does it log?',
    choices: ['2', '0', '`undefined`'],
    answer: 1,
    why: "`face.materialIndex` is only filled in when the mesh has a material array. With one material, three.js ignores the groups, so it's always 0.",
  },
  {
    code: `const geometry = mergeGeometries([bodyGeometry, trimGeometry]);
const car = new Mesh(geometry, [paint, chrome]);`,
    ask: 'What does the car look like?',
    choices: [
      'Body in paint, trim in chrome',
      'All of it in paint, the first material',
      'Nothing is drawn at all',
    ],
    answer: 2,
    why: '`mergeGeometries` makes no groups unless its second argument is `true`, and a mesh with a material array draws only its groups. Pass `true` to get one group per input.',
  },
];
