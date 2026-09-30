// Read-the-code questions for the environment maps and IBL page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// no lights in the scene
const env = await new HDRLoader().loadAsync('/env/studio.hdr');
env.mapping = EquirectangularReflectionMapping;
scene.background = env;
faucet.material = new MeshStandardMaterial({ metalness: 1, roughness: 0.05 });`,
    ask: 'How does the chrome faucet look?',
    choices: ['Black, with nothing to reflect or light it', 'Reflecting the studio shown behind it', 'Lit evenly, but with no reflections'],
    answer: 0,
    why: '`scene.background` only draws the picture behind the scene; it lights nothing. Reflections and IBL come from `scene.environment`, so set both to `env`.',
  },
  {
    code: `scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; // no lights
box.material = new MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.6 }); // blue paint`,
    ask: 'How does the painted box look?',
    choices: ['Black, since the scene has no lights', 'Lit only where it reflects the room', 'Softly lit from all around by the room'],
    answer: 2,
    why: "An environment lights every physically based material, not just metals: each point gets light from the whole picture around it. That's image-based lighting.",
  },
  {
    code: `scene.environment = env;
knob.material.envMapIntensity = 0.3; // dim just the knob's reflections`,
    ask: 'Does the knob get dimmer than the rest?',
    choices: ["No, since the scene's setting is used", 'Yes, to 30% of what the other parts get', 'Yes, and every other part dims too'],
    answer: 0,
    why: "With `scene.environment`, three.js uses `scene.environmentIntensity` and ignores `envMapIntensity`. To dim one part, give it its own `material.envMap = env`.",
  },
  {
    code: `import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
const env = await new RGBELoader().loadAsync('/env/studio.hdr');`,
    ask: 'What happens when this runs?',
    choices: ['It loads, with no warning at all', 'It fails, since RGBELoader is gone', 'It loads, but warns you to switch'],
    answer: 2,
    why: '`RGBELoader` is the old name for `HDRLoader`, kept for old code, so it loads and logs a warning. Switch the import to `HDRLoader`.',
  },
  {
    code: `scene.environment = env;
scene.background = env;
scene.environmentRotation.y = Math.PI / 2;`,
    ask: 'What turns?',
    choices: ['The reflections and lighting, not the background', 'The background, the reflections, and the lighting', 'Only the background behind the scene'],
    answer: 0,
    why: '`environmentRotation` turns only the light and reflections. The background has its own `scene.backgroundRotation`; set both to keep them in step.',
  },
];
