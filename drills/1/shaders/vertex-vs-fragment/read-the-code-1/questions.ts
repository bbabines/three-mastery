// Read-the-code questions for the vertex vs fragment page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const cloth = new Mesh(new PlaneGeometry(3, 2), waveMaterial);
// waveMaterial's vertex shader: p.z += sin(p.x * 3.0 + uTime * 2.0) * 0.25;
// the flag stays flat and just tips back and forth`,
    ask: "Why doesn't the flag ripple?",
    choices: [
      'It has four vertices, so only corners move',
      'Waves belong in the fragment shader, per pixel',
      'The wave is too small to show at 0.25 units',
    ],
    answer: 0,
    why: 'The vertex shader runs only at the four corners, and each triangle stays flat between them. Give the plane more vertices: `new PlaneGeometry(3, 2, 64, 1)`.',
  },
  {
    code: `// glass: see-through, opacity 0.3; the camera looks straight at the stack
for (let i = 0; i < 5; i++) {
  scene.add(new Mesh(new PlaneGeometry(4, 4), glass).translateZ(-i));
}`,
    ask: 'How many fragment shader runs where all overlap?',
    choices: ['Once: one pixel gets one run', 'Five times: once for each pane', 'Once: only the front pane is shaded'],
    answer: 1,
    why: "Each pane makes its own fragment at that pixel, and each see-through one is shaded and mixed in. That's overdraw, so keep stacked see-through layers few.",
  },
  {
    code: `renderer.setPixelRatio(2);
renderer.setSize(1920, 1080);
// a full-screen effect: one rectangle covering the canvas`,
    ask: 'How many fragment shader runs per frame?',
    choices: [
      'About 2 million: once per CSS pixel',
      'About 8.3 million: once per device pixel',
      'Four: once per corner of the rectangle',
    ],
    answer: 1,
    why: 'At pixel ratio 2, the canvas has 3840 × 2160 device pixels, and the rectangle covers them all. The cost grows with the ratio squared, so cap it with `Math.min(devicePixelRatio, 2)`.',
  },
  {
    code: `// the vertex shader of a ShaderMaterial on a crate
void main() {
  gl_Position = vec4(position, 1.0);
}`,
    ask: 'What goes wrong?',
    choices: [
      "It's stuck to the screen: the camera is ignored",
      'Nothing: three.js applies the matrices for you',
      "It won't compile: gl_Position needs a matrix",
    ],
    answer: 0,
    why: "three.js declares the matrices but doesn't apply them, so the crate's own numbers go straight to clip space. Write `projectionMatrix * modelViewMatrix * vec4(position, 1.0)`.",
  },
  {
    code: `// fragment shader
void main() {
  vec3 puffed = position + normal * 0.2;
  gl_FragColor = vec4(puffed, 1.0);
}`,
    ask: 'What happens?',
    choices: [
      'The part is drawn 0.2 bigger on every side',
      'Each pixel slides 0.2 outward along its normal',
      "It won't compile, as attributes are vertex-only",
    ],
    answer: 2,
    why: '`position` and `normal` are attributes, declared only in the vertex shader. Move the surface there, and hand anything the fragment shader needs over in a varying.',
  },
];
