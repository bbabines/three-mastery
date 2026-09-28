// Scenes for the cross product page. The README places each one with <div data-scene="name">.
import { arrow, choiceButtons, COLORS, formatNumber, formatVector, label, overlay, setArrow, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const perpendicular: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3, 3.5, 4);
  controls.target.set(0.5, 0.6, -0.5);

  const origin = new THREE.Vector3();
  const a = new THREE.Vector3(1.5, 0, 0);
  const b = new THREE.Vector3();
  const result = new THREE.Vector3();
  let swapped = false;
  let degrees = 90;

  const aArrow = arrow(COLORS.red);
  setArrow(aArrow, origin, a);
  const aTag = label('a', COLORS.red);
  aTag.position.set(1.7, 0.1, 0);
  const bArrow = arrow(COLORS.green);
  const bTag = label('b', COLORS.green);
  const resultArrow = arrow(COLORS.purple);
  const resultTag = label('result', COLORS.purple);

  // The parallelogram a and b form; its area is the result's length.
  const areaGeometry = new THREE.BufferGeometry();
  areaGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
  areaGeometry.setIndex([0, 1, 2, 0, 2, 3]);
  const area = new THREE.Mesh(
    areaGeometry,
    new THREE.MeshBasicMaterial({ color: COLORS.purple, transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
  );
  area.frustumCulled = false;
  scene.add(aArrow, aTag, bArrow, bTag, resultArrow, resultTag, area);

  const readout = overlay(container, 'readout');
  const controlsPanel = overlay(container, 'controls');

  const update = () => {
    const radians = THREE.MathUtils.degToRad(degrees);
    b.set(Math.cos(radians), 0, -Math.sin(radians)).multiplyScalar(1.5);
    setArrow(bArrow, origin, b);
    bTag.position.copy(b).multiplyScalar(1.15).setY(0.1);

    if (swapped) result.crossVectors(b, a);
    else result.crossVectors(a, b);
    setArrow(resultArrow, origin, result);
    resultTag.position.copy(result).setY(result.y + (result.y >= 0 ? 0.3 : -0.3));
    resultTag.visible = result.lengthSq() > 1e-6;

    const corners = [origin, a, a.clone().add(b), b];
    const positions = areaGeometry.getAttribute('position') as THREE.BufferAttribute;
    corners.forEach((corner, i) => positions.setXYZ(i, corner.x, 0.01, corner.z));
    positions.needsUpdate = true;

    readout.textContent = [
      `${swapped ? 'b.clone().cross(a)' : 'a.clone().cross(b)'}  ${formatVector(result)}`,
      `length ${formatNumber(result.length())}: the shaded area`,
      result.lengthSq() < 1e-6 ? 'a and b line up: no area, no single direction at right angles' : '',
    ].join('\n');
  };

  slider(controlsPanel, 'turn b', { min: 0, max: 360, step: 5, value: degrees }, (value) => {
    degrees = value;
    update();
  });
  choiceButtons(controlsPanel, [
    { html: '<code>a.cross(b)</code>', select: () => { swapped = false; update(); } },
    { html: '<code>b.cross(a)</code>', select: () => { swapped = true; update(); } },
  ]);
};

export const triangleNormal: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.5, 3, 5);
  controls.target.set(0.3, 0.8, 0.3);

  const a = new THREE.Vector3(-1, 0.2, 1);
  const b = new THREE.Vector3(1.5, 0.2, 1);
  const c = new THREE.Vector3(0, 1.7, -1);
  const ab = b.clone().sub(a);
  const ac = c.clone().sub(a);
  const center = a.clone().add(b).add(c).divideScalar(3);

  const triangle = new THREE.Mesh(
    new THREE.BufferGeometry().setFromPoints([a, b, c]),
    new THREE.MeshBasicMaterial({ color: COLORS.white, transparent: true, opacity: 0.2, side: THREE.DoubleSide }),
  );
  const abArrow = arrow(COLORS.red);
  setArrow(abArrow, a, ab);
  const acArrow = arrow(COLORS.green);
  setArrow(acArrow, a, ac);
  const normalArrow = arrow(COLORS.purple);
  scene.add(triangle, abArrow, acArrow, normalArrow);

  for (const [corner, name] of [[a, 'a'], [b, 'b'], [c, 'c']] as const) {
    const tag = label(name, COLORS.white);
    tag.position.copy(corner).sub(center).multiplyScalar(0.25).add(corner);
    scene.add(tag);
  }
  const abTag = label('b − a', COLORS.red);
  abTag.position.copy(a).addScaledVector(ab, 0.5).add(new THREE.Vector3(0, -0.25, 0.2));
  const acTag = label('c − a', COLORS.green);
  acTag.position.copy(a).addScaledVector(ac, 0.5).add(new THREE.Vector3(-0.45, 0, 0));
  scene.add(abTag, acTag);

  const readout = overlay(container, 'readout');
  const show = (first: THREE.Vector3, second: THREE.Vector3, code: string) => {
    const normal = new THREE.Vector3().crossVectors(first, second).normalize();
    setArrow(normalArrow, center, normal.clone().multiplyScalar(1.2));
    readout.textContent = `${code}.normalize()\nnormal ${formatVector(normal)}`;
  };
  choiceButtons(overlay(container, 'controls'), [
    { html: '<code>crossVectors(b − a, c − a)</code>', select: () => show(ab, ac, 'crossVectors(b − a, c − a)') },
    { html: '<code>crossVectors(c − a, b − a)</code>', select: () => show(ac, ab, 'crossVectors(c − a, b − a)') },
  ]);
};
