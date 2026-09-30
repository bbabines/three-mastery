// Read-the-code questions for the attributes, uniforms, varyings page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// vertex shader: the triangle's corners are red, green, and blue
vColor = color;
// fragment shader
gl_FragColor = vec4(vColor, 1.0);`,
    ask: 'What color is the fragment at the very center?',
    choices: [
      'An even mix of red, green, and blue',
      "Red, the first corner's color, unchanged",
      'Black, since no vertex sits at the center',
    ],
    answer: 0,
    why: "A varying is blended across the triangle, weighted by how close each corner is. At the center that's a third of each, a gray; only `flat` would hand over one corner's color.",
  },
  {
    code: `// vertex shader, on a box whose corners run from y = -1 to y = 1
vHeight = position.y;
// fragment shader
gl_FragColor = vec4(vec3(vHeight * 0.5 + 0.5), 1.0);`,
    ask: 'What does a side of the box look like?',
    choices: [
      'Black below halfway, then white above it',
      'One flat gray, since each face gets one value',
      'A smooth fade from black up to white',
    ],
    answer: 2,
    why: 'The bottom corners hold −1 and the top ones 1, and every fragment between gets a blend. So the value climbs smoothly up the side, from black to white.',
  },
  {
    code: `flat varying vec3 vNormal; // in both shaders
// fragment shader
float light = max(dot(normalize(vNormal), uToSun), 0.0);`,
    ask: 'How does a smooth ball look with this lighting?',
    choices: [
      'Smooth: the normal is blended as usual',
      'Faceted: one flat shade per triangle',
      "Black: flat varyings can't hold a direction",
    ],
    answer: 1,
    why: "`flat` turns blending off, so every fragment in a triangle gets one corner's normal and the same shade. Drop `flat` to shade the ball smoothly.",
  },
  {
    code: `let time = 0;
const material = new ShaderMaterial({ uniforms: { uTime: { value: time } }, vertexShader, fragmentShader });
renderer.setAnimationLoop((now) => { time = now / 1000; renderer.render(scene, camera); });`,
    ask: 'Why does the effect never move?',
    choices: [
      'Uniforms are fixed once the material compiles',
      'time must be in milliseconds, not seconds',
      'The uniform copied 0 and never changes',
    ],
    answer: 2,
    why: "`{ value: time }` copied the number 0 when the material was made, and changing `time` later doesn't touch it. Set `material.uniforms.uTime.value = now / 1000` instead.",
  },
  {
    code: `// vCorner is (1, 0, 0), (0, 1, 0), (0, 0, 1) at each triangle's three corners
float nearEdge = min(min(vCorner.x, vCorner.y), vCorner.z);
gl_FragColor = vec4(vec3(nearEdge < 0.03 ? 0.0 : 1.0), 1.0);`,
    ask: 'What shows on the model?',
    choices: [
      "Black lines along every triangle's edges",
      "Black dots at every triangle's corners",
      'All white, since the values never get so small',
    ],
    answer: 0,
    why: "Along an edge, the far corner's share of the blend is 0, so `nearEdge` is near 0 there and the edge turns black. Every triangle gets an outline.",
  },
];
