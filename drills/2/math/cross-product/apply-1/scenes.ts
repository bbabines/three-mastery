// Runs drill.ts live: the label at each corner of the route is what turnAt says about it.
import { attempt, ball, COLORS, label, LABEL_LIFT, overlay, pointer, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { turnAt } from './drill';

const FLOOR = 0.05; // just above the grid, so the route's lines don't hide in it

export const route: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 4.3, 3.4);
  controls.target.set(0, 0, 0.1);

  const points = [
    new THREE.Vector3(-3, FLOOR, 1),
    new THREE.Vector3(-1.6, FLOOR, -0.6),
    new THREE.Vector3(0.3, FLOOR, 0.6),
    new THREE.Vector3(1.8, FLOOR, -0.5),
    new THREE.Vector3(3, FLOOR, 0.9),
  ];
  const path = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: COLORS.yellow }));
  path.frustumCulled = false; // its points move
  const stops = points.map(() => ball(COLORS.yellow, 1, 0.08));
  const robot = pointer(COLORS.white, 0.6);
  robot.position.copy(points[0]).setY(0.2);
  robot.lookAt(points[1].clone().setY(0.2));
  scene.add(path, robot, ...stops);

  // One label per corner, redrawn when its text changes.
  const tags: (THREE.Sprite | undefined)[] = [];
  const tagText: string[] = [];
  const setTag = (index: number, text: string, color: string) => {
    if (tagText[index] === text) return;
    const old = tags[index];
    if (old) {
      scene.remove(old);
      old.material.map?.dispose();
      old.material.dispose();
    }
    tags[index] = label(text, color);
    tagText[index] = text;
    scene.add(tags[index]);
  };

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  const update = () => {
    path.geometry.setFromPoints(points);
    points.forEach((point, i) => stops[i].position.copy(point));
    const lines: string[] = [];
    for (let i = 1; i < points.length - 1; i++) {
      const result = attempt('turnAt', () => turnAt(points[i - 1].clone(), points[i].clone(), points[i + 1].clone()));
      const text = result.ok ? result.value : '?';
      const color = text === 'left' ? COLORS.green : text === 'right' ? COLORS.orange : COLORS.gray;
      setTag(i, text, color);
      tags[i]!.position.copy(points[i]).add(LABEL_LIFT);
      lines.push(result.ok ? `turnAt(p${i - 1}, p${i}, p${i + 1})  ${result.value}` : result.note);
    }
    readout.textContent = [...new Set(lines)].join('\n');
  };

  slider(bar, 'corner across', { min: -0.9, max: 1.3, step: 0.05, value: points[2].x }, (value) => {
    points[2].x = value;
    update();
  });
  slider(bar, 'corner deep', { min: -1.4, max: 1.6, step: 0.05, value: points[2].z }, (value) => {
    points[2].z = value;
    update();
  });
  update();
};
