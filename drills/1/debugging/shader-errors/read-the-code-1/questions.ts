// Read-the-code questions for the shader errors page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const material = new ShaderMaterial({
  fragmentShader: \`void main() {
  gl_FragColor = vec4(colr, 1.0);
}\`,
});
// console: ERROR: 0:58: 'colr' : undeclared identifier`,
    ask: 'Where is line 58?',
    choices: [
      'Line 58 of the JavaScript file with this code',
      'In the shader three.js built from yours',
      'Line 58 of the fragmentShader string',
    ],
    answer: 1,
    why: 'three.js puts dozens of its own lines in front of your shader, and the driver counts from the top. Your typo is on line 2; find the line marked `>` in your code.',
  },
  {
    code: `material.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <color_fragment>',
    '#include <color_fragment>\\ndiffuseColor.rgb *= tint;',
  );
};`,
    ask: 'What happens when the material is first drawn?',
    choices: [
      'Nothing goes wrong, since three.js declares tint',
      'A compile error, since tint is never declared',
      'The tint line is skipped without any error',
    ],
    answer: 1,
    why: "Nothing declares `uniform vec3 tint;`, so the shader fails to compile and the material doesn't draw. The log's line number is in the thousands.",
  },
  {
    code: `renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
  errors.push(gl.getShaderInfoLog(fragmentShader));
};
// then a material fails to compile`,
    ask: 'What does three.js print in the console?',
    choices: [
      'Its usual Shader Error report, then calls yours',
      'An exception that stops the render loop',
      'Nothing, since your function replaces its report',
    ],
    answer: 2,
    why: "Setting `onShaderError` turns off three.js's own report, so the message goes only into `errors`. The material still doesn't draw.",
  },
];
