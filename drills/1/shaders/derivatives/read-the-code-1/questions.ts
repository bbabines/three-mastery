// Read-the-code questions for the derivatives page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// a single big floor plane, 2 triangles
vec2 toLine = abs(fract(vWorldPos.xz - 0.5) - 0.5);
vec2 inPixels = toLine / fwidth(vWorldPos.xz);
float line = 1.0 - min(min(inPixels.x, inPixels.y), 1.0);`,
    ask: 'How wide are the grid lines on screen?',
    choices: [
      'Fixed in world units, so thinner far away',
      'About one pixel wide, whatever the distance',
      'Thick near the camera, gone far away',
    ],
    answer: 1,
    why: '`fwidth(vWorldPos.xz)` is how much ground one pixel covers at that spot, so dividing the distance to a line by it gives the distance in pixels. Every line then fades out over about one pixel, near or far, all on two triangles. Without the divide, the lines would have a fixed width in world units: fat up close, and breaking up far away.',
  },
  {
    code: `// vertex shader: vViewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
// fragment shader
vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));`,
    ask: 'A smooth, indexed ball is lit with `n`. How does it look?',
    choices: [
      'Smooth: just like its vertex normals',
      'Black: derivatives are 0 on curved faces',
      'Faceted: one flat shade for each triangle',
    ],
    answer: 2,
    why: "`dFdx` and `dFdy` of the position are two small steps along the surface, across and up the screen, and their cross product points straight out of the triangle. The steps are the same everywhere on a flat triangle, so each triangle gets one normal: a faceted look, without splitting the shared vertices. three.js's `flatShading: true` does exactly this.",
  },
  {
    code: `// vertex shader
float w = fwidth(position.x);`,
    ask: 'What happens?',
    choices: [
      "It won't compile: derivatives are fragment-only",
      'It works: w is how much x changes between vertices',
      'It compiles: w is always 0 in a vertex shader',
    ],
    answer: 0,
    why: "Derivatives compare a value with the neighboring pixel's, and only fragments have neighboring pixels, so `dFdx`, `dFdy`, and `fwidth` exist only in the fragment shader. Work out what you need in the vertex shader, hand it over as a varying, and take its derivative in the fragment shader.",
  },
];
