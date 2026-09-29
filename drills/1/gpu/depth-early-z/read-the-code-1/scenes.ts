// Scenes for the depth buffer and early-z page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The grid and axes are lines: they'd add draw calls, and light, to what these scenes count.
function hideFloorHelpers(scene: THREE.Scene) {
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }
}

const PANEL_COLORS = [COLORS.orange, COLORS.yellow, COLORS.green, COLORS.blue, COLORS.purple];

export const layers: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(1.2, 1.8, 4);
  controls.target.set(0.3, 1.3, -1);
  hideFloorHelpers(scene);

  // Five panels, front (0) to back (4), overlapping in the middle.
  const geometry = new THREE.PlaneGeometry(2.2, 1.4);
  const normal = PANEL_COLORS.map((color) => new THREE.MeshStandardMaterial({ color }));
  // Each fragment that passes the depth test adds this much light, so brightness counts the writes.
  const overdraw = new THREE.MeshBasicMaterial({ color: '#5c2c10', blending: THREE.AdditiveBlending });
  const panels = PANEL_COLORS.map((_, i) => {
    const panel = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(geometry, normal[i]);
    panel.position.set(-0.3 + i * 0.3, 1.1 + i * 0.1, 1 - i * 0.5);
    scene.add(panel);
    return panel;
  });

  let frontToBack = true;
  let overdrawView = false;
  const apply = () => {
    // renderOrder forces the order here; three.js draws opaque objects front to back by itself.
    panels.forEach((panel, i) => {
      panel.renderOrder = frontToBack ? i : panels.length - 1 - i;
      panel.material = overdrawView ? overdraw : normal[i];
    });
  };
  const bar = overlay(container, 'controls');
  choiceButtons(buttonGroup(bar), [
    { html: 'front to back', select: () => ((frontToBack = true), apply()) },
    { html: 'back to front', select: () => ((frontToBack = false), apply()) },
  ]);
  choiceButtons(buttonGroup(bar), [
    { html: 'normal view', select: () => ((overdrawView = false), apply()) },
    { html: 'overdraw view', select: () => ((overdrawView = true), apply()) },
  ]);

  const readout = overlay(container, 'readout');
  // Runs before each render, so the count is from the frame just drawn.
  onFrame(() => {
    readout.textContent = [
      `draw order: ${frontToBack ? 'front to back, as three.js sorts solid objects' : 'back to front'}`,
      `renderer.info.render.calls  ${renderer.info.render.calls}   (all five panels are drawn either way)`,
      frontToBack
        ? 'where all five overlap: 1 fragment written, 4 rejected by the depth test'
        : 'where all five overlap: 5 fragments written, each shaded and then covered',
      overdrawView ? 'overdraw view: each fragment that passes the depth test adds light' : 'normal view: the picture is the same either way',
    ].join('\n');
  });
};

export const hidden: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.6, 1.6, 5.6);
  controls.target.set(0, 1.0, -0.4);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 5, 4), 0.8, 2);

  // Shelves full of bins, standing behind a wall.
  const steel = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  const binMaterial = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  const binGeometry = new THREE.BoxGeometry(0.34, 0.26, 0.3);
  let binsDrawn = 0;
  let binsLastFrame = 0;
  const bins: THREE.Mesh[] = [];
  for (const z of [-0.2, -1.2]) {
    for (const y of [0.3, 0.9, 1.5]) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 0.5), steel);
      plank.position.set(0, y - 0.15, z);
      scene.add(plank);
      for (let i = 0; i < 10; i++) {
        const bin = new THREE.Mesh(binGeometry, binMaterial);
        bin.position.set(-1.62 + i * 0.36, y, z);
        bin.onBeforeRender = () => void (binsDrawn += 1);
        bins.push(bin);
        scene.add(bin);
      }
    }
  }
  const wall = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.6, 0.12), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  wall.position.set(0, 1.35, 0.9); // its foot just above the floor grid
  scene.add(wall);

  choiceButtons(overlay(container, 'controls'), [
    { html: 'wall up', select: () => (wall.visible = true) },
    { html: 'no wall', select: () => (wall.visible = false) },
  ]);

  const readout = overlay(container, 'readout');
  // Runs before each render, so the counts are from the frame just drawn.
  onFrame(() => {
    binsLastFrame = binsDrawn;
    binsDrawn = 0;
    const { calls, triangles } = renderer.info.render;
    readout.textContent = [
      wall.visible ? 'wall.visible = true: every bin is hidden from the camera' : 'wall.visible = false: the bins are in plain sight',
      `bins drawn last frame           ${binsLastFrame} of ${bins.length}`,
      `renderer.info.render.calls      ${calls}`,
      `renderer.info.render.triangles  ${triangles.toLocaleString('en-US')}`,
    ].join('\n');
  });
};
