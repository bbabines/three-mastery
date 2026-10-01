// Reference repair for drills/3/gpu/draw-call-anatomy/break-fix-1.
import * as THREE from 'three';

export function drawSubmissions(meshes: {groups:number;visible:boolean}[], shadowLights: number): number {
  return meshes.filter(m=>m.visible).reduce((n,m)=>n+m.groups,0)*(1+shadowLights);
}
