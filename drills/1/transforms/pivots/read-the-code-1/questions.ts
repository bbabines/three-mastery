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
  {
    code: `// the lid is a box 1 deep, with its origin in its middle
lid.pivot = new Vector3(0, 0, -0.5); // its back edge, measured from the lid
lid.rotation.x = -Math.PI / 3;`,
    ask: 'What does the lid do?',
    choices: [
      'Swings up around its back edge, with no group',
      'Spins around its middle, since edges need a group',
      'Slides back 0.5, then spins around its middle',
    ],
    answer: 0,
    why: "Since r183, `pivot` makes `rotation` and `scale` work around that point instead of the origin, so the lid swings up on its back edge, the same as it would hanging from a pivot group. Setting `pivot` doesn't slide the lid: with no turn it changes nothing. A group is still the way for several parts, joint chains, or older three.js.",
  },
  {
    code: `door.position.set(2, 0, 0);          // added straight to the scene
door.pivot = new Vector3(-0.5, 0, 0); // its left edge
door.rotation.y = Math.PI / 2;
door.getWorldPosition(v);`,
    ask: 'Where is `v`?',
    choices: [
      'Not at (2, 0, 0), since the origin swung around',
      "At (2, 0, 0), since that is the door's position",
      'At the hinge (1.5, 0, 0), where the pivot sits',
    ],
    answer: 0,
    why: "`getWorldPosition` gives the door's origin, its middle. With `pivot` set, the spot that stays put is `position` plus `pivot`, the hinge at (1.5, 0, 0), and the middle swings around it to (1.5, 0, −0.5). `door.position` still reads (2, 0, 0), so read where the door is with `getWorldPosition`, not `position`.",
  },
];
