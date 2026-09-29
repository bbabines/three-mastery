// Read-the-code questions for the visibility, removal, layers page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `shelf.visible = false;
// the ray passes straight through the shelf
const hits = raycaster.intersectObject(shelf);
console.log(hits.length > 0);`,
    ask: 'What does it log?',
    choices: [
      "false: hidden objects are skipped",
      "false: hidden objects have no faces to hit",
      "true: raycasts don't check visible",
    ],
    answer: 2,
    why: "`visible` only decides what's drawn. A raycast tests the shelf's triangles whether it's shown or not, so it hits. Filter the hits yourself, checking the hit object and every parent above it, or take the shelf out with `removeFromParent()`.",
  },
  {
    code: `// part is a Group holding three Meshes;
// the camera is on layer 0 only
part.layers.set(1);`,
    ask: 'What does the camera draw of the part?',
    choices: [
      'All three Meshes: each is still on layer 0',
      'Nothing: the Meshes follow the Group onto layer 1',
      'Nothing: layer 1 hides it from every camera',
    ],
    answer: 0,
    why: "Layers are tested on each object by itself, and children keep their own. The Group isn't drawn anyway, and its Meshes are still on layer 0, so the camera draws them all. Use `part.traverse((object) => object.layers.set(1))` to move the whole part.",
  },
  {
    code: `helper.layers.set(1);
camera.layers.enable(1);
// the raycaster keeps its default layers
const hits = raycaster.intersectObjects(scene.children);`,
    ask: 'Is the helper drawn, and can the ray hit it?',
    choices: [
      'Drawn and hit: layers only affect cameras',
      'Drawn, and never hit: the raycaster tests only layer 0',
      'Hit, but not drawn: set() hides it from cameras',
    ],
    answer: 1,
    why: 'The camera now draws layers 0 and 1, so the helper shows. The raycaster is still on layer 0 only, and it skips any object that shares no layer with it. That\'s the usual way to keep clicks off helpers and labels.',
  },
];
