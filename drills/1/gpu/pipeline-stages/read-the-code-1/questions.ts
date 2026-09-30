// Read-the-code questions for the pipeline stages page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// two opaque walls cover the same pixels,
// and the back wall is drawn first
back.renderOrder = 0;
front.renderOrder = 1;`,
    ask: 'How often does the fragment shader run there?',
    choices: [
      "Twice, once for each wall's fragment",
      'Once, since each pixel gets one fragment',
      'Once, since the depth test skips the back wall',
    ],
    answer: 0,
    why: "A fragment is one triangle's claim on one pixel. Both walls' fragments are shaded, and the front one covers the back. Drawn front to back, the back one could be skipped.",
  },
  {
    code: `const ball = new Mesh(new SphereGeometry(1, 512, 256), material);
ball.scale.setScalar(0.01); // a speck on screen`,
    ask: 'What does the speck still cost every frame?',
    choices: [
      'Almost nothing, since it covers few pixels',
      'Vertex work for about 130,000 vertices',
      'One pixel of work for each vertex',
    ],
    answer: 1,
    why: 'Vertex work grows with the vertex count, however small the mesh looks; only the pixel work shrank. Use a lower-detail geometry for things seen small.',
  },
  {
    code: `fence.material.map = chainLinkTexture; // alpha 0 in the gaps
fence.material.alphaTest = 0.5;`,
    ask: 'Where are the gaps in the fence made?',
    choices: [
      'In the fragment shader, which discards them',
      'In rasterization, which never makes them',
      'In blending, which mixes them in at zero',
    ],
    answer: 0,
    why: '`alphaTest` adds a `discard` to the fragment shader, so every gap pixel is still made into a fragment and starts shading. The gaps cost nearly as much as the wire.',
  },
  {
    code: `const sign = new Mesh(new PlaneGeometry(2, 1), new MeshBasicMaterial());
sign.rotation.y = Math.PI; // its back now faces the camera`,
    ask: 'Why does the sign vanish?',
    choices: [
      'The depth test hides its back behind its front',
      'Culling drops triangles that face away',
      'Back faces come out fully transparent',
    ],
    answer: 1,
    why: 'Materials default to `side: FrontSide`, so triangles facing away are dropped before rasterization. `side: DoubleSide` keeps both faces, at the cost of shading the backs too.',
  },
];
