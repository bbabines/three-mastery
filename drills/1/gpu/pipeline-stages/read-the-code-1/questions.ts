// Read-the-code questions for the pipeline stages page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// two opaque walls, one straight behind the other,
// covering the same pixels
back.renderOrder = 0;
front.renderOrder = 1; // the back wall is drawn first`,
    ask: 'For a pixel both walls cover, how many times does the fragment shader run?',
    choices: [
      'Twice: each wall makes its own fragment there',
      'Once: every pixel gets exactly one fragment',
      'Once: the depth test skips the back wall',
    ],
    answer: 0,
    why: 'A fragment is one triangle\'s claim on one pixel, not the pixel itself. The back wall is drawn first, so its fragment passes the depth test and is shaded; then the front wall\'s fragment is nearer, so it\'s shaded too and overwrites it. Drawn the other way round, the depth test could reject the back wall\'s fragment, which is why three.js draws opaque objects front to back.',
  },
  {
    code: `const ball = new Mesh(new SphereGeometry(1, 512, 256), material);
ball.scale.setScalar(0.01); // a speck on screen`,
    ask: 'What does the speck still cost the GPU every frame?',
    choices: [
      'Almost nothing: it only covers a few pixels',
      'Vertex work: about 130,000 vertex shader runs',
      'Pixel work: each vertex becomes one pixel',
    ],
    answer: 1,
    why: 'Vertex work grows with the vertex count, and this sphere has 513 × 257 = 131,841 vertices however small it is on screen. Pixel work is what shrank: it covers only a few pixels. The two kinds of work are independent, which is why a far-away model can still be heavy.',
  },
  {
    code: `fence.material.map = chainLinkTexture; // alpha 0 in the gaps
fence.material.alphaTest = 0.5;`,
    ask: 'Where do the gaps in the fence get made?',
    choices: [
      'In the fragment shader: it discards them',
      'In rasterization: the gaps never become fragments',
      'In blending: gaps mix in at zero strength',
    ],
    answer: 0,
    why: '`alphaTest` adds a `discard` to the fragment shader: every pixel the fence covers is rasterized into a fragment and starts its shader, which reads the texture and throws the fragment away when alpha is under 0.5. So the gaps cost nearly as much as the wire, and a shader that can discard can stop the GPU from skipping hidden fragments early.',
  },
  {
    code: `const sign = new Mesh(new PlaneGeometry(2, 1), new MeshBasicMaterial());
sign.rotation.y = Math.PI; // its back now faces the camera`,
    ask: 'Why does the sign vanish?',
    choices: [
      'The depth test: its back is farther than its front',
      'Culling: faces pointed away are dropped',
      'The fragment shader: back faces come out transparent',
    ],
    answer: 1,
    why: 'Materials default to `side: FrontSide`, so the GPU drops triangles facing away from the camera before it rasterizes them: no fragments, no pixel work. `side: DoubleSide` keeps both faces, at the cost of rasterizing and shading the back faces too.',
  },
];
