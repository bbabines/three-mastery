// Read-the-code questions for the nothing-renders checklist page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gltf = await loader.loadAsync('shelf.glb'); // resolves, but nothing shows
scene.add(gltf.scene);
console.log(new Box3().setFromObject(gltf.scene).getSize(new Vector3()));
// (1800, 2000, 400), and camera.far is 100`,
    ask: "What's wrong?",
    choices: [
      'Loading: its textures are still on their way',
      "Units: it's in millimeters, far too big",
      'Culling: a new model skips its first frame',
    ],
    answer: 1,
    why: 'A resolved promise means the file arrived, not that it shows. 1800 units wide is millimeters: the camera sits inside it and most is past `far`. Scale it by 0.001.',
  },
  {
    code: `const slope = rise / run; // both are 0 for this part
const positions = new Float32Array([0, 0, 0, 1, 0, 0, 1, slope, 0]);
geometry.setAttribute('position', new BufferAttribute(positions, 3));
scene.add(new Mesh(geometry, material));`,
    ask: 'What does the console show on the first render?',
    choices: [
      "An error that the bounding sphere's radius is NaN",
      'Nothing, since NaN in a geometry is never reported',
      'An exception that stops the render loop',
    ],
    answer: 0,
    why: "`0 / 0` makes one corner NaN. Culling needs the bounding sphere, so three.js logs `Computed radius is NaN` with `console.error`, and nothing throws.",
  },
  {
    code: `const composer = new EffectComposer(renderer);
composer.addPass(new UnrealBloomPass(size, 1, 0.4, 0.85));
composer.addPass(new OutputPass());
// every frame: composer.render();`,
    ask: 'Why is the canvas black?',
    choices: [
      'The bloom is strong enough to wash it out',
      'OutputPass has to come before the bloom',
      'Nothing draws the scene into the composer',
    ],
    answer: 2,
    why: "A composer's passes only work on what an earlier pass drew. Add `RenderPass(scene, camera)` at the front; `OutputPass` stays last.",
  },
];
