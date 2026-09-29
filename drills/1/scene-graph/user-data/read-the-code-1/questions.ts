// Read-the-code questions for the userData and metadata page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const reserved = new Set(); // names of the parts a shopper reserved
reserved.add(safetyA.name);  // rack A's safety
// rack B was loaded from the same file
console.log(reserved.has(safetyB.name));`,
    ask: 'What does it log?',
    choices: [
      'false: the second load renames its parts, like safety_1 and pin_1',
      'true: both copies share the name, so both look reserved',
      'false: a Set compares the objects, not their names',
    ],
    answer: 1,
    why: "Two loads of one file have the same names throughout, so a table keyed by name can't tell rack A's safety from rack B's. Keep the data on the object instead: `safetyA.userData.reserved = true`.",
  },
  {
    code: `// a node in the .glb file:
// { "name": "Shelf Top", "extras": { "sku": "R3-SHELF", "selectable": true } }
const shelf = gltf.scene.getObjectByName('Shelf_Top');
console.log(shelf.userData);`,
    ask: 'What does it log?',
    choices: [
      "`{ sku: 'R3-SHELF', selectable: true }`",
      "`{ name: 'Shelf Top' }`",
      "`{ name: 'Shelf Top', sku: 'R3-SHELF', selectable: true }`",
    ],
    answer: 2,
    why: "GLTFLoader keeps the node's original name in `userData.name`, then copies the node's `extras` in beside it. A material's extras go to `material.userData` the same way.",
  },
  {
    code: `mesh.userData.original = mesh.material;
const copy = mesh.clone();
console.log(copy.userData.original.isMaterial);`,
    ask: 'What does it log?',
    choices: ['`true`: it\'s the same material object', '`undefined`: it became a plain description', '`true`: it\'s a new copy of the material'],
    answer: 1,
    why: "`clone()` copies `userData` by turning it into JSON text and back, so the material comes out as a plain description of it, with no `isMaterial`. Plain data survives that trip; live objects like materials don't. Keep references like this in a `Map` keyed by mesh, or restore before cloning.",
  },
];
