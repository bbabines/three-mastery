// Read-the-code questions for the loaders and textures tour. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// rack.glb was exported from Blender with Draco compression
const loader = new GLTFLoader();
const gltf = await loader.loadAsync('/models/rack.glb');
scene.add(gltf.scene);`,
    ask: 'What happens?',
    choices: [
      'The load fails with a "No DRACOLoader" error',
      'It loads, using a Draco decoder built into GLTFLoader',
      'It loads, but every mesh arrives without geometry',
    ],
    answer: 0,
    why: "GLTFLoader has no decoder of its own. Given a Draco-compressed file with no `setDRACOLoader`, the promise rejects with \"No DRACOLoader instance provided\", so `scene.add` never runs. Attach one first: `loader.setDRACOLoader(new DRACOLoader().setDecoderPath('/draco/'))`.",
  },
  {
    code: `const tag = new CanvasTexture(canvas);
sign.material.map = tag;
// later, when the price changes:
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillText('$99', 40, 160);`,
    ask: 'What does the sign show after the price changes?',
    choices: ['The old price, from before the redraw', 'The new price, $99, straight away', 'A blank sign, because clearRect wiped the canvas'],
    answer: 0,
    why: 'The GPU draws from its own copy of the canvas. The copy is made when the texture is first drawn, and again only when `needsUpdate` is set. The constructor set it once, so the first price showed up; after redrawing, add `tag.needsUpdate = true`.',
  },
  {
    code: `const wood = new TextureLoader().load('/textures/wood.jpg');
console.log(wood.image);`,
    ask: 'What does it log?',
    choices: ["null, since the image hasn't arrived yet", 'The image element, already loaded', 'A promise that resolves to the image'],
    answer: 0,
    why: "`load` returns the texture right away and fills in `wood.image` once the file arrives, so on the next line it's still `null`. Setting `material.map = wood` straight away is fine, since the texture updates itself when the image lands. To wait for the image, use `await loader.loadAsync(url)`.",
  },
];
