// Read-the-code questions for the shader and material cost page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const paint = new MeshPhysicalMaterial({ color: '#1e3a8a', roughness: 0.4 });
// clearcoat, sheen, and transmission left at their defaults`,
    ask: 'How does its cost per pixel compare with a MeshStandardMaterial with the same settings?',
    choices: [
      'Much higher, since Physical always runs every extra',
      'Close to it, since the extras are left out while 0',
      'Double, since Physical draws each mesh twice',
    ],
    answer: 1,
    why: "three.js compiles each extra into the shader only when it's above 0, and they all start at 0. What's left adds only a little over Standard, for its reflectivity settings. `clearcoat: 1` adds shader work; `transmission` adds a full extra render of the solid objects every frame.",
  },
  {
    code: `bottle.material = new MeshPhysicalMaterial({ transmission: 1, roughness: 0.1 });
// the scene holds 200 other meshes, all solid and all in view`,
    ask: 'About how many draw calls does each frame make now?',
    choices: [
      'About 400, since the solid meshes are drawn twice',
      '201, with one more for the bottle',
      '202, one for the bottle and one for its see-through picture',
    ],
    answer: 0,
    why: "For glass to show what's behind it, three.js first draws every solid object into a picture, then draws the scene as usual, with the glass reading that picture: 200 + 200 + the bottle. `renderer.info.render.calls` counts both, since they happen inside one `render()` call.",
  },
  {
    code: `// a showroom lit by 12 spotlights; the visitor switches 10 of them off
for (const lamp of lamps.slice(2)) lamp.intensity = 0;`,
    ask: 'How many lights does each lit pixel work out now?',
    choices: [
      'Only 2, since dark lights are skipped',
      'Only 2, once three.js rebuilds the shaders',
      'Still all 12, since they stay in the shader',
    ],
    answer: 2,
    why: 'An intensity of 0 still counts as a light: every lit material keeps working out all 12 at every pixel, each of the 10 adding nothing. `lamp.visible = false` takes a light out of the shaders; three.js then builds the lit materials\' shaders again for the new number of lights.',
  },
];
