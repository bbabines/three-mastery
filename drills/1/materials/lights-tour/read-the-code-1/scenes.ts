// Scenes for the lights tour. The README places each one with <div data-scene="name">.
import { choiceButtons, COLORS, label, line, overlay, pointer, setLine } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init(); // once, before any RectAreaLight is drawn

export const members: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.7, 3.3);
  controls.target.set(0, 0.6, 0);
  for (const child of scene.children) {
    if (child instanceof THREE.HemisphereLight) child.intensity = 0; // only the chosen light
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(7, 5), new THREE.MeshStandardMaterial({ color: '#8b8f98', roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2;
  const standard = new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 24), new THREE.MeshStandardMaterial({ color: COLORS.orange, roughness: 0.45 }));
  standard.position.set(-0.8, 0.55, 0);
  const lambert = new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 24), new THREE.MeshLambertMaterial({ color: COLORS.orange }));
  lambert.position.set(0.8, 0.55, 0);
  const standardTag = label('Standard', COLORS.white);
  standardTag.position.copy(standard.position).add(new THREE.Vector3(0, 0.95, 0));
  const lambertTag = label('Lambert', COLORS.white);
  lambertTag.position.copy(lambert.position).add(new THREE.Vector3(0, 0.95, 0));
  scene.add(floor, standard, lambert, standardTag, lambertTag);

  const aim = new THREE.Vector3(0, 0.5, 0);
  const ambient = new THREE.AmbientLight(0xffffff, 2);
  const hemisphere = new THREE.HemisphereLight(0xdde8ff, 0x5a4636, 3);
  const directional = new THREE.DirectionalLight(0xffffff, 3);
  directional.position.set(2, 3, 2);
  directional.target.position.copy(aim);
  const point = new THREE.PointLight(0xffffff, 8);
  point.position.set(0, 1.6, 0.9);
  const spot = new THREE.SpotLight(0xffffff, 40, 0, Math.PI / 7, 0.3);
  spot.position.set(1.4, 3, 1.8);
  spot.target.position.copy(aim);
  // A small cone and a line mark the spot light and its aim. (SpotLightHelper draws its cone
  // 1000 units long when the light's distance is 0, the default.)
  const spotMarker = new THREE.Group();
  const spotBody = pointer(COLORS.yellow, 0.4);
  spotBody.position.copy(spot.position);
  spotBody.lookAt(aim);
  const spotLine = line(COLORS.yellow, 0.5);
  setLine(spotLine, spot.position, aim);
  spotMarker.add(spotBody, spotLine);
  const rect = new THREE.RectAreaLight(0xffffff, 8, 2.4, 0.8);
  rect.position.set(0, 1.9, 1.8);
  rect.lookAt(aim);
  hemisphere.position.set(0, 2.6, -1.2);

  const helpers = new Map<THREE.Light, THREE.Object3D>([
    [hemisphere, new THREE.HemisphereLightHelper(hemisphere, 0.4)],
    [directional, new THREE.DirectionalLightHelper(directional, 0.5)],
    [point, new THREE.PointLightHelper(point, 0.12)],
    [spot, spotMarker],
    [rect, new RectAreaLightHelper(rect)],
  ]);
  const lights = [ambient, hemisphere, directional, point, spot, rect];
  for (const light of lights) {
    light.visible = false; // a hidden light is left out, as if it weren't there
    scene.add(light);
  }
  scene.add(directional.target, spot.target);
  rect.add(helpers.get(rect)!); // the RectAreaLight helper rides on the light
  for (const [light, helper] of helpers) if (light !== rect) scene.add(helper);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const members = [
    { name: 'Ambient', light: ambient, code: 'new AmbientLight(0xffffff, 2)', quirk: 'no direction: no shading, no shadows' },
    { name: 'Hemisphere', light: hemisphere, code: 'new HemisphereLight(skyColor, groundColor, 3)', quirk: 'sky color from above, ground color from below' },
    { name: 'Directional', light: directional, code: 'new DirectionalLight(0xffffff, 3)', quirk: 'shines from position toward target; rotation does nothing' },
    { name: 'Point', light: point, code: 'new PointLight(0xffffff, 8)', quirk: 'fades with distance; a shadow would take six renders' },
    { name: 'Spot', light: spot, code: 'new SpotLight(0xffffff, 40, 0, Math.PI / 7, 0.3)', quirk: 'a cone aimed at spot.target, which must be in the scene' },
    { name: 'RectArea', light: rect, code: 'new RectAreaLight(0xffffff, 8, 2.4, 0.8)', quirk: 'needs RectAreaLightUniformsLib.init(); no shadows' },
  ];

  choiceButtons(
    controlsBar,
    members.map((member) => ({
      html: member.name,
      select: () => {
        for (const light of lights) light.visible = light === member.light;
        for (const [light, helper] of helpers) helper.visible = light === member.light;
        const lightsLambert = member.light !== rect;
        readout.textContent = [
          `scene.add(${member.code})`,
          member.quirk,
          `lights Standard: yes    lights Lambert: ${lightsLambert ? 'yes' : 'no, it stays dark'}`,
        ].join('\n');
      },
    })),
  );
};
