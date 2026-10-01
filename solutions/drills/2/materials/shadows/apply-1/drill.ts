import type { Answer } from '@harness/drill';
import { DirectionalLight, Mesh, MeshStandardMaterial, Texture } from 'three';
export function hybridFloor(floor: Mesh, material: MeshStandardMaterial, ao: Texture, key: DirectionalLight): Answer<Mesh> {
 ao.channel = 1;
 material.aoMap = ao;
 material.aoMapIntensity = 1;
 floor.material = material;
 floor.receiveShadow = true;
 key.castShadow = true;
 return floor;
}
