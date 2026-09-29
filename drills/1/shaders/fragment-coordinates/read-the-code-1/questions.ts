// Read-the-code questions for the fragment coordinates page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `renderer.setPixelRatio(2);
renderer.setSize(800, 600);
// fragment shader of a quad covering the whole canvas
gl_FragColor = vec4(gl_FragCoord.x > 400.0 ? 1.0 : 0.0, 0.0, 0.0, 1.0);`,
    ask: 'Which part of the canvas turns red?',
    choices: [
      'The right half, past 400 CSS pixels',
      'The right three-quarters, past 200 CSS pixels',
      'The left half, as x counts from the right',
    ],
    answer: 1,
    why: "At pixel ratio 2, the 800 × 600 CSS canvas is 1600 × 1200 device pixels, and `gl_FragCoord` counts device pixels. 400 of them is only 200 CSS pixels in, so everything past the first quarter turns red. For half the canvas, compare against half of `renderer.getDrawingBufferSize(v).x`.",
  },
  {
    code: `// uResolution: the canvas size in device pixels
vec2 screenUv = gl_FragCoord.xy / uResolution;
gl_FragColor = vec4(vec3(screenUv.y), 1.0);`,
    ask: 'Where is the canvas darkest?',
    choices: ['Along the top edge, where CSS starts', 'Along the bottom edge', 'At the middle of the canvas'],
    answer: 1,
    why: "`gl_FragCoord` counts from the bottom-left corner, with y going up, so `screenUv.y` is 0 along the bottom and 1 along the top. CSS and pointer events count y down from the top, which is why a mouse position needs flipping before it goes to a shader.",
  },
  {
    code: `// the pixel ratio is 2
material.uniforms.uResolution.value = renderer.getSize(new Vector2());
// fragment shader: vec2 screenUv = gl_FragCoord.xy / uResolution;`,
    ask: "The vignette's center sits off toward the bottom-left. Why?",
    choices: [
      'getSize is in CSS pixels, not device pixels',
      'gl_FragCoord counts from the top-left, like CSS',
      'The uniform must be set again every frame',
    ],
    answer: 0,
    why: "`renderer.getSize()` gives the canvas in CSS pixels, but `gl_FragCoord` counts device pixels, twice as many each way here. So `screenUv` runs from 0 to 2, and its 0.5 lands a quarter of the way across and up. Use `renderer.getDrawingBufferSize(new Vector2())`, and update it on resize.",
  },
];
