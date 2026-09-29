// Read-the-code questions for the glTF structure page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// bracket.glb: node "Bracket", whose mesh has two primitives,
// one with a steel material and one with rubber
const gltf = await loader.loadAsync('bracket.glb');
const bracket = gltf.scene.getObjectByName('Bracket');
console.log(bracket.type, bracket.children.length);`,
    ask: 'What does it log?',
    choices: ['Group 2', 'Mesh 0', 'Mesh 2'],
    answer: 0,
    why: 'A three.js Mesh holds one material, so GLTFLoader makes one Mesh per primitive. With two primitives, the node becomes a `Group` named "Bracket" holding two Meshes. With one primitive, the node would have been the Mesh itself.',
  },
  {
    code: `// the tube's glTF mesh has two primitives: painted and bare metal
const tube = model.getObjectByName('Tube');
tube.material.color.set('red');`,
    ask: 'What happens?',
    choices: [
      'It throws, because a Group has no material',
      'Both parts turn red, since the Group passes it on',
      'Only the painted part turns red, as it comes first',
    ],
    answer: 0,
    why: "`tube` is a Group, and a Group's `material` is `undefined`, so reading `.color` from it throws a TypeError. Set the color on each Mesh inside it: `for (const mesh of tube.children) mesh.material.color.set('red')`.",
  },
  {
    code: `// in Blender the object is named "Shelf Top.001"
const shelf = gltf.scene.getObjectByName('Shelf Top.001');
console.log(shelf);`,
    ask: 'What does it log?',
    choices: ['The shelf node', 'undefined', 'An error about the dot in the name'],
    answer: 1,
    why: 'GLTFLoader cleans names as it loads: whitespace becomes `_` and dots are removed, so the node is called `Shelf_Top001`. The Blender name survives in `shelf.userData.name`.',
  },
  {
    code: `// four bolt nodes in the file all point at the same glTF mesh
const a = gltf.scene.getObjectByName('Bolt');
const b = gltf.scene.getObjectByName('Bolt_1');
console.log(a.geometry === b.geometry);`,
    ask: 'What does it log, and why?',
    choices: ['true: all four share one geometry', 'false: each node gets its own copy', 'false: only the first node has one'],
    answer: 0,
    why: 'GLTFLoader builds each glTF mesh once. Every extra node that uses it gets a clone of the Mesh, and a Mesh clone shares its geometry and material. So changing that geometry or material changes all four bolts.',
  },
  {
    code: `// the primitive's POSITION accessor: type "VEC3", componentType FLOAT, count 753
const position = mesh.geometry.attributes.position;
console.log(position.itemSize, position.count, position.array.length);`,
    ask: 'What does it log?',
    choices: ['3 753 2259', '1 2259 2259', '3 2259 753'],
    answer: 0,
    why: 'An accessor becomes a BufferAttribute. `VEC3` means groups of 3, so `itemSize` is 3; the accessor\'s count is the number of vertices, so `count` is 753; and the flat array holds 753 × 3 = 2259 numbers.',
  },
];
