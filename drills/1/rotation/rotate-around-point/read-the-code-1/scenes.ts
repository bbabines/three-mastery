// Scenes for the rotating around a point page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, label, LABEL_LIFT, overlay, pointer, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A flat ring of line around `center`, for the path something travels.
function circle(center: THREE.Vector3, radius: number, color: string, opacity: number) {
  const points = Array.from({ length: 97 }, (_, i) => {
    const angle = (i / 96) * Math.PI * 2;
    return new THREE.Vector3(center.x + Math.cos(angle) * radius, center.y, center.z + Math.sin(angle) * radius);
  });
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

export const orbit: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.6, 7.2, 4.6);
  controls.target.set(0.4, 0.6, -0.9);

  const up = new THREE.Vector3(0, 1, 0);
  const planetSpot = new THREE.Vector3(1.6, 0.9, -0.8);
  const planet = ball(COLORS.blue, 1, 0.3);
  planet.position.copy(planetSpot);
  const planetTag = label('planet', COLORS.blue);
  planetTag.position.copy(planetSpot).add(LABEL_LIFT).add(new THREE.Vector3(0, 0.1, 0));
  const centerTag = label('center of the world', COLORS.gray);
  centerTag.position.set(-0.2, 0.3, 0.5);

  // The moon starts 1.3 from the planet, with its tip pointing at the planet.
  const startSpot = planetSpot.clone().add(new THREE.Vector3(1.3, 0, 0));
  const moon = pointer(COLORS.yellow, 0.7);
  moon.position.copy(startSpot);
  moon.lookAt(planetSpot);
  const startTurn = moon.quaternion.clone();
  const moonTag = label('moon', COLORS.yellow);

  const aroundPlanet = circle(planetSpot, 1.3, COLORS.yellow, 0.35);
  const aroundCenter = circle(new THREE.Vector3(0, 0.9, 0), Math.hypot(startSpot.x, startSpot.z), COLORS.gray, 0.35);
  scene.add(planet, planetTag, centerTag, moon, moonTag, aroundPlanet, aroundCenter);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let aroundPoint = true;
  let degrees = 60;
  const offset = new THREE.Vector3();
  const turn = new THREE.Quaternion();

  const update = () => {
    const radians = THREE.MathUtils.degToRad(degrees);
    if (aroundPoint) {
      offset.subVectors(startSpot, planetSpot).applyAxisAngle(up, radians);
      moon.position.addVectors(planetSpot, offset);
      moon.quaternion.copy(startTurn).premultiply(turn.setFromAxisAngle(up, radians)); // rotateOnWorldAxis
    } else {
      moon.position.copy(startSpot).applyAxisAngle(up, radians);
      moon.quaternion.copy(startTurn);
    }
    moonTag.position.copy(moon.position).add(LABEL_LIFT);
    aroundPlanet.visible = aroundPoint;
    aroundCenter.visible = !aroundPoint;

    const toPlanet = moon.position.distanceTo(planetSpot);
    readout.innerHTML = [
      aroundPoint
        ? `offset.subVectors(moon, planet).applyAxisAngle(up, ${formatNumber(radians)})   // ${degrees}°`
        : `moon.position.applyAxisAngle(up, ${formatNumber(radians)})   // ${degrees}°`,
      aroundPoint ? 'moon.position.addVectors(planet, offset); moon.rotateOnWorldAxis(up, a)' : '// turns around (0, 0, 0): the center of the world',
      aroundPoint
        ? `moon to planet: ${formatNumber(toPlanet)}, always`
        : `<span style="color:${COLORS.orange}">moon to planet: ${formatNumber(toPlanet)}, and changing</span>`,
    ].join('\n');
  };
  choiceButtons(controlsBar, [
    {
      html: 'move, turn, move back',
      select: () => {
        aroundPoint = true;
        update();
      },
    },
    {
      html: '<code>moon.position.applyAxisAngle(up, a)</code>',
      select: () => {
        aroundPoint = false;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Turn a', { min: 0, max: 360, step: 15, value: degrees }, (value) => {
    degrees = value;
    update();
  });
};
