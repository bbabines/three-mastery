// Read-the-code questions for the baked lighting page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the showroom floor's lightmap was baked with the sofa by the window
floor.material.lightMap = bakedLight;
sofa.position.x += 2; // the shopper drags the sofa across the room`,
    ask: 'What happens to the shadow under the sofa?',
    choices: ['It moves with the sofa to its new spot', 'It fades out slowly, since the sofa has moved', 'It stays on the floor where the sofa was'],
    answer: 2,
    why: "A lightmap is a picture of the light, worked out when it was baked. Nothing in it knows the sofa moved, so the dark patch stays by the window and the sofa sits unshadowed. Anything that moves needs a live shadow (the shadows page).",
  },
  {
    code: `geometry.setAttribute('uv1', bakedUVs);
floor.material.lightMap = bakedLight; // loaded with TextureLoader
// bakedLight.channel is never set`,
    ask: 'Where does the baked light land?',
    choices: ['In the wrong places, read from uv', 'In the right places, from uv1', 'Nowhere at all, since the map is ignored'],
    answer: 0,
    why: "Each texture reads the UV set its `channel` names, and `channel` starts at 0, the first set, `uv`. Set `bakedLight.channel = 1` to read `uv1`. `GLTFLoader` does this for you when a file has a second set.",
  },
  {
    code: `part.material.aoMap = occlusion; // dark in the crease between two panels
scene.add(spot); // a SpotLight aimed straight into the crease`,
    ask: 'How does the crease look under the spotlight?',
    choices: ['Dark, since the AO map darkens all light there', 'Lit by the spotlight, with only its soft light darkened', 'Black, as AO and a spotlight cancel each other out'],
    answer: 1,
    why: "AO says how hidden a spot is from the light all around it, so three.js applies it only to ambient, hemisphere, environment, and lightmap light. A direct light like the spot still lights the crease fully.",
  },
];
