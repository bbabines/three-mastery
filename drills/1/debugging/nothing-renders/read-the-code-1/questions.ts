// Read-the-code questions for the nothing-renders checklist page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const gltf = await loader.loadAsync('shelf.glb');
scene.add(gltf.scene);
console.log(new Box3().setFromObject(gltf.scene).getSize(new Vector3()));
// (1800, 2000, 400), and camera.far is 100`,
    ask: "The promise resolved, but none of the shelf is on screen. What's wrong?",
    choices: [
      'Loading: its textures are still on their way',
      "Units: it's in millimeters, far bigger than the view",
      'Culling: a new model is skipped for its first frame',
    ],
    answer: 1,
    why: "A resolved promise means the file arrived and became objects, not that they're visible. A shelf 1800 units wide is in millimeters: the camera most likely sits inside it, and most of it is past `far`. Scale it by 0.001, or frame it with the fit to bounds page. Missing textures would still leave the shape on screen.",
  },
  {
    code: `const slope = rise / run; // both are 0 for this part
const positions = new Float32Array([0, 0, 0, 1, 0, 0, 1, slope, 0]);
geometry.setAttribute('position', new BufferAttribute(positions, 3));
scene.add(new Mesh(geometry, material));`,
    ask: 'What does the console show on the first render?',
    choices: [
      "An error saying the bounding sphere's radius is NaN",
      'Nothing, since a NaN in a geometry is never reported',
      'An exception that stops the render loop',
    ],
    answer: 0,
    why: "`0 / 0` is NaN, so one corner is NaN. To cull the mesh, the renderer computes its bounding sphere, and three.js logs `THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN` with `console.error`. Nothing throws, and a NaN in a transform instead of the vertex data gets no message at all.",
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
    why: "A composer's passes only work on what an earlier pass drew. With no `RenderPass(scene, camera)` first, the bloom and the output pass process an empty picture. Add the `RenderPass` at the front; `OutputPass` stays last.",
  },
];
