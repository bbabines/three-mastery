// Scenes for the axis-angle page. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, formatVector, label, line, overlay, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A fan whose blades lie flat around its own Y, so it spins around its own Y. One blade is orange,
// so the spin shows.
function fan() {
  const group = new THREE.Group();
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 24), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  group.add(hub);
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.03, 0.24).translate(0.5, 0, 0),
      new THREE.MeshStandardMaterial({ color: i === 0 ? COLORS.orange : COLORS.white }),
    );
    blade.rotation.y = (i / 3) * Math.PI * 2;
    group.add(blade);
  }
  return group;
}

export const whoseAxis: SceneSetup = ({ scene, camera, controls, container, onFrame }) => {
  camera.position.set(-1.2, 4.3, 3.3);
  controls.target.set(0, 1.45, 0);

  const LEAN = THREE.MathUtils.degToRad(30);
  const SPEED = 1.5; // radians per second
  const center = new THREE.Vector3(0, 1.5, 0);
  const spinner = fan();
  spinner.position.copy(center);
  // The fan's own Y rides along as a child, so it leans and swings with the fan.
  const ownY = line(COLORS.green);
  setLine(ownY, new THREE.Vector3(0, -1.1, 0), new THREE.Vector3(0, 1.1, 0));
  spinner.add(ownY);
  const worldY = line(COLORS.white, 0.6);
  setLine(worldY, center.clone().setY(0.4), center.clone().setY(2.6));
  const ownTag = label("fan's own Y", COLORS.green);
  const worldTag = label("world's Y", COLORS.white);
  worldTag.position.set(0, 0.25, 0); // at the bottom of the upright line, clear of the fan's label
  scene.add(spinner, worldY, ownTag, worldTag);

  const readout = overlay(container, 'readout');
  const up = new THREE.Vector3(0, 1, 0);
  const ownAxis = new THREE.Vector3();
  let onWorld = false;

  const reset = () => {
    spinner.quaternion.identity();
    spinner.rotation.z = LEAN;
  };
  choiceButtons(overlay(container, 'controls'), [
    {
      html: '<code>fan.rotateOnAxis(up, speed * delta)</code>',
      select: () => {
        onWorld = false;
        reset();
      },
    },
    {
      html: '<code>fan.rotateOnWorldAxis(up, speed * delta)</code>',
      select: () => {
        onWorld = true;
        reset();
      },
    },
  ]);

  onFrame((delta) => {
    if (onWorld) spinner.rotateOnWorldAxis(up, SPEED * delta);
    else spinner.rotateOnAxis(up, SPEED * delta);

    ownAxis.set(0, 1, 0).applyQuaternion(spinner.quaternion);
    ownTag.position.copy(center).addScaledVector(ownAxis, 1.3);
    readout.innerHTML = [
      `fan.${onWorld ? 'rotateOnWorldAxis' : 'rotateOnAxis'}(up, ${SPEED} * delta)   // every frame, up = (0, 1, 0)`,
      onWorld ? "spins around the world's upright Y" : 'spins around its own Y, which leans with it',
      `<span style="color:${COLORS.green}">fan's own Y</span>  ${formatVector(ownAxis, 2)}   ${onWorld ? 'swings around' : 'stays put'}`,
    ].join('\n');
  });
};
