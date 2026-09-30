// Read-the-code questions for the debug output page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// checking the floor's normal, in the world
gl_FragColor = vec4(normalize(vWorldNormal) * 0.5 + 0.5, 1.0);
// the floor shows as (0.5, 1.0, 0.5), a light green`,
    ask: "What is the floor's normal?",
    choices: [
      "Unknown: a color can't show a direction",
      '(0, 1, 0): it points straight up',
      '(0.5, 1, 0.5): leaning toward +X and +Z',
    ],
    answer: 1,
    why: '`* 0.5 + 0.5` squeezed −1 to 1 into 0 to 1, so undo it when you read: 0.5 means 0. The color is the direction (0, 1, 0), straight up.',
  },
  {
    code: `gl_FragColor = vec4(normalize(vNormal), 1.0);
// parts of the ball come out pure black`,
    ask: 'Why are those parts black?',
    choices: [
      'Those normals are broken and point inward',
      'Negative parts clip to 0 on screen',
      'normalize fails on the back half of a ball',
    ],
    answer: 1,
    why: "A normal's parts run from −1 to 1, but the screen clips anything below 0, so where all three are negative the color is black. Remap first with `* 0.5 + 0.5`.",
  },
  {
    code: `part.material = new MeshNormalMaterial();
// orbit halfway around: the part's colors change`,
    ask: 'Is something wrong with the normals?',
    choices: [
      'Yes: the normals are recomputed every frame',
      "Yes: the part's matrixWorld is out of date",
      'No: it shows normals measured from the camera',
    ],
    answer: 2,
    why: '`MeshNormalMaterial` turns normals with `normalMatrix`, so it shows them measured from the camera. For world normals, use a small shader with `normalize(mat3(modelMatrix) * normal)`.',
  },
  {
    code: `gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0);
// near and far objects all look almost white`,
    ask: 'Why does everything look almost white?',
    choices: [
      'gl_FragCoord.z is in world units, so over 1',
      'Depth is squeezed toward 1 for most of the view',
      'Depth is only known after the fragment shader',
    ],
    answer: 1,
    why: 'With a perspective camera, most of the view is packed close to a depth of 1. Show how far in front of the camera instead, mapped from a range you choose.',
  },
  {
    code: `gl_FragColor = vec4(vUv, 0.0, 1.0);
// on a sphere, red jumps from full to none along one line, pole to pole`,
    ask: 'What is that line?',
    choices: [
      'The UV seam, where u wraps from 1 back to 0',
      "A crack in the mesh, where it's missing faces",
      'Rounding, since varyings lose precision there',
    ],
    answer: 0,
    why: "A sphere's UVs run once around it and have to meet somewhere: that's the seam, where the texture's edges touch. UVs as color find seams fast.",
  },
];
