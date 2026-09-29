// Scenes for the shader errors page. The README places each one with <div data-scene="name">.
// The broken shaders are only compiled when their button is pressed, off to the side (never drawn),
// and renderer.debug.onShaderError catches each log, so nothing reaches the console.
import { choiceButtons, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const VERTEX = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Each version's fragment shader, and the one line that differs.
const WORKING = `varying vec2 vUv;
void main() {
  vec3 color = mix(vec3(0.95, 0.17, 0.01), vec3(0.04, 0.23, 0.9), vUv.y);
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}`;
const TYPO = WORKING.replace('vec4(color, 1.0)', 'vec4(colr, 1.0)');
const WHOLE = WORKING.replace('  gl_FragColor = vec4(color, 1.0);', '  float glow = 1;\n  gl_FragColor = vec4(color * glow, 1.0);');
const PATCH_LINE = 'diffuseColor.rgb *= tint;';

interface Version {
  html: string;
  material: THREE.Material;
  yourLine: string; // the line that breaks it, as written
  yourLineNumber: number; // where that line sits in the code you wrote
}

export const compileLog: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 1.4, 3.2);
  controls.target.set(0, 0.9, 0);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 1, 2);

  const lineOf = (source: string, text: string) => source.split('\n').findIndex((line) => line.includes(text)) + 1;
  const shader = (name: string, fragmentShader: string) =>
    new THREE.ShaderMaterial({ name, vertexShader: VERTEX, fragmentShader });

  const patched = new THREE.MeshStandardMaterial({ name: 'patched', color: '#ffffff' });
  patched.onBeforeCompile = (built) => {
    built.fragmentShader = built.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>\n\t${PATCH_LINE}`);
  };

  const versions: Version[] = [
    { html: 'compiles', material: shader('working', WORKING), yourLine: '', yourLineNumber: 0 },
    {
      html: 'typo',
      material: shader('typo', TYPO),
      yourLine: 'gl_FragColor = vec4(colr, 1.0);',
      yourLineNumber: lineOf(TYPO, 'colr'),
    },
    {
      html: 'whole number',
      material: shader('whole-number', WHOLE),
      yourLine: 'float glow = 1;',
      yourLineNumber: lineOf(WHOLE, 'glow = 1'),
    },
    {
      html: '<code>onBeforeCompile</code> patch',
      material: patched,
      yourLine: PATCH_LINE,
      yourLineNumber: 2,
    },
  ];

  // Catch the log instead of letting three.js print it.
  const caught = new Map<string, { message: string; line: number; total: number }>();
  renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
    const message = (gl.getShaderInfoLog(fragmentShader) ?? '').trim().split('\n')[0];
    const source = gl.getShaderSource(fragmentShader) ?? '';
    const line = Number(/ERROR: \d+:(\d+)/.exec(message)?.[1] ?? 0);
    caught.set(currentName, { message, line, total: source.split('\n').length });
  };
  let currentName = '';

  // Compile a version without drawing it, then ask its program for its uniforms, which is when
  // three.js checks for errors.
  const geometry = new THREE.SphereGeometry(0.7, 48, 24);
  const check = (version: Version) => {
    const name = version.material.name;
    if (caught.has(name) || name === 'working') return;
    currentName = name;
    renderer.compile(new THREE.Mesh(geometry, version.material), camera, scene);
    renderer.info.programs?.find((program) => program.name === name)?.getUniforms();
  };

  const ball = new THREE.Mesh(geometry, versions[0].material);
  ball.position.y = 0.9;
  scene.add(ball);

  const readout = overlay(container, 'readout');
  const show = (version: Version) => {
    check(version);
    const log = caught.get(version.material.name);
    ball.visible = !log;
    if (!log) {
      readout.textContent = ['the shader compiled: no log', 'mix() blends orange to blue from the bottom of the ball to the top'].join('\n');
      return;
    }
    const where =
      version.material === patched
        ? `your line sits inside MeshStandardMaterial's shader: line ${log.line} of ${log.total}`
        : `it's line ${version.yourLineNumber} of your fragmentShader: three.js put ${log.line - version.yourLineNumber} lines before it`;
    readout.textContent = [log.message, `> ${log.line}: ${version.yourLine}`, where, "the material doesn't draw; the rest of the scene does"].join('\n');
  };
  choiceButtons(
    overlay(container, 'controls'),
    versions.map((version) => ({ html: version.html, select: () => show(version) })),
  );

  onFrame((delta) => (ball.rotation.y += delta * 0.4));
};
