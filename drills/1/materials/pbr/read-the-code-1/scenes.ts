// Scenes for the PBR metal and roughness page. The README places each one with <div data-scene="name">.
import { choiceButtons, formatNumber, overlay, roomEnvironment, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// Lights the scene with a studio room to reflect, instead of the harness's sky light.
function studio(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  const sky = scene.children.find((child) => child instanceof THREE.HemisphereLight);
  if (sky) sky.visible = false;
  scene.environment = roomEnvironment(renderer);
}

export const sliders: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.35, 2.5);
  controls.target.set(0, 1.1, 0);
  studio(scene, renderer);

  const material = new THREE.MeshStandardMaterial({ color: '#d4a84a', metalness: 1, roughness: 0.2 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.7, 96, 48), material);
  ball.position.set(0, 1.1, 0);
  scene.add(ball);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const update = () => {
    readout.textContent = [
      `new MeshStandardMaterial({ color: '#d4a84a', metalness: ${formatNumber(material.metalness)}, roughness: ${formatNumber(material.roughness)} })`,
      material.metalness === 1
        ? 'a metal: no diffuse color; its reflections take its color'
        : material.metalness === 0
          ? 'a non-metal: its own color, with faint white reflections on top'
          : 'in between: a blend of both recipes, which no real surface is',
      material.roughness < 0.25 ? 'smooth: sharp reflections' : material.roughness > 0.75 ? 'rough: reflections blurred into a sheen' : 'reflections blurring as roughness grows',
    ].join('\n');
  };
  slider(controlsBar, 'metalness', { min: 0, max: 1, step: 0.25, value: material.metalness }, (value) => {
    material.metalness = value;
    update();
  });
  slider(controlsBar, 'roughness', { min: 0, max: 1, step: 0.05, value: material.roughness }, (value) => {
    material.roughness = value;
    update();
  });
  update();
};

const FINISHES = [
  { name: 'bare steel', color: '#c0c4c8', metalness: 1, roughness: 0.35 },
  { name: 'chrome', color: '#f2f3f5', metalness: 1, roughness: 0.04 },
  { name: 'powder coat', color: '#1e3a8a', metalness: 0, roughness: 0.55 },
  { name: 'rubber', color: '#26282c', metalness: 0, roughness: 0.95 },
  { name: 'steel, metalness 0.5', color: '#c0c4c8', metalness: 0.5, roughness: 0.35 },
];

export const finishes: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.4, 2.6);
  controls.target.set(0, 1.1, 0);
  studio(scene, renderer);

  const material = new THREE.MeshStandardMaterial();
  const part = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.18, 200, 32), material);
  part.position.set(0, 1.1, 0);
  scene.add(part);

  const readout = overlay(container, 'readout');
  choiceButtons(
    overlay(container, 'controls'),
    FINISHES.map((finish) => ({
      html: finish.name,
      select: () => {
        material.color.set(finish.color);
        material.metalness = finish.metalness;
        material.roughness = finish.roughness;
        readout.textContent = [
          `new MeshStandardMaterial({ color: '${finish.color}', metalness: ${finish.metalness}, roughness: ${finish.roughness} })`,
          finish.metalness === 0.5 ? 'half of each recipe: milky, washed-out reflections that no real material has' : `a real ${finish.metalness ? 'metal' : 'non-metal'} finish`,
        ].join('\n');
      },
    })),
  );
};
