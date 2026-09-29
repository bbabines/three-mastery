// Read-the-code questions for the depth buffer and early-z page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a warehouse model: 2,000 bins on racks,
// all behind the front wall from where the camera stands
scene.add(frontWall, racks);`,
    ask: 'What do the hidden bins still cost every frame?',
    choices: [
      'Nothing, since the depth test skips hidden objects',
      'Their draw calls and their vertex work, at least',
      "Only GPU memory, since hidden objects aren't drawn",
    ],
    answer: 1,
    why: 'three.js only skips objects outside the camera\'s view (frustum culling). Bins inside the view but behind a wall are still drawn: a draw call each on the CPU, and the vertex shader on all their vertices. The depth test only acts on their fragments, and those are rejected before shading only if the wall was drawn first.',
  },
  {
    code: `// two opaque meshes cover the same pixels;
// near is in front of far, and both use one material
renderer.sortObjects = true; // the default`,
    ask: 'Which is drawn first, and why?',
    choices: [
      'far: so near can be painted over it afterwards',
      "near: then far's hidden fragments are skipped",
      'near: so that it ends up on top of far',
    ],
    answer: 1,
    why: 'three.js draws solid objects front to back so the depth buffer already holds the nearer surface when the farther one comes. The GPU can then reject far\'s hidden fragments before shading them (early-z). Which one ends up on top doesn\'t depend on order at all: the depth test gets that right either way.',
  },
  {
    code: `fence.material.alphaTest = 0.5;
// 12 fence panels stand one behind another,
// and together they fill the screen`,
    ask: 'What is the risk for pixel work?',
    choices: [
      'All layers shaded: discard can stop early-z',
      'None: the depth test hides the layers behind',
      'Sorting: the panels must go back to front first',
    ],
    answer: 0,
    why: '`alphaTest` adds a `discard` to the fragment shader, and whether a fragment survives isn\'t known until the shader runs, so the GPU may not be able to reject hidden fragments early. Twelve layers across the whole screen can then mean twelve shaded fragments per pixel. Cutouts don\'t need sorting: they keep writing depth like any solid surface.',
  },
  {
    code: `scene.overrideMaterial = new MeshBasicMaterial({ colorWrite: false });
renderer.render(scene, camera);
scene.overrideMaterial = null;
renderer.autoClearDepth = false;
renderer.render(scene, camera);`,
    ask: 'What does the first render do for the second?',
    choices: [
      'It fills the depth buffer, so each pixel is shaded about once',
      'It halves the draw calls the second render makes',
      'Nothing, since the second render clears it all',
    ],
    answer: 0,
    why: 'The first render writes only depth, since `colorWrite` is off. With `autoClearDepth` off, the second render keeps that depth, so every fragment that isn\'t the nearest fails the depth test, and each pixel is shaded about once. The price is drawing everything twice: twice the draw calls and vertex work. That\'s a depth prepass.',
  },
];
