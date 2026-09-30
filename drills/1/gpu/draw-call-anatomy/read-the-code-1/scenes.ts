// Scenes for the draw call anatomy page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, glCalls, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The grid and axes are lines: each would add a draw call to every count.
function hideFloorHelpers(scene: THREE.Scene) {
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }
}

// A WebGL command's kind, as the readout names it.
function kindOf(name: string) {
  if (name === 'useProgram' || name === 'bindVertexArray' || name === 'bindTexture' || name.startsWith('draw')) return name;
  return name.startsWith('uniform') ? 'uniforms' : 'state';
}

const ORDER = ['useProgram', 'uniforms', 'bindTexture', 'state', 'bindVertexArray', 'drawElements', 'drawArrays'];

export const anatomy: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 2, 4.3);
  controls.target.set(0, 0.75, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.8, 2);
  const calls = glCalls(renderer);

  const shapes = [
    { name: 'box', mesh: new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75)) },
    { name: 'can', mesh: new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.9, 32)) },
    { name: 'ball', mesh: new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 16)) },
  ];
  shapes.forEach(({ name, mesh }, i) => {
    mesh.position.set((i - 1) * 1.45, 0.7, 0);
    // Marks where this mesh's draw call starts in the list of WebGL commands.
    mesh.onBeforeRender = () => void calls.log.push(`#${name}`);
    scene.add(mesh);
  });

  const colors = [COLORS.orange, COLORS.blue, COLORS.green];
  const shared = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  const each = colors.map((color) => new THREE.MeshStandardMaterial({ color }));
  const types = [
    new THREE.MeshStandardMaterial({ color: colors[0] }),
    new THREE.MeshLambertMaterial({ color: colors[1] }),
    new THREE.MeshPhongMaterial({ color: colors[2] }),
  ];
  let mode = '';
  choiceButtons(overlay(container, 'controls'), [
    { html: 'one shared material', select: () => ((mode = 'one MeshStandardMaterial shared by all three'), shapes.forEach((s) => (s.mesh.material = shared))) },
    { html: 'a material each', select: () => ((mode = 'three MeshStandardMaterials'), shapes.forEach((s, i) => (s.mesh.material = each[i]))) },
    { html: 'three material types', select: () => ((mode = 'Standard, Lambert, and Phong'), shapes.forEach((s, i) => (s.mesh.material = types[i]))) },
  ]);

  const readout = overlay(container, 'readout');
  onFrame((delta) => {
    shapes.forEach(({ mesh }, i) => (mesh.rotation.y += delta * (0.4 + i * 0.25))); // different speeds, different matrices

    // Split last frame's commands at each mesh's marker: each piece is that mesh's draw call.
    const draws: { name: string; counts: Map<string, number> }[] = [];
    for (const entry of calls.log) {
      if (entry.startsWith('#')) {
        draws.push({ name: entry.slice(1), counts: new Map() });
      } else if (draws.length > 0) {
        const counts = draws[draws.length - 1].counts;
        counts.set(kindOf(entry), (counts.get(kindOf(entry)) ?? 0) + 1);
      }
    }
    const lines = draws.map(({ name, counts }) => {
      const parts = ORDER.filter((kind) => counts.has(kind)).map((kind) => {
        const n = counts.get(kind)!;
        if (kind === 'uniforms') return `${n} uniform${n === 1 ? '' : 's'}`;
        if (kind === 'state') return `${n} state setting${n === 1 ? '' : 's'}`;
        return n > 1 ? `${kind} ×${n}` : kind;
      });
      return `${name.padEnd(5)} ${parts.join(' · ')}`;
    });
    readout.textContent = [`${mode}: ${renderer.info.render.calls} draw calls, ${calls.log.length - draws.length} WebGL commands`, ...lines].join('\n');
    calls.reset();
  });
};

const PART_COUNTS = [1, 10, 50, 100, 200, 400];
const PART = 0.18;

export const count: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0, 5.2, 5.6);
  controls.target.set(0, 0, 0.3);
  hideFloorHelpers(scene);
  const sun = sunlight(scene, new THREE.Vector3(3, 8, 2), 0.7, 2.5);
  const calls = glCalls(renderer);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: '#3a3f4a' }),
  );
  floor.receiveShadow = true;
  scene.add(floor);

  const geometry = new THREE.BoxGeometry(PART, PART, PART); // six groups, one per side
  const paint = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  const trim = new THREE.MeshStandardMaterial({ color: COLORS.white });
  const array = [paint, trim, paint, trim, paint, paint];
  const parts = new THREE.Group();
  scene.add(parts);

  let partCount = 100;
  let materialArray = false;
  let shadows = false;
  const rebuild = () => {
    parts.clear();
    const side = Math.ceil(Math.sqrt(partCount));
    for (let i = 0; i < partCount; i++) {
      const part = new THREE.Mesh(geometry, materialArray ? array : paint);
      part.position.set(((i % side) - (side - 1) / 2) * 0.3, PART / 2 + 0.01, (Math.floor(i / side) - (side - 1) / 2) * 0.3);
      part.castShadow = shadows;
      parts.add(part);
    }
    renderer.shadowMap.enabled = shadows;
    sun.castShadow = shadows;
    for (const material of [paint, trim, floor.material]) material.needsUpdate = true; // shadows on or off: rebuild
  };

  const bar = overlay(container, 'controls');
  slider(bar, 'parts', { min: 0, max: PART_COUNTS.length - 1, step: 1, value: PART_COUNTS.indexOf(partCount) }, (value) => {
    partCount = PART_COUNTS[value];
    rebuild();
  });
  choiceButtons(buttonGroup(bar), [
    { html: 'one material', select: () => ((materialArray = false), rebuild()) },
    { html: 'material array (6 groups)', select: () => ((materialArray = true), rebuild()) },
  ]);
  choiceButtons(buttonGroup(bar), [
    { html: 'shadows off', select: () => ((shadows = false), rebuild()) },
    { html: 'shadows on', select: () => ((shadows = true), rebuild()) },
  ]);

  const readout = overlay(container, 'readout');
  const n = (value: number) => value.toLocaleString('en-US');
  // Runs before each render, so both counts are the last frame's.
  onFrame(() => {
    const { render } = renderer.info;
    const { counts } = calls;
    const others = counts.programs + counts.textures + counts.state;
    const total = others + counts.uniforms + counts.buffers + counts.draws;
    readout.textContent = [
      `${partCount} parts × ${materialArray ? 'a material array' : 'one material'}, shadows ${shadows ? 'on' : 'off'}`,
      `renderer.info.render.calls      ${n(render.calls)}`,
      `renderer.info.render.triangles  ${n(render.triangles)}`,
      `WebGL commands last frame       ${n(total)}  (${n(counts.uniforms)} of them uniforms)`,
    ].join('\n');
    calls.reset();
  });
};
