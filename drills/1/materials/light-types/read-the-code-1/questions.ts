// Read-the-code questions for the light types and falloff page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const lamp = new PointLight(0xffffff, 10);
lamp.position.set(0, 2, 0); // was (0, 1, 0), right above the product`,
    ask: 'How much light reaches the product now?',
    choices: ['Half as much as before', 'A quarter as much as before', 'Exactly as much as before'],
    answer: 1,
    why: 'Point and spot lights fade with the square of the distance (`decay` 2, the default). Twice as far away means a quarter of the light. A directional light would give exactly as much.',
  },
  {
    code: `// a cabinet exported from CAD in millimeters: it's 1800 units tall
const lamp = new PointLight(0xffffff, 30);
lamp.position.set(0, 2400, 600); // a lamp over it, in the model's units`,
    ask: 'The same lamp lit a meters version of the cabinet well. How does this one look?',
    choices: ['Lit the same, since units make no difference', 'Blown out to white by a lamp that big', 'Almost dark, the lamp barely reaching it'],
    answer: 2,
    why: 'three.js reads distances in whatever units the scene uses, and point lights fade with distance squared. 2400 units away is a thousand times farther than 2.4, so a million times less light. Scale the model to meters on load: `model.scale.setScalar(0.001)`.',
  },
  {
    code: `// a product lit by one DirectionalLight from the upper left
scene.add(new AmbientLight(0xffffff, 4)); // "the shadow side is too dark"`,
    ask: 'What happens to the product?',
    choices: ['It looks flat, its shading washed out', 'Only its shadow side gets lighter', 'Nothing, since ambient light is subtle'],
    answer: 0,
    why: "Ambient light adds the same amount to every surface, whichever way it faces, so the lit side brightens as much as the shadow side and the shape flattens out. Use a little, or a `HemisphereLight` or an environment, which vary with the direction a surface faces.",
  },
];
