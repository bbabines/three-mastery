import { DataTexture, Mesh, NearestFilter, PlaneGeometry, RGBAFormat, UnsignedByteType } from 'three';
import { attempt, overlay } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import { roughnessDebug } from './drill';

export const channels: SceneSetup = ({ scene, container }) => {
  const map = new DataTexture(new Uint8Array([30,155,240,255]),1,1,RGBAFormat,UnsignedByteType);
  map.minFilter = map.magFilter = NearestFilter;
  map.needsUpdate = true;
  const result = attempt('roughness debug', () => roughnessDebug(map));
  if(result.ok) { const mesh = new Mesh(new PlaneGeometry(2,2),result.value); mesh.position.y=1; scene.add(mesh); }
  const readout = overlay(container,'readout');
  readout.textContent = result.ok ? 'Square should be middle gray: green channel is 155/255' : result.note;
};
