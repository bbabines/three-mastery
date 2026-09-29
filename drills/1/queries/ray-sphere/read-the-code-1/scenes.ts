// Scenes for the ray–sphere page. The README places each one with <div data-scene="name">.
import { ball, COLORS, formatVector, label, line, overlay, pointer, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

export const startInside: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.4, 2.3, 6);
  controls.target.set(0.2, 1.55, 0);

  const sphere = new THREE.Sphere(new THREE.Vector3(0.5, 1.3, 0), 1.1);
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(sphere.radius, 32, 16),
    new THREE.MeshStandardMaterial({ color: COLORS.blue, transparent: true, opacity: 0.25, depthWrite: false }),
  );
  shell.position.copy(sphere.center);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(sphere.radius, 16, 8)), new THREE.LineBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.35 }));
  wire.position.copy(sphere.center);
  const tag = label('sphere', COLORS.blue);
  tag.position.copy(sphere.center).add(new THREE.Vector3(1.5, 0.9, 0)); // beside it, clear of the readout

  const laser = pointer(COLORS.red, 0.5);
  const ray = line(COLORS.red);
  const spotMark = ball(COLORS.white, 1, 0.08);
  scene.add(shell, wire, tag, laser, ray, spotMark);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const direction = new THREE.Vector3(1, 0, 0);
  const start = new THREE.Vector3();
  const spot = new THREE.Vector3();
  let startX = -3;

  const update = () => {
    start.set(startX, 1.7, 0); // a little above the center, so the way in and the way out differ
    laser.position.copy(start);
    laser.lookAt(start.clone().add(direction));
    const r = new THREE.Ray(start, direction);
    const where = r.intersectSphere(sphere, spot);
    const touches = r.intersectsSphere(sphere);
    const inside = sphere.containsPoint(start);

    setLine(ray, start, where ? spot : r.at(6, new THREE.Vector3()));
    spotMark.visible = !!where;
    if (where) spotMark.position.copy(spot);
    readout.textContent = [
      `start ${formatVector(start)}: ${inside ? 'inside the sphere' : where ? 'outside, before it' : 'past it'}`,
      `ray.intersectsSphere(sphere) → ${touches}`,
      `ray.intersectSphere(sphere, spot) → ${
        where ? `${formatVector(spot, 2)}, where it ${inside ? 'comes out' : 'goes in'}` : 'null: the sphere is behind the start'
      }`,
    ].join('\n');
  };
  slider(sliders, 'Move the start', { min: -3, max: 3, step: 0.25, value: startX }, (value) => {
    startX = value;
    update();
  });
  update();
};
