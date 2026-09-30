// Read-the-code questions for the world-space bounds page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// tube: a Mesh inside a part the file scales to 0.038;
// in the scene it stands 2.3 units tall
tube.geometry.computeBoundingBox();
const height = tube.geometry.boundingBox.getSize(new Vector3()).y;`,
    ask: 'About what is `height`?',
    choices: [
      'About 2.3: the box is measured in the world',
      'About 60: the box ignores the scale above it',
      'About 0.09: the scale gets applied twice',
    ],
    answer: 1,
    why: "A geometry's box is measured from the Mesh itself, before the 0.038 scale above it. For the size in the world, measure the object: `new Box3().setFromObject(tube)`.",
  },
  {
    code: `// the model sits straight in the scene
const box = new Box3().setFromObject(model);
model.position.y -= box.min.y;`,
    ask: 'Where does the model end up?',
    choices: ['With its origin at y = 0', 'Lifted up by the full height of the model', 'With its lowest point at y = 0'],
    answer: 2,
    why: "`box.min.y` is the model's lowest point in the world, so moving down by that much puts the lowest point on y = 0, wherever the model's origin is.",
  },
  {
    code: `pullUpBar.visible = false; // the widest part of the rack
const box = new Box3().setFromObject(rack);`,
    ask: 'How does hiding the bar change `box`?',
    choices: [
      'Narrower: hidden parts are left out',
      'Narrower later: once the next render has run',
      'Not at all: hidden parts are measured as well',
    ],
    answer: 2,
    why: "`setFromObject` never checks `visible`, so the hidden bar still counts. To measure only what's shown, build the box from the visible Meshes with `traverseVisible` and `expandByObject`.",
  },
  {
    code: `jcup.rotation.x = Math.PI / 4;
const loose = new Box3().setFromObject(jcup);
const tight = new Box3().setFromObject(jcup, true);`,
    ask: 'How do the two boxes compare?',
    choices: [
      '`loose` is as big as `tight`, or bigger',
      '`tight` is bigger, since it counts every vertex',
      'They match, and `true` only makes it faster',
    ],
    answer: 0,
    why: "The default boxes each Mesh's own box turned into the world, so it holds the whole shape, often with room to spare. `true` boxes every vertex: tight, but CPU time for every vertex.",
  },
  {
    code: `// the rack stands on a cart
cart.position.x += 2;
const box = new Box3().setFromObject(rack);`,
    ask: 'Where is `box`?',
    choices: ["Around the rack's new spot, 2 units over", "Around the rack's old spot", 'Empty until the next render runs'],
    answer: 1,
    why: "`setFromObject` refreshes the rack and everything under it, but not the cart above it, so it uses the cart's old transform. Call `cart.updateMatrixWorld()` first.",
  },
];
