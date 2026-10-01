import { attempt, ball, COLORS, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import { chooseGeometryCodec, rgbaTextureBytes } from './drill';

export const practice: SceneSetup = ({ scene, camera, controls, container, onFrame, renderer }) => {
  camera.position.set(3, 3, 5);
  controls.target.set(0, 0.5, 0);
  const marker = ball(COLORS.yellow, 1, 0.22);
  marker.position.set(0, 1, 0);
  scene.add(marker);
  const readout = overlay(container, 'readout');
  const width = 4, height = 4;
  onFrame((_, elapsed) => {
    marker.position.x = Math.sin(elapsed * 0.8);
    const codec = attempt('chooseGeometryCodec', () => chooseGeometryCodec(180000,90,210000,12,25)); const bytes = attempt('rgbaTextureBytes', () => rgbaTextureBytes(width,height,true));
    readout.textContent = [codec.ok ? `codec: ${codec.value}` : codec.note, bytes.ok ? `decoded texture: ${bytes.value} bytes` : bytes.note].join('\n');
  });
};
