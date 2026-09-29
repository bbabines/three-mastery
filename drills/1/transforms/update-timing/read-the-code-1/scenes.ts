// Scenes for the update timing page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, label, LABEL_LIFT, line, outline, overlay, pointer, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const solid = (color: string) => new THREE.MeshStandardMaterial({ color });

// The x the saved matrixWorld puts an object at, as the last refresh left it.
const savedX = (object: THREE.Object3D) => new THREE.Vector3().setFromMatrixPosition(object.matrixWorld).x;

const BEAM_START = new THREE.Vector3(0, 0.5, 1.5);
const BEAM_END = new THREE.Vector3(0, 0.5, -3);
const BOX_SIZE = 0.8;

export const raycastAfterMove: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.1, 2.95, 4.85);
  controls.target.set(0.1, 0.5, -0.6);

  const raycaster = new THREE.Raycaster(BEAM_START, BEAM_END.clone().sub(BEAM_START).normalize());
  const scanner = pointer(COLORS.red, 0.7);
  scanner.position.copy(BEAM_START);
  scanner.lookAt(BEAM_END);
  const scannerTag = label('scanner', COLORS.red);
  scannerTag.position.copy(BEAM_START).add(LABEL_LIFT);
  const beam = line(COLORS.red);

  // A track for the box to slide along, just above the floor grid.
  const track = new THREE.Mesh(new THREE.BoxGeometry(5, 0.02, 1.1), solid(COLORS.gray));
  track.position.set(0, 0.06, -0.5);

  const geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
  const box = new THREE.Mesh(geometry, solid(COLORS.yellow));
  box.position.set(-1.5, 0.55, -0.5);
  // Where the raycast thought the box was: the spot its saved matrixWorld held at that moment.
  const tested = outline(geometry, COLORS.gray);
  const testedTag = label('raycast tested', COLORS.gray);
  const hitMark = ball(COLORS.white, 1, 0.07);
  scene.add(scanner, scannerTag, beam, track, box, tested, testedTag, hitMark);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let refreshFirst = false;

  const reset = () => {
    setLine(beam, BEAM_START, BEAM_END);
    tested.visible = testedTag.visible = hitMark.visible = false;
    readout.textContent = 'Move the box with the slider.';
  };

  const test = (x: number) => {
    box.position.x = x;
    if (refreshFirst) box.updateMatrixWorld();
    const hits = raycaster.intersectObject(box);
    const testedX = savedX(box); // what the raycast just used
    const stale = Math.abs(testedX - x) > 1e-6;

    tested.position.set(testedX, box.position.y, box.position.z);
    testedTag.position.copy(tested.position).add(new THREE.Vector3(0, 0.75, 0));
    tested.visible = testedTag.visible = stale;
    hitMark.visible = hits.length > 0;
    if (hits.length > 0) hitMark.position.copy(hits[0].point);
    setLine(beam, BEAM_START, hits.length > 0 ? hits[0].point : BEAM_END);

    const inBeam = Math.abs(x) < BOX_SIZE / 2;
    const result =
      hits.length > 0
        ? inBeam
          ? 'hit'
          : 'hit, but the box has left the beam'
        : inBeam
          ? 'miss, but the box is in the beam'
          : 'miss';
    const where = `tested the box at x = ${formatNumber(testedX)}${stale ? ', where it was last drawn' : ''}`;
    readout.textContent = [
      `box.position.x = ${formatNumber(x)}`,
      ...(refreshFirst ? ['box.updateMatrixWorld()'] : []),
      'const hits = raycaster.intersectObject(box)',
      `→ ${result}`,
      `  ${where}`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>raycaster.intersectObject(box)</code> right away',
      select: () => {
        refreshFirst = false;
        reset();
      },
    },
    {
      html: '<code>box.updateMatrixWorld()</code> first',
      select: () => {
        refreshFirst = true;
        reset();
      },
    },
  ]);
  slider(controlsBar, 'Move box', { min: -2, max: 2, step: 0.5, value: box.position.x }, test);
};

// A simple rack: two side panels and three shelves, with its origin at its center.
function buildRack() {
  const rack = new THREE.Group();
  const material = solid(COLORS.blue);
  for (const x of [-0.42, 0.42]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 0.5), material);
    side.position.x = x;
    rack.add(side);
  }
  for (const y of [-0.6, -0.05, 0.5]) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.5), material);
    plank.position.y = y;
    rack.add(plank);
  }
  return rack;
}

export const autoUpdate: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.05, 2.55, 4.3);
  controls.target.set(0.25, 1, -0.65);

  const rack = buildRack();
  rack.position.set(-1, 0.72, -0.5); // its lowest shelf clears the floor grid
  const rackTag = label('drawn here', COLORS.blue);
  // Where rack.position says the rack is, shown when that's not where it's drawn.
  const said = outline(new THREE.BoxGeometry(0.9, 1.3, 0.5), COLORS.gray);
  const saidTag = label('rack.position', COLORS.gray);
  scene.add(rack, rackTag, said, saidTag);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const drawn = new THREE.Vector3();

  choiceButtons(controlsBar, [
    { html: '<code>rack.matrixAutoUpdate = true</code>', select: () => (rack.matrixAutoUpdate = true) },
    { html: '<code>rack.matrixAutoUpdate = false</code>', select: () => (rack.matrixAutoUpdate = false) },
  ]);
  slider(controlsBar, 'Move rack', { min: -2, max: 2, step: 0.5, value: rack.position.x }, (value) => {
    rack.position.x = value;
  });
  const rebuild = document.createElement('button');
  rebuild.innerHTML = '<code>rack.updateMatrix()</code>';
  rebuild.addEventListener('click', () => rack.updateMatrix());
  controlsBar.append(rebuild);

  // Runs before each render, so matrixWorld here is where the last render drew the rack.
  onFrame(() => {
    drawn.setFromMatrixPosition(rack.matrixWorld);
    const matches = Math.abs(drawn.x - rack.position.x) < 1e-6;
    rackTag.position.copy(drawn).add(new THREE.Vector3(0, 0.95, 0));
    said.position.copy(rack.position);
    saidTag.position.copy(rack.position).add(new THREE.Vector3(0, 1.3, 0)); // above the other tag
    said.visible = saidTag.visible = !matches;

    readout.textContent = [
      `rack.matrixAutoUpdate = ${rack.matrixAutoUpdate}`,
      `rack.position.x   ${formatNumber(rack.position.x)}`,
      `drawn at x        ${formatNumber(drawn.x).padEnd(6)}${
        matches ? 'matches position' : 'matrix not rebuilt: press rack.updateMatrix()'
      }`,
    ].join('\n');
  });
};
