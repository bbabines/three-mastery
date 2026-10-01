import { DataTexture, DoubleSide, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, RGBAFormat, UnsignedByteType } from 'three';
import { attempt, label, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { roughnessDebug } from './drill';

export const channels: SceneSetup = ({ scene, container }) => {
  const map = new DataTexture(new Uint8Array([30,155,240,255]),1,1,RGBAFormat,UnsignedByteType);
  map.minFilter = map.magFilter = NearestFilter;
  map.needsUpdate = true;
  const geometry = new PlaneGeometry(2, 2);
  const packed = new Mesh(geometry, new MeshBasicMaterial({ map, side: DoubleSide }));
  packed.position.set(-1.4, 1.5, 0);
  scene.add(packed);
  const packedLabel = label('packed RGB', '#e5e7eb');
  packedLabel.position.set(-1.4, 2.8, 0);
  scene.add(packedLabel);
  const result = attempt('roughness debug', () => roughnessDebug(map));
  if(result.ok) {
    const mesh = new Mesh(geometry,result.value);
    mesh.position.set(1.4, 1.5, 0);
    scene.add(mesh);
    const roughnessLabel = label('green channel', '#e5e7eb');
    roughnessLabel.position.set(1.4, 2.8, 0);
    scene.add(roughnessLabel);
  }
  const readout = overlay(container,'readout');
  readout.textContent = result.ok ? 'Left: packed RGB. Right: middle gray from green = 155/255.' : `Left: packed RGB. ${result.note}`;
};
