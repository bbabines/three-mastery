// Read-the-code questions for the shader and material cost page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const paint = new MeshPhysicalMaterial({ color: '#1e3a8a', roughness: 0.4 });
// clearcoat, sheen, and transmission left at 0`,
    ask: 'How does it compare with Standard, per pixel?',
    choices: [
      'Much higher, since Physical runs every extra',
      'Close to it, since the extras are left out',
      'Double, since Physical draws each mesh twice',
    ],
    answer: 1,
    why: "three.js builds each extra into the shader only when it's above 0, and they all start at 0. `clearcoat: 1` adds shader work, and `transmission` adds a second render of the solid objects.",
  },
  {
    code: `bottle.material = new MeshPhysicalMaterial({ transmission: 1, roughness: 0.1 });
// the scene holds 200 other meshes, all solid and all in view`,
    ask: 'About how many draw calls per frame now?',
    choices: ['About 400, the solid meshes drawn twice', '201, with one more for the bottle', '202, one more for its see-through picture'],
    answer: 0,
    why: "For glass to show what's behind it, three.js first draws every solid object into a picture, then draws the scene as usual: 200 + 200 + the bottle.",
  },
  {
    code: `// a showroom lit by 12 spotlights; 10 of them are switched off like this
for (const lamp of lamps.slice(2)) lamp.intensity = 0;`,
    ask: 'How many lights does each lit pixel work out?',
    choices: [
      'Only 2, since dark lights are skipped',
      'Only 2, once three.js rebuilds the shaders',
      'Still all 12, since they stay in the shader',
    ],
    answer: 2,
    why: 'An intensity of 0 still counts as a light, so every lit material works out all 12 at every pixel. `lamp.visible = false` takes a light out of the shaders.',
  },
];
