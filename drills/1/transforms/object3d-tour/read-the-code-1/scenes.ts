// Scenes for the Object3D API tour. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const members: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.9, 2.1, 5.2);
  controls.target.set(0.8, 0.5, 0);

  // A small rack: two posts, a top bar, a shelf, and a yellow sign on its +Z side so turns show.
  const rack = new THREE.Group();
  const frameMaterial = new THREE.MeshStandardMaterial({ color: COLORS.gray });
  for (const x of [-0.6, 0.6]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), frameMaterial);
    post.position.set(x, 0.8, 0);
    rack.add(post);
  }
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.08, 0.08), frameMaterial);
  top.position.y = 1.6;
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  shelf.position.y = 0.8;
  shelf.userData.sku = 'R3-SHELF';
  const shelfTag = label('shelf', COLORS.orange);
  shelfTag.position.set(0, 0.25, 0);
  shelf.add(shelfTag);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.04), new THREE.MeshStandardMaterial({ color: COLORS.yellow }));
  sign.position.set(0, 1.3, 0.1);
  rack.add(top, shelf, sign);

  const target = ball(COLORS.green);
  target.position.set(2.4, 0.2, 1);
  const targetTag = label('target', COLORS.green);
  targetTag.position.copy(target.position).add(LABEL_LIFT);
  scene.add(rack, target, targetTag);

  const readout = overlay(container, 'readout');
  const buttons = overlay(container, 'controls');
  const up = new THREE.Vector3(0, 1, 0);

  // Each button starts from the same rack, runs one line, and shows what it changed.
  const members: { name: string; code: string; run: () => void }[] = [
    { name: 'start', code: '// nothing yet', run: () => {} },
    { name: 'position', code: 'rack.position.set(1.2, 0, 0)', run: () => rack.position.set(1.2, 0, 0) },
    { name: 'rotation', code: 'rack.rotation.y = Math.PI / 4', run: () => (rack.rotation.y = Math.PI / 4) },
    {
      name: 'quaternion',
      code: 'rack.quaternion.setFromAxisAngle(up, -Math.PI / 6)',
      run: () => rack.quaternion.setFromAxisAngle(up, -Math.PI / 6),
    },
    { name: 'scale', code: 'rack.scale.set(1, 1.4, 1)', run: () => rack.scale.set(1, 1.4, 1) },
    { name: 'visible', code: 'shelf.visible = false', run: () => (shelf.visible = false) },
    { name: 'lookAt', code: 'rack.lookAt(target.position)', run: () => rack.lookAt(target.position) },
  ];

  const show = (code: string) => {
    const q = rack.quaternion;
    const degrees = THREE.MathUtils.radToDeg(rack.rotation.y);
    readout.textContent = [
      `ran:  ${code}`,
      `rack.position    ${formatVector(rack.position)}   rack.scale ${formatVector(rack.scale)}`,
      `rack.rotation.y  ${formatNumber(rack.rotation.y)} (${formatNumber(degrees, 0)}°)   rack.quaternion.y ${formatNumber(q.y)}, .w ${formatNumber(q.w)}`,
      `shelf.visible    ${shelf.visible}   shelf.userData.sku '${shelf.userData.sku}'`,
    ].join('\n');
  };

  choiceButtons(
    buttons,
    members.map((member) => ({
      html: member.name,
      select: () => {
        rack.position.set(0, 0, 0);
        rack.rotation.set(0, 0, 0);
        rack.scale.set(1, 1, 1);
        shelf.visible = true;
        member.run();
        show(member.code);
      },
    })),
  );
};
