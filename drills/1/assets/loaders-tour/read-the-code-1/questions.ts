// Read-the-code questions for the loaders and textures tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// rack.glb was exported with Draco compression
const loader = new GLTFLoader();
const gltf = await loader.loadAsync('/models/rack.glb');
scene.add(gltf.scene);`,
    ask: 'What happens?',
    choices: [
      'It loads, using a Draco decoder built in',
      'The load fails with "No DRACOLoader"',
      'It loads, but the meshes have no geometry',
    ],
    answer: 1,
    why: 'GLTFLoader has no decoders of its own, so the promise rejects and `scene.add` never runs. Attach one first with `loader.setDRACOLoader(draco)`.',
  },
  {
    code: `const tag = new CanvasTexture(canvas);
sign.material.map = tag;
// later, when the price changes:
ctx.fillText('$99', 40, 160);`,
    ask: 'What does the sign show after the redraw?',
    choices: ['A blank sign until the next frame', 'The new price, $99, straight away', 'The old price, from before the redraw'],
    answer: 2,
    why: 'The GPU draws from its own copy, made on the first draw and again only when `needsUpdate` is set. Add `tag.needsUpdate = true` after each redraw.',
  },
  {
    code: `const wood = new TextureLoader().load('/textures/wood.jpg');
console.log(wood.image);`,
    ask: 'What does it log?',
    choices: ["null, since the image hasn't arrived", 'The image element, already loaded', 'A promise that resolves to the image'],
    answer: 0,
    why: '`load` returns the texture at once and fills in `image` when the file arrives. The texture still works on a material; use `loadAsync` to wait for it.',
  },
];
