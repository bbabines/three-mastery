// Scenes for the materials tour. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, line, overlay, setLine, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A matcap: a picture of a lit clay ball, light from the upper left, drawn on a canvas.
function clayBall() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#1b1c20';
  context.fillRect(0, 0, 256, 256);
  const shade = context.createRadialGradient(92, 84, 8, 128, 128, 128);
  shade.addColorStop(0, '#ffffff');
  shade.addColorStop(0.35, '#c9c9c9');
  shade.addColorStop(0.85, '#4a4a4a');
  shade.addColorStop(1, '#262626');
  context.fillStyle = shade;
  context.beginPath();
  context.arc(128, 128, 127, 0, Math.PI * 2);
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; // a picture of colors
  return texture;
}

export const members: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.5, 3.4);
  controls.target.set(0, 1.05, 0);

  const center = new THREE.Vector3(0, 1.1, 0);
  const sun = sunlight(scene, new THREE.Vector3(3, 3, 2), 0.25, 3);
  sun.target.position.copy(center);
  scene.add(sun.target);
  const bulb = ball(COLORS.yellow, 1, 0.1);
  const ray = line(COLORS.yellow, 0.5);
  scene.add(bulb, ray);

  const part = new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.2, 180, 28));
  part.position.copy(center);
  scene.add(part);

  const orange = '#f97316';
  const members: { name: string; code: string; lit: boolean; cost: string; make: () => THREE.Material }[] = [
    { name: 'Basic', code: `new MeshBasicMaterial({ color: '${orange}' })`, lit: false, cost: 'the least of all', make: () => new THREE.MeshBasicMaterial({ color: orange }) },
    { name: 'Lambert', code: `new MeshLambertMaterial({ color: '${orange}' })`, lit: true, cost: 'low, per pixel and per light', make: () => new THREE.MeshLambertMaterial({ color: orange }) },
    {
      name: 'Phong',
      code: `new MeshPhongMaterial({ color: '${orange}', shininess: 60 })`,
      lit: true,
      cost: 'a little more than Lambert',
      make: () => new THREE.MeshPhongMaterial({ color: orange, shininess: 60 }),
    },
    {
      name: 'Standard',
      code: `new MeshStandardMaterial({ color: '${orange}', roughness: 0.4 })`,
      lit: true,
      cost: 'more per pixel; the usual choice',
      make: () => new THREE.MeshStandardMaterial({ color: orange, roughness: 0.4 }),
    },
    {
      name: 'Physical',
      code: `new MeshPhysicalMaterial({ color: '${orange}', roughness: 0.7, clearcoat: 1 })`,
      lit: true,
      cost: "Standard's, plus each extra turned on",
      make: () => new THREE.MeshPhysicalMaterial({ color: orange, roughness: 0.7, clearcoat: 1 }),
    },
    { name: 'Toon', code: `new MeshToonMaterial({ color: '${orange}' })`, lit: true, cost: 'low', make: () => new THREE.MeshToonMaterial({ color: orange }) },
    {
      name: 'Matcap',
      code: `new MeshMatcapMaterial({ color: '${orange}', matcap: clayBall })`,
      lit: false,
      cost: 'very low: one texture read per pixel',
      make: () => new THREE.MeshMatcapMaterial({ color: orange, matcap: clayBall() }),
    },
    { name: 'Normal', code: 'new MeshNormalMaterial()', lit: false, cost: 'very low', make: () => new THREE.MeshNormalMaterial() },
    { name: 'Depth', code: 'new MeshDepthMaterial()', lit: false, cost: 'very low', make: () => new THREE.MeshDepthMaterial() },
  ];
  const materials = members.map((member) => member.make());

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let selected = 0;
  let angle = 45;

  const update = () => {
    const member = members[selected];
    part.material = materials[selected];
    // The depth view spreads gray from the camera's near plane to its far plane. With the scene's
    // usual near 0.1 and far 100, the part would come out almost black, so its range is narrowed.
    const depth = member.name === 'Depth';
    camera.near = depth ? 2.5 : 0.1;
    camera.far = depth ? 4.3 : 100;
    camera.updateProjectionMatrix();

    const a = THREE.MathUtils.degToRad(angle);
    sun.position.set(Math.cos(a) * 3, 3, Math.sin(a) * 3).add(center);
    bulb.position.copy(sun.position).sub(center).setLength(1.6).add(center);
    setLine(ray, bulb.position, center);

    readout.textContent = [
      `part.material = ${member.code}`,
      member.lit ? 'lit: moving the light changes it' : 'unlit: moving the light changes nothing',
      `cost: ${member.cost}`,
      depth ? 'camera.near 2.5 and far 4.3 here, so the gray range spans the part' : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  choiceButtons(
    controlsBar,
    members.map((member, i) => ({
      html: member.name,
      select: () => {
        selected = i;
        update();
      },
    })),
  );
  slider(controlsBar, 'Light from', { min: 0, max: 360, step: 15, value: angle }, (value) => {
    angle = value;
    update();
  });
};
