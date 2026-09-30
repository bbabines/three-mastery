// Read-the-code questions for the hitch avoidance page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gltf = await loader.loadAsync('armchair-velvet.glb'); // loaded as the page opened
optionButton.addEventListener('click', () => scene.add(gltf.scene));`,
    ask: 'What can still make the click stutter?',
    choices: [
      'Uploads and shader compiles in that frame',
      'Nothing, since the load already finished',
      'Downloading the file again on add()',
    ],
    answer: 0,
    why: 'Loading ends at decode. three.js uploads and compiles in the first frame that draws the model, right after the click. Warm up after loading with `compileAsync` and `initTexture`.',
  },
  {
    code: `const queue = [...newShelves]; // 400 shelves for the next aisle
renderer.setAnimationLoop(() => {
  for (let i = 0; i < 20 && queue.length > 0; i++) scene.add(queue.shift());
  renderer.render(scene, camera);
});`,
    ask: 'What does this change, compared with all at once?',
    choices: [
      'It cuts the total work to a twentieth',
      'It spreads the same work over 20 frames',
      'Nothing, since three.js batches adds',
    ],
    answer: 1,
    why: "Every shelf still costs its draw call, and anything new still uploads and compiles, so the total doesn't change. But each frame takes a twentieth of it, so no frame swallows it all.",
  },
  {
    code: `await renderer.compileAsync(showroom, camera, scene);
scene.add(new SpotLight('white', 50)); // a spotlight, added afterwards
scene.add(showroom);`,
    ask: 'What happens in the first frame that draws it?',
    choices: [
      'Nothing new, since compileAsync built every shader',
      'The spotlight is ignored until the next warm-up',
      'Its lit materials compile again, for the new light',
    ],
    answer: 2,
    why: "A lit material's shader is built for the scene's lights at that moment. Adding a spotlight changes them, so every lit material compiles again. Set up the lights first, then warm up.",
  },
];
