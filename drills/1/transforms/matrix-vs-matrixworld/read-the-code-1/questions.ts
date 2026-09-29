// Read-the-code questions for the matrix vs matrixWorld lesson. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `table.add(lamp);
lamp.position.set(0, 1, 0);
table.position.set(3, 0, 0);
renderer.render(scene, camera);`,
    ask: 'What move does `lamp.matrix` hold now?',
    choices: ['1 up, measured from the table', "3 right and 1 up, from the scene's center", "3 right, the same move as the table's"],
    answer: 0,
    why: "`matrix` is built from the lamp's own `position`, `rotation`, and `scale`, so all it holds is 1 up from its parent. The table's move lives in `table.matrix`. The two are combined in `lamp.matrixWorld`, which puts the lamp at (3, 1, 0) in the world.",
  },
  {
    code: `scene.add(drone);
drone.position.set(0, 5, 0);
renderer.render(scene, camera);
drone.position.set(0, 9, 0);
const height = new Vector3().setFromMatrixPosition(drone.matrixWorld).y;`,
    ask: '`setFromMatrixPosition` reads the spot out of a saved transform. What is `height`?',
    choices: ['5', '9', '0'],
    answer: 0,
    why: '`matrixWorld` is a saved copy that three.js refreshes when it renders. The last render saw the drone at height 5, and setting `position` afterward changes only `position`. `drone.getWorldPosition(v).y` gives 9; the update timing page covers which methods you can trust right after a move.',
  },
  {
    code: `cart.add(crate); // the crate sits at the cart's center
cart.position.set(20, 0, 0);
renderer.render(scene, camera);
crate.geometry.computeBoundingBox();
const box = crate.geometry.boundingBox.clone().applyMatrix4(crate.matrix);`,
    ask: 'Where does `box` end up?',
    choices: [
      "At the scene's center, 20 units from the crate",
      'Around the crate, right where it sits in the world',
      'Around the whole cart, with the crate inside it',
    ],
    answer: 0,
    why: "`crate.matrix` holds only the crate's own move from the cart, which is none, so the box stays around the crate's shape at the scene's center. `applyMatrix4(crate.matrixWorld)` includes the cart and puts the box around the crate. `new Box3().setFromObject(crate)` does that for you.",
  },
  {
    code: `rack.add(bin);
rack.position.set(10, 0, 0);
bin.position.set(0, 2, 0);
renderer.render(scene, camera);
layout.push({ id: bin.name, transform: bin.matrix.clone() });`,
    ask: '`layout` goes to a warehouse system that has no racks, only one world. Where will that system place the bin?',
    choices: [
      'At (0, 2, 0), 10 units from where it really is',
      'At (10, 2, 0), exactly where it sits in the scene',
      'At (10, 0, 0), in the middle of the rack',
    ],
    answer: 0,
    why: "`bin.matrix` is measured from the rack, and the list leaves the rack out. For a flat list, save `bin.matrixWorld`, which has the rack combined in. A glTF file keeps the tree, so saving each object's `matrix` works there.",
  },
  {
    code: `shelfA.add(bin);
bin.position.set(0, 1, 0);
renderer.render(scene, camera);
shelfB.add(bin);
renderer.render(scene, camera);`,
    ask: 'The two shelves stand in different places. After the second render, what has changed?',
    choices: [
      "`bin.matrixWorld` changed, but `bin.matrix` didn't",
      "`bin.matrix` changed, but `bin.matrixWorld` didn't",
      'Neither, since the bin itself was never moved',
    ],
    answer: 0,
    why: "`add` keeps the bin's `position`, so `matrix` still holds 1 up, now measured from shelf B. `matrixWorld` combines in shelf B instead of shelf A, so the bin jumped to the same spot on shelf B. `shelfB.attach(bin)` would have kept it in place; the add vs attach page covers it.",
  },
];
