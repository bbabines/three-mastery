// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function drawSubmissions(meshes: {groups:number;visible:boolean}[], shadowLights: number): number {
  return meshes.filter(m=>m.visible).length*(1+shadowLights);
}
