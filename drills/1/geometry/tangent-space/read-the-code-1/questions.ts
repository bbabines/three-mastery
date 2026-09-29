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
    why: "(0.5, 0.5, 1) stands for (0, 0, 1) in tangent space: straight along each point's own normal, whichever way that side faces. So nothing tilts. If the colors were world directions, every side would light as if it faced +Z.",
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
    why: 'three.js reads green as up (+Y), the OpenGL convention glTF also uses. A −Y map read that way has its up-and-down tilts reversed, while red, left to right, is fine. Flip green on the material with `material.normalScale.y *= -1`, or in the image.',
  },
  {
    code: `// a glTF model whose file stores no tangents
const { scene: model } = await gltfLoader.loadAsync('panel.glb');
console.log(model.getObjectByName('Panel').material.normalScale.y);`,
    ask: 'What does it log?',
    choices: ['1', '−1', '0'],
    answer: 1,
    why: "`GLTFLoader` flips `normalScale.y` to −1 on meshes with no stored tangents, its own correction for how glTF lays out textures, not a sign of a DirectX map. That's why a fix for a DirectX map should multiply, `normalScale.y *= -1`, rather than set −1, which would undo the loader's correction.",
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
    why: "`SRGBColorSpace` tells three.js to convert the colors as they're read, which is right for a color texture and wrong for data. The directions come out bent, and the bumps light wrong. Leave a normal map at its default, `NoColorSpace`.",
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
    why: 'Tangents follow the texture\'s u direction, so `computeTangents` needs UVs, and it also needs an index. Without them it logs an error and returns. With no `tangent` attribute, three.js works out the tangent frame per pixel from the UVs instead, which still needs UVs.',
  },
];
