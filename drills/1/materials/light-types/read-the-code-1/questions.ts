// Read-the-code questions for the light types and falloff page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const lamp = new PointLight(0xffffff, 10);
lamp.position.set(0, 2, 0); // was (0, 1, 0), right above the product`,
    ask: 'How much light reaches the product now?',
    choices: ['Half as much as before', 'A quarter as much as before', 'Exactly as much as before'],
    answer: 1,
    why: 'Point and spot lights fade with the square of the distance, so twice as far means a quarter of the light. A directional light would give just as much.',
  },
  {
    code: `// a cabinet from CAD, in millimeters: 1800 units tall
const lamp = new PointLight(0xffffff, 30); // it lit a meters version well
lamp.position.set(0, 2400, 600);`,
    ask: 'How does the cabinet look under this lamp?',
    choices: ["Lit the same, since units don't matter", 'Blown out to white by a lamp that big', 'Almost dark, the lamp barely reaching it'],
    answer: 2,
    why: 'Point lights fade with distance squared, so a thousand times farther is a million times less light. Scale the model to meters on load: `scale.setScalar(0.001)`.',
  },
  {
    code: `// a product lit by one DirectionalLight from the upper left
scene.add(new AmbientLight(0xffffff, 4)); // "the shadow side is too dark"`,
    ask: 'What happens to the product?',
    choices: ['It looks flat, its shading washed out', 'Only its shadow side gets lighter', 'Nothing, since ambient light is subtle'],
    answer: 0,
    why: 'Ambient light adds the same amount to every surface, lit side included, so the shading washes out. Use a little, or a `HemisphereLight` or an environment.',
  },
];
