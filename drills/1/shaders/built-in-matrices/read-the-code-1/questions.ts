// Read-the-code questions for the built-in matrices and spaces page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// crate.position.y = 2; the crate's geometry runs from y = -0.5 to 0.5
vHeight = position.y;`,
    ask: "At the crate's top face, what is `vHeight`?",
    choices: [
      "2.5: the crate's lift is added to its height",
      "2: every vertex gets the crate's position",
      '0.5: position is measured from the crate itself',
    ],
    answer: 2,
    why: "`position` is the attribute straight from the geometry, measured from the crate itself, so the top face says 0.5 wherever the crate is. Nothing converts it until you multiply: `(modelMatrix * vec4(position, 1.0)).y` gives 2.5, the height in the world.",
  },
  {
    code: `// uToSun: the direction toward the sun, in the world
vec3 n = normalize(normalMatrix * normal);
float sun = max(dot(n, uToSun), 0.0);`,
    ask: 'The lit side slides around the part as you orbit. Why?',
    choices: [
      'The sun direction needs normalizing in the shader first',
      'n is measured from the camera, but uToSun is in the world',
      'normalMatrix is only refreshed when the part itself moves',
    ],
    answer: 1,
    why: "three.js builds `normalMatrix` from the mesh and the camera together, so `n` is measured from the camera and changes as you orbit, while `uToSun` stays put in the world. Comparing values in two spaces gives shading that slides. Either turn the sun into the camera's space, `(viewMatrix * vec4(uToSun, 0.0)).xyz`, or use a world normal.",
  },
  {
    code: `// fragment shader
varying vec3 vLocalPos;
void main() {
  vec3 worldPos = (modelMatrix * vec4(vLocalPos, 1.0)).xyz;`,
    ask: 'What happens?',
    choices: [
      "It won't compile without declaring modelMatrix",
      'It works, since every built-in is in both shaders',
      'It compiles, but modelMatrix is all zeros there',
    ],
    answer: 0,
    why: "three.js declares the matrices in the vertex shader only; the fragment shader gets just `viewMatrix`, `cameraPosition`, and `isOrthographic`. Work the world position out in the vertex shader and hand it over: `vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`.",
  },
  {
    code: `// vertex shader
vNormal = normalize(normalMatrix * normal);
// fragment shader
float rim = 1.0 - abs(normalize(vNormal).z);`,
    ask: 'Where does the glow sit as you orbit around the part?',
    choices: ['On the sides facing the world\'s +Z and −Z', 'Around the outline, from any angle', 'On top, wherever the normals point up'],
    answer: 1,
    why: "`normalMatrix` gives normals measured from the camera, where you always look along −Z. A normal whose `z` is near 0 is side-on to you, and that's the outline, from wherever you look. With a world normal, `.z` would be the world's Z, and the glow would stay stuck to the part instead.",
  },
  {
    code: `// vertex shader: vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
// fragment shader
float away = distance(vWorldPos, cameraPosition);`,
    ask: 'What is `away`?',
    choices: [
      "How far the object's center is from the camera",
      'How far this spot is from the camera, in world units',
      'The depth in clip space, from 0 to 1',
    ],
    answer: 1,
    why: "`vWorldPos` is this fragment's spot in the world, blended from the corners, and `cameraPosition` is the camera's spot in the world, so their distance is how far this part of the surface is from the camera. It's the usual starting point for fog and distance fades.",
  },
];
