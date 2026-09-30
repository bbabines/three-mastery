// Read-the-code questions for the glTF structure page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// node "Bracket": its mesh has two primitives, steel and rubber
const bracket = gltf.scene.getObjectByName('Bracket');
console.log(bracket.type, bracket.children.length);`,
    ask: 'What does it log?',
    choices: ['Mesh 0', 'Group 2', 'Mesh 2'],
    answer: 1,
    why: 'A three.js Mesh holds one material, so GLTFLoader makes one Mesh per primitive. With two primitives, the node becomes a Group holding two Meshes.',
  },
  {
    code: `// the tube's glTF mesh has two primitives: painted and bare metal
const tube = model.getObjectByName('Tube');
tube.material.color.set('red');`,
    ask: 'What happens?',
    choices: [
      'Both parts turn red, as the Group passes it on',
      'It throws, since a Group has no material',
      'Only the painted part turns red, as it comes first',
    ],
    answer: 1,
    why: "`tube` is a Group, whose `material` is `undefined`, so reading `.color` throws a TypeError. Set the color on each Mesh in `tube.children`.",
  },
  {
    code: `// in Blender the object is named "Shelf Top.001"
const shelf = gltf.scene.getObjectByName('Shelf Top.001');
console.log(shelf);`,
    ask: 'What does it log?',
    choices: ['The shelf node', 'An error about the dot', 'undefined'],
    answer: 2,
    why: 'GLTFLoader turns the space into `_` and drops the dot, so the node is `Shelf_Top001`. Search for that; the Blender name is in `userData.name`.',
  },
  {
    code: `// four bolt nodes in the file all use the same glTF mesh
const a = gltf.scene.getObjectByName('Bolt');
const b = gltf.scene.getObjectByName('Bolt_1');
console.log(a.geometry === b.geometry);`,
    ask: 'What does it log?',
    choices: ['false, since each node gets its own copy', 'false, since only the first node has one', 'true, since all four share one geometry'],
    answer: 2,
    why: 'GLTFLoader builds each glTF mesh once and clones the Mesh for the other nodes, and a clone shares its geometry. Changing it changes all four bolts.',
  },
  {
    code: `// the POSITION accessor: type "VEC3", count 753
const position = mesh.geometry.attributes.position;
console.log(position.itemSize, position.count, position.array.length);`,
    ask: 'What does it log?',
    choices: ['3 753 2259', '1 2259 2259', '3 2259 753'],
    answer: 0,
    why: '`VEC3` means groups of 3, so `itemSize` is 3. `count` is the number of vertices, and the flat array holds three numbers for each.',
  },
];
