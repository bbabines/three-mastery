// Scenes for the compose and decompose page. The README places each one with <div data-scene="name">.
import { COLORS, cornerAngle, formatNumber, formatVector, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The sharper of an object's two corner angles in the world: 90° unless it's skewed.
function sharpCorner(matrixWorld: THREE.Matrix4) {
  const angle = cornerAngle(matrixWorld);
  return Math.min(angle, 180 - angle);
}

export const roundTrip: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.3, 2.2, 4.5);
  controls.target.set(0, 1.55, 0);

  // The rack is a backboard behind the panel, so its stretch is easy to see.
  const rack = new THREE.Group();
  rack.position.set(0, 1.3, 0);
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.1, 0.04),
    new THREE.MeshStandardMaterial({ color: COLORS.gray, transparent: true, opacity: 0.4 }),
  );
  board.position.z = -0.1;
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.06), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  rack.add(board, panel);

  // The copy is only an outline, drawn on top so it shows over the panel. It hangs straight from the
  // scene and gets the panel's decomposed parts.
  const copy = new THREE.LineSegments(
    new THREE.EdgesGeometry(panel.geometry),
    new THREE.LineBasicMaterial({ color: COLORS.yellow, depthTest: false }),
  );
  copy.renderOrder = 1;

  const rackTag = label('rack', COLORS.gray);
  rackTag.position.set(0, 0.55, 0);
  const panelTag = label('panel', COLORS.blue);
  panelTag.position.set(-0.9, 2.1, 0);
  const copyTag = label('copy, from decompose', COLORS.yellow);
  copyTag.position.set(0.7, 2.1, 0);
  scene.add(rack, copy, rackTag, panelTag, copyTag);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  let stretch = 1;
  let tilt = 30;
  const corners = [
    new THREE.Vector3(-0.45, -0.3, 0.03),
    new THREE.Vector3(0.45, -0.3, 0.03),
    new THREE.Vector3(0.45, 0.3, 0.03),
    new THREE.Vector3(-0.45, 0.3, 0.03),
  ];
  const onPanel = new THREE.Vector3();
  const onCopy = new THREE.Vector3();

  const update = () => {
    rack.scale.set(stretch, 1, 1);
    panel.rotation.z = THREE.MathUtils.degToRad(tilt);
    panel.updateWorldMatrix(true, false);
    panel.matrixWorld.decompose(copy.position, copy.quaternion, copy.scale);
    copy.updateMatrixWorld();

    // How far the copy's worst corner lands from the panel's matching corner.
    const gap = Math.max(
      ...corners.map((corner) =>
        onPanel.copy(corner).applyMatrix4(panel.matrixWorld).distanceTo(onCopy.copy(corner).applyMatrix4(copy.matrixWorld)),
      ),
    );
    const matches = gap < 1e-4;
    readout.innerHTML = [
      'panel.matrixWorld.decompose(copy.position, copy.quaternion, copy.scale)',
      `<span style="color:${COLORS.yellow}">copy.scale</span>        ${formatVector(copy.scale, 2)}`,
      `<span style="color:${COLORS.blue}">panel's corners</span>   ${formatNumber(sharpCorner(panel.matrixWorld), 0)}°`,
      `<span style="color:${COLORS.yellow}">copy's corners</span>    ${formatNumber(sharpCorner(copy.matrixWorld), 0)}°`,
      matches ? 'The copy matches the panel exactly.' : `Worst corner is off by ${formatNumber(gap)}: the skew was dropped.`,
    ].join('\n');
  };
  slider(sliders, 'Stretch rack', { min: 1, max: 2.5, step: 0.25, value: stretch }, (value) => {
    stretch = value;
    update();
  });
  slider(sliders, 'Tilt panel', { min: 0, max: 90, step: 15, value: tilt }, (value) => {
    tilt = value;
    update();
  });
  update();
};
