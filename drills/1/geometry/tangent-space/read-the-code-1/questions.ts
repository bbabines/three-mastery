// Read-the-code questions for the tangent space and normal maps page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a flat normal map: every pixel is (0.5, 0.5, 1), a pale blue-violet
crate.material.normalMap = flatNormalMap;`,
    ask: 'How does the crate light?',
    choices: [
      'Every side lit as if it faced +Z',
      'Every side dark, as if lit from behind',
      'The same as with no normal map',
    ],
    answer: 2,
    why: "(0.5, 0.5, 1) means straight along each point's own normal, whichever way that side faces, so nothing tilts. Read as world directions, every side would light as if it faced +Z.",
  },
  {
    code: `// a normal map baked in a DirectX-style tool: green means down (−Y)
material.normalMap = bakedNormalMap;
material.normalScale.set(1, 1);`,
    ask: 'How do the raised rivets look in three.js?',
    choices: [
      'Correct, since three.js detects the convention',
      'Lit backward left to right, like dents',
      'Lit backward top to bottom, like dents',
    ],
    answer: 2,
    why: 'three.js reads green as up (+Y), so a −Y map has its up-and-down tilts reversed, while red is fine. Flip green with `material.normalScale.y *= -1`, or in the image.',
  },
  {
    code: `// a glTF model whose file stores no tangents
const { scene: model } = await gltfLoader.loadAsync('panel.glb');
console.log(model.getObjectByName('Panel').material.normalScale.y);`,
    ask: 'What does it log?',
    choices: ['1', '−1', '0'],
    answer: 1,
    why: '`GLTFLoader` sets `normalScale.y` to −1 on meshes with no stored tangents, as its own correction, not a sign of a DirectX map. So fix a DirectX map with `*= -1`, never by setting −1.',
  },
  {
    code: `const bricksNormal = await new TextureLoader().loadAsync('bricks_normal.png');
bricksNormal.colorSpace = SRGBColorSpace;
material.normalMap = bricksNormal;`,
    ask: 'What goes wrong?',
    choices: [
      'Its directions get bent when it is read',
      'Nothing, since every texture is sRGB',
      'three.js ignores sRGB normal maps',
    ],
    answer: 0,
    why: '`SRGBColorSpace` converts the colors as they are read, which is right for a color texture and wrong for directions, so the bumps light wrong. Leave a normal map at `NoColorSpace`.',
  },
  {
    code: `const geometry = new BufferGeometry();
geometry.setAttribute('position', positions);
geometry.setAttribute('normal', normals);
geometry.computeTangents();`,
    ask: 'What does `computeTangents` do here?',
    choices: [
      'Builds tangents from the positions alone',
      'Logs an error and adds no tangents',
      'Adds tangents that all point along +X',
    ],
    answer: 1,
    why: "Tangents follow the texture's u direction, so `computeTangents` needs UVs, and an index too. Without them it logs an error and returns.",
  },
];
