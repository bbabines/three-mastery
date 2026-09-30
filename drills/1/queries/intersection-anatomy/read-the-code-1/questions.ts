// Read-the-code questions for the intersection anatomy page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const hits = raycaster.intersectObjects([farCrate, nearCrate]);
console.log(hits[0].object === nearCrate); // the ray passes through both`,
    ask: 'What does it log?',
    choices: [
      '`false`, since hits follow the order of the list',
      '`false`, since the last object tested comes first',
      '`true`, since hits come back nearest first',
    ],
    answer: 2,
    why: 'Hits are sorted by `distance` before they come back, whatever order the list was in, so `hits[0]` is always the nearest.',
  },
  {
    code: `lid.visible = false;
const hits = raycaster.intersectObjects([lid, box]); // the ray passes the lid, then the box
console.log(hits[0].object);`,
    ask: 'What does it log?',
    choices: ["`lid`, even though it's hidden", '`box`, the first thing you can see', '`undefined`, since nothing is hit'],
    answer: 0,
    why: 'Raycasting tests triangles and ignores `visible`, so the nearer lid is `hits[0]`. Leave hidden things out of the target list.',
  },
  {
    code: `crate.rotation.y = Math.PI / 2; // turned a quarter turn
crate.updateMatrixWorld();
const hit = raycaster.intersectObject(crate)[0]; // hits the side facing +Z
console.log(hit.face.normal);`,
    ask: 'What does it log?',
    choices: ['(0, 0, −1)', '(−1, 0, 0)', '(0, 0, 1)'],
    answer: 1,
    why: "`face.normal` is measured from the crate itself, and the side facing +Z is the crate's own −X side. Turn it into the world with the normal matrix to get (0, 0, 1).",
  },
  {
    code: `// the click lands near the top of the poster
const hit = raycaster.intersectObject(poster)[0];
ctx.fillRect(hit.uv.x * canvas.width, hit.uv.y * canvas.height, 8, 8);
texture.needsUpdate = true;`,
    ask: 'Where does the dot appear?',
    choices: ['Near the top, right where the click was', 'Near the left, turned on its side', 'Near the bottom, mirrored top to bottom'],
    answer: 2,
    why: '`hit.uv.y` runs up the texture, but a canvas measures y down from its top, so a click near the top paints near the bottom. Use `(1 - hit.uv.y) * canvas.height`.',
  },
  {
    code: `// shelves: an InstancedMesh drawing 40 shelves
const hit = raycaster.intersectObject(shelves)[0];
shelves.setColorAt(hit.instanceId, new Color('yellow'));
shelves.instanceColor.needsUpdate = true;`,
    ask: 'What turns yellow?',
    choices: ['Only the one shelf the ray hit, by its id', 'All 40, since they share a material', 'Nothing, since copies share one color'],
    answer: 0,
    why: '`hit.object` is the whole `InstancedMesh`, and `hit.instanceId` says which copy the ray hit. `setColorAt` colors just that one.',
  },
];
