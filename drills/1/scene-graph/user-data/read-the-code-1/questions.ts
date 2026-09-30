// Read-the-code questions for the userData and metadata page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const reserved = new Set(); // names of the parts a shopper reserved
reserved.add(safetyA.name);  // rack A's safety
// rack B was loaded from the same file
const looksReserved = reserved.has(safetyB.name);`,
    ask: 'What is `looksReserved`?',
    choices: [
      'false: the second load renamed its parts',
      'true: both copies share the name',
      'false: a Set compares objects, not names',
    ],
    answer: 1,
    why: "Two loads of one file have the same names throughout, so a table keyed by name can't tell the safeties apart. Keep the data on the object: `safetyA.userData.reserved = true`.",
  },
  {
    code: `// a node in the .glb file:
// { "name": "Shelf Top", "extras": { "sku": "R3" } }
const shelf = gltf.scene.getObjectByName('Shelf_Top');`,
    ask: 'What does `shelf.userData` hold?',
    choices: ["`{ sku: 'R3' }`", "`{ name: 'Shelf Top', sku: 'R3' }`", "`{ name: 'Shelf_Top', extras: { sku: 'R3' } }`"],
    answer: 1,
    why: "GLTFLoader keeps the node's original name in `userData.name`, then copies its `extras` in beside it. A material's extras go to `material.userData` the same way.",
  },
  {
    code: `mesh.userData.original = mesh.material;
const copy = mesh.clone();`,
    ask: 'What does `copy.userData.original` hold?',
    choices: ['The same material object as the mesh', 'A plain description of the material', 'A new material, cloned from the first'],
    answer: 1,
    why: '`clone()` copies `userData` through JSON text, so the material comes out as a plain description, with no `isMaterial`. Keep live objects like this in a `Map` keyed by mesh.',
  },
];
