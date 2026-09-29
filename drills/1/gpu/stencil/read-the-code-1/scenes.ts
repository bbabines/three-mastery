// Scenes for the stencil buffer page. The README places each one with <div data-scene="name">.
// The harness creates every renderer with { stencil: true }; without it these settings do nothing.
import { choiceButtons, COLORS, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const outline: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.9, 1.7, 3.4);
  controls.target.set(0.35, 1.1, 0);
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false; // not part of the count
  }
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.8, 2);

  // The selected part, a capsule standing up, and an unselected box beside it.
  const part = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 0.8, 8, 32), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  part.position.set(0, 1, 0);
  const other = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  other.position.set(1.1, 0.4, -0.3);
  // The rim: a slightly bigger copy of the part in the outline color, drawn after it.
  const rim = new THREE.Mesh(part.geometry, new THREE.MeshBasicMaterial({ color: COLORS.yellow }));
  rim.position.copy(part.position);
  rim.scale.setScalar(1.08);
  rim.renderOrder = 1;
  scene.add(part, other, rim);

  const partMaterial = part.material;
  const rimMaterial = rim.material;
  const versions = [
    {
      html: 'no outline',
      lines: ['rim.visible = false'],
      apply: () => (rim.visible = false),
    },
    {
      html: 'bigger copy, no stencil',
      lines: ['rim.scale.setScalar(1.08)   // and no stencil settings anywhere'],
      apply: () => ((rim.visible = true), (partMaterial.stencilWrite = false), (rimMaterial.stencilWrite = false)),
    },
    {
      html: 'bigger copy + stencil',
      lines: [
        'part.material: stencilWrite true, stencilRef 1, stencilZPass ReplaceStencilOp',
        'rim.material:  stencilWrite true, stencilRef 1, stencilFunc NotEqualStencilFunc',
      ],
      apply: () => ((rim.visible = true), (partMaterial.stencilWrite = true), (rimMaterial.stencilWrite = true)),
    },
  ];
  partMaterial.stencilRef = 1;
  partMaterial.stencilZPass = THREE.ReplaceStencilOp;
  rimMaterial.stencilRef = 1;
  rimMaterial.stencilFunc = THREE.NotEqualStencilFunc;

  let current = versions[0];
  choiceButtons(
    overlay(container, 'controls'),
    versions.map((version) => ({
      html: version.html,
      select: () => {
        current = version;
        version.apply();
      },
    })),
  );

  const readout = overlay(container, 'readout');
  // Runs before each render, so the count is from the frame just drawn.
  onFrame(() => {
    readout.textContent = [
      ...current.lines,
      `renderer.info.render.calls  ${renderer.info.render.calls}   (no post-processing passes)`,
    ].join('\n');
  });
};
