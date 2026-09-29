// Read-the-code questions for the pivots and offset groups page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// shelf was loaded from a file; its origin is at its back-left foot
shelf.rotation.y = Math.PI / 4;`,
    ask: 'What point does the shelf turn around?',
    choices: [
      'Its back-left foot, where its origin is',
      'The middle of its shape, like any object',
      'The center of the scene, the world origin',
    ],
    answer: 0,
    why: "An object always turns around its own origin, wherever that is on the shape. Shapes three.js builds have their origin in the middle, but a loaded model's origin is wherever the artist left it. To turn it around its middle, hang it from a group placed at the center of its `Box3`.",
  },
  {
    code: `hinge.position.set(2, 1, 0);
hinge.add(door);
door.position.x = 0.4; // half the door's width
hinge.rotation.y = Math.PI / 2;`,
    ask: 'What does the door do?',
    choices: [
      "Swings a quarter turn around the hinge's spot",
      'Spins a quarter turn around its own middle',
      'Swings a quarter turn around the scene center',
    ],
    answer: 0,
    why: "The door is measured from the hinge group, so turning the group swings the door around the group's origin at (2, 1, 0). The door's edge stays on the hinge and its middle travels a quarter circle. Setting `door.rotation.y` instead would spin it around its own middle.",
  },
  {
    code: `const shape = new BoxGeometry(0.8, 2, 0.05);
const doorA = new Mesh(shape, wood);
const doorB = new Mesh(shape, wood);
doorA.geometry.translate(0.4, 0, 0);`,
    ask: 'What happens to `doorB`?',
    choices: [
      'It shifts too, since both share one shape',
      'Nothing, translate only changes doorA',
      "It stays put, and doorA's position becomes 0.4",
    ],
    answer: 0,
    why: "`translate` moves the points stored in the geometry, and both meshes draw that same geometry, so both doors shift 0.4 and now turn around their left edge. Neither `position` changes. To change only one door, give it its own copy with `shape.clone()`, or use a pivot group.",
  },
];
