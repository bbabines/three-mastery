// Read-the-code questions for the shadows page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a small product's shadow is blocky; the box covers the whole 40 m hall
sun.shadow.camera.left = sun.shadow.camera.bottom = -20;
sun.shadow.camera.right = sun.shadow.camera.top = 20;
sun.shadow.mapSize.set(4096, 4096); // "a bigger map will fix it"`,
    ask: 'Is a 4096 map the best fix?',
    choices: ['No, a box fitted to the product is sharper', 'Yes, a bigger map fixes any shadow', 'Yes, since the box size makes no difference'],
    answer: 0,
    why: "The map's pixels are spread across the box, so most of them land on the empty hall. Fit the box to the product first; it's free.",
  },
  {
    code: `// the DoubleSide floor had stripes with a bias of 0
sun.shadow.bias = -0.02; // the stripes are gone`,
    ask: 'What new problem shows up?',
    choices: ['The stool seems to float above its shadow', 'The stripes come back, only larger', 'Every shadow turns blocky and square'],
    answer: 0,
    why: 'Too much bias starts the shadow too far from whatever casts it: peter-panning. Nudge only until the acne goes.',
  },
  {
    code: `// sun, stool, and floor already cast and receive shadows
renderer.render(scene, camera); // the first frame
renderer.shadowMap.enabled = true;`,
    ask: "Does the floor show the stool's shadow next frame?",
    choices: ['Yes, from the very next frame on', 'Yes, once the camera moves a bit', "No, not until its material rebuilds"],
    answer: 2,
    why: "The floor's material built its shader on the first frame, without shadow code. Set `floor.material.needsUpdate = true`, or turn shadows on before the first render.",
  },
];
