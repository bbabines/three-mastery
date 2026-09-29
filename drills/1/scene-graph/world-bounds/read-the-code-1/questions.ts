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
    why: "A geometry's box is measured from the Mesh itself, before anything above it moves, turns, or resizes it. 2.3 ÷ 0.038 is about 60. For the size in the world, measure the object: `new Box3().setFromObject(tube)`.",
  },
  {
    code: `// the model sits straight in the scene
const box = new Box3().setFromObject(model);
model.position.y -= box.min.y;`,
    ask: 'Where does the model end up?',
    choices: ['With its origin at y = 0', 'Lifted up by the full height of the model', 'With its lowest point at y = 0'],
    answer: 2,
    why: "`box.min.y` is the model's lowest point in the world. Moving the model down by that much puts the lowest point on y = 0, wherever its origin is. It works because the model's parent is the scene, so `position` and the box measure from the same place.",
  },
  {
    code: `pullUpBar.visible = false; // the widest part of the rack
const box = new Box3().setFromObject(rack);`,
    ask: 'How wide is `box`, compared with before the bar was hidden?',
    choices: [
      'Narrower: hidden parts are left out',
      'Narrower later: once the next render has run',
      'Just as wide: hidden parts are measured too',
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
      '`loose` is as big as `tight` or bigger, never smaller',
      '`tight` is bigger, because it counts every vertex',
      'They match; `true` only makes it faster to compute',
    ],
    answer: 0,
    why: "The default boxes each Mesh's own box, turned into the world, so it always holds the whole shape, often with room to spare once things are turned. `true` boxes every vertex: a tight fit that costs CPU time for every vertex in the model.",
  },
  {
    code: `// the rack stands on a cart
cart.position.x += 2;
const box = new Box3().setFromObject(rack);`,
    ask: 'Where is `box`?',
    choices: [
      "Around the rack's new spot, 2 units over",
      'Around the rack where it was before the cart moved',
      'Nowhere yet, since the box stays empty until the next render',
    ],
    answer: 1,
    why: '`setFromObject` refreshes the rack and everything under it, but not the cart above it, so it combines the rack with the cart\'s old saved transform. Measure the cart, or call `cart.updateMatrixWorld()` first.',
  },
];
