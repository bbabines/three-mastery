// Scenes for the blending and transparency page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, label, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// A pane with its color stored per vertex, so three panes merged into one mesh keep their colors.
function pane(color: string, x: number, z: number) {
  const geometry = new THREE.PlaneGeometry(1.5, 1.1);
  const rgb = new THREE.Color(color);
  const colors = new Float32Array(geometry.attributes.position.count * 3).map((_, i) => rgb.toArray()[i % 3]);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.translate(x, 1.05, z);
  return geometry;
}

export const panes: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.5, 1.55, 2.9);
  controls.target.set(0, 1.15, 0);

  // Stored back pane first: C (z = −0.8), then B, then A (z = 0.8).
  const shapes = [
    { name: 'C', geometry: pane(COLORS.blue, 0.45, -0.8) },
    { name: 'B', geometry: pane(COLORS.green, 0, 0) },
    { name: 'A', geometry: pane(COLORS.red, -0.45, 0.8) },
  ];
  const glass = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  let drawing: string[] = [];
  let drawn: string[] = [];
  const separate = shapes.map(({ name, geometry }) => {
    // Each pane as its own mesh, positioned at its center so three.js sorts it by that center.
    const center = new THREE.Vector3();
    geometry.computeBoundingBox();
    geometry.boundingBox!.getCenter(center);
    const mesh = new THREE.Mesh(geometry.clone().translate(-center.x, -center.y, -center.z), glass);
    mesh.position.copy(center);
    mesh.onBeforeRender = () => void (drawing.includes(name) || drawing.push(name)); // DoubleSide draws twice
    const tag = label(name, COLORS.white);
    tag.position.copy(center).add(new THREE.Vector3(0, 0.75, 0));
    scene.add(tag);
    return mesh;
  });
  const merged = new THREE.Mesh(mergeGeometries(shapes.map((shape) => shape.geometry)), glass);
  scene.add(...separate, merged);

  let mergedOn = false;
  choiceButtons(overlay(container, 'controls'), [
    { html: 'three meshes', select: () => ((mergedOn = false), separate.forEach((m) => (m.visible = true)), (merged.visible = false)) },
    { html: 'one merged mesh', select: () => ((mergedOn = true), separate.forEach((m) => (m.visible = false)), (merged.visible = true)) },
  ]);

  const readout = overlay(container, 'readout');
  // Runs before each render, so `drawing` holds the frame just drawn.
  onFrame(() => {
    drawn = drawing.length > 0 ? drawing : drawn;
    drawing = [];
    const fromFront = camera.position.z > 0;
    readout.textContent = mergedOn
      ? [
          'one merged mesh: one draw, its triangles in stored order: C, B, A',
          `seen from the ${fromFront ? 'front' : 'back'}, that's ${fromFront ? 'back to front: right' : 'front to back: wrong'}`,
          fromFront ? 'orbit around to the back' : 'C is drawn first, writes its depth, and hides B and A where they overlap',
        ].join('\n')
      : [
          'three meshes: sorted by center, back to front, every frame',
          `draw order last frame: ${drawn.join(', ')}   (seen from the ${fromFront ? 'front' : 'back'})`,
          'right from both sides',
        ].join('\n');
  });
};

export const glassCase: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.7, 1.75, 3.3);
  controls.target.set(0, 0.95, 0);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.9, 2);

  // Created first, so it wins the tie: the case and the bottle share one center.
  const caseMaterial = new THREE.MeshStandardMaterial({ color: COLORS.white, transparent: true, opacity: 0.25 });
  const glassCase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 1.1), caseMaterial);
  glassCase.position.set(0, 0.85, 0);
  const bottle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.8, 32),
    new THREE.MeshStandardMaterial({ color: COLORS.green, transparent: true, opacity: 0.7 }),
  );
  bottle.position.copy(glassCase.position);
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.16, 1.3), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  pedestal.position.set(0, 0.13, 0); // just above the floor grid
  scene.add(glassCase, bottle, pedestal);

  const readout = overlay(container, 'readout');
  const show = (depthWrite: boolean) => {
    caseMaterial.depthWrite = depthWrite;
    readout.textContent = [
      `glassCase.material.depthWrite = ${depthWrite}${depthWrite ? '   // three.js\'s default, transparent or not' : ''}`,
      'transparent list, back to front: case, bottle   (same center: the one created first goes first)',
      depthWrite
        ? "the case's front writes its depth, so the bottle behind it fails the depth test"
        : "the case writes no depth, so the bottle is drawn and blended over it",
    ].join('\n');
  };
  choiceButtons(overlay(container, 'controls'), [
    { html: '<code>depthWrite = true</code>', select: () => show(true) },
    { html: '<code>depthWrite = false</code>', select: () => show(false) },
  ]);
};
