// Read-the-code questions for the depth buffer and early-z page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a warehouse model: 2,000 bins on racks,
// all behind the front wall from where the camera stands
scene.add(frontWall, racks);`,
    ask: 'What do the hidden bins still cost every frame?',
    choices: [
      'Nothing, since the depth test skips them',
      'Their draw calls and their vertex work',
      'Only GPU memory, since they are not drawn',
    ],
    answer: 1,
    why: "three.js only skips objects outside the camera's view. Bins behind a wall are still drawn, a draw call each and all their vertices; only their fragments can be skipped.",
  },
  {
    code: `// two opaque meshes cover the same pixels;
// near is in front of far, and both use one material
renderer.sortObjects = true; // the default`,
    ask: 'Which is drawn first, and why?',
    choices: [
      'far, so near can be painted over it',
      "near, so far's hidden fragments are skipped",
      'near, so that it ends up on top',
    ],
    answer: 1,
    why: "With the nearer surface drawn first, the GPU can reject far's hidden fragments before shading them. Which one ends up on top doesn't depend on order; the depth test handles that.",
  },
  {
    code: `fence.material.alphaTest = 0.5;
// 12 fence panels stand one behind another,
// and together they fill the screen`,
    ask: 'What is the risk for pixel work?',
    choices: [
      'Every layer shaded, as discard can stop early-z',
      'None, as the depth test hides the layers behind',
      'Sorting, as cutouts must go back to front',
    ],
    answer: 0,
    why: "With `discard`, the GPU can't know a fragment survives until the shader runs, so it may shade all twelve layers. Cutouts keep writing depth, so they need no sorting.",
  },
  {
    code: `scene.overrideMaterial = new MeshBasicMaterial({ colorWrite: false });
renderer.render(scene, camera);
scene.overrideMaterial = null;
renderer.autoClearDepth = false;
renderer.render(scene, camera);`,
    ask: 'What does the first render do for the second?',
    choices: [
      'Its depth lets each pixel be shaded about once',
      "It halves the second render's draw calls",
      'Nothing, since the second render clears it',
    ],
    answer: 0,
    why: 'The first render writes only depth, and the second keeps it, so every fragment that isn\'t the nearest fails the depth test. The price is drawing everything twice.',
  },
];
