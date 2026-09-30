// Runs drill.ts live: the yellow ball and arrow are placed by hotspotInWorld and beamInWorld. The red
// dot and the white beam line ride on the turntable as its children, so they show where the answers
// belong.
import { arrow, attempt, ball, COLORS, formatVector, line, overlay, setArrow, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { beamInWorld, hotspotInWorld } from './drill';

// Measured from the turntable itself.
const HOTSPOT = new THREE.Vector3(0.25, 0.75, 0.46);
const BEAM = new THREE.Vector3(0.4, 0.5, 1).normalize();
const BEAM_LENGTH = 1.3;

export const turntable: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2, 2.1, 3.3);
  controls.target.set(0.3, 0.7, 0);

  const table = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.1, 0.12, 48),
    new THREE.MeshStandardMaterial({ color: COLORS.gray }),
  );
  const product = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  product.position.y = 0.51;
  const dot = ball(COLORS.red, 1, 0.07);
  dot.position.copy(HOTSPOT);
  const guide = line(COLORS.white);
  setLine(guide, HOTSPOT, HOTSPOT.clone().addScaledVector(BEAM, BEAM_LENGTH));
  table.add(product, dot, guide);

  const yourSpot = ball(COLORS.yellow, 1, 0.1);
  const yourBeam = arrow(COLORS.yellow);
  scene.add(table, yourSpot, yourBeam);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const values = { slide: 0.6, turn: 30 };

  const update = () => {
    table.position.set(values.slide, 0.06, 0);
    table.rotation.y = THREE.MathUtils.degToRad(values.turn);
    table.updateMatrixWorld(); // matrixWorld is read straight away, before the next render
    const truthSpot = dot.getWorldPosition(new THREE.Vector3());
    const truthBeam = BEAM.clone().applyQuaternion(table.getWorldQuaternion(new THREE.Quaternion()));

    const spot = attempt('hotspotInWorld', () => hotspotInWorld(HOTSPOT.clone(), table.matrixWorld.clone()));
    yourSpot.visible = spot.ok;
    if (spot.ok) yourSpot.position.copy(spot.value);

    const beam = attempt('beamInWorld', () => beamInWorld(BEAM.clone(), table.matrixWorld.clone()));
    if (beam.ok) setArrow(yourBeam, spot.ok ? spot.value : truthSpot, beam.value.clone().multiplyScalar(BEAM_LENGTH));
    else yourBeam.visible = false;

    const spotVerdict = spot.ok && spot.value.distanceTo(truthSpot) < 1e-3 ? 'on the red dot' : 'off the red dot';
    const beamVerdict = beam.ok && beam.value.distanceTo(truthBeam) < 1e-3 ? 'along the beam' : 'off the beam';
    readout.textContent = [
      spot.ok ? `hotspotInWorld  ${formatVector(spot.value, 2)}  ${spotVerdict}` : spot.note,
      beam.ok ? `beamInWorld     ${formatVector(beam.value, 2)}  ${beamVerdict}` : beam.note,
    ].join('\n');
  };

  slider(bar, 'slide', { min: -1.5, max: 1.5, step: 0.1, value: values.slide }, (value) => {
    values.slide = value;
    update();
  });
  slider(bar, 'turn', { min: 0, max: 360, step: 5, value: values.turn }, (value) => {
    values.turn = value;
    update();
  });
  update();
};
