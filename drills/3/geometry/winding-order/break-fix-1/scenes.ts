import { attempt, choiceButtons, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { flipFrontFace } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.3, 4.5);
  controls.target.set(0, 1.1, 0);
  const readout = overlay(container, 'readout');
  const source = new THREE.BufferGeometry();
  source.setAttribute('position', new THREE.Float32BufferAttribute([-0.6, -0.5, 0, 0.6, -0.5, 0, -0.1, 0.65, 0], 3));
  source.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2));
  source.setIndex([0, 1, 2]);
  source.computeVertexNormals();
  const result = attempt('flipFrontFace', () => flipFrontFace(source));
  if (!result.ok) { readout.textContent = result.note; return; }

  const reference = source.clone();
  reference.setIndex([0, 2, 1]);
  reference.computeVertexNormals();
  const makePanel = (geometry: THREE.BufferGeometry, x: number, color: THREE.ColorRepresentation) => {
    const panel = new THREE.Group();
    panel.position.set(x, 1.15, 0);
    panel.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, side: THREE.FrontSide })));
    const border = new THREE.LineSegments(new THREE.EdgesGeometry(source), new THREE.LineBasicMaterial({ color: COLORS.yellow, depthTest: false }));
    panel.add(border);
    scene.add(panel);
    return panel;
  };
  const yours = makePanel(result.value, -1, COLORS.blue);
  const target = makePanel(reference, 1, COLORS.green);
  const controlsBar = overlay(container, 'controls');
  choiceButtons(controlsBar, [
    { html: 'front', select: () => { yours.rotation.y = target.rotation.y = 0; readout.textContent = 'left: your face; right: reference\nfront: both triangles should be hidden'; } },
    { html: 'back', select: () => { yours.rotation.y = target.rotation.y = Math.PI; readout.textContent = 'left: your face; right: reference\nback: both triangles should be visible'; } },
  ]);
};
