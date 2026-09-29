// Read-the-code questions for the update timing lesson. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `scene.add(crate); // at x = 0
renderer.render(scene, camera);
crate.position.x = 4;
raycaster.set(new Vector3(4, 0, 10), new Vector3(0, 0, -1)); // aimed at x = 4
const hits = raycaster.intersectObject(crate);`,
    ask: 'Does the raycast hit the crate?',
    choices: [
      'No: it tests the crate where it was last drawn',
      'Yes: setting position refreshed its matrixWorld',
      'Yes: a raycast refreshes each object it tests',
    ],
    answer: 0,
    why: "A raycast reads each object's saved `matrixWorld`, which still has the crate at x = 0 from the last render, so the ray aimed at x = 4 misses. Call `crate.updateMatrixWorld()` after the move, and it hits.",
  },
  {
    code: `shelf.add(bin);
renderer.render(scene, camera);
shelf.position.x += 2;
bin.updateMatrixWorld();
const spot = new Vector3().setFromMatrixPosition(bin.matrixWorld);`,
    ask: "Does `spot` include the shelf's move?",
    choices: [
      "No: the shelf itself wasn't refreshed",
      'Yes: updateMatrixWorld refreshes its parents too',
      'No: the bin needs updateMatrix() called as well',
    ],
    answer: 0,
    why: "`updateMatrixWorld` refreshes the bin and anything under it by combining it with the shelf's saved `matrixWorld`, which is still from the last render. `bin.updateWorldMatrix(true, false)` refreshes the parents first, and `bin.getWorldPosition(spot)` does that for you.",
  },
  {
    code: `shelf.add(bin); // the shelf stands at (3, 0, 0)
renderer.render(scene, camera);
shelf.scale.set(2, 2, 2);
const bounds = new Box3().setFromObject(bin);`,
    ask: 'What does `bounds` fit around?',
    choices: ["The bin at the shelf's old size", "The bin at the shelf's new, doubled size", "The bin's bare shape, at the scene's center"],
    answer: 0,
    why: "`setFromObject` refreshes the bin and anything under it, but not the shelf above it, so it combines the bin with the shelf's old saved size. Call `shelf.updateMatrixWorld()` first, or measure `new Box3().setFromObject(shelf)`, which refreshes the shelf too.",
  },
  {
    code: `scene.add(part);
part.position.set(1, 0, 0);
renderer.render(scene, camera);
part.position.set(4, 0, 0);
const saved = part.toJSON();`,
    ask: 'Later, `new ObjectLoader().parse(saved)` loads the part back. Where is it?',
    choices: ['At x = 1', 'At x = 4', 'At x = 0'],
    answer: 0,
    why: '`toJSON` saves the part\'s `matrix` as it is, without refreshing it, and the loader rebuilds `position` from that matrix. The last render built it with x = 1, so the move to 4 is lost. Call `part.updateMatrix()` before saving.',
  },
  {
    code: `rack.position.set(3, 0, 0);
rack.matrixAutoUpdate = false; // it never moves, so skip the rebuild
scene.add(rack);
renderer.render(scene, camera);`,
    ask: 'Where is the rack drawn?',
    choices: ['At the center of the scene', 'At (3, 0, 0), its position', "Nowhere until it's refreshed"],
    answer: 0,
    why: 'With auto-update off, no render rebuilds `matrix` from `position`, so `matrix` is still the starting transform: no move, no turn, no resize. Call `rack.updateMatrix()` once after placing it.',
  },
];
