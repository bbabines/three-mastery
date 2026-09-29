// Read-the-code questions for the shadows page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the shadow of a small product is blocky; the shadow camera covers the whole 40 m hall
sun.shadow.camera.left = sun.shadow.camera.bottom = -20;
sun.shadow.camera.right = sun.shadow.camera.top = 20;
sun.shadow.mapSize.set(4096, 4096); // "a bigger map will fix it"`,
    ask: 'Is raising the map to 4096 the best fix?',
    choices: ['No, a box fitted to the product is sharper for free', 'Yes, a bigger map is the fix for any shadow', 'Yes, since the box size makes no difference'],
    answer: 0,
    why: "The map's pixels are spread across the shadow camera's box. Shrinking the box to fit the product puts the map's pixels where they're needed, at no cost; 4096 costs 64 times the memory of the default 512 and still spends most of it on the empty hall. A bigger map doesn't cure acne or peter-panning either.",
  },
  {
    code: `// the shadow camera reaches from near 0.5 to far 10
sun.shadow.bias = -0.02; // was 0, and the DoubleSide floor had stripes`,
    ask: 'The stripes are gone. What new problem shows up?',
    choices: ['The stool looks like it floats above its shadow', 'The stripes come back at a larger size', 'Every shadow turns blocky, with big square pixels'],
    answer: 0,
    why: "Bias nudges the depth comparison so a surface stops shadowing itself (the stripes were shadow acne). Too much, and the shadow starts too far from whatever casts it: peter-panning. Nudge only until the acne goes.",
  },
  {
    code: `// sun.castShadow, stool.castShadow, and floor.receiveShadow are already true
renderer.render(scene, camera); // the first frame, with shadowMap.enabled still false
renderer.shadowMap.enabled = true;`,
    ask: 'On the next frames, does the floor show the stool\'s shadow?',
    choices: ['Yes, as soon as the next frame draws', 'Yes, but only once the camera has moved a bit', "No, not until the floor's material is rebuilt"],
    answer: 2,
    why: "The floor's material built its shader on the first frame, without shadow code, and turning `shadowMap.enabled` on later doesn't make three.js rebuild it. Set `floor.material.needsUpdate = true`, or turn shadows on before the first render.",
  },
];
