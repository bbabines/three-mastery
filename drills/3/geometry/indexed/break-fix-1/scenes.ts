import { attempt, choiceButtons, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { triangleAt } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(2.5, 3, 5);
  controls.target.set(0, 1.3, 0);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    -1, 1, 0, 1, 1, 0, 1, 2.4, 0, -1, 2.4, 0,
    2, 1.2, 0, 2.5, 2.2, 0,
  ], 3));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.computeVertexNormals();
  scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: COLORS.gray, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })));
  const outline = (color: string) => {
    const shape = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color, depthTest: false }));
    shape.frustumCulled = false;
    scene.add(shape);
    return shape;
  };
  const yours = outline(COLORS.blue);
  const reference = outline(COLORS.yellow);
  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const position = geometry.getAttribute('position');

  const update = (triangle: number) => {
    const result = attempt('triangleAt', () => triangleAt(geometry, triangle));
    const expected = [0, 1, 2].map((corner) => new THREE.Vector3().fromBufferAttribute(position, geometry.index!.getX(3 * triangle + corner)));
    reference.geometry.setFromPoints(expected);
    yours.visible = result.ok;
    if (!result.ok) { readout.textContent = result.note; return; }
    yours.geometry.setFromPoints(result.value);
    readout.textContent = `triangle ${triangle} · blue: your outline · yellow: reference\nindices: ${[0, 1, 2].map(corner => geometry.index!.getX(3 * triangle + corner)).join(', ')}`;
  };
  choiceButtons(controlsBar, [
    { html: 'second face', select: () => update(1) },
    { html: 'first face', select: () => update(0) },
  ]);
};
