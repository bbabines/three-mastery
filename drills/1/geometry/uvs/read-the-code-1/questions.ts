// Read-the-code questions for the UVs page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const uv = geometry.attributes.uv;
uv.setXY(1, 3, 3); // this corner's UV, far past 1
uv.needsUpdate = true;
// the texture keeps its default settings`,
    ask: 'What does the texture show toward that corner?',
    choices: [
      'The image repeated about three times',
      "The image's edge pixels, stretched out",
      'An error, since UVs must stay 0 to 1',
    ],
    answer: 1,
    why: "UVs can go anywhere; the texture's wrap setting decides what shows past 1. The default, `ClampToEdgeWrapping`, stretches the edge pixels. For tiling, use `RepeatWrapping`.",
  },
  {
    code: `floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
floorTexture.repeat.set(8, 8);`,
    ask: 'What does the floor show?',
    choices: ['One tile, 8 times as big', 'The tile 8 times each way', 'One tile, smeared at its edges'],
    answer: 1,
    why: '`repeat` scales the UVs as the texture is read, so they run from 0 to 8, and `RepeatWrapping` tiles the image. The geometry is unchanged.',
  },
  {
    code: `geometry.setAttribute('uv1', bakedUVs);
material.lightMap = bakedLight; // bakedLight.channel left as it was made`,
    ask: 'Which UVs does the light map read?',
    choices: ['`uv`, the first set', '`uv1`, the second set', '`uv2`, as light maps need'],
    answer: 0,
    why: "Every map reads the UV set its texture's `channel` names, and a new texture's `channel` is 0, meaning `uv`. Set `bakedLight.channel = 1` to read `uv1`.",
  },
];
