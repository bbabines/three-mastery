// Read-the-code questions for the hitch avoidance page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gltf = await loader.loadAsync('armchair-velvet.glb'); // loaded as the page opened
optionButton.addEventListener('click', () => scene.add(gltf.scene));`,
    ask: 'The file finished loading long before the click. What can still make the click stutter?',
    choices: [
      'Uploading its textures and compiling its shaders in that frame',
      'Nothing, since everything was ready once the load finished',
      'Downloading the file again, since add() fetches the model',
    ],
    answer: 0,
    why: "Loading ends at decode. three.js uploads the geometry and textures and compiles the shaders in the first frame that draws the model, which is the frame right after the click. Warm it up after loading instead: `renderer.compileAsync(gltf.scene, camera, scene)`, and `renderer.initTexture` for its textures.",
  },
  {
    code: `const queue = [...newShelves]; // 400 shelves for the next aisle
renderer.setAnimationLoop(() => {
  for (let i = 0; i < 20 && queue.length > 0; i++) scene.add(queue.shift());
  renderer.render(scene, camera);
});`,
    ask: 'What does this do, compared with adding all 400 at once?',
    choices: [
      'Cuts the total work to a twentieth, 20 at a time',
      'Spreads the work over 20 frames of 20 shelves',
      'Nothing, since three.js batches adds into one frame',
    ],
    answer: 1,
    why: "The total work doesn't change: every shelf still costs its draw call, and anything drawn for the first time still uploads and compiles. But each frame takes on a twentieth of it, so no single frame has to swallow it all.",
  },
  {
    code: `await renderer.compileAsync(showroom, camera, scene);
scene.add(new SpotLight('white', 50)); // a spotlight, added afterwards
scene.add(showroom);`,
    ask: 'What happens in the first frame that draws the showroom?',
    choices: [
      'Nothing new, since compileAsync already built every shader',
      'The spotlight is ignored until the next warm-up',
      'Its lit materials compile again, for the new light',
    ],
    answer: 2,
    why: "A lit material's shader is built for the lights the scene has at that moment. Adding the spotlight changes that, so every lit material needs a new program on its next draw, and the hitch is back. Set up the lights and the environment first, then warm up (the decode, upload, compile page).",
  },
];
