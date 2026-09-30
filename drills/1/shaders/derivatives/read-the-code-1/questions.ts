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
    why: '`fwidth` is how much ground one pixel covers there, so dividing by it measures the distance to a line in pixels. Every line fades over about one pixel, with no extra geometry.',
  },
  {
    code: `// vertex shader: vViewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
// fragment shader, on a smooth, indexed ball
vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));`,
    ask: 'Lit with `n`, how does the ball look?',
    choices: [
      'Smooth: just like its vertex normals',
      'Black: derivatives are 0 on curved faces',
      'Faceted: one flat shade for each triangle',
    ],
    answer: 2,
    why: "The derivatives are two steps along a flat triangle, and their cross product points straight out of it, so each triangle gets one normal. That's how `flatShading: true` works.",
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
    why: "Derivatives compare a value with the neighboring pixel's, so they exist only in the fragment shader. Hand the value over as a varying and take its derivative there.",
  },
];
