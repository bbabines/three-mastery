// Read-the-code questions for the vertex vs fragment page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const cloth = new Mesh(new PlaneGeometry(3, 2), waveMaterial);
// waveMaterial's vertex shader:
// p.z += sin(p.x * 3.0 + uTime * 2.0) * 0.25;`,
    ask: "The flag doesn't ripple: it stays flat and just tips back and forth. Why?",
    choices: [
      'It has four vertices, so only corners move',
      'Waves belong in the fragment shader, per pixel',
      'The wave is too small to show at 0.25 units',
    ],
    answer: 0,
    why: "`new PlaneGeometry(3, 2)` has one segment each way, so four vertices. The vertex shader runs only at those corners, and each triangle stays flat between them, so the flag tips as a whole instead of rippling. Give it more vertices along the wave: `new PlaneGeometry(3, 2, 64, 1)`. A fragment shader can't move the surface at all.",
  },
  {
    code: `const glass = new MeshBasicMaterial({ color: 'skyblue', transparent: true, opacity: 0.3 });
for (let i = 0; i < 5; i++) {
  const pane = new Mesh(new PlaneGeometry(4, 4), glass);
  pane.position.z = -i;
  scene.add(pane);
}`,
    ask: 'The camera looks straight at the stack. For a pixel where all five panes overlap, how many times does the fragment shader run?',
    choices: ['Once: one pixel gets one run', 'Five times: once for each of the five panes', 'Once: only the front pane is shaded'],
    answer: 1,
    why: "Each pane's triangles make their own fragment at that pixel. See-through objects are drawn back to front, and each one is shaded and mixed into the color already there, so the fragment shader runs five times for one pixel on screen. That extra work is overdraw, and it's why stacked see-through layers get expensive.",
  },
  {
    code: `renderer.setPixelRatio(2);
renderer.setSize(1920, 1080);
// a full-screen effect: one rectangle, four vertices, covering the canvas`,
    ask: "About how many times does the effect's fragment shader run each frame?",
    choices: [
      'About 2 million: once per CSS pixel',
      'About 8.3 million: once per device pixel',
      'Four times: once per corner of the rectangle',
    ],
    answer: 1,
    why: '`setPixelRatio(2)` gives the canvas 3840 × 2160 device pixels behind its 1920 × 1080 CSS size, and a full-screen rectangle covers every one of them: about 8.3 million fragments. Its four vertices barely count. A full-screen effect\'s cost grows with the pixel ratio squared, which is why setup code caps it with `Math.min(devicePixelRatio, 2)`.',
  },
  {
    code: `// the vertex shader of a ShaderMaterial on a crate
void main() {
  gl_Position = vec4(position, 1.0);
}`,
    ask: 'What goes wrong?',
    choices: [
      "It's stuck to the screen: the camera is ignored",
      'Nothing: three.js applies the matrices for you anyway',
      "It won't compile: gl_Position needs a matrix",
    ],
    answer: 0,
    why: "`gl_Position` must be in clip space. three.js declares the matrices for you but doesn't apply them, so the crate's own measurements go straight to clip space: it's drawn at a fixed spot in the middle of the view, whatever the camera or the crate's `position` does. Write `gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);`.",
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
      'Each pixel slides 0.2 outward along the normal there',
      "It won't compile, since attributes are vertex-only",
    ],
    answer: 2,
    why: "`position` and `normal` are attributes, inputs to the vertex shader, and three.js declares them only there, so the fragment shader fails on an undeclared name. A fragment shader can't move the surface anyway: moving is the vertex shader's job. Anything the fragment shader needs from a vertex has to be handed over, which the attributes, uniforms, varyings page covers.",
  },
];
