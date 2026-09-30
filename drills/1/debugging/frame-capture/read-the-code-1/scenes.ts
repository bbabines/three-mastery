// Scenes for the frame capture page. The README places each one with <div data-scene="name">.
// Neither runs a capture tool: they wrap the WebGL context's methods the way one does, and label
// each draw call from onBeforeRender, the way Spector's setMarker labels a capture.
import { choiceButtons, COLORS, glCalls, label, overlay, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// The grid and axes are lines: each would add a draw call to every list.
function hideFloorHelpers(scene: THREE.Scene) {
  for (const child of scene.children) {
    if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) child.visible = false;
  }
}

const DRAWS = new Set(['drawElements', 'drawArrays', 'drawElementsInstanced', 'drawArraysInstanced']);

export const drawList: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(0.4, 2.3, 4.2);
  controls.target.set(0, 0.5, 0);
  hideFloorHelpers(scene);
  const sun = sunlight(scene, new THREE.Vector3(2, 4, 2), 0.8, 2.2);
  const calls = glCalls(renderer);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.6).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#3a3f4a' }));
  floor.name = 'floor';
  floor.receiveShadow = true;
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  box.name = 'box';
  box.position.set(-1, 0.3, 0);
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.8, 32), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  can.name = 'can';
  can.position.set(0, 0.4, 0);
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 16), new THREE.MeshStandardMaterial({ color: COLORS.green }));
  sphere.name = 'ball';
  sphere.position.set(1, 0.32, 0);
  const meshes = [floor, box, can, sphere];
  for (const mesh of meshes) {
    if (mesh !== floor) mesh.castShadow = true;
    mesh.onBeforeRender = () => void calls.log.push(`#${mesh.name}`);
    mesh.onBeforeShadow = () => void calls.log.push(`#${mesh.name} (shadow)`);
    scene.add(mesh);
  }

  let twice = false;
  const setShadows = (on: boolean) => {
    renderer.shadowMap.enabled = on;
    sun.castShadow = on;
    for (const mesh of meshes) (mesh.material as THREE.Material).needsUpdate = true; // shadows on or off: rebuild
  };
  choiceButtons(overlay(container, 'controls'), [
    { html: 'one <code>render()</code> a frame', select: () => ((twice = false), setShadows(false)) },
    { html: 'shadows on', select: () => ((twice = false), setShadows(true)) },
    { html: '<code>render()</code> called twice', select: () => ((twice = true), setShadows(false)) },
  ]);

  const readout = overlay(container, 'readout');
  onFrame(() => {
    // Last frame's commands: each draw command belongs to the mesh whose marker came before it.
    const draws: string[] = [];
    let current = 'unlabeled';
    for (const entry of calls.log) {
      if (entry.startsWith('#')) current = entry.slice(1);
      else if (DRAWS.has(entry)) draws.push(current);
    }
    readout.textContent = [
      `scene graph: ${meshes.length} meshes (${meshes.map((mesh) => mesh.name).join(', ')})`,
      `this frame:  ${draws.length} draw calls`,
      `  ${draws.join(' · ')}`,
      `renderer.info.render.calls: ${renderer.info.render.calls}, from the last render() only`,
    ].join('\n');
    calls.reset();
    if (twice) renderer.render(scene, camera); // the bug: an extra render, before the harness's own
  });
};

interface Draw {
  what: string;
  blend: boolean;
  depthWrite: boolean;
}

export const stepThrough: SceneSetup = ({ scene, camera, controls, container, renderer, onFrame }) => {
  camera.position.set(1.4, 1.9, 3.6);
  controls.target.set(0, 0.55, 0);
  hideFloorHelpers(scene);
  sunlight(scene, new THREE.Vector3(2, 4, 3), 0.9, 2);

  // Materials are made in this order, and three.js draws opaque meshes by material first.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4, 3).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#3a3f4a' }));
  floor.name = 'floor';
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: COLORS.orange }));
  crate.name = 'crate';
  crate.position.set(-0.7, 0.35, -0.4);
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 16), new THREE.MeshStandardMaterial({ color: COLORS.blue }));
  sphere.name = 'ball';
  sphere.position.set(0.6, 0.35, -0.5);
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.1),
    new THREE.MeshStandardMaterial({ color: '#bfe3ff', transparent: true, opacity: 0.35 }),
  );
  glass.name = 'glass';
  glass.position.set(0, 0.6, 0.4);
  const tag = label('crate', COLORS.white);
  tag.name = 'label';
  tag.position.set(-0.7, 1, -0.4);
  const objects: THREE.Object3D[] = [floor, crate, sphere, glass, tag];
  scene.add(...objects);

  // Wrap the context: track blending and depth writes, number every draw, and skip the ones past
  // the slider, the way a capture tool shows the picture partway through a frame.
  const gl = renderer.getContext() as unknown as Record<string, (...args: unknown[]) => unknown> & WebGL2RenderingContext;
  const state = { blend: false, depthWrite: true, what: '' };
  let frameDraws: Draw[] = [];
  let lastFrame: Draw[] = [];
  let stopAfter = objects.length;
  const wrap = (name: string, before: (...args: unknown[]) => boolean) => {
    const original = gl[name];
    gl[name] = (...args: unknown[]) => (before(...args) ? original.apply(gl, args) : undefined);
  };
  wrap('enable', (cap) => {
    if (cap === gl.BLEND) state.blend = true;
    return true;
  });
  wrap('disable', (cap) => {
    if (cap === gl.BLEND) state.blend = false;
    return true;
  });
  wrap('depthMask', (flag) => {
    state.depthWrite = Boolean(flag);
    return true;
  });
  for (const name of DRAWS) {
    wrap(name, () => {
      frameDraws.push({ what: state.what, blend: state.blend, depthWrite: state.depthWrite });
      return frameDraws.length <= stopAfter;
    });
  }
  for (const object of objects) {
    object.onBeforeRender = (_renderer, _scene, _camera, _geometry, material) => void (state.what = `${object.name} · ${material.type}`);
  }

  slider(overlay(container, 'controls'), 'stop after draw', { min: 1, max: objects.length, step: 1, value: stopAfter }, (value) => (stopAfter = value));

  const readout = overlay(container, 'readout');
  onFrame(() => {
    if (frameDraws.length > 0) lastFrame = frameDraws;
    frameDraws = [];
    const shown = Math.min(stopAfter, lastFrame.length);
    const draw = lastFrame[shown - 1];
    if (!draw) return;
    readout.textContent = [
      `draw ${shown} of ${lastFrame.length}: ${draw.what}`,
      `blending ${draw.blend ? 'on' : 'off'} · depth write ${draw.depthWrite ? 'on' : 'off'}`,
      `drawn so far: ${lastFrame.slice(0, shown).map((item) => item.what.split(' ')[0]).join(', ')}`,
    ].join('\n');
  });
};
