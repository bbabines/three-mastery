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
      'Line 58 of the JavaScript file this code sits in',
      'In the shader three.js built from yours',
      'Line 58 of the fragmentShader string',
    ],
    answer: 1,
    why: "three.js puts dozens of lines of its own in front of your shader, a version line, precision, defines, and its built-in uniforms and attributes, and the driver counts from the top of that. Your typo is on line 2 of the string. Look at the line the log marks with `>` and search your code for it.",
  },
  {
    code: `material.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <color_fragment>',
    '#include <color_fragment>\\ndiffuseColor.rgb *= tint;',
  );
};`,
    ask: 'What happens the first time the material is drawn?',
    choices: [
      'Nothing goes wrong, since three.js declares tint',
      'A compile error, since tint is never declared',
      'The tint line is skipped without any error',
    ],
    answer: 1,
    why: "The patch uses `tint`, but nothing declares `uniform vec3 tint;` or supplies `shader.uniforms.tint`, so the shader fails to compile and the material doesn't draw. The log's line number is in the thousands, because the patch sits inside the whole built-in shader.",
  },
  {
    code: `renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
  errors.push(gl.getShaderInfoLog(fragmentShader));
};`,
    ask: 'A material then fails to compile. What does three.js print in the console?',
    choices: [
      'Its usual Shader Error report, then calls yours',
      'An exception that stops the render loop',
      'Nothing, since your function replaces its report',
    ],
    answer: 2,
    why: "Setting `onShaderError` turns off three.js's own report and hands you the WebGL context, the program, and both shaders instead. Here the message goes into `errors` and nothing reaches the console. The material still doesn't draw.",
  },
];
