// Runs drill.ts live: the yellow trail is flightPoint at 40 steps along the route, and the plane sits
// at the slider's t. The two city markers are placed by three.js directly, so the trail should start
// and end on them.
import { attempt, ball, buttonGroup, choiceButtons, COLORS, formatNumber, formatVector, label, LABEL_LIFT, overlay, pointer, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { flightPoint, type City } from './drill';

const CENTER = new THREE.Vector3(0, 1.3, 0);
const RADIUS = 1.1;
const STEPS = 40;
const ROUTES: { name: string; from: City; to: City }[] = [
  { name: 'north', from: { lat: 40.7, lon: -74 }, to: { lat: 51.5, lon: -0.1 } },
  { name: 'south to east', from: { lat: -33.9, lon: 18.4 }, to: { lat: 1.3, lon: 103.8 } },
];

const onGlobe = (city: City, lift = 0) =>
  new THREE.Vector3()
    .setFromSphericalCoords(RADIUS + lift, THREE.MathUtils.degToRad(90 - city.lat), THREE.MathUtils.degToRad(city.lon))
    .add(CENTER);

export const globe: SceneSetup = ({ scene, camera, controls, container }) => {
  const body = new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 0.99, 48, 24), new THREE.MeshStandardMaterial({ color: '#1f3a5f' }));
  const grid = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(RADIUS, 24, 12)),
    new THREE.LineBasicMaterial({ color: COLORS.gray, transparent: true, opacity: 0.35 }),
  );
  const equator = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(Array.from({ length: 96 }, (_, i) => onGlobe({ lat: 0, lon: (i / 96) * 360 }, 0.005))),
    new THREE.LineBasicMaterial({ color: COLORS.green }),
  );
  body.position.copy(CENTER);
  grid.position.copy(CENTER);
  scene.add(body, grid, equator);

  const fromMarker = ball(COLORS.blue, 1, 0.06);
  const toMarker = ball(COLORS.orange, 1, 0.06);
  const fromTag = label('from', COLORS.blue);
  const toTag = label('to', COLORS.orange);
  const trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: COLORS.yellow }));
  trail.frustumCulled = false; // its points change
  const plane = pointer(COLORS.yellow, 0.35);
  scene.add(fromMarker, toMarker, fromTag, toTag, trail, plane);

  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const state = { route: ROUTES[0], t: 0.35 };

  const update = () => {
    const { from, to } = state.route;
    fromMarker.position.copy(onGlobe(from));
    toMarker.position.copy(onGlobe(to));
    fromTag.position.copy(onGlobe(from, 0.1)).add(LABEL_LIFT);
    toTag.position.copy(onGlobe(to, 0.1)).add(LABEL_LIFT);

    const run = (t: number) => flightPoint(CENTER.clone(), RADIUS, { ...from }, { ...to }, t);
    const here = attempt('flightPoint', () => run(state.t));
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= STEPS && here.ok; i++) {
      const point = attempt('flightPoint', () => run(i / STEPS));
      if (point.ok) points.push(point.value);
    }
    trail.geometry.setFromPoints(points);
    trail.visible = plane.visible = here.ok;
    if (!here.ok) {
      readout.textContent = here.note;
      return;
    }
    plane.position.copy(here.value);
    const ahead = attempt('flightPoint', () => run(Math.min(1, state.t + 0.02)));
    if (ahead.ok && ahead.value.distanceTo(here.value) > 1e-6) plane.lookAt(ahead.value);
    readout.textContent = [
      `flightPoint(center, radius, from, to, ${state.t})`,
      `  ${formatVector(here.value, 2)}`,
      `height above the surface  ${formatNumber(here.value.distanceTo(CENTER) - RADIUS)}`,
    ].join('\n');
  };

  slider(bar, 't', { min: 0, max: 1, step: 0.01, value: state.t }, (value) => {
    state.t = value;
    update();
  });
  // choiceButtons selects the first route straight away, which draws the first frame.
  choiceButtons(
    buttonGroup(bar, 'route'),
    ROUTES.map((route) => ({
      html: route.name,
      select: () => {
        state.route = route;
        // Look at the middle of the route, from a little above it.
        const middle = onGlobe({ lat: (route.from.lat + route.to.lat) / 2 + 15, lon: (route.from.lon + route.to.lon) / 2 });
        camera.position.copy(middle.sub(CENTER).setLength(3.6).add(CENTER));
        controls.target.copy(CENTER);
        update();
      },
    })),
  );
};
