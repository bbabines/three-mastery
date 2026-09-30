// Scenes for the closest-point queries page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatNumber, label, line, outline, overlay, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const f = (n: number) => formatNumber(n, 2);

export const nearestSpot: SceneSetup = ({ scene, camera, controls, container }) => {
  // A little from the side, so the lines back to the triangle show their length.
  camera.position.set(1.3, 2.7, 4.6);
  controls.target.set(-0.4, 1.1, -0.5);

  const triangle = new THREE.Triangle(new THREE.Vector3(-2.6, 0.4, -1.2), new THREE.Vector3(-0.5, 0.4, -1.7), new THREE.Vector3(-1.5, 2.3, -1));
  const panelShape = new THREE.BufferGeometry().setFromPoints([triangle.a, triangle.b, triangle.c]);
  const panel = new THREE.Mesh(panelShape, new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
  const panelEdges = outline(panelShape, COLORS.blue);
  const triangleTag = label('triangle', COLORS.blue);
  triangleTag.position.copy(triangle.a).add(new THREE.Vector3(-0.55, 0.25, 0)); // left of its lower corner, clear of the readout

  // The rail: a Line3, drawn as a thin rod.
  const rail = new THREE.Line3(new THREE.Vector3(0.6, 0.5, -0.9), new THREE.Vector3(2.7, 2, -0.7));
  const railDirection = rail.delta(new THREE.Vector3());
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, rail.distance(), 12), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  rod.position.copy(rail.getCenter(new THREE.Vector3()));
  rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), railDirection.normalize());
  const railTag = label('rail', COLORS.orange);
  railTag.position.copy(rail.end).add(new THREE.Vector3(0, 0.3, 0));

  const p = ball(COLORS.yellow, 1, 0.1);
  const pTag = label('p', COLORS.yellow);
  const toTriangle = line(COLORS.white);
  const toRail = line(COLORS.white);
  const toCorner = line(COLORS.gray, 0.6);
  const onTriangle = ball(COLORS.white, 1, 0.05);
  const onRail = ball(COLORS.white, 1, 0.05);
  scene.add(panel, panelEdges, triangleTag, rod, railTag, p, pTag, toTriangle, toRail, toCorner, onTriangle, onRail);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const at = { x: -1.2, y: 0.9 }; // in front of the triangle's face
  const spot = new THREE.Vector3();
  const railSpot = new THREE.Vector3();
  const weights = new THREE.Vector3();

  const update = () => {
    p.position.set(at.x, at.y, 0.4);
    pTag.position.copy(p.position).add(new THREE.Vector3(0, 0.3, 0));

    triangle.closestPointToPoint(p.position, spot);
    triangle.getBarycoord(spot, weights);
    const zeros = [weights.x, weights.y, weights.z].filter((w) => w < 1e-4).length;
    const where = zeros === 0 ? 'on the face' : zeros === 1 ? 'on an edge' : 'at a corner';
    const corners = [triangle.a, triangle.b, triangle.c];
    const corner = corners.reduce((best, c) => (c.distanceTo(p.position) < best.distanceTo(p.position) ? c : best));
    rail.closestPointToPoint(p.position, true, railSpot);
    const along = rail.closestPointToPointParameter(p.position, true);

    setLine(toTriangle, p.position, spot);
    setLine(toRail, p.position, railSpot);
    setLine(toCorner, p.position, corner);
    onTriangle.position.copy(spot);
    onRail.position.copy(railSpot);
    readout.textContent = [
      `triangle.closestPointToPoint(p, spot) → ${f(spot.distanceTo(p.position))} away, ${where}`,
      `the triangle's nearest corner → ${f(corner.distanceTo(p.position))} away`,
      `rail.closestPointToPoint(p, true, spot) → ${f(railSpot.distanceTo(p.position))} away, ${
        along <= 0 ? 'at its start' : along >= 1 ? 'at its end' : 'partway along'
      }`,
    ].join('\n');
  };
  slider(sliders, 'move p across', { min: -3.5, max: 3.5, step: 0.1, value: at.x }, (value) => {
    at.x = value;
    update();
  });
  slider(sliders, 'move p up', { min: 0.2, max: 2.6, step: 0.1, value: at.y }, (value) => {
    at.y = value;
    update();
  });
  update();
};
