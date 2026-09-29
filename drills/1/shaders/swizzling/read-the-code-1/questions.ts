// Read-the-code questions for the swizzling page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// uCadPoint: a point from a CAD file, where Z is up; three.js uses Y for up
vec3 p = uCadPoint.xzy;`,
    ask: "What's wrong with `p`?",
    choices: [
      'Nothing: swapping y and z converts Z-up to Y-up',
      'Its z has the wrong sign: front and back swap',
      "It won't compile: xzy mixes up the letter order",
    ],
    answer: 1,
    why: "Swapping two axes makes a mirror image, not a turn: the height comes out right, but the point lands on the wrong side, front for back. Going from Z-up to Y-up is a −90° turn around X, which is the swap plus one sign flip: `vec3(p.x, p.z, -p.y)`. Any order of letters compiles, as long as they come from one set.",
  },
  {
    code: `// a drone hovers 5 units straight above uCenter
float d = length(vWorldPos.xz - uCenter.xz);`,
    ask: 'What is `d` at the drone?',
    choices: ['0: height is left out of .xz', '5: the height above the center', 'About 7: height and floor both count'],
    answer: 0,
    why: "`.xz` keeps x and z and drops y, the height, so a spot straight above the center is 0 away along the floor. That's what a ring on the ground, a radar sweep, or a spotlight disc wants. `distance(vWorldPos, uCenter)` would give 5.",
  },
  {
    code: `vec4 orm = texture2D(ormMap, vUv); // glTF packing: occlusion, roughness, metalness
float roughness = orm.r;`,
    ask: 'What does `roughness` hold?',
    choices: [
      'Roughness: r stands for roughness',
      "Nothing: .r only works on a vec3",
      'Occlusion: roughness is in the green channel',
    ],
    answer: 2,
    why: "`r`, `g`, `b`, and `a` are just names for the first, second, third, and fourth parts, the same as `x`, `y`, `z`, and `w`. glTF packs occlusion into red, roughness into green, and metalness into blue, so `orm.r` is occlusion. Roughness is `orm.g`.",
  },
];
