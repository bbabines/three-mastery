// Scenes for the debug views page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatNumber, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// An 8 × 8 checker drawn in code, so no image file is needed.
function checkerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d')!;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      context.fillStyle = (x + y) % 2 ? '#ffffff' : COLORS.orange;
      context.fillRect(x * 32, y * 32, 32, 32);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// A tank whose normals are flipped on one patch of its side, the way a bad export or a bad edit
// leaves them.
function tankGeometry() {
  const geometry = new THREE.CylinderGeometry(0.55, 0.55, 1.3, 48, 8);
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  for (let i = 0; i < position.count; i++) {
    const angle = Math.atan2(position.getX(i), position.getZ(i)); // 0 faces +Z
    const y = position.getY(i);
    if (Math.abs(normal.getY(i)) < 0.5 && angle > 0.15 && angle < 1.1 && y > -0.35 && y < 0.35) {
      normal.setXYZ(i, -normal.getX(i), -normal.getY(i), -normal.getZ(i));
    }
  }
  return geometry;
}

export const views: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.3, 2.3, 3.2);
  controls.target.set(0.2, 0.6, 0);
  sunlight(scene, new THREE.Vector3(2, 3, 4), 0.6, 2.5);

  const tank = new THREE.Mesh(tankGeometry());
  tank.position.set(-0.3, 0.7, 0);
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7));
  crate.position.set(0.9, 0.36, -0.5);
  const meshes = [tank, crate];
  scene.add(tank, crate);

  const checker = checkerTexture();
  const views = [
    { html: 'lit', line: 'new MeshStandardMaterial({ color })', make: () => new THREE.MeshStandardMaterial({ color: COLORS.orange }) },
    {
      html: 'wireframe',
      line: 'material.wireframe = true',
      make: () => new THREE.MeshStandardMaterial({ color: COLORS.orange, wireframe: true }),
    },
    { html: 'normals', line: 'mesh.material = new MeshNormalMaterial()', make: () => new THREE.MeshNormalMaterial() },
    { html: 'depth', line: 'mesh.material = new MeshDepthMaterial()', make: () => new THREE.MeshDepthMaterial() },
    { html: 'UV checker', line: 'material.map = checker', make: () => new THREE.MeshStandardMaterial({ map: checker }) },
  ].map((view) => ({ ...view, materials: meshes.map(() => view.make()) }));

  const notes: Record<string, string[]> = {
    lit: ['a dark patch on the tank: a shadow, or bad normals?', 'the lit view alone can’t say'],
    wireframe: ['48 slices around, 8 bands up: even triangles', 'the patch is invisible here: the shape itself is fine'],
    normals: ['color = direction measured from the camera; orbit and it changes', 'the patch shows in the colors of a surface facing away'],
    depth: ['white at near, black at far', ''],
    'UV checker': ['squares on the lid, wide rectangles around the side:', 'the side’s UVs stretch each square about 2.7 times wider than tall'],
  };

  let view = views[0];
  const bar = overlay(container, 'controls');
  choiceButtons(
    buttonGroup(bar),
    views.map((item) => ({
      html: item.html,
      select: () => {
        view = item;
        meshes.forEach((mesh, i) => (mesh.material = item.materials[i]));
      },
    })),
  );
  slider(bar, 'camera.near', { min: 0.1, max: 2.5, step: 0.1, value: camera.near }, (value) => {
    camera.near = value;
    camera.updateProjectionMatrix();
  });

  const readout = overlay(container, 'readout');
  onFrame(() => {
    const [first, second] = notes[view.html];
    readout.textContent = [
      view.line,
      first,
      view.html === 'depth' ? `camera.near = ${formatNumber(camera.near, 1)}, far = ${camera.far}: raise near to spread the shades` : second,
    ]
      .filter(Boolean)
      .join('\n');
  });
};
