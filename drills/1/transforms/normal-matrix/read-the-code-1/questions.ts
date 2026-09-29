// Read-the-code questions for the normal matrix page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// the ramp is stretched to three times its length: scale (3, 1, 1)
const n = new Vector3(-0.6, 0.8, 0); // the slope's normal, measured from the ramp
n.transformDirection(ramp.matrixWorld);`,
    ask: 'Which way does `n` point now?',
    choices: ['Straight out of the longer slope', 'Leaning over, not straight out', 'Straight up, like a flat floor'],
    answer: 1,
    why: "Stretching the ramp made its slope gentler, so the true normal tips toward straight up. `transformDirection` stretches the normal along with the ramp instead, which tips it the other way, over toward the surface. `n.applyNormalMatrix(new Matrix3().getNormalMatrix(ramp.matrixWorld))` keeps it straight out.",
  },
  {
    code: `// the lamp is scaled 2.5 on every axis and turned 70°
const n = normal.clone().transformDirection(lamp.matrixWorld);`,
    ask: 'Is `n` the right normal, in the world?',
    choices: ['Yes: growing evenly tilts nothing', 'No: any scale at all tilts normals', 'No: its length is 2.5 instead of 1'],
    answer: 0,
    why: "Turning, and growing by the same amount on every axis, never tilt a normal, so `transformDirection` gives the right direction, and it normalizes, so the length is 1. That's why treating normals like directions seems fine until something is stretched unevenly.",
  },
  {
    code: `// sign is a PlaneGeometry, turned so its front faces +X in the world
const hit = raycaster.intersectObject(sign)[0];
console.log(hit.face.normal);`,
    ask: 'The ray hits the front of the sign. What does it log?',
    choices: ['(0, 0, 1)', '(1, 0, 0)', '(−1, 0, 0)'],
    answer: 0,
    why: "`hit.face.normal` is measured from the object itself, and a plane's front faces +Z in its own geometry, whichever way the sign is turned. Turn it into the world with `applyNormalMatrix(new Matrix3().getNormalMatrix(sign.matrixWorld))`, which gives (1, 0, 0). `hit.point`, by contrast, is already in the world.",
  },
  {
    code: `const n = hit.face.normal.clone().applyNormalMatrix(hit.object.normalMatrix);
decal.position.copy(hit.point);
decal.lookAt(hit.point.clone().add(n));`,
    ask: "The decal doesn't sit flat on the surface. Why?",
    choices: [
      '`normalMatrix` turns normals into camera space',
      'Normals need `transformDirection` instead',
      '`hit.point` is measured from the object itself',
    ],
    answer: 0,
    why: "three.js fills in `mesh.normalMatrix` while rendering, from the object and the camera together, so it turns normals into camera space, and it changes whenever the camera moves. For the world, build one: `new Matrix3().getNormalMatrix(hit.object.matrixWorld)`. `transformDirection` would be wrong too on a stretched object.",
  },
  {
    code: `// vertex shader
vNormal = normalize(mat3(modelViewMatrix) * normal);
// fragment shader: 0 facing the camera, 1 side-on
float rim = 1.0 - normalize(vNormal).z;`,
    ask: 'The part is stretched with `scale.set(1, 3, 1)`. What happens to the rim glow?',
    choices: [
      'It spreads onto parts that face the camera',
      'Nothing, since normals turn like directions',
      'It vanishes, since the normals get too long',
    ],
    answer: 0,
    why: "`mat3(modelViewMatrix)` stretches the normals along with the part, tilting them away from the camera, so surfaces that face the camera glow as if they were side-on. Use the built-in normal matrix: `vNormal = normalize(normalMatrix * normal);`. Both lines give camera space, where a normal facing the camera points along +Z.",
  },
];
