import { attempt, COLORS, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { comparison } from '../../compare';
import { triangleVertices } from './drill';

export const demo: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3, 5); controls.target.set(0, 0.8, 0);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const position = geometry.getAttribute('position');
  const outline = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: COLORS.green }));
  outline.position.y = 1; outline.rotation.x = -0.4; scene.add(outline);
  const controlsBar = overlay(container, 'controls');
  const show = comparison(container, 'Read the corners of a chosen triangle');
  let triangle = 1;
  const update = () => {
    const ids = [0, 1, 2].map(i => geometry.index!.getX(3 * triangle + i));
    const expected = ids.map(i => new THREE.Vector3().fromBufferAttribute(position, i));
    outline.geometry.setFromPoints(expected);
    const result = attempt('triangleVertices', () => triangleVertices(geometry, triangle));
    show(`triangle ${triangle} · index IDs ${ids.join(', ')}`,
      result.ok ? result.value.map(v => `(${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)})`).join(' ') : result.note,
      expected.map(v => `(${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)})`).join(' '));
  };
  slider(controlsBar, 'triangle', { min: 0, max: 1, step: 1, value: triangle }, value => { triangle = value; update(); });
  update();
};
