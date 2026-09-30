// Runs drill.ts live: every frame, inFront asks about the viewer's own camera, and lights the mirror
// while it's in front. The see-through ghosts behind the mirror sit where mirrorImage puts each shape.
import { attempt, COLORS, formatVector, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { inFront, mirrorImage } from './drill';

// Three corners, counter-clockwise from the front, and the fourth that completes the mirror.
const A = new THREE.Vector3(-1.4, 0.3, -1);
const B = new THREE.Vector3(1.4, 0.3, -1.3);
const C = new THREE.Vector3(1.4, 2.3, -1.3);
const D = A.clone().add(C).sub(B);

export const mirror: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.5, 2.2, 4.2);
  controls.target.set(0, 1, -0.4);

  const glass = new THREE.MeshStandardMaterial({ color: '#cbd5e1', transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false });
  const pane = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([A, B, C, A, C, D]), glass);
  pane.geometry.computeVertexNormals();
  const frame = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([A, B, C, D]), new THREE.LineBasicMaterial({ color: COLORS.white }));
  scene.add(pane, frame);

  const shapes = [
    { geometry: new THREE.SphereGeometry(0.22, 32, 16), color: COLORS.red, at: new THREE.Vector3(-0.6, 0.6, 0.8) },
    { geometry: new THREE.BoxGeometry(0.4, 0.4, 0.4), color: COLORS.green, at: new THREE.Vector3(0.6, 0.45, 1.3) },
    { geometry: new THREE.ConeGeometry(0.2, 0.5, 24), color: COLORS.blue, at: new THREE.Vector3(0.1, 1.5, 0.2) },
  ].map(({ geometry, color, at }, i) => {
    const solid = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color }));
    const ghost = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.35, depthWrite: false }));
    const link = line(COLORS.gray, 0.35);
    scene.add(solid, ghost, link);
    return { solid, ghost, link, at, phase: i * 2.1 };
  });

  const readout = overlay(container, 'readout');
  onFrame((_, elapsed) => {
    const front = attempt('inFront', () => inFront(A.clone(), B.clone(), C.clone(), camera.position.clone()));
    glass.color.set(front.ok && front.value ? '#e2e8f0' : '#334155');
    glass.opacity = front.ok && front.value ? 0.45 : 0.2;

    let imageNote = '';
    for (const shape of shapes) {
      // A slow drift, so the images have to keep up.
      shape.solid.position.copy(shape.at).add(new THREE.Vector3(Math.sin(elapsed * 0.6 + shape.phase) * 0.4, 0, Math.cos(elapsed * 0.4 + shape.phase) * 0.3));
      const image = attempt('mirrorImage', () => mirrorImage(A.clone(), B.clone(), C.clone(), shape.solid.position.clone()));
      shape.ghost.visible = shape.link.visible = image.ok;
      if (!image.ok) {
        imageNote = image.note;
        continue;
      }
      shape.ghost.position.copy(image.value);
      setLine(shape.link, shape.solid.position, image.value);
      if (shape === shapes[0]) imageNote = `mirrorImage(a, b, c, ball)  ${formatVector(image.value, 2)}`;
    }
    readout.textContent = [
      front.ok ? `inFront(a, b, c, camera)  ${front.value}: ${front.value ? 'draw the mirror' : 'nothing to draw'}` : front.note,
      imageNote,
    ].join('\n');
  });
};
