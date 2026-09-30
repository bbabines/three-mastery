// Read-the-code questions for the built-in matrices and spaces page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// crate.position.y = 2; the crate's geometry runs from y = -0.5 to 0.5
vHeight = position.y;`,
    ask: "At the crate's top face, what is `vHeight`?",
    choices: [
      "2.5: the crate's lift is added in",
      "2: every vertex gets the crate's position",
      '0.5: measured from the crate itself',
    ],
    answer: 2,
    why: '`position` comes straight from the geometry, measured from the crate itself, wherever the crate is. `(modelMatrix * vec4(position, 1.0)).y` gives 2.5, the height in the world.',
  },
  {
    code: `// uToSun: the direction toward the sun, in the world
// the lit side slides around the part as you orbit
vec3 n = normalize(normalMatrix * normal);
float sun = max(dot(n, uToSun), 0.0);`,
    ask: 'Why does the lit side slide?',
    choices: [
      'uToSun needs normalizing in the shader first',
      'n is measured from the camera, uToSun is not',
      'normalMatrix only refreshes when the part moves',
    ],
    answer: 1,
    why: "`normalMatrix` includes the camera, so `n` changes as you orbit while `uToSun` stays put in the world. Use a world normal, or turn the sun into the camera's space.",
  },
  {
    code: `// fragment shader
varying vec3 vLocalPos;
void main() {
  vec3 worldPos = (modelMatrix * vec4(vLocalPos, 1.0)).xyz;`,
    ask: 'What happens?',
    choices: [
      "It won't compile: modelMatrix isn't declared",
      'It works: every built-in is in both shaders',
      'It compiles: modelMatrix is all zeros there',
    ],
    answer: 0,
    why: 'The fragment shader gets only `viewMatrix`, `cameraPosition`, and `isOrthographic`. Work the world position out in the vertex shader and hand it over in a varying.',
  },
  {
    code: `// vertex shader
vNormal = normalize(normalMatrix * normal);
// fragment shader
float rim = 1.0 - abs(normalize(vNormal).z);`,
    ask: 'Where does the glow sit as you orbit?',
    choices: ["On the sides facing the world's +Z and −Z", 'Around the outline, from any angle', 'On top, wherever the normals point up'],
    answer: 1,
    why: '`normalMatrix` gives normals measured from the camera, where you always look along −Z. A normal whose `z` is near 0 is side-on to you, and that\'s the outline.',
  },
  {
    code: `// vertex shader: vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
// fragment shader
float away = distance(vWorldPos, cameraPosition);`,
    ask: 'What is `away`?',
    choices: [
      "How far the object's center is from the camera",
      'How far this spot is from the camera',
      'The depth in clip space, from 0 to 1',
    ],
    answer: 1,
    why: "`vWorldPos` is this fragment's spot in the world, and `cameraPosition` is the camera's, so this is the distance fog and fades start from.",
  },
];
