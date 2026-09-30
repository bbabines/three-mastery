// Read-the-code questions for the baked lighting page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the floor's lightmap was baked with the sofa by the window
floor.material.lightMap = bakedLight;
sofa.position.x += 2; // the shopper drags the sofa away`,
    ask: "What happens to the sofa's shadow?",
    choices: ['It moves with the sofa to its new spot', 'It fades out slowly, since the sofa moved', 'It stays on the floor where the sofa was'],
    answer: 2,
    why: 'A lightmap is a picture of the light when it was baked, so the dark patch stays by the window. Anything that moves needs a live shadow.',
  },
  {
    code: `geometry.setAttribute('uv1', bakedUVs);
floor.material.lightMap = bakedLight; // loaded with TextureLoader
// bakedLight.channel is never set`,
    ask: 'Where does the baked light land?',
    choices: ['In the wrong places, read from uv', 'In the right places, read from uv1', 'Nowhere, since the map is ignored'],
    answer: 0,
    why: 'Each texture reads the UV set its `channel` names, and `channel` starts at 0, the first set, `uv`. Set `bakedLight.channel = 1`.',
  },
  {
    code: `part.material.aoMap = occlusion; // dark in the crease between two panels
scene.add(spot); // a SpotLight aimed straight into the crease`,
    ask: 'How does the crease look under the spotlight?',
    choices: ['Dark, since AO darkens all light there', 'Lit by the spot, only soft light darkened', 'Black, as AO and a spot cancel out'],
    answer: 1,
    why: 'AO applies only to ambient, hemisphere, environment, and lightmap light. A direct light like the spot still lights the crease fully.',
  },
];
