// Small teaching preview shared by the elective's mask pages. Each page supplies its own TSL
// fields and controls; this only frames two squares consistently.
import { overlay } from '@harness/lesson';
import type { TslHarness } from '@harness/tsl';
import { cameraFar, cameraNear, perspectiveDepthToViewZ, positionView, vec3, viewportDepthTexture } from 'three/tsl';
import type { Node } from 'three/webgpu';
import * as THREE from 'three/webgpu';

export function compareMasks(harness: TslHarness, left: Node<'float'>, right: Node<'float'>, caption: string) {
  const { scene, camera, controls, container } = harness;
  camera.position.set(0, 1.3, 3.5);
  controls.target.set(0, 1.3, 0);
  for (const child of scene.children) if (child instanceof THREE.AxesHelper) child.visible = false;
  for (const [index, mask] of [left, right].entries()) {
    const material = new THREE.MeshBasicNodeMaterial();
    material.colorNode = vec3(mask);
    const square = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.45), material);
    square.position.set(index === 0 ? -0.82 : 0.82, 1.3, 0);
    scene.add(square);
  }
  const readout = overlay(container, 'readout');
  readout.textContent = caption;
  return readout;
}

// r186's SoftParticles add-on names a generated GLSL parameter `input`, which the WebGL 2
// backend rejects. Keep the underlying view-space depth comparison here so both backends work.
export function softParticleOpacity(opacity: Node<'float'>, fadeDistance: Node<'float'>) {
  const sceneViewZ = perspectiveDepthToViewZ(viewportDepthTexture(), cameraNear, cameraFar);
  return opacity.mul(positionView.z.sub(sceneViewZ).div(fadeDistance).clamp(0, 1));
}
