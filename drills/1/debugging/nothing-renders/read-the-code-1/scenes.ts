// Scenes for the nothing-renders checklist page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatNumber, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

interface Bug {
  html: string;
  line: string;
  apply(): void;
}

export const checklist: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(1.7, 1.55, 3.2);
  controls.target.set(0, 0.9, -0.6);
  const axes = scene.children.find((child) => child instanceof THREE.AxesHelper);
  if (axes) axes.visible = false; // its lines would cross the sign
  const sun = sunlight(scene, new THREE.Vector3(2, 4, 5), 0.8, 2.5);
  const sky = scene.children.find((child): child is THREE.HemisphereLight => child instanceof THREE.HemisphereLight)!;

  // A sign whose front faces +Z, toward the camera.
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  const holder = new THREE.Group(); // never added to the scene
  const home = new THREE.Vector3(0, 1.1, -0.6);

  const bugs: Bug[] = [
    { html: 'no bug', line: '// the sign as intended', apply: () => {} },
    { html: 'not added', line: 'holder.add(sign)   // holder was never added to the scene', apply: () => holder.add(sign) },
    { html: 'behind the camera', line: 'sign.position.z = 9', apply: () => (sign.position.z = 9) },
    {
      html: 'near = 20',
      line: 'camera.near = 20   // meant as 20 cm',
      apply: () => {
        camera.near = 20;
        camera.updateProjectionMatrix();
      },
    },
    { html: 'too small', line: 'sign.scale.setScalar(0.001)   // mm to meters, done twice', apply: () => sign.scale.setScalar(0.001) },
    { html: 'facing away', line: 'sign.rotation.y = Math.PI', apply: () => (sign.rotation.y = Math.PI) },
    { html: 'no light', line: '// no light in the scene', apply: () => (sun.intensity = sky.intensity = 0) },
    { html: 'NaN', line: 'sign.position.y = height / width   // both 0', apply: () => (sign.position.y = NaN) },
  ];

  let bug = bugs[0];
  choiceButtons(
    overlay(container, 'controls'),
    bugs.map((item) => ({
      html: item.html,
      select: () => {
        bug = item;
        scene.add(sign);
        sign.position.copy(home);
        sign.rotation.set(0, 0, 0);
        sign.scale.setScalar(1);
        camera.near = 0.1;
        camera.updateProjectionMatrix();
        sun.intensity = 2.5;
        sky.intensity = 0.8;
        item.apply();
      },
    })),
  );

  const frustum = new THREE.Frustum();
  const viewProjection = new THREE.Matrix4();
  const center = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const toCamera = new THREE.Vector3();
  const size = new THREE.Vector3();

  // Each test is written so a NaN slips past it, as NaN slips past most real checks: every
  // comparison with NaN is false. Only the last check looks for NaN itself.
  const checks: { name: string; test(): string | null }[] = [
    {
      name: 'in the scene',
      test: () => {
        let top: THREE.Object3D = sign;
        while (top.parent) top = top.parent;
        return top === scene ? null : "sign.parent is a group that isn't in the scene";
      },
    },
    {
      name: 'near/far',
      test: () => {
        const distance = camera.position.distanceTo(sign.getWorldPosition(center));
        return distance < camera.near || distance > camera.far
          ? `distance ${formatNumber(distance, 1)}, but camera.near is ${formatNumber(camera.near)}`
          : null;
      },
    },
    {
      name: 'in view',
      test: () => {
        camera.updateMatrixWorld();
        viewProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(viewProjection);
        return frustum.intersectsObject(sign) ? null : 'frustum.intersectsObject(sign) is false';
      },
    },
    {
      name: 'size',
      test: () => {
        new THREE.Box3().setFromObject(sign).getSize(size);
        return Math.max(size.x, size.y, size.z) < 0.01 ? `Box3 size (${formatNumber(size.x, 4)}, ${formatNumber(size.y, 4)}, 0): a speck` : null;
      },
    },
    {
      name: 'facing',
      test: () => {
        normal.set(0, 0, 1).transformDirection(sign.matrixWorld);
        toCamera.copy(camera.position).sub(sign.getWorldPosition(center));
        return normal.dot(toCamera) < 0 ? "the camera sees the sign's back, and FrontSide skips it" : null;
      },
    },
    {
      name: 'lit',
      test: () => {
        let lit = false;
        scene.traverse((object) => {
          if (object instanceof THREE.Light && object.intensity > 0) lit = true;
        });
        return lit || scene.environment ? null : 'MeshStandardMaterial, and no light in the scene: drawn black';
      },
    },
    {
      name: 'NaN',
      test: () => (sign.matrixWorld.elements.some(Number.isNaN) ? 'sign.matrixWorld.elements.some(Number.isNaN) is true' : null),
    },
  ];

  const readout = overlay(container, 'readout');
  onFrame(() => {
    sign.updateMatrixWorld();
    const passed: string[] = [];
    let failed = '';
    for (const check of checks) {
      const problem = check.test();
      if (problem) {
        failed = `✗ ${check.name}: ${problem}`;
        break;
      }
      passed.push(check.name);
    }
    readout.textContent = [
      bug.line,
      `✓ ${passed.join(' · ') || 'none'}`,
      failed || 'all seven pass, so it shows',
    ].join('\n');
  });
};
