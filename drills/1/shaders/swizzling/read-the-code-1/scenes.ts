// Scenes for the swizzling page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const DISTANCES = [
  {
    html: '<code>length(vWorldPos.xz)</code>',
    expression: 'length(vWorldPos.xz)',
    lines: ['float d = length(vWorldPos.xz);   x and z: distance along the floor', 'height is left out: each pillar keeps one color, bottom to top'],
    measure: (p: THREE.Vector3) => new THREE.Vector3(p.x, 0, p.z).length(),
  },
  {
    html: '<code>length(vWorldPos)</code>',
    expression: 'length(vWorldPos)',
    lines: ['float d = length(vWorldPos);      straight-line distance', 'height counts too: the rings curve up over the pillars'],
    measure: (p: THREE.Vector3) => p.length(),
  },
  {
    html: '<code>length(vWorldPos.xy)</code>',
    expression: 'length(vWorldPos.xy)',
    lines: ['float d = length(vWorldPos.xy);   x and y: across a wall, not the floor', 'the wrong pair for a Y-up world: height counts, z is left out'],
    measure: (p: THREE.Vector3) => new THREE.Vector3(p.x, p.y, 0).length(),
  },
];

const ringMaterial = (expression: string) =>
  new THREE.ShaderMaterial({
    uniforms: {
      uColorA: { value: new THREE.Color(COLORS.orange) },
      uColorB: { value: new THREE.Color(COLORS.blue) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPos, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      void main() {
        float d = ${expression};
        vec3 color = mix(uColorA, uColorB, step(0.5, fract(d * 1.25)));
        float shade = 0.55 + 0.45 * max(dot(normalize(vWorldNormal), normalize(vec3(0.5, 1.0, 0.3))), 0.0);
        gl_FragColor = vec4(color * shade, 1.0);
        #include <colorspace_fragment>
      }`,
  });

export const floor: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(5.2, 5.4, 7.2);
  controls.target.set(0, 0.6, -0.4);

  const materials = DISTANCES.map((version) => ringMaterial(version.expression));
  const meshes: THREE.Mesh[] = [];

  // A disc on the floor, just above the grid, and pillars of different heights around the center.
  const disc = new THREE.Mesh(new THREE.CircleGeometry(3.8, 96).rotateX(-Math.PI / 2), materials[0]);
  disc.position.y = 0.05;
  meshes.push(disc);
  const COUNT = 11;
  for (let i = 0; i < COUNT; i++) {
    const height = 1 + (i % 4) * 0.5;
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.28, height, 0.28), materials[0]);
    const angle = THREE.MathUtils.degToRad(i * 137.5);
    const radius = 0.9 + i * 0.26;
    pillar.position.set(Math.cos(angle) * radius, height / 2 + 0.05, Math.sin(angle) * radius);
    meshes.push(pillar);
  }
  scene.add(...meshes);

  // The tallest pillar gets a tag, and the readout follows it from bottom to top.
  const tagged = meshes[4];
  const height = (tagged.geometry as THREE.BoxGeometry).parameters.height;
  const bottom = new THREE.Vector3(tagged.position.x, 0.05, tagged.position.z);
  const top = new THREE.Vector3(tagged.position.x, 0.05 + height, tagged.position.z);
  const tag = label('this pillar', COLORS.white);
  tag.position.copy(top).add(new THREE.Vector3(0, 0.3, 0));
  scene.add(tag);

  const readout = overlay(container, 'readout');
  choiceButtons(
    overlay(container, 'controls'),
    DISTANCES.map((version, i) => ({
      html: version.html,
      select: () => {
        for (const mesh of meshes) mesh.material = materials[i];
        readout.textContent = [
          ...version.lines,
          `this pillar:  d at its foot ${formatNumber(version.measure(bottom))}   d at its top ${formatNumber(version.measure(top))}`,
        ].join('\n');
      },
    })),
  );
};
