// Read-the-code questions for the clone semantics page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const copy = rack.clone();
const knob = copy.getObjectByName('knob'); // a Mesh
knob.material.color.set('orange');`,
    ask: 'Which knobs turn orange?',
    choices: [
      "Only the copy's: clone makes new objects",
      "Both: the copy shares the original's material",
      "Neither: the copy isn't in the scene yet",
    ],
    answer: 1,
    why: "The copy's knob is a new Mesh, but it points at the same material as the original's, so recoloring it recolors both. Give the copy its own first: `knob.material = knob.material.clone()`.",
  },
  {
    code: `const copy = bolt.clone(); // bolt is a Mesh
copy.geometry.scale(1, 2, 1);`,
    ask: 'What happens to the original bolt?',
    choices: [
      'It stretches too: the geometry is shared',
      "Nothing: the copy's geometry is its own",
      'Nothing: geometry.scale only changes copy.scale',
    ],
    answer: 0,
    why: "`geometry.scale` moves the vertices of the one geometry both bolts use. `copy.scale.y = 2` would stretch only the copy, since `scale` is the copy's own. To reshape just the copy, give it its own geometry first: `copy.geometry = copy.geometry.clone()`.",
  },
  {
    code: `const colors = ['red', 'green', 'blue'];
const copies = colors.map((color) => {
  const copy = bolt.clone();
  copy.material.color.set(color);
  return copy;
});`,
    ask: 'What color do the bolts end up?',
    choices: ['Red, green, and blue, one each', 'All blue, and the original too', 'All red, since the first color sticks'],
    answer: 1,
    why: 'All three copies and the original share one material, so each `set` overwrites the last, and blue is the last. Clone the material inside the loop, `copy.material = copy.material.clone()`, before setting its color.',
  },
  {
    code: `// the rack's metal material has a texture map
copy.traverse((object) => {
  if (object.isMesh) object.material = object.material.clone();
});`,
    ask: "How many copies of the metal texture's image does the GPU hold?",
    choices: [
      'Two: material.clone() copies its textures',
      'One: the cloned materials still share the texture',
      'None: the copy has not been drawn yet',
    ],
    answer: 1,
    why: "`material.clone()` copies the material's settings, and its `map` still points at the same Texture, so the image is on the GPU once. That's what makes per-copy colors cheap. Cloning a texture is a separate step, and rarely needed.",
  },
  {
    code: `const copy = rack.clone();
copy.position.x = 3;
// nothing else happens to copy`,
    ask: 'What changes on screen?',
    choices: [
      'A second rack appears at x = 3, beside the first one',
      'The original rack moves over to x = 3',
      'Nothing new, since the copy has no parent yet',
    ],
    answer: 2,
    why: "`clone()` returns a copy with no parent, so it isn't in the scene and isn't drawn until you `scene.add(copy)`. Its position is its own, so the original doesn't move.",
  },
];
