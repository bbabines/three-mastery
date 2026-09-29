// Read-the-code questions for the debug output page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// checking that the floor's normal points straight up, in the world
gl_FragColor = vec4(normalize(vWorldNormal) * 0.5 + 0.5, 1.0);`,
    ask: 'The floor shows as (0.5, 1.0, 0.5), a light green. What does that say about its normal?',
    choices: [
      "Nothing: a color can't show a direction",
      '(0, 1, 0): it points straight up',
      '(0.5, 1, 0.5): it leans toward +X and +Z',
    ],
    answer: 1,
    why: "`* 0.5 + 0.5` squeezed −1 to 1 into 0 to 1, so undo it when you read: 0.5 means 0, and 1 means 1. (0.5, 1, 0.5) is the direction (0, 1, 0), straight up. That's the whole idea of debug output: any value can be read off the screen once it's mapped into 0 to 1.",
  },
  {
    code: `gl_FragColor = vec4(normalize(vNormal), 1.0);`,
    ask: 'Parts of the ball come out pure black. Why?',
    choices: [
      'Those normals are broken and point inward',
      'Negative parts clip to 0 on screen',
      'normalize fails on the back half of a ball',
    ],
    answer: 1,
    why: "A normal's parts run from −1 to 1, but the screen can only show 0 to 1, so every negative part is clipped to 0. Where all three are negative, the color is pure black, even though those normals are fine. Remap first: `normalize(vNormal) * 0.5 + 0.5`.",
  },
  {
    code: `part.material = new MeshNormalMaterial();
// then orbit halfway around the part`,
    ask: "The part's colors change as you orbit. Is something wrong?",
    choices: [
      'Yes: the normals are recomputed every frame',
      "Yes: the part's matrixWorld is out of date",
      'No: it shows normals measured from the camera',
    ],
    answer: 2,
    why: "`MeshNormalMaterial` turns normals with `normalMatrix`, so it shows them measured from the camera: a face turned toward you is always bluish, whichever face it is. That's right, not a bug. To check normals in the world, use a small shader with `vWorldNormal = normalize(mat3(modelMatrix) * normal);`, and its colors stay put as you orbit.",
  },
  {
    code: `gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0);`,
    ask: 'Near and far objects all look almost white. Why?',
    choices: [
      'gl_FragCoord.z is in world units, so over 1',
      'Depth is squeezed toward 1 for most of the view',
      'Depth is only known after the fragment shader',
    ],
    answer: 1,
    why: "`gl_FragCoord.z` is the depth the depth test uses, and with a perspective camera most of the view is packed close to 1, as the depth precision page showed. To see depth as a readable picture, hand over the distance in front of the camera, `-(modelViewMatrix * vec4(position, 1.0)).z`, and map a range you choose into 0 to 1.",
  },
  {
    code: `gl_FragColor = vec4(vUv, 0.0, 1.0);`,
    ask: 'On a sphere, a sharp line runs from pole to pole where red jumps from full to none. What is it?',
    choices: [
      'The UV seam, where u wraps from 1 back to 0',
      "A crack in the mesh, where it's missing faces",
      'Rounding, since varyings lose precision there',
    ],
    answer: 0,
    why: "A sphere's UVs run once around it, from 0 to 1, and have to meet somewhere: that's the seam, where the texture's left and right edges touch. It's where a texture that doesn't tile shows a visible join. UVs as color, or a checker made from them, is the quickest way to find seams and stretched areas on a model.",
  },
];
