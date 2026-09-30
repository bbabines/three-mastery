// Runs drill.ts live: the panel turns red when isFlatPanel flags it. The slider bends corner d off
// the surface through the other three, either way.
import { attempt, ball, COLORS, formatNumber, label, LABEL_LIFT, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { isFlatPanel } from './drill';

const TOLERANCE = 0.02;

export const panel: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(1.2, 2.2, 3.6);
  controls.target.set(0, 1.2, 0);

  const placement = new THREE.Object3D();
  placement.position.set(0, 1.2, 0);
  placement.rotation.set(0.35, 0.5, 0.15);
  placement.updateMatrixWorld();
  const flat = [
    new THREE.Vector3(-0.8, -0.5, 0),
    new THREE.Vector3(0.8, -0.5, 0),
    new THREE.Vector3(0.8, 0.5, 0),
    new THREE.Vector3(-0.8, 0.5, 0),
  ].map((corner) => corner.applyMatrix4(placement.matrixWorld));
  const normal = new THREE.Plane().setFromCoplanarPoints(flat[0], flat[1], flat[2]).normal;

  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshStandardMaterial({ color: COLORS.blue, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false; // corner d moves
  const dots = flat.map(() => ball(COLORS.white, 1, 0.05));
  const tag = label('d', COLORS.white);
  scene.add(mesh, tag, ...dots);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  const update = (bend: number) => {
    const corners = flat.map((corner) => corner.clone());
    corners[3].addScaledVector(normal, bend);
    const [a, b, c, d] = corners;
    geometry.setFromPoints([a, b, c, a, c, d]);
    geometry.computeVertexNormals();
    corners.forEach((corner, i) => dots[i].position.copy(corner));
    tag.position.copy(d).add(LABEL_LIFT);

    const off = new THREE.Plane().setFromCoplanarPoints(a, b, c).distanceToPoint(d);
    const result = attempt('isFlatPanel', () => isFlatPanel(a.clone(), b.clone(), c.clone(), d.clone(), TOLERANCE));
    material.color.set(result.ok && !result.value ? COLORS.red : COLORS.blue);
    readout.textContent = [
      `d off the surface  ${formatNumber(off, 3)}`,
      result.ok ? `isFlatPanel(a, b, c, d, ${TOLERANCE})  ${result.value}` : result.note,
    ].join('\n');
  };

  slider(bar, 'bend', { min: -0.3, max: 0.3, step: 0.005, value: 0 }, update);
  update(0);
};
